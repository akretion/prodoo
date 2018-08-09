'use strict';

var gulp = require('gulp');

var paths = gulp.paths;

var $ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'main-bower-files']
});

gulp.task('dev', ['inject', 'app', 'components'], function () {
  return gulp.src(paths.tmp + '/serve/*.html')
    	.pipe(gulp.dest(paths.dist + '/'))
    	.pipe($.size({ title: paths.dist + '/', showFiles: true }));
});

gulp.task('app', function () {

  var jsFilter = $.filter(['**/*.js', '**/*.html']);

  return gulp.src(paths.src + '/app/**/')
    .pipe(gulp.dest(paths.dist + '/app'))
    .pipe($.size({ title: paths.dist + '/', showFiles: true }));
});

gulp.task('components', function () {

  var jsFilter = $.filter(['**/*.js', '**/*.html']);

  return gulp.src(paths.src + '/components/**/')
    .pipe(gulp.dest(paths.dist + '/components'))
    .pipe($.size({ title: paths.dist + '/', showFiles: true }));
});
