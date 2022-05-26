const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    name: String
});

const Car = mongoose.model('Car', schema);

module.exports = Car;