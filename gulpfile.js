var gulp = require('gulp');

var utilities = require('gulp-util');

// JavaScript build tasks go in the order concatInterface -> jsBrowserify -> minifyScripts

var concat = require('gulp-concat');

var browserify = require('browserify');
var source = require('vinyl-source-stream');

var uglify = require('gulp-uglify');

var del = require('del');

var buildProduction = utilities.env.production;


// JS BUILD TASK | concatInterface
gulp.task('concatInterface', function() {
  return gulp.src(['./js/*-interface.js'])
    .pipe(concat('allConcat.js'))
    .pipe(gulp.dest('./tmp'));
});

// JS BUILD TASK | jsBrowserify
gulp.task('jsBrowserify', ['concatInterface'], function() {
  return browserify({ entries: ['./tmp/allConcat.js'] })
    .bundle()
    .pipe(source('app.js'))
    .pipe(gulp.dest('./build/js'));
});

// JS BUILD TASK | minifyScripts
gulp.task("minifyScripts", ["jsBrowserify"], function(){
  return gulp.src("./build/js/app.js")
    .pipe(uglify())
    .pipe(gulp.dest("./build/js"));
});

gulp.task("build", function(){
  if (buildProduction) {
    gulp.start('minifyScripts');
  } else {
    gulp.start('jsBrowserify');
  }
});

gulp.task("clean", function(){
  return del(['build', 'tmp']);
});

gulp.task("build", ['clean'], function(){
  if (buildProduction) {
    gulp.start('minifyScripts');
  } else {
    gulp.start('jsBrowserify');
  }
});

// put this task at the very bottom of our gulpfile since we will run it separately from the chain of build tasks... this is a good task to run periodically as you develop, and when you need some help debugging

var jshint = require('gulp-jshint');

gulp.task('jshint', function(){
  return gulp.src(['js/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});
