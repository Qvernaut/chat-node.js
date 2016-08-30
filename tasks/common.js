var gulp  = require('gulp');
var shell = require('gulp-shell');

module.exports = function(config) {
    gulp.task('commit-lib', shell.task([
        'git add .',
        'git commit -m "Update."'
    ]));

    gulp.task('push-lib', shell.task([
        'git push -u origin master'
    ]));

    gulp.task('push', ['commit-lib', 'push-lib']);
};