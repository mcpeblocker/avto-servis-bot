const { Scenes, Markup } = require("telegraf");
const db = require("../../database");

const scene = new Scenes.BaseScene("cars");

scene.enter(async (ctx) => {
  let text = "🚘 Mashina rusumini tanlang yoki yozib yuboring:";

  const cars = await db.models.Car.find();
  ctx.scene.state.cars = cars;
  let keyboard = cars.map((car) => car.name);
  keyboard.push("◀️ Orqaga");
  ctx.reply(text, Markup.keyboard(keyboard, { columns: 2 }).resize());
});

scene.hears("◀️ Orqaga", (ctx) => ctx.scene.enter("services"));

scene.on("text", (ctx) => {
  let msg = ctx.message.text;
  let cars = ctx.scene.state.cars;
  let car = cars.find((c) => c.name === msg);
  if (!car) return ctx.reply("👇 Quyidagilardan birini tanlang");
  ctx.session.service.car = car;

  ctx.scene.enter("order");
});

scene.use((ctx) => ctx.scene.reenter());

module.exports = scene;
