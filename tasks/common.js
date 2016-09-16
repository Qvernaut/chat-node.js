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

        var app = require('express')();
        var server = require('http').Server(app);
        var io = require('socket.io')(server);
        var request = require('request');
        var log = require('cllc')();

        require(config.appDir + 'chat.js')(io, log);
        require(config.appDir + 'api.js')(app, request);

        server.listen(port);

        app.use(require('express').static(config.publicDir));

        app.get('/', function (req, res) {
            res.sendfile(config.publicDir + 'index.html');
        });

        log('Chat listening to port', port, '...');
    });


    gulp.task('default', function (callback) {
        return sequence(['styles'], callback);
    });
};