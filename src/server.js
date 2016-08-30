var port = 8080;
var chatClients = {};

var io = require('socket.io').listen(port);

io.sockets.on('connection', function(socket) {

    socket.on('connect', function(data){
        connect(socket, data);
    });

    socket.on('userConnect', function(data) {

        connect(socket, data);
    });

    socket.on('send', function(data) {

       send(socket, data);
    });

    socket.on('message', function(data) {

        message(socket, data);
    });

});

function connect(socket, data) {
    console.log(data);
}

function userConnect(socket, data) {
    console.log(data);
}

function send(socket, data) {
    console.log(data);
}

function message(socket, data) {
    console.log(data);
}

console.log('Chat listening to port %d...', port);

