const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    name: String,
    username: String,
    password: String
});

const model = mongoose.model('user', schema);

module.exports = model;