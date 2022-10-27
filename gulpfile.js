'use strict';

var gulp = require('gulp');

gulp.paths = {
  src: 'src',
  dist: 'dist',
  tmp: '.tmp',
};

require('require-dir')('./gulp');

gulp.task('default', [], function () {
    gulp.start('build');
});