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
        // var Session = require('express-session');
        // var SessionStore = require('session-file-store')(Session);
        // var session = Session({store: new SessionStore({path: __dirname+'/tmp/sessions'}), secret: 'pass', resave: true, saveUninitialized: true});

        var port = 8080;

        var express = require('express');
        var app = express();
        var server = require('http').Server(app);
        // var ios = require(config.appDir + '/session.js');
        var io = require('socket.io')(server);
        // io.use(ios(session));
        var request = require('request');
        var log = require('cllc')();
        var bodyParser = require('body-parser');

        server.listen(port);

        app.use(bodyParser.urlencoded({ extended: false }));
        app.use(bodyParser.json());
        app.use(express.static(config.publicDir));

        app.get('/', function (req, res) {
            console.log(req);
            // req.session.uid = Date.now();
            res.sendfile(config.publicDir + 'index.html');
        });

        require(config.appDir + 'chat.js')(io, log);
        require(config.appDir + 'api.js')(app, request);

        log('Chat listening to port', port, '...');
    });


    gulp.task('default', function (callback) {
        return sequence(['styles'], callback);
    });
};