'use strict';

let app = require('express')(),
    http = require('http').Server(app),
    io = require('socket.io')(http),
    port = 3000;

    app.get('/', (req, res) => {
        res.sendFile(__dirname + '/index.html');
    });

    app.get('/js/:filename', (req, res) => {
        res.sendFile(__dirname + '/js/' + req.params.filename);
    });

    io.on('connection', function(socket) {
        socket.on('chat message', function(msg) {
            io.emit('chat message', msg);
        });
    });

http.listen(port, function () {
    console.log(`Server running at localhost:${port}`);
});



//
// var http = require('http');
//
// var i = 0;
//
// http.createServer(function (req, res) {
//     res.writeHead(200, {'Content-Type': 'text/plain'});
//     res.end(JSON.stringify({obj: i++}));
// }).listen(1337, '127.0.0.1');
//
// console.log('Server running at http://127.0.0.1:1337/');



// var express = require('express');
//
// var app = express();
//
// app.use(function(req, res, next) {
//     res.write('Hello');
//     next();
// });
//
// app.post('/', function(req, res){
//     res.send('World');
// });
//
// app.delete('/2', function(req, res){
//     res.send('World 2');
// });
//
// app.listen(3000);
