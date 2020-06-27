const mongoose = require('mongoose');
const schema = mongoose.Schema;

let SensorDataSchema = new schema({
    floor: Number,
    timeStamp: String,
    status: String,
    beaconIds: [String]
});

module.exports = mongoose.model('Sensor_Data', SensorDataSchema);