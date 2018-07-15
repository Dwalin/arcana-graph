var gulp         = require('gulp-async-tasks')(require('gulp'));
var inject       = require('gulp-inject');
var data         = require('gulp-data');
var watch        = require('gulp-watch');
var gulpBrowser  = require("gulp-browser");
var injectCSS    = require('gulp-inject-css');
var stylus       = require('gulp-stylus');
var nunjucks     = require('gulp-nunjucks');
var minify       = require('gulp-minifier');
var browserSync  = require('browser-sync').create();
var inline       = require('gulp-inline-fonts');
var concat       = require('gulp-concat');
var clean = require('gulp-clean');
const zip        = require('gulp-zip');
var merge        = require('merge-stream');

gulp.task('default', function() {

  gulp.run(['compile-html']);

  browserSync.init({
    server: "./dist/test/"
  });

  gulp.watch('./src/css/**/*.styl', ['compile-styl']);
  gulp.watch('./src/templates/**/*.html', ['compile-styl', 'compile-html']);
  gulp.watch('./src/js/**/*.js', ['compile-js']);

});

gulp.task('compile-img', function(){
   gulp.src('./src/img/*')
    .pipe(gulp.dest('./dist/test/'));
});

gulp.task('compile-styl', function(){
  return gulp.src('./src/css/style.styl')
    .pipe(stylus())
    .pipe(minify({
      minify: true,
      minifyJS: true,
      uglifyJS: true,
      uglifyCSS: true,
      minifyCSS: true,
      minifyHTML: true,
      collapseWhitespace: true
    }))
    .pipe(gulp.dest('./dist/test/'))
    .pipe(browserSync.stream());
});

gulp.task('compile-html', ['compile-styl', 'compile-img'] ,function(){

  data = {
    _ADPATH_  : '',
    _ADCLICK_ : '',
    _ADCUID_  : '',
    _ADADID_  : '',
    _ADBNID_  : '',
    _ADTIME_  : ''
  };

  return gulp.src('./src/templates/index.html')
    .pipe(nunjucks.compile(data))
    .pipe(injectCSS())
    .pipe(gulp.dest('./dist/test/'));
});

gulp.task('compile-js', function(){
  return gulp.src('./src/js/*.js')
    .pipe(gulpBrowser.browserify())
    .pipe(gulp.dest('./dist/test/js/'));
});