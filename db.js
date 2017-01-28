'use strict';

const mongoose = require('mongoose'),
    config = require('./config');

mongoose.connect(config.mongoUrl, err => {
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