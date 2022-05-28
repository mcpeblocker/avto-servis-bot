const { Scenes, Markup } = require("telegraf");

const scene = new Scenes.BaseScene('start');

scene.enter((ctx) => {
    let text = "Bot xizmatlaridan birini tanlang 👇";
    let keyboard = Markup.keyboard([
        ["ℹ️ Biz haqimizda", "⚙️ Xizmatlar"],
        ["📍 Manzil", "💬 Xabar jo'natish"]
    ]).resize();

    ctx.reply(text, keyboard);
});

scene.hears("ℹ️ Biz haqimizda", (ctx) => {
    let text = "ℹ️ Bot haqida ma'lumot";
    ctx.reply(text);
});

scene.hears("⚙️ Xizmatlar", (ctx) => {
    ctx.scene.enter('categories');
});

scene.hears("📍 Manzil", (ctx) => {
    let text = "📍 Manzil haqida ma'lumot";
    ctx.reply(text);
});

scene.hears("💬 Xabar jo'natish", (ctx) => {
    ctx.scene.enter('comment');
})


module.exports = scene;
