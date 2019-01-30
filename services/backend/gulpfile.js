const { task, src, dest, series, parallel, watch } = require('gulp');
const ts = require('gulp-typescript');
const rimraf = require('rimraf');

const tsProject = ts.createProject('tsconfig.build.json');
const ASSETS = 'src/**/*.{graphql,sql,json,kml}';

function clean(done) {
  rimraf('dist/*', done);
}

function compile() {
  return tsProject
    .src()
    .pipe(tsProject())
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
