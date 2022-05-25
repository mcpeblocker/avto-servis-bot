const { Scenes } = require("telegraf");

const stage = new Scenes.Stage([
    require('./start'),
    require('./comment'),
    ...require('./services')
]);

module.exports = stage;