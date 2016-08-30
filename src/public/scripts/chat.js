"use strict";
(function($) {
    var socket = null;
    var clientId = null;
    var nickname = null;
    var serverProtocol = 'http';
    var serverAddress = 'localhost';
    var serverPort = '8080';

    function bindDOMEvents() {

        connect();
    }

    function bindSocketEvents(){

    }

    function connect(){

        socket = io.connect(serverProtocol + '://' + serverAddress + ':' + serverPort);

        bindSocketEvents();
    }

    $(function(){
        bindDOMEvents();

        socket.on('connect', function(){
            socket.emit('connect', { nickname: nickname });
        });
        socket.emit('userConnect', {"userConnect" : "1"});
        socket.emit('send', {"send": "2"});
        socket.emit('message', {"message": "3"});
    });
})(jQuery);