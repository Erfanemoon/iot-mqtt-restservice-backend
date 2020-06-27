const SensorData = require('../models/sensor-data');
const HttpError = require('../utils/http-error');
var HashMap = require('hashmap');
const { validationResult } = require('express-validator');

const getData = async (req, res, next) => {
    console.log('request recived : ' + req);
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError('invalid input data', 422));
    }

    let { entertime, exittime } = req.body;

    let dataArray = await SensorData.find({
        floor: 1,
        status: 'exist',
        timeStamp: {
            $gte: entertime,
            $lte: exittime
        }
    });

    if (!dataArray) {
        return next(new HttpError('no data in this given time was found', 402));
    }

    let beaconsArray = [];
    dataArray.forEach(element => {
        beaconsArray.push.apply(beaconsArray, element.beaconIds);
    });

    // let map = new HashMap();
    let result = repeatChecker(beaconsArray);
    // for (let i = 0; i < result[0].length; i++) {
    //     map.set(result[0][i], result[1][i]);
    // }

    res.status(200).json({ beacon_keys: result[0], beacon_values: result[1] });
};

function repeatChecker(beaconsArray) {
    let a = [], b = [], prev;
    beaconsArray.sort();
    for (let i = 0; i < beaconsArray.length; i++) {
        if (beaconsArray[i] !== prev) {
            a.push(beaconsArray[i]);
            b.push(1);
        } else {
            b[b.length - 1]++;
        }
        prev = beaconsArray[i];
    }

    return [a, b];
}

exports.getData = getData;