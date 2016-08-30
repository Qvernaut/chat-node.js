"use strict";
(function($) {
    var socket = null;
    var clientId = null;
    var nickname = null;
    var serverProtocol = 'http';
    var serverAddress = 'localhost';
    var serverPort = '8080';

    function bindDOMEvents() {
        $('.usernameInput').keyup(function(){
            if(event.keyCode==13) {
                nickname = $(this).val();
                connect();
                $('.login-page').fadeOut(200);
                $('.message').focus();
            }
        });

        $('.message').keyup(function(){
            if(event.keyCode==13) {
                handleMessage();
            }
        });
    }

    function bindSocketEvents(){
        socket.on('updateChatList', function(data){
            var users = '';

            for(var i in data) {
                users += '<div class="user">' + data[i] + '</div>';
            }

            $('.left-col').html(users);
        });

        socket.on('newMessage', function(data){
            $(".messages").append('<div class="mess"><div class="mess-username">' + data.userName + '</div>' +
                data.message + '</div>');
        })

    }

    function handleMessage(){
        var message = $('.message').val().trim();
        if(message){
            socket.emit('newMessage', {message: message});
            $(".messages").append('<div class="mess own"><div class="mess-username own">' + nickname + '</div>' +
                message + '</div>')
            $('.message').val('');
        }
    }

    function connect(){
        socket = io.connect(serverProtocol + '://' + serverAddress + ':' + serverPort);

        bindSocketEvents();

        socket.emit('userRegister', {"userName" : nickname});
    }

    $(function(){
        bindDOMEvents();
    });
})(jQuery);