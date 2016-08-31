var port = 8080;
var chatClients = {};
var chatClientsOnline = {};

var io = require('socket.io').listen(port);

io.sockets.on('connection', function(socket) {
    socket.on('userRegister', function(data){
        userRegister(socket, data);
    });

    socket.on('newMessage', function(data) {
        newMessage(socket, data);
    });

    socket.on('online', function(data) {
        online(socket, data);
    });

    socket.on('offline', function(data) {
        offline(socket, data);
    });

    socket.on('disconnect', function (data) {
        disconnect(socket, data);
    });
});

function userRegister(socket, data) {
    chatClients[socket.id] = data.userName;

    socket.username = data.userName;

    io.sockets.emit('updateChatList', chatClients);

    online(socket, data);
}

function newMessage(socket, data) {
    socket.broadcast.emit('newMessage', {
        userName: socket.username,
        message: data.message
    });
}

function disconnect(socket, data) {
    setTimeout(function () {
        delete chatClients[socket.id];
        delete chatClientsOnline[socket.id];

        io.sockets.emit('updateChatList', chatClients);
    }, 500);
}
function online(socket, data) {
    chatClientsOnline[socket.id] = socket.username;

    socket.status = 'online';

    io.sockets.emit('usersStatus', chatClientsOnline);
}

function offline(socket, data) {
    delete chatClientsOnline[socket.id];

    socket.status = 'offline';

    io.sockets.emit('usersStatus', chatClientsOnline);
}


console.log('Chat listening to port %d...', port);

