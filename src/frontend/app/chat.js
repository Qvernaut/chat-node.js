module.exports = function(io, log, test) {
    var chatClients = {};
    var chatClientsOnline = {};

    io.sockets.on('connection', function (socket) {
        // // console.log(socket.handshake.session.uid);
        //
        // socket.on('getSession', function (data) {
        //     // socket.emit('getSession', {"sessionId": socket.handshake.session.uid});
        // });
        //
        // socket.on('setSession', function (data) {
        //     setSession(socket, data);
        // });

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
        log.step(1, 0);

        chatClients[socket.id] = data.userLogin;

        socket.userLogin = data.userLogin;

        io.sockets.emit('updateChatList', chatClients);

        online(socket);
    }

    function newMessage(socket, data) {
        socket.broadcast.emit('newMessage', {
            userLogin: socket.userLogin,
            message: data.message
        });
    }

    function disconnect(socket, data) {
        log.step(-1, -1);

        setTimeout(function () {
            delete chatClients[socket.id];
            delete chatClientsOnline[socket.id];

            io.sockets.emit('updateChatList', chatClients);
            io.sockets.emit('usersStatus', chatClientsOnline);
        }, 500);
    }

    function online(socket, data) {
        log.step(0, 1);

        chatClientsOnline[socket.id] = socket.userLogin;

        socket.status = 'online';

        io.sockets.emit('usersStatus', chatClientsOnline);
    }

    function offline(socket, data) {
        log.step(0, -1);

        delete chatClientsOnline[socket.id];

        socket.status = 'offline';

        io.sockets.emit('usersStatus', chatClientsOnline);
    }

    // function setSession(socket, data) {
    //     // socket.session.uLogin = data.userLogin;
    //     socket.handshake.session.uid = Date.now();
    // }

    log.start('Пользователей онлайн %s, Активных %s.');
};