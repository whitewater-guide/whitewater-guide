var gulp = require('gulp');
var browserify = require('browserify');
var gutil = require('gulp-util');
var tap = require('gulp-tap');
var uglify = require('gulp-uglify');
var buffer = require('gulp-buffer');
var babelify    = require('babelify');

gulp.task('bundle-workers', function () {
  return gulp.src([
    'workers/*.js',
    '!workers/*.min.js',
  ], {read: false})
    // transform file objects using gulp-tap plugin
    .pipe(tap(function (file) {
      gutil.log('bundling ' + file.path);
      // replace file contents with browserify's bundle stream
      var browserifyOpts = {
        browserField : false,
        builtins : false,
        commondir : false,
        insertGlobalVars : {
          process: undefined,
          global: undefined,
          'Buffer.isBuffer': undefined,
          Buffer: undefined
        }
      };
      file.contents = browserify(file.path, browserifyOpts)
        .transform("babelify", { presets: ["es2015"] })
        .bundle();
    }))
    .pipe(buffer())
    .pipe(uglify().on('error', gutil.log))
    .pipe(gulp.dest('private/workers'));
});

gulp.task('default', ['bundle-workers']);