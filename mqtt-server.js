const mosca = require('mosca');
const SensorData = require('./models/sensor-data');
const mongoose = require('mongoose');
const TMClient = require('textmagic-rest-client');
mongoose.Promise = global.Promise;
require('dotenv/config');

mongoose.connect(process.env.DB_CONNECTION,
    { useNewUrlParser: true },
    () => {
        console.log('connected to db')
    });

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback() {
    console.log("database opened ...");
});


let settings = {
    port: 1883,
    http: { port: 8089, bundle: true, static: './' }
};

// here we start mosca
let server = new mosca.Server(settings, function () {
    console.log('mosca server running');
});

// // fired when the mqtt server is ready
server.on('ready', function () {
    console.log(Date() + ' Mosca server is up and running');
});

// fired when a client is connected
server.on('clientConnected', function (client) {
    console.log('Client Connected: ', client.id);
});

// // fired when a message is received
server.on('published', function (packet, client) {
    console.log('Published : ', packet.payload.toString());
});

// // fired when a client subscribes to a topic
server.on('subscribed', function (topic, client) {
    console.log('Subscribed : ', topic, " from : ", client.id);
});

// // fired when a client subscribes to a topic
server.on('unsubscribed', function (topic, client) {
    console.log('Unsubscribed : ', topic, " from : ", client.id);
});

// // fired when a client is disconnected
server.on('clientDisconnected', function (client) {
    console.log('Client Disconnected : ', client.id);
});

server.on('published', function (packet, client) {
    console.log('Published  : ', packet.payload.toString());

    try {
        let data = JSON.parse(packet.payload);
        let convertion = data.beaconIds.substring(1, data.beaconIds.length - 1);
        let fields = convertion.split(',');
        let beaconArray = fields;
        let sensorData;

        if (beaconArray.length >= 6) {
            let c = new TMClient('erfandavoodi', 'WfqVHm4xsAqiNZYaXGn0BLCfCsc03c');
            c.Messages.send({ text: 'WARNING ... there are so many people in floor 1', phones: '00393480566187' }, function (err, res) {
                console.log('Messages.send()', err, res);
            });
        }
        sensorData = new SensorData({
            floor: 1,
            beaconIds: beaconArray,
            timeStamp: new Date().valueOf(),
            status: data.status
        });

        SensorData.find({ beaconIds: beaconArray }, (err, result) => {
            if (result.length === 0 && data.beaconIds.length && data.beaconIds) {
                sensorData.save().then((err) => {
                    console.log(err);
                })
            }
        });

    } catch (e) {
        console.log(e);
    }
});

server.on('subscribed', function (topic, client) {
    console.log('Subscribed : ', topic, " from : ", client.id);
});



