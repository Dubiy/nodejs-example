'use strict';

const express = require('express'),

    Task = require('./model'),

    router = express.Router();

router.get('/tasks', (req, res, next) => {

    // Task.find({name: 'Coffee'})
    Task.find({})
        .sort({position: 1})
        .then(tasks => {
            res.json({tasks});
        })
        .catch(next);
});

router.post('/tasks', (req, res, next) => {
    //find biggest position
    Task.findOne({})
        .sort({position: -1})
        .then(lastTask => {
            let newPosition = 1;
            if (lastTask && lastTask.position) {
                newPosition = lastTask.position + 1;
            }

            req.body.task.position = newPosition;

            new Task(req.body.task)
                .save()
                .then(task => {
                    console.log('newTask', task);
                    res.json({task});
                })
                .catch(next);
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

router.put('/tasks/move/:task_id/to/:moveToId', (req, res, next) => {
    Task.find({
        $or:[
            {_id: req.params.task_id},
            {_id: req.params.moveToId}
        ]
    })
        .then(tasks => {
            if (tasks.length != 2) {
                res.status(400).json({error: 'Task not exists'});
                return;
            }

            let taskIndex = 0;
            if (tasks[1]._id == req.params.task_id) {
                taskIndex = 1;
            }

            let task = tasks[taskIndex];
            let moveTo = tasks[Math.abs(taskIndex - 1)];

            let query = {position: {$lte: moveTo.position, $gte: task.position}};
            let direction = -1;
            if (task.position > moveTo.position) {
                query = {position: {$lte: task.position, $gte: moveTo.position}};
                direction = 1;
            }
            Task.find(query)
                .then(tasksBetween => {
                    tasksBetween.forEach(function (el, idx) {
                        let newPos = el.position + direction;
                        console.log(el._id.equals(task._id), el._id, task._id);
                        if (el._id.equals(task._id)) {
                            newPos = moveTo.position;
                        }

                        Task.update({'_id': el._id},
                            {$set: {position: newPos}},
                            function (err, result) {
                                if (err) throw err;
                                console.log(result);
                            });
                    });

                    res.json({tasksBetween});
                })
                .catch(next);

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