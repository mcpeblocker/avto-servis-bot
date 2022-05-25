const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    name: String,
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
    price: Number | String
});

const Service = mongoose.model('Service', schema);

module.exports = Service;