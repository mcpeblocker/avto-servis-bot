const ExcelJS = require("exceljs");
const { Stream } = require("stream");
const logger = require("./logger");
const db = require("../database");
const { Category, Service } = db.models;

exports.generateDb = async ({ categories, services, orders, users }) => {
  const workbook = new ExcelJS.Workbook();

  // categories
  const categoriesSheet = workbook.addWorksheet("Servis turlari");
  categoriesSheet.columns = [
    { header: "T/r", key: "number", width: 5 },
    { header: "Nomi", key: "name", width: 30 },
  ];
  categories.forEach((category, index) => {
    category.number = index + 1;
    categoriesSheet.addRow(category);
  });
  categoriesSheet.getRow(1).eachCell((cell) => (cell.font = { bold: true }));

  // services
  const servicesSheet = workbook.addWorksheet("Servislar");
  servicesSheet.columns = [
    { header: "T/r", key: "number", width: 5 },
    { header: "Nomi", key: "name", width: 30 },
    { header: "Servis turi", key: "tur", width: 20 },
    { header: "Narxi", key: "price", width: 20 },
  ];
  services.forEach((service, index) => {
    service.number = index + 1;
    service.tur = service.category.name;
    servicesSheet.addRow(service);
  });
  servicesSheet.getRow(1).eachCell((cell) => (cell.font = { bold: true }));

  // orders
  const ordersSheet = workbook.addWorksheet("Buyurtmalar");
  ordersSheet.columns = [
    { header: "T/r", key: "number", width: 5 },
    { header: "Xizmat turi", key: "xizmat", width: 40 },
    { header: "Mashina", key: "car", width: 15 },
    { header: "Holati", key: "status", width: 15 },
    { header: "Buyurtmachi", key: "buyurtmachi", width: 15 },
  ];
  let statuses = {
    pending: "Navbatda",
    done: "Bitkazilgan",
    cancelled: "Bekor qilingan",
  };
  orders.forEach((order, index) => {
    order.number = index + 1;
    order.status = statuses[order.status];
    order.xizmat =
      (order.category?.name || "") + " - " + (order.service?.name || "");
    order.buyurtmachi = order.user?.name || "";
    ordersSheet.addRow(order);
  });
  ordersSheet.getRow(1).eachCell((cell) => (cell.font = { bold: true }));

  // users
  const usersSheet = workbook.addWorksheet("Foydalanuvchilar");
  usersSheet.columns = [
    { header: "T/r", key: "number", width: 10 },
    { header: "Nomi", key: "name", width: 30 },
    { header: "Telegram ID", key: "userId", width: 15 },
  ];
  users.forEach((user, index) => {
    user.number = index + 1;
    usersSheet.addRow(user);
  });
  usersSheet.getRow(1).eachCell((cell) => (cell.font = { bold: true }));

  return await workbook.xlsx.writeBuffer();
};

exports.updateDb = async (data, cb) => {
  let workbook = new ExcelJS.Workbook();
  const stream = new Stream.Readable();
  stream.push(data);
  stream.push(null);
  workbook.xlsx.read(stream).then(async (workbook) => {
    const categoriesSheet = workbook.getWorksheet("Servis turlari");
    const servicesSheet = workbook.getWorksheet("Servislar");

    if (!categoriesSheet || !servicesSheet) {
      return cb(false);
    }

    // categories
    let categories = [];
    categoriesSheet.eachRow((row) => {
      if (row.number > 1) {
        categories.push({
          name: row.getCell(2).value,
        });
      }
    });

    await Category.deleteMany({});
    await Category.insertMany(categories);

    // do the same for others at once
    let services = [];

    // servicesSheet.eachRow(async row => {
    for (let i = 0; i < servicesSheet.rowCount; i++) {
      let row = servicesSheet.getRow(i + 1);
      if (row.number > 1) {
        let category = await Category.findOne({
          name: row.getCell(3).value,
        }).select("_id");
        if (!category) {
          logger.warn("Category not found");
          return cb(false);
          // return { success: true, message: 'Kategoriya topilmadi' }
        }
        services.push({
          name: row.getCell(2).value,
          category: category._id,
          price: row.getCell(4).value
        });
      }
    }
    // }
    await Service.deleteMany({});
    await Service.insertMany(services);

    cb(true);
  });
};
