const ExcelJS = require("exceljs");
const { Stream } = require("stream");
const logger = require("./logger");
const db = require("../database");
const { Category, Service, Car, Price } = db.models;

exports.generateDb = async ({
  categories,
  services,
  orders,
  users,
  cars,
  prices,
}) => {
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
  ];
  services.forEach((service, index) => {
    service.number = index + 1;
    service.tur = service.category.name;
    servicesSheet.addRow(service);
  });
  servicesSheet.getRow(1).eachCell((cell) => (cell.font = { bold: true }));

  // cars
  const carsSheet = workbook.addWorksheet("Mashina turlari");
  carsSheet.columns = [
    { header: "T/r", key: "number", width: 5 },
    { header: "Nomi", key: "name", width: 30 },
  ];
  cars.forEach((car, index) => {
    car.number = index + 1;
    carsSheet.addRow(car);
  });
  carsSheet.getRow(1).eachCell((cell) => (cell.font = { bold: true }));

  // prices
  const pricesSheet = workbook.addWorksheet("Xizmat narxlari");
  pricesSheet.columns = [
    { header: "T/r", key: "number", width: 5 },
    { header: "Servis nomi", key: "xizmat", width: 30 },
    { header: "Xizmat turi", key: "tur", width: 30 },
    { header: "Mashina turi", key: "mashina", width: 20 },
    { header: "Narxi", key: "value", width: 15 },
  ];
  prices.forEach((price, index) => {
    price.number = index + 1;
    price.xizmat = price.service.name;
    price.tur = price.category.name;
    price.mashina = price.car.name;
    pricesSheet.addRow(price);
  });

  // orders
  const ordersSheet = workbook.addWorksheet("Buyurtmalar");
  ordersSheet.columns = [
    { header: "T/r", key: "number", width: 5 },
    { header: "Xizmat turi", key: "xizmat", width: 50 },
    { header: "Mashina", key: "mashina", width: 15 },
    { header: "Narx", key: "price", width: 15 },
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
    order.mashina = order.car?.name || "";
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
    const carsSheet = workbook.getWorksheet("Mashina turlari");
    const pricesSheet = workbook.getWorksheet("Xizmat narxlari");

    if (!categoriesSheet || !servicesSheet || !carsSheet || !pricesSheet) {
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
        });
      }
    }
    // }
    await Service.deleteMany({});
    await Service.insertMany(services);

    // cars
    let cars = [];
    for (let i = 0; i < carsSheet.rowCount; i++) {
      let row = carsSheet.getRow(i + 1);
      if (row.number <= 1) {
        continue;
      }
      cars.push({ name: row.getCell(2).value });
    }
    await Car.deleteMany();
    await Car.insertMany(cars);

    // prices
    let prices = [];
    for (let i = 0; i < pricesSheet.rowCount; i++) {
      let row = pricesSheet.getRow(i + 1);
      if (row.number <= 1) {
        continue;
      }
      // get category
      const category = await Category.findOne({
        name: row.getCell(3).value,
      }).select("_id");
      if (!category) {
        logger.warn("Category not found");
        return cb(false);
      }

      // get service
      const service = await Service.findOne({
        name: row.getCell(2).value,
        category: category._id,
      }).select("_id");
      if (!service) {
        logger.warn("Service not found");
        return cb(false);
      }

      // get car
      const car = await Car.findOne({
        name: row.getCell(4).value,
      }).select("_id");
      if (!car) {
        logger.warn("Car not found");
        return cb(false);
      }

      prices.push({
        service: service._id,
        category: category._id,
        car: car._id,
        value: row.getCell(5).value,
      });
    }
    await Price.deleteMany();
    await Price.insertMany(prices);

    cb(true);
  });
};
