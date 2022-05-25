require("dotenv").config();

const bot = require("./core/bot");
const session = require("./core/session");
const auth = require("./middlewares/auth");
const stage = require("./scenes");
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

require("./utils/channel");

startBot(bot);
