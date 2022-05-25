const { Scenes, Markup } = require("telegraf");
const db = require("../../database");

const scene = new Scenes.BaseScene("categories");

scene.enter(async (ctx) => {
  ctx.session.service = {};
  let text = "⚙️ Quyidagi xizmatlardan birini tanlang:";

  let categories = await db.models.Category.find();
  ctx.scene.state.categories = categories;
  let keyboard = categories.map((category) => category.name);
  keyboard.push("◀️ Orqaga");

  ctx.reply(text, Markup.keyboard(keyboard, { columns: 2 }));
});

scene.hears("◀️ Orqaga", (ctx) => {
  ctx.scene.enter("start");
});

scene.on("text", (ctx) => {
  let msg = ctx.message.text;

  let categories = ctx.scene.state.categories;
  let category = categories.find((c) => c.name === msg);
  if (!category) return ctx.reply("👇 Quyidagilardan birini tanlang");

  ctx.session.service.category = category;
  ctx.scene.state.categories = null;

  ctx.scene.enter("services");
});

module.exports = scene;
