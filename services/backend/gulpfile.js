const { task, src, dest, series, parallel, watch } = require('gulp');
const ts = require('gulp-typescript');
const rimraf = require('rimraf');
const sourcemaps = require('gulp-sourcemaps');

const tsProject = ts.createProject('tsconfig.build.json');
const ASSETS = 'src/**/*.{graphql,sql,json,kml,mjml}';

function clean(done) {
  rimraf('dist/*', done);
}

function compile() {
  return tsProject
    .src()
    .pipe(sourcemaps.init())
    .pipe(tsProject())
    .pipe(sourcemaps.write())
    .pipe(dest('dist'));
}

function assets() {
  return src([ASSETS]).pipe(dest('dist'));
}

const build = series(clean, parallel(compile, assets));

const watchBuild = function() {
  watch(tsProject.src(), compile);
  watch(ASSETS, assets);
};

task('clean', clean);
task('build', build);
task('default', build);
task('watch', watchBuild);