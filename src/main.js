require("dotenv").config();

const bot = require("./core/bot");
const session = require("./core/session");
const auth = require("./middlewares/auth");
const stage = require("./scenes");
const config = require("./utils/config");
const startBot = require("./utils/startBot");

require("./database");

bot.use(session);
bot.use((ctx, next) => {
  ctx.session ?? (ctx.session = {});
  next();
});
bot.use(auth);
bot.use(stage.middleware());

bot.start((ctx) => ctx.chat.type === "private" && ctx.scene.enter("start"));

bot.command(
  "admin",
  (ctx) =>
    ctx.chat.type === "private" &&
    config.ADMINS.includes(ctx.from.id) &&
    ctx.scene.enter("admin")
);

require("./utils/channel");

startBot(bot);
