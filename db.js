'use strict';

const mongoose = require('mongoose'),
    config = require('./config');

var uriString =
    process.env.MONGOLAB_URI ||
    process.env.MONGOHQ_URL ||
    config.mongoUrl;


mongoose.connect(uriString, err => {
    if (err) throw err;
});

process.on('SIGINT', () => {
    mongoose.disconnect()
        .then(() => {
            console.log('Disconnected');
            process.exit();
        });
});

module.exports = mongoose;