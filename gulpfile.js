var gulp = require('gulp'),

  jshint = require('gulp-jshint'),
  stylish = require('jshint-stylish'),

  connect = require('gulp-connect'),
  concat = require('gulp-concat'),
  browserify = require('gulp-browserify'),
  uglify = require('gulp-uglify'),
  sass = require('gulp-sass'),

  watch = require('gulp-watch'),
  port = process.env.port || 5000,

  path = require('path');

gulp.task('default',['bundle','sass','connect','watch']);

gulp.task('connect',function(){
  connect.server({
    root: path.resolve('./'),
    port: port,
    livereload: true
  })
});

gulp.task('js',function(){
  gulp.src('./src/*.js')
    .pipe(connect.reload())
});

gulp.task('css',function(){
  gulp.src('./src/*.scss')
    .pipe(connect.reload())
});

gulp.task('html',function(){
  gulp.src('./index.html')
    .pipe(connect.reload());
});

gulp.task('watch',function(){
  gulp.watch('./src/*.js',['bundle','js']);
  gulp.watch('./src/*.scss',['sass','css']);
  gulp.watch('./index.html',['html']);
});

gulp.task('bundle', function() {
  return gulp.src('./src/*.js')
    .pipe(concat('bundle.js'))
    .pipe(browserify())
    .pipe(gulp.dest('./dist/'));
});

gulp.task('sass',function(){
  return gulp.src('./src/*.scss')
    .pipe(concat('style.css'))
    .pipe(sass())
    .pipe(gulp.dest('./dist/'));
});

gulp.task('dist',function(){
  gulp.src('./src/*.js')
    .pipe(browserify())
    .pipe(concat('bundle.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./dist/'));
  return gulp.src('./src/*.scss')
    .pipe(concat('style.css'))
    .pipe(sass({outputStyle: 'compressed'}))
    .pipe(gulp.dest('./dist/'));

});
gulp.task('hint', function(){
  return gulp.src('./src/*.js')
    .pipe(watch('./src/*.js'))
    .pipe(jshint())
    .pipe(jshint.reporter(stylish));
});