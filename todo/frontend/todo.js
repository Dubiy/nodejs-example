console.log('hello');

var listData = [], list, modal, mode, filter, currentTask;

jQuery(function ($) {
    modal = $('#exampleModal');
    list = $('#todo-list-view').click(function (event) {
        var btn = $(event.target);
        var taskId = btn.closest('li').data('id');
        if (!btn.hasClass('btn')) {
            return;
        }
        if (btn.hasClass('btn-success')) {
            toggleDone(taskId);
        }
        if (btn.hasClass('btn-warning')) {
            mode = 'edit';
            currentTask = findById(taskId);
            modal.modal('show');
        }
        if (btn.hasClass('btn-danger')) {
            mode = 'delete';
            currentTask = findById(taskId);
            modal.modal('show');
        }
    });

    var taskFilters = $('.taskFilters li').click(function (event) {
        taskFilters.removeClass('active');
        filter = event.currentTarget.dataset.filter;
        console.log(filter);
        $(event.currentTarget).addClass('active');
        doRender();
    });

    $.get('/api/v1/tasks', function (data) {
        listData = data.tasks;
        console.log(data);
        doRender();
    }, 'json');

    $('#add-task').click(function () {
        mode = 'add';
        $('#exampleModal').modal('show');
    });

    modal.on('show.bs.modal', function (event) {
        if (mode == 'edit') {
            modal.find('#task-title').val(currentTask.title);
        } else if (mode == 'add') {
            modal.find('#task-title').val('');
        }

        if (mode == 'delete') {
            modal.find('.modal-title').text('Delete ' + currentTask.title + '?');
            modal.find('.modal-body').hide();
        } else {
            modal.find('.modal-title').text('Task');
            modal.find('.modal-body').show();
        }
    });

    modal.find('.modal-footer .btn-primary').click(function () {
        var input = modal.find('#task-title');
        switch (mode) {
            case 'add': {
                $.ajax({
                    url: '/api/v1/tasks',
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify({
                        "task": {
                            "title": input.val(),
                            "done": false,
                            "position": 0
                        }
                    }),
                    dataType: 'json',
                    success: function(data){
                        addTask(data.task);
                        modal.modal('hide');
                    },
                    error: function(data){
                        alert('Error occurred :(');
                        console.log('error', data);
                    },
                    processData: false
                });
            } break;
            case 'edit': {
                currentTask.title = input.val();
                doRender();
                $.ajax({
                    url: '/api/v1/tasks/' + currentTask._id,
                    type: 'PUT',
                    contentType: 'application/json',
                    data: JSON.stringify({
                        "task": currentTask
                    }),
                    dataType: 'json',
                    success: function(data){
                        modal.modal('hide');
                    },
                    error: function(data){
                        alert('Error occurred :(');
                        console.log('error', data);
                    },
                    processData: false
                });
            } break;
            case 'delete': {
                $.ajax({
                    url: '/api/v1/tasks/' + currentTask._id,
                    type: 'DELETE',
                    dataType: 'json',
                    success: function(data){
                        modal.modal('hide');
                        list.find('li[data-id=' + currentTask._id + ']').remove();
                    },
                    error: function(data){
                        alert('Error occurred :(');
                        console.log('error', data);
                    },
                    processData: false
                });
            } break;
            default: alert('unknown mode');
        }
    });

    function doRender() {
        countDone = 0;
        list.find('li').remove();
        listData.forEach(function (task) {
            switch (filter) {
                case 'done': {
                    if (task.done) {
                        addTask(task);
                    }
                } break;
                default: {
                    addTask(task);
                } break;
            }

            task.done && countDone++;
        });

        //upd counters
        $('.taskFilters .filterAll .badge').text(listData.length);
        $('.taskFilters .filterDone .badge').text(countDone);
    }

    function addTask(task) {
        list.append('<li class="list-group-item ' + (task.done ? 'done' : '') + '" data-id="' + task._id + '">' +
                        '<span class="data">' + task.title + '<span>' +
                        '<span class="pull-right btn-group">' +
                            '<span class="btn btn-success btn-xs glyphicon glyphicon-ok"></span>' +
                            '<span class="btn btn-warning btn-xs glyphicon glyphicon-edit"></span>' +
                            '<span class="btn btn-danger btn-xs glyphicon glyphicon-remove"></span>' +
                        '</span>' +
                    '</li>'

        );
    }

    function findById(taskId) {
        var res;
        try {
            listData.forEach(function (task, i) {
                if (task._id == taskId) {
                    res = listData[i];
                    throw '';
                }
            });
            console.log('task not found');
            return;
        } catch (e) {}
        return res;
    }

    function toggleDone(taskId) {
        currentTask = findById(taskId);
        currentTask.done = !currentTask.done;

        doRender();
        $.ajax({
            url: '/api/v1/tasks/' + taskId,
            type: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify({
                "task": currentTask
            }),
            dataType: 'json',
            success: function(data){
                console.log('done', data);
            },
            error: function(data){
                alert('Error occurred :(');
                console.log('error', data);
            },
            processData: false
        });
    }
});