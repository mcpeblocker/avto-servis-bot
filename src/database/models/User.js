const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    userId: String
});

const User = mongoose.model('User', schema);

module.exports = User;