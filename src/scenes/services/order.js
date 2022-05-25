const { Scenes, Markup } = require("telegraf");
const db = require("../../database");
const { sendToChannel } = require("../../utils/channel");
const config = require("../../utils/config");

const scene = new Scenes.BaseScene("order");

scene.enter(async (ctx) => {
  if (!ctx.session.service) return ctx.scene.enter("start");
  let { category, service, car } = ctx.session.service;

  let text = `<b>Xizmat turi:</b> ${category.name} - ${service.name}\n`;
  text += `<b>Mashina turi:</b> ${car}\n`;
  text += `<b>Xizmat narxi:</b> ${service.price}\n`;

  const orders = await db.models.Order.find({
    category: category._id,
    service: service._id,
    status: "pending",
  });

  text += `<b>Navbatda:</b> ${orders.length}`;

  let keyboard = Markup.keyboard([
    ["🛎 Navbatga qo'shilish"],
    ["◀️ Bekor qilish"],
  ]);

  ctx.replyWithHTML(text, keyboard);
});

scene.hears("🛎 Navbatga qo'shilish", async (ctx) => {
  // add user to queue;
  const order = new db.models.Order(
    Object.assign(ctx.session.service, { user: ctx.session.user })
  );
  await order.save();

  //  send to channel
  sendToChannel(
    await db.models.Order.findById(order._id).populate("category service user")
  );

  // finish
  ctx.reply("✅ Siz navbatga muvaffaqiyatli qo'shildingiz!");
  ctx.scene.enter("start");
});
scene.hears("◀️ Bekor qilish", (ctx) => ctx.scene.enter("start"));

module.exports = scene;
