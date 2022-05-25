const { Scenes, Markup } = require("telegraf");
const db = require("../../database");

const scene = new Scenes.BaseScene("services");

scene.enter(async (ctx) => {
  let category = ctx.session.service.category;
  let text = `🔽 ${category.name} servislaridan birini tanlang:`;

  const services = await db.models.Service.find({ category: category._id });
  ctx.scene.state.services = services;
  let keyboard = services.map((service) => service.name);
  keyboard.push("◀️ Orqaga");
  ctx.reply(text, Markup.keyboard(keyboard, { columns: 2 }));
});

scene.hears("◀️ Orqaga", (ctx) => ctx.scene.enter("categories"));

scene.on('text', (ctx) => {
  let msg = ctx.message.text;

  let services = ctx.scene.state.services;
  let service = services.find((s) => s.name === msg);
  if (!service) return ctx.reply("👇 Quyidagilardan birini tanlang");

  ctx.session.service.service = service;
  ctx.scene.state.services = null;

  ctx.scene.enter("cars");
})

module.exports = scene;
