var port = 8080;

var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var request = require('request');
var log = require('cllc')();

require('./chat.js')(io, log);
require('./api.js')(app, request);

server.listen(port);

app.use(require('express').static(__dirname + '/../public/'));

app.get('/', function (req, res) {
    res.sendfile(__dirname + '/../public/index.html');
});

log('Chat listening to port', port, '...');
