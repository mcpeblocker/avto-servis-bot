const db = require("../database");

module.exports = async (ctx, next) => {
  if (ctx.chat.type !== "private") return next();
  if (ctx.session.user) return next();
  let user = await db.models.User.findOne({ userId: ctx.from.id });
  if (!user) {
    let newUser = new db.models.User({ userId: ctx.from.id });
    user = await newUser.save();
  }
  ctx.session.user = user;
  return next();
};
