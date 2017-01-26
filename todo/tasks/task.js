'use strict';

const express = require('express'),

    Task = require('./model'),

    router = express.Router();

router.get('/tasks', (req, res, next) => {

    // Task.find({name: 'Coffee'})
    Task.find({})
        .then(tasks => {
            res.json({tasks});
        })
        .catch(next);
});

router.post('/tasks', (req, res, next) => {
    new Task(req.body.task)
        .save()
        .then(task => {
            console.log(task);
            res.json({task});
        })
        .catch(next);
});

router.put('/tasks/:task_id', (req, res, next) => {
    Task.update({'_id' : req.params.task_id},
        {$set: req.body.task},
        function (err, result) {
            if (err) throw err;
            console.log(result);
        });
    Task.find({_id: req.params.task_id})
        .then(task => {
            res.json({task});
        })
        .catch(next);
});

router.delete('/tasks/:task_id', (req, res, next) => {
    Task.remove({_id: req.params.task_id}, function(err, result) {
        if (err) {
            console.log(err);
        }
        console.log(result);

        res.json({
                'status': 'ok'
            });
    });
});

module.exports = router;