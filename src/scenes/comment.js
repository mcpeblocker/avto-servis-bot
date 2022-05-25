const { Scenes, Markup } = require("telegraf");
const config = require("../utils/config");

const scene = new Scenes.WizardScene(
  "comment",
  (ctx) => {
    let text =
      "✍️ Xizmatlarimiz haqidagi istalgan fikr yoki shikoyatingizni yozib qoldirishingiz mumkin!";
    let keyboard = Markup.keyboard(["◀️ Orqaga"]).resize();
    ctx.reply(text, keyboard);
    ctx.wizard.next();
  },
  (ctx) => {
    let adminText = `<a href="tg://user?id=${ctx.from.id}">Foydalanuvchi</a> fikri 👆`;
    let admins = config.ADMINS;
    admins.forEach(async (admin) => {
      try {
        await ctx.forwardMessage(admin);
        await ctx.telegram.sendMessage(admin, adminText, { parse_mode: 'HTML' });
      } catch (err) {}
    });
    let text = "✅ Izohingiz muvaffaqiyatli yetkazildi!";
    ctx.reply(text);
    ctx.scene.enter("start");
  }
);

scene.hears("◀️ Orqaga", ctx => ctx.scene.enter('start'));

module.exports = scene;
