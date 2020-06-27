const Admin = require('../models/system-admin');
const HttpError = require('../utils/http-error');
const { validationResult } = require('express-validator');

const signup = async (req, res, next) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError('invalid input data', 422));
    }

    let { name, email, password } = req.body;
    let userExists;
    try {
        userExists = await Admin.findOne({ email: email });
    } catch (e) {
        return next(new HttpError('user signup faild , try again', 500));
    }
    if (userExists) {
        return next(new HttpError('user is already signed up , validate your data', 422));
    }

    let adminData = new Admin({
        name,
        email,
        password,
    });

    try {
        await adminData.save();
    } catch (e) {
        return next(new HttpError('something went wrong with sign-up', 500));
    }
    res.status(200).json({ admin: adminData.toObject({ getters: true }) });
};

const login = async (req, res, next) => {
    let { email, password } = req.body;
    let existingAdmin;
    try {
        existingAdmin = await Admin.findOne({ email: email });
    } catch (e) {
        return next(new HttpError('something went wrong with login', 500));
    }

    if (!existingAdmin || existingAdmin.password !== password) {
        return next(new HttpError('invalid credentials for admin', 401));
    }

    res.status(200).json({ message: 'loged in admin' });
};

exports.signup = signup;
exports.login = login;