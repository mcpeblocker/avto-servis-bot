const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });
require("./index");
const { Category, Service } = require("./models");

let services = {
  "Motor qismini ta'mirlash": [
    {
      name: "Motor kapital ta'mirlash",
      price: "$100",
    },
    {
      name: "Injektor tozalash",
      price: "$100",
    },
    {
      name: "Galovka ta'mirlash",
      price: "$100",
    },
    {
      name: "Klapan reglurovka",
      price: "$100",
    },
    {
      name: "Moy almashtirish",
      price: "$100",
    },
    {
      name: "Boshqa motor nosozligini ta'mirlash",
      price: "$100",
    },
  ],
  "Yurish qismini ta'mirlash": [
    {
      name: "Amartizator ta'mirlash",
      price: "$100",
    },
    {
      name: "Tormoz tizimini ta'mirlash",
      price: "$100",
    },
    {
      name: "Rulavoy qismini ta'mirlash",
      price: "$100",
    },
    {
      name: "Boshqa xizmatlar kelishilgan narxda",
      price: "$100",
    },
  ],
  Avtoelektrik: [
    {
      name: "Xizmatga qarab kelishilgan narxda",
      price: "$100",
    },
  ],
  "Kuzov ta'mirlash": [
    {
      name: "Polirovka keramika",
      price: "$100",
    },
    {
      name: "Shumalyatsiya",
      price: "$100",
    },
    {
      name: "Vakuumlik xizmati",
      price: "$100",
    },
  ],
  Vulkanizatsiya: [
    {
      name: "Xizmatga qarab kelishilgan narxda",
      price: "$100",
    },
  ],
  Razval: [
    {
      name: "Old g'ildiraklar",
      price: "$100",
    },
    {
      name: "Komplekt g'ildiraklar",
      price: "$100",
    },
  ],
  "Gaz ustanovka": [
    {
      name: "Propan - 45 balon",
      price: "$100",
    },
    {
      name: "Propan - 80 balon",
      price: "$100",
    },
    {
      name: "Propan - 90 balon",
      price: "$100",
    },
    {
      name: "Propan - 100 balon",
      price: "$100",
    },
    {
      name: "Metan - 45 balon",
      price: "$100",
    },
    {
      name: "Metan - 80 balon",
      price: "$100",
    },
    {
      name: "Metan - 90 balon",
      price: "$100",
    },
    {
      name: "Metan - 100 balon",
      price: "$100",
    }
  ],
  Avtomoyka: [
    {
      name: "O'z-o'ziga xizmat",
      price: "$100",
    },
    {
      name: "Sirt qismini yuvdirish",
      price: "$100",
    },
    {
      name: "Faqat salon qismi",
      price: "$100",
    },
    {
      name: "Polniy moyka ximchistki",
      price: "$100",
    },
  ],
};

(async () => {
  // remove existing collections
  await Category.deleteMany();
  await Service.deleteMany();

  // insert categories and services
  for (let category of Object.keys(services)) {
    let newCategory = await new Category({ name: category }).save();

    for (let service of services[category]) {
      let newService = Object.assign(service, { category: newCategory._id });
      await (new Service(newService)).save();
    }
  }

  console.log('All done!');
  process.exit(0);
})();
