const { Scenes, Markup } = require("telegraf");
const db = require("../database");
const { generateDb } = require("../utils/excel");
const { Category, Service, User, Order } = db.models;

const scene = new Scenes.BaseScene("admin");

scene.enter((ctx) => {
  let text = "👮‍♂️ Admin paneli";
  let keyboard = Markup.keyboard([
    "⬇️ Statistikani olish",
    "🔄 Bazani yangilash",
  ]);

  ctx.reply(text, keyboard);
});

scene.hears("⬇️ Statistikani olish", async (ctx) => {
  const categories = await Category.find();
  const services = await Service.find().populate("category");
  const users = await User.find();
  const orders = await Order.find().populate("category service user");

  const data = await generateDb({
    categories,
    services,
    orders,
    users,
  });

  ctx.replyWithDocument({ source: data, filename: "Baza.xlsx" });
});

scene.hears("🔄 Bazani yangilash", ctx => ctx.scene.enter('admin:update'));

module.exports = scene;
