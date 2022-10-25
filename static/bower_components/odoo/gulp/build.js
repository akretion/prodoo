'use strict';

var gulp = require('gulp');
var bump = require('gulp-bump');
var git  = require('gulp-git');
var paths = gulp.paths;

var $ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'main-bower-files', 'uglify-save-license', 'del']
});

gulp.task('build-lib', [], function () {
 return gulp.src([
     paths.src + '/app/app.js',
     paths.src + '/components/**/*.js'
   ])
     .pipe($.ignore.exclude('*.spec.js'))
     .pipe($.ngAnnotate())
     .pipe($.concat('odoo.js'))
     .pipe(gulp.dest(paths.dist + '/'))
     .pipe($.size({ title: paths.dist + '/', showFiles: true }));
});

gulp.task('build-lib-min', [], function () {
 return gulp.src([
     paths.src + '/app/app.js',
     paths.src + '/components/**/*.js'
   ])
     .pipe($.ignore.exclude('*.spec.js'))
     .pipe($.ngAnnotate())
     .pipe($.uglify({preserveComments:$.uglifySaveLicense}))
     .pipe($.concat('odoo.min.js'))
     .pipe(gulp.dest(paths.dist + '/'))
     .pipe($.size({ title: paths.dist + '/', showFiles: true }));
});

gulp.task('bump', function() {
  gulp.src(['./bower.json', './package.json'])
    .pipe(bump())
    .pipe(git.add())
    .pipe(gulp.dest('./'));
});

gulp.task('tag', function() {
  var pkg = require('../package.json');
  var message = 'Release ' + pkg.version;
  return gulp.src('./')
    .pipe(git.add())
    .pipe(git.commit(message))
    .on('end', function (e) {
      console.log('on end', e);
      git.tag(pkg.version, message)
    });
});

gulp.task('clean', function (done) {
  $.del([paths.dist + '/', paths.tmp + '/'], done);
});

gulp.task('build', ['build-lib', 'build-lib-min']);
