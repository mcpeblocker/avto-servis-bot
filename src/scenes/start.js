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
    let text = "🤖 Bot yordamida istalgan joyda va istalgan vaqtda turli xil avto-servislardan foydalanish imkoniyatiga ega boʻlishingiz mumkin.\n🚘 Mashinangiz uchun kerakli servisni tanlagan zahoti hamyonbop narxlarni bilib oling.\n📝 Bundan tashqari botning oʻzida servislardagi navbatni kuzatishingiz va unga qoʻshilishingiz mumkin 🎉";
    ctx.reply(text);
});

scene.hears("⚙️ Xizmatlar", (ctx) => {
    ctx.scene.enter('categories');
});

scene.hears("📍 Manzil", (ctx) => {
    ctx.replyWithLocation('20.659324', '-11.406255');
});

scene.hears("💬 Xabar jo'natish", (ctx) => {
    ctx.scene.enter('comment');
})


module.exports = scene;
