const { Scenes, Markup } = require("telegraf");
const { updateDb } = require("../utils/excel");
const axios = require("axios");

const scene = new Scenes.WizardScene(
  "admin:update",
  (ctx) => {
    let text = "📄 Marhamat, excel faylni jo'nating";
    let keyboard = Markup.keyboard(["◀️ Orqaga"]).resize();
    ctx.reply(text, keyboard);
    ctx.wizard.next();
  },
  async (ctx) => {
    let file = ctx.message?.document;
    if (!file) return ctx.scene.reenter();
    const { href: link } = await ctx.telegram.getFileLink(file.file_id);
    const { data } = await axios.get(link, { responseType: "arraybuffer" });
    ctx.reply("⏳ Qabul qilindi. Baza yangilanmoqda...");
    await updateDb(data, (success) => {
      if (!success) {
        let text =
          "❌ Bazani yangilashda xatolik! Excel faylni to'g'ri ekanligiga ishonch hosil qiling!";
        ctx.reply(text);
        ctx.scene.enter("admin");
        return;
      }
      let text = "✅ Baza muvaffaqiyatli yangilandi!";
      ctx.reply(text);
      ctx.scene.enter("admin");
    });
  }
);

scene.hears("◀️ Orqaga", (ctx) => ctx.scene.enter("admin"));

module.exports = scene;
