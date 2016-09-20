module.exports = function(io, log) {
    //баги: плодятся сессии
    var accessLog = false;
    var chatClients = [];
    var chatClientsOnline = {};

    io.sockets.on('connection', function (socket) {
        socket.on('sessionClose', function (data) {
            sessionClose(socket, data);
        });

        socket.on('gR', function (data) {
            gR(socket, data);
        });

        socket.on('userRegister', function (data) {
            userRegister(socket, data);
        });

        socket.on('newMessage', function (data) {
            newMessage(socket, data);
        });

        socket.on('online', function (data) {
            online(socket, data);
        });

        socket.on('offline', function (data) {
            offline(socket, data);
        });

        socket.on('disconnect', function (data) {
            disconnect(socket, data);
        });
    });

    function userRegister(socket, data) {
        if(accessLog) log.step(1, 0);

        if(chatClients.length === 0) {
            chatClients.push({
                            'login': data.userLogin,
                            'socketId': [socket.id],
                            'sessionId': [socket.handshake.sessionID]
                             });

            socket.userLogin = data.userLogin;

            io.sockets.emit('updateChatList', chatClients);

            online(socket);
        } else {
            if(socket.userLogin){
                socket.emit('updateChatList', chatClients);

                online(socket);
            } else {
                for(var i = 0; i < chatClients.length; i++) {
                    if(chatClients[i].login === data.userLogin) {
                        // already logged
                        chatClients[i].socketId.push(socket.id);
                        chatClients[i].sessionId.push(socket.handshake.sessionID);

                        socket.userLogin = data.userLogin;

                        io.sockets.emit('updateChatList', chatClients);

                        online(socket);
                    } else {

                        chatClients.push({'login': data.userLogin,
                            'socketId': [socket.id],
                            'sessionId': [socket.handshake.sessionID]});

                        socket.userLogin = data.userLogin;

                        io.sockets.emit('updateChatList', chatClients);

                        online(socket);
                        break;
                    }

                }
            }
        }
    }

    function newMessage(socket, data) {
        socket.broadcast.emit('newMessage', {
            userLogin: socket.userLogin,
            message: data.message
        });
    }

    function disconnect(socket, data) {
        if(accessLog) log.step(-1, -1);

        setTimeout(function () {
            for(var i = 0; i < chatClients.length; i++) {
                for (var j = 0; j < chatClients[i].socketId.length; j++) {
                    if (chatClients[i].socketId[j] === socket.id) {
                        chatClients[i].socketId.splice(j, 1);
                        io.sockets.emit('usersStatus', chatClientsOnline);
                    }
                }
            }
        }, 500);
    }

    function online(socket, data) {
        if(accessLog) log.step(0, 1);

        chatClientsOnline[socket.userLogin] = socket.userLogin;

        socket.status = 'online';

        io.sockets.emit('usersStatus', chatClientsOnline);
    }

    function offline(socket, data) {
        if(accessLog) log.step(0, -1);

        delete chatClientsOnline[socket.userLogin];

        socket.status = 'offline';

        io.sockets.emit('usersStatus', chatClientsOnline);
    }

    function gR(socket, data) {
        if(chatClients.length === 0) {
            socket.emit('cR', {state: true});
        } else {
            for(var i = 0; i < chatClients.length; i++) {
                for (var j = 0; j < chatClients[i].sessionId.length; j++) {
                    if (chatClients[i].sessionId[j] === socket.handshake.sessionID) {
                        // one browser
                        socket.userLogin = chatClients[i].login;

                        chatClients[i].socketId.push(socket.id);
                        chatClients[i].sessionId.push(socket.handshake.sessionID);

                        socket.emit('cR', {state: false, login: socket.userLogin});
                        break;
                    } else {
                        socket.emit('cR', {state: true});
                    }
                }
            }
        }
    }

    function sessionClose(socket, data) {
        for(var i = 0; i < chatClients.length; i++) {
            for (var j = 0; j < chatClients[i].socketId.length; j++) {
                if (chatClients[i].socketId[j] === socket.id) {
                    chatClients.splice(i, 1);
                    io.sockets.emit('updateChatList', chatClients);
                    break;
                }
            }
        }
        // socket.emit('sessionIsClosed');
    }

    if(accessLog) log.start('Пользователей онлайн %s, Активных %s.');
};