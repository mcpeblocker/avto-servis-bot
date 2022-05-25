const { Scenes } = require("telegraf");

const stage = new Scenes.Stage([
    require('./start'),
    require('./comment'),
    ...require('./services'),
    require('./admin'),
    require('./adminUpdate')
]);

module.exports = stage;