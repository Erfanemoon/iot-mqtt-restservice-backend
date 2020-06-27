const User = require('../models/user');
const HttpError = require('../utils/http-error');
const { validationResult } = require('express-validator');

const getUsers = async (req, res, next) => {
    let users;
    try {

        users = await User.find({}, '-password');
    } catch (e) {
        return next(new HttpError('Fetching users failed, please try again later', 500));
    }

    res.json({ users: users.map(user => user.toObject({ getters: true })) });
};

const signup = async (req, res, next) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError('invalid input data', 422));
    }

    let { name, beaconId, floor } = req.body;
    let userExists;
    try {
        userExists = await User.findOne({ beaconId: beaconId });
    } catch (e) {
        return next(new HttpError('user signup faild , try again', 500));
    }
    if (userExists) {
        return next(new HttpError('user is already signed up with this beaconId , validate your data', 422));
    }

    let userData = new User({
        name,
        beaconId,
        floor
    });

    try {
        await userData.save();
    } catch (e) {
        return next(new HttpError('something went wrong with sign-up', 500));
    }
    res.status(201).json({ user: userData.toObject({ getters: true }) });
};

// const login = async (req, res, next) => {
//     let { email, password } = req.body;
//     let existingUser;
//     try {
//         existingUser = await User.findOne({ email: email });
//     } catch (e) {
//         return next(new HttpError('something went wrong with login', 500));
//     }

//     if (!existingUser || existingUser.password !== password) {
//         return next(new HttpError('invalid credentials for user', 401));
//     }

//     res.json({ message: 'loged in user' });
// }

let deleteUser = async (req, res, next) => {

    let userId = req.params.userId;
    let user;
    try {
        user = await User.findById(userId);
    } catch (e) {
        return next(new HttpError('something went wrong in deleting user', 500));
    }
    if (!user) {
        return next(new HttpError('no user found with provided id', 404));
    }

    try {
        await user.remove();
    } catch (e) {
        return next(new HttpError('something went wrong in deleting user', 500));
    }

    res.status(200).json({ message: 'user deleted' });
}

let updateUser = async (req, res, next) => {

    let userId = req.body.id;
    let user;
    const { name, email, password, beaconId, floor } = req.body;



    try {
        let dataBybeconId = await User.find({ beaconId: beaconId });
        if (dataBybeconId.length > 1) {
            return next(new HttpError('this beaconId is already used'), 201);
        }

        user = await User.findById(userId);
    } catch (e) {
        return next(new HttpError('something went wrong with updating user', 500));
    }

    if (!user) {
        return next(new HttpError('the id provided is not assigned to any user', 404));
    }

    user.name = name;
    user.email = email;
    user.password = password;
    user.beaconId = beaconId;
    user.floor = floor;

    try {
        await user.save();
    } catch (e) {
        return next(new HttpError('user could not be updated ', 500));
    }

    res.status(200).json({ user: user.toObject({ getters: true }) });
};

let getByBeaconId = async (req, res, next) => {
    let beaconId = req.params.beaconId;
    let data;
    try {
        data = await User.findById({ beaconId: beaconId });
    } catch (e) {
        return next(new HttpError('something went wrong , try again', 500));
    }
    if (!data) {
        return next(new HttpError('beacon id provided is not valid', 402));
    }

    res.status(200).json({ user: data.toObject({ getters: true }) });

};

exports.getByBeaconId = getByBeaconId;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;
exports.getUsers = getUsers;
exports.signup = signup;
//exports.login = login;