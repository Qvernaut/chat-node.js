var config = {

};

var gulp  = require('gulp');
var shell = require('gulp-shell');

gulp.task('shorthand', shell.task([
    'echo hello',
    'echo world'
]));