var port = 8080;
var chatClients = {};

var io = require('socket.io').listen(port);

io.sockets.on('connection', function(socket) {
    socket.on('userRegister', function(data){
        userRegister(socket, data);
        io.sockets.emit('updateChatList', chatClients);
    });

    socket.on('newMessage', function(data) {
        newMessage(socket, data);
    });
});

function userRegister(socket, data) {
    chatClients[socket.id] = data.userName;
    socket.username = data.userName;
}

function newMessage(socket, data) {
    socket.broadcast.emit('newMessage', {
        userName: socket.username,
        message: data.message
    });
}


console.log('Chat listening to port %d...', port);

