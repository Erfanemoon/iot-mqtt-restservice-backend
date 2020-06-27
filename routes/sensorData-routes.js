const express = require('express');
const { check } = require('express-validator');
const sensorController = require('../controllers/sensor-controller');
const router = express.Router();

router.post('/data', [
    check('entertime').not().isEmpty(),
    check('exittime').not().isEmpty()
], sensorController.getData);

module.exports = router;