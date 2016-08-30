var gulp  = require('gulp');
var shell = require('gulp-shell');

module.exports = function(config) {
    gulp.task('update-lib', shell.task([
        'git add .',
        'git commit -m "Update."'
    ]));
};