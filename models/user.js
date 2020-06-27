const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const schema = mongoose.Schema;

let userSchema = new schema({
    name: String,
    email: String,
    password: String,
    beaconId: String,
    floor: Number
});

userSchema.plugin(uniqueValidator);
module.exports = mongoose.model('User', userSchema);