const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const adminSchema = mongoose.Schema({
    name: String,
    email: String,
    password: String
});

adminSchema.plugin(uniqueValidator);
module.exports = mongoose.model('admin', adminSchema);