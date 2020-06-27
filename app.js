const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const user_routes = require('./routes/users-routes');
const admin_routes = require('./routes/admin-routes');
const sensorData_routes = require('./routes/sensorData-routes');
const HttpError = require('./utils/http-error');
const cors = require('cors');
const app = express();


mongoose.Promise = global.Promise;
require('dotenv/config');

app.use(bodyParser.json());
app.use(cors());
app.options('*', cors());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    //res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
    next();
});


app.use('/api/admin', admin_routes);
app.use('/api/users', user_routes);
app.use('/api/sensors', sensorData_routes);

app.use((req, res, next) => {
    const error = new HttpError('Could not find this route.', 404);
    throw error;
});

app.use((err, req, res, next) => {
    if (res.headerSent) {
        return next(err);
    }
    res.status(err.code || 500);
    res.json({ message: err.message || 'unknown error occured' });
});

app.listen(5000);

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

//*sing-up
//*login
//*list-users
//delete-user
