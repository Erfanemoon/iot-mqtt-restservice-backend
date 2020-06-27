const express = require('express');
const userController = require('../controllers/users-controller');
const { check } = require('express-validator');
const router = express.Router();

router.get('/list', userController.getUsers);
router.post('/signup', [
    check('name').not().isEmpty(),
    check('beaconId').not().isEmpty(),
    check('floor').not().isEmpty(),
], userController.signup);

//router.post('/login', userController.login);

router.get('/delete/:userId', userController.deleteUser);
router.post('/update/', userController.updateUser);
router.get('/get/beacon/:beaconId', userController.getByBeaconId);

module.exports = router;


