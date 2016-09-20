var gulp = require('gulp');
var shell = require('gulp-shell');
var sequence = require('run-sequence');

module.exports = function (config) {
    require('./styles.js')(config);
    require('./watch.js')(config);

    gulp.task('commit-lib', shell.task([
        'git add .',
        'git commit -m "Update."'
    ]));

    gulp.task('push-lib', shell.task([
        'git push -u origin master'
    ]));

    gulp.task('push', ['commit-lib', 'push-lib']);

    gulp.task('server', function () {
        var port = 8080;

        // require any modules
        var request = require('request');
        var log = require('cllc')();
        var bodyParser = require('body-parser');

        // initializing express-session middleware
        var Session = require('express-session');
        var SessionStore = require('session-file-store')(Session);
        var session = Session({store: new SessionStore({path: __dirname+'/../tmp/sessions'}), secret: 'pass', resave: true, saveUninitialized: true});

        // creating express app
        var express = require('express');
        var app = express();
        app.use(session);
        app.use(bodyParser.urlencoded({ extended: false }));
        app.use(bodyParser.json());

        // app.get('/', function (req, res) {
        //     res.sendfile(config.publicDir + 'index.html');
        // });

        app.use(express.static(config.publicDir));

        // attaching express app to HTTP server
        var http = require('http');
        var server = http.createServer(app);
        server.listen(port);

        // creating new socket.io app
        var ios = require('socket.io-express-session');
        var io = require('socket.io')(server);
        io.use(ios(session));


        // require other modules
        require(config.appDir + 'chat.js')(io, log);
        require(config.appDir + 'api.js')(app, request);

        log('Chat listening to port', port, '...');
    });


    gulp.task('default', function (callback) {
        return sequence(['styles'], callback);
    });
};