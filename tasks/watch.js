var gulp = require('gulp');
var sequence = require('run-sequence');
var plugins = require('gulp-load-plugins')();

module.exports = function (config) {
    gulp.task('watch:start', function () {
        return sequence('default', 'server');
    });

    gulp.task('watch', ['watch:start'], function () {

        // Stylus.
        gulp.watch(
            [
                'src/**/*.styl',
            ],
            [ 'styles' ]
        );
    });
};