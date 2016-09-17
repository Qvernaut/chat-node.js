"use strict";
(function ($) {
    var socket = null;
    var userLogin = null;
    var windowActive = true;
    var messageSong = '../src/public/sounds/sound.mp3';
    var serverProtocol = 'http';
    var serverAddress = 'localhost';
    var serverPort = '8080';

    function bindDOMEvents() {
        $('.registration-page__button').click(function () {
            handleRegistration();
        });

        $('.login-page__button').click(function () {
            handleLogin();
        });

        $('.registration-page__link').click(function () {
            $('.registration-page').fadeOut(200);
            $('.login-page').fadeIn(200);
        });

        $('.login-page__link').click(function () {
            $('.login-page').fadeOut(200);
            $('.registration-page').fadeIn(200);
        });

        // $('.login-page__nickName').keyup(function(){
        //     if(event.keyCode==13) {
        //         handleNicname();
        //     }
        // });
        //
        $('.right-panel__textarea').keyup(function(){
            if(event.keyCode==13) {
                handleMessage();
            }
        });
    }

    function bindSocketEvents() {
        socket.on('updateChatList', function (data) {
            var users = '';

            for (var i in data) {
                users += '<div class="left-panel__user-block"  data="' + i + '">' +
                    '<span class="left-panel__user-status_offline left-panel__user-status"></span>' +
                    '<span class="left-panel__nickname">' +
                    data[i] +
                    '</span>' +
                    '</div>';
            }

            $('.left-panel__content').html(users);
        });

        socket.on('newMessage', function (data) {
            var date = new Date();
            var hours = date.getHours() >= 10 ? date.getHours() : '0' + date.getHours();
            var minutes = date.getMinutes() >= 10 ? date.getMinutes() : '0' + date.getMinutes();

            $(".right-panel__content").append('<div class="right-panel__message">' +
                '<span class="right-panel__author">' + data.userLogin + '</span>' +
                '<span class="right-panel__date">' + hours + ':' + minutes + '</span>' +
                '<div class="right-panel__message-text">' +
                data.message +
                '</div>' +
                '</div>');
            playMessageSong();

            chatScroll();
        });

        socket.on('usersStatus', function (data) {
            $('.left-panel__user-block').each(function (f, elem) {
                var trigger = false;

                for (var i in data) {
                    if (i == $(this).attr("data")) {
                        trigger = true;
                    }
                }

                if (trigger) {
                    $(this).find('.left-panel__user-status').removeClass('left-panel__user-status_offline');
                    $(this).find('.left-panel__user-status').addClass('left-panel__user-status_online');
                } else {
                    $(this).find('.left-panel__user-status').removeClass('left-panel__user-status_online');
                    $(this).find('.left-panel__user-status').addClass('left-panel__user-status_offline');
                }
            });
        })
    }

    function handleMessage() {
        var message = $('.right-panel__textarea').val().trim();

        if (message) {
            socket.emit('newMessage', {message: message});

            var date = new Date();
            var hours = date.getHours() >= 10 ? date.getHours() : '0' + date.getHours();
            var minutes = date.getMinutes() >= 10 ? date.getMinutes() : '0' + date.getMinutes();

            $(".right-panel__content").append('<div class="right-panel__message">' +
                '<span class="right-panel__author right-panel__author_own">' + userLogin + '</span>' +
                '<span class="right-panel__date">' + hours + ':' + minutes + '</span>' +
                '<div class="right-panel__message-text">' +
                message +
                '</div>' +
                '</div>');


            $('.right-panel__textarea').val('');

            chatScroll();
        }
    }

    function handleLogin() {
        userLogin = $('.login-page__input_login').val().trim();
        var userPassword = $('.login-page__input_password').val().trim();

        if (userLogin && userPassword) {
            $.post("http://localhost:8080/api/login", {
                login: userLogin,
                password: userPassword
            }, function (data) {
                if(JSON.parse(data).status === true) {

                    // socket.emit('setSession', {login: userLogin});

                    // sessionStorage['auth'] = true;
                    // sessionStorage['userLogin'] = userLogin;

                    connect();

                    $('.login-page').fadeOut(200);
                    $('.page-wrap').fadeIn(200);

                    $('.right-panel__textarea').focus();
                } else {
                    $('.growl-container__message').html(JSON.parse(data).error);

                    $('.growl-container').fadeIn(200);
                    setTimeout(function () {
                        $('.growl-container').fadeOut(200);
                    }, 2000);
                }
            });
        }
    }

    function handleRegistration() {
        userLogin = $('.registration-page__input_login').val().trim();
        var userPassword = $('.registration-page__input_password').val().trim();

        if (userLogin && userPassword) {
            $.post("http://localhost:8080/api/registration", {
                login: userLogin,
                password: userPassword
            }, function (data) {
                if(JSON.parse(data).status === true) {
                    $('.registration-page').fadeOut(200);
                    $('.login-page').fadeIn(200);
                } else {
                    $('.growl-container__message').html(JSON.parse(data).error);

                    $('.growl-container').fadeIn(200);
                    setTimeout(function () {
                        $('.growl-container').fadeOut(200);
                    }, 2000);
                }
            });
        }
    }

    function chatScroll() {
        $('.right-panel__content').scrollTop($('.right-panel__content').prop('scrollHeight'));
    }

    function connect() {
        // socket = io.connect(serverProtocol + '://' + serverAddress + ':' + serverPort);

        bindSocketEvents();

        socket.emit('userRegister', {"userLogin": userLogin});
    }

    function playMessageSong() {
        var audio = new Audio();
        audio.src = messageSong;
        audio.autoplay = true;
    }

    window.onblur = function () {
        if (userLogin && socket) {
            if (windowActive) {
                windowActive = false;

                socket.emit('offline');
            }
        }
    };

    window.onfocus = function () {
        if (userLogin && socket) {
            if (!windowActive) {
                windowActive = true;

                socket.emit('online');
            }
        }
    };

    $(function () {
        socket = io.connect(serverProtocol + '://' + serverAddress + ':' + serverPort);

        // socket.emit('getSession');
        // socket.on('getSession', function (data) {
        //     console.log(data.sessionId + ' dsa');
        // });

        // if(!sessionStorage['auth']) {
            bindDOMEvents();
        // } else {
        //     userLogin = sessionStorage['userLogin'];
        //
        //     bindDOMEvents();
        //     $('.login-page').fadeOut(200);
        //     $('.page-wrap').fadeIn(200);
        //     connect();
        //
        //     $('.right-panel__textarea').focus();
        // }
    });

})(jQuery);