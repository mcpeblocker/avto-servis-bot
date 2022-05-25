const { Scenes, Markup } = require("telegraf");

const scene = new Scenes.BaseScene('cars');

scene.enter((ctx) => {
    let text = "🚘 Mashina rusumini tanlang yoki yozib yuboring:";
    let keyboard = Markup.keyboard([
        ["Kaptiva", "Malibu"],
        ["Gentra", "Cobalt"],
        ["Nexia 3", "Nexia 2"],
        ["Nexia 1", "Damas"],
        ["Spark", "Matiz"],
        ["Tiko", "Lacetti"],
        ["◀️ Orqaga"]
    ]);
    ctx.reply(text, keyboard);
});

scene.hears("◀️ Orqaga", ctx => ctx.scene.enter('services'));

scene.on('text', ctx => {
    ctx.session.service.car = ctx.message.text;
    ctx.scene.enter('order');
});

scene.use(ctx => ctx.scene.reenter());

module.exports = scene;