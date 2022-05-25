const bot = require("../core/bot");
const db = require("../database");
const config = require("./config");
const { Markup } = require("telegraf");
const logger = require("./logger");

// bot.on("channel_post", (ctx) => ctx.reply(ctx.chat.id));

let statuses = {
  pending: "⏳ Navbatda",
  done: "✅ Bitkazilgan",
  cancelled: "❌ Bekor qilingan",
};

bot.action(/done_(.+)/, async (ctx) => {
  let order = await db.models.Order.findById(ctx.match[1]).populate(
    "category service user"
  );
  if (!order) return ctx.answerCbQuery('❗️ Buyurtma topilmadi');
  order.status = "done";
  await order.save();
  await ctx.editMessageText(generateText(order), { parse_mode: "HTML" });
  ctx.answerCbQuery("✅ Navbatdan o'chirildi!");
});

bot.action(/cancelled_(.+)/, async (ctx) => {
  let order = await db.models.Order.findById(ctx.match[1]).populate(
    "category service user"
  );
  if (!order) return ctx.answerCbQuery('❗️ Buyurtma topilmadi');
  order.status = "cancelled";
  await order.save();
  await ctx.editMessageText(generateText(order), { parse_mode: "HTML" });
  ctx.answerCbQuery("✅ Navbatdan o'chirildi!");
});

const generateText = (order) => {
  let { category, service, car, status, user } = order;

  let text = `<a href="tg://user?id=${user.userId}">Mijoz</a>\n`;
  text += `<b>Xizmat turi:</b> ${category.name} - ${service.name}\n`;
  text += `<b>Mashina turi:</b> ${car}\n`;
  text += `<b>Xizmat narxi:</b> ${service.price}\n`;
  text += `<b>Holati:</b> ${statuses[status]}`;

  return text;
};

const sendToChannel = async (order) => {
  let text = generateText(order);

  let keyboard = Markup.inlineKeyboard([
    Markup.button.callback("✅ Bitkazildi", `done_${order._id}`),
    Markup.button.callback("❌ Bekor qilindi", `cancelled_${order._id}`),
  ]);
  try {
    await bot.telegram.sendMessage(config.CHANNEL, text, {
      ...keyboard,
      parse_mode: "HTML",
    });
  } catch (err) {
    logger.error(`sendToChannel failed!`, { error: err, message: err.message });
  }
};

module.exports = {
  sendToChannel,
};