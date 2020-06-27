const express = require('express');
const adminController = require('../controllers/admin-controller');
const { check } = require('express-validator');
const router = express.Router();

router.post('/signup', [
    check('name').not().isEmpty(),
    check('email').normalizeEmail().isEmail(),
    check('password').not().isEmpty()
], adminController.signup);

router.post('/login', [
    check('email').normalizeEmail().isEmail(),
    check('password').not().isEmpty()
], adminController.login)

module.exports = router