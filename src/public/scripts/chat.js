"use strict";
(function($) {
    var socket = null;
    var nickname = null;
    var windowActive = true;
    var messageSong = '../public/sounds/sound.mp3';
    var serverProtocol = 'http';
    var serverAddress = 'localhost';
    var serverPort = '8080';

    function bindDOMEvents() {
        $('.usernameInput').keyup(function(){
            if(event.keyCode==13) {
                handleNicname();
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
                users += '<div class="user" data="' + i + '"><span class="name">' + data[i] + '</span></div>';
            }

            $('.left-col').html(users);
        });

        socket.on('newMessage', function(data){
            $(".messages").append('<div class="mess"><div class="mess-username">' + data.userName + '</div>' +
                data.message + '</div>');

            playMessageSong();

            chatScroll();
        });

        socket.on('usersStatus', function(data){
            $('.user').each(function(f,elem) {
                var trigger = false;

                for(var i in data) {
                    if(i == $(this).attr("data")) {
                        trigger = true;
                    }
                }

                if (trigger) {
                    $(this).find('.offline').remove();
                    $(this).find('.online').remove();
                    $(this).find('.name').append('<span class="online"></span>');
                } else {
                    $(this).find('.online').remove();
                    $(this).find('.offline').remove();
                    $(this).find('.name').append('<span class="offline"></span>');
                }
            });
        })
    }

    function handleMessage(){
        var message = $('.message').val().trim();

        if(message){
            socket.emit('newMessage', {message: message});

            $(".messages").append('<div class="mess own"><div class="mess-username own">' + nickname + '</div>' +
                message + '</div>');

            $('.message').val('');

            chatScroll();
        }
    }

    function handleNicname(){
        nickname = $('.usernameInput').val().trim();

        if(nickname) {
            connect();

            $('.login-page').fadeOut(200);

            $('.message').focus();
        }
    }

    function chatScroll() {
        $('.messages').scrollTop($('.messages').prop('scrollHeight'));
    }

    function connect(){
        socket = io.connect(serverProtocol + '://' + serverAddress + ':' + serverPort);

        bindSocketEvents();

        socket.emit('userRegister', {"userName" : nickname});
    }

    function playMessageSong() {
        var audio = new Audio();
        audio.src = messageSong;
        audio.autoplay = true;
    }

    window.onblur = function () {
        if(nickname && socket) {
            if (windowActive) {
                windowActive = false;

                socket.emit('offline');
            }
        }
    };

    window.onfocus = function () {
        if(nickname && socket) {
            if(!windowActive) {
                windowActive = true;

                socket.emit('online');
            }
        }
    };

    $(function(){
        bindDOMEvents();
    });

})(jQuery);