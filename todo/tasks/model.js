'use strict';

const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: String,
    done: Boolean,
    position: Number
});

module.exports = mongoose.model('Task', taskSchema );