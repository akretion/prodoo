'use strict';

var gulp = require('gulp');

gulp.paths = {
  src: 'src',
  dist: '/os/target',
  tmp: '.tmp',
  build: 'build'
};

require('require-dir')('./gulp');

gulp.task('default', ['clean'], function () {
  gulp.start('build');
});
