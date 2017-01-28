'use strict';

const
    express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    config = require('./config'),

    task = require('./tasks/task');

require('./db');

app.listen(config.port, config.ip, () => {
    console.log(`Server running at ${config.ip}:${config.port}`);
});

app.use(bodyParser.json());

app.use('/api/v1', task);
app.use(express.static(__dirname + '/frontend/'));

// error handling
app.use((req, res, next) => {
    const err = new Error(`Not Found ${req.path}`);
    err.status = 404;
    next(err);
});

app.use((error, req, res, next) => {
    if (error) {
        console.log(error);
        return res.status(400).json({error});
    }
    next(error);
});

app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;