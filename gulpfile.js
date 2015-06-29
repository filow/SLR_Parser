var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    stylish = require('jshint-stylish'),
    watch = require('gulp-watch');

gulp.task('default', function() {
  // place code for your default task here
});

gulp.task('run', function() {
  // place code for your default task here
});

gulp.task('hint', function(){
  return gulp.src('./src/*.js')
    .pipe(watch('./src/*.js'))
    .pipe(jshint())
    .pipe(jshint.reporter(stylish));
});