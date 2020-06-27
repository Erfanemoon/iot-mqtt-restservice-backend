let mqtt = require('mqtt')
options = {
    port: 1883
}
client = mqtt.connect('mqtt://127.0.0.1', options);
client.subscribe('/floors/1/');
console.log('Client publishing.. ');
client.publish('/floors/1/', 'hello everybody');