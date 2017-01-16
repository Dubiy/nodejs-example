'use strict';

const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
    name: String,
    calories: Number
});

module.exports = mongoose.model('Food', foodSchema);