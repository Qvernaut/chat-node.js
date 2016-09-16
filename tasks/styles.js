var gulp = require('gulp');
var gutil = require('gulp-util');
var plugins = require('gulp-load-plugins')();

module.exports = function(config) {
    gulp.task('styles', function () {
        gulp.src(config.mainStylDir + '*.styl')
            .pipe(plugins.stylus({
                errors: true,
                'include css': true
            }))
            .pipe(plugins.autoprefixer())
            .pipe(config.production ? plugins.minifyCss() : gutil.noop())
            .pipe(plugins.size({gzip: true , title: 'styles', showFiles: true}))
            .pipe(gulp.dest(config.buildDir))
    });
};