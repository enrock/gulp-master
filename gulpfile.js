var gulp = require('gulp'),
    gutil = require('gulp-util'),
    coffee = require('gulp-coffee'),
	browserify = require('gulp-browserify'), //must apply gulp bowserify in perens
    compass = require('gulp-compass'),
    connect = require('gulp-connect'),
	uglify = require('gulp-uglify'),
	minifyCss = require('gulp-minify-css');
	minifyHTML = require('gulp-minify-html');
	jsonminify = require('gulp-jsonminify');
    concat = require('gulp-concat');


var coffeeSources = ['components/coffee/tagline.coffee'];
var sassSources = ['components/sass/style.scss'];
var htmlSources = ['_builds/_dev/*.html']
var jsonSources = ['_builds/_dev/_js/*.json']


var jsSources = [
  'components/scripts/rclick.js',
  'components/scripts/pixgrid.js',//remove in future
  'components/scripts/tagline.js',//remove in future
  'components/scripts/template.js'//remove in future
];


gulp.task('coffee', function() {
  gulp.src(coffeeSources)
    .pipe(coffee({ bare: true })
      .on('error', gutil.log))
    .pipe(gulp.dest('components/scripts'))
});


gulp.task('js', function() {
  gulp.src(jsSources)
    .pipe(concat('script.js'))
    .pipe(browserify())
    .pipe(uglify())
    .pipe(gulp.dest('_builds/_site/js/')) //for js templating
    .pipe(connect.reload())
});


//gulp.task('compass',['coffee'], function() { add coffee (or other tasks) to have js and coffee compile together
gulp.task('compass', function() {
  gulp.src(sassSources)
    .pipe(compass({
      sass: 'components/sass',
      images: '_builds/_dev/_img',
      style: 'expanded',
      require: ['susy']//must add require susy for compass
    })
    .on('error', gutil.log))
    .pipe(gulp.dest('_builds/_dev/_css'))
    .pipe(connect.reload())
});

gulp.task('minify-css', function() {
  return gulp.src('_builds/_dev/_css/style.css')
    .pipe(minifyCss({compatibility: 'ie8'}))
    .pipe(gulp.dest('_builds/_site/css/'));
});


gulp.task('watch', function(){
	gulp.watch(coffeeSources, ['coffee']);
	gulp.watch(jsSources, ['js']);
	gulp.watch('components/sass/*.scss', ['compass']);
	gulp.watch('_builds/_dev/*.html', ['html']);
	gulp.watch('_builds/_dev/js/*.json', ['json']);
});


//function that creates a server for json files
gulp.task('connect', function() {
  connect.server({
    root: '_builds/_dev/',
    livereload: true
  });
});


gulp.task('html', function() {
 	gulp.src(htmlSources)
    .pipe(connect.reload())
});


gulp.task('minify-html', function() {
  var opts = {
    conditionals: true,
    spare:true
  };
 
  return gulp.src('_builds/_dev/*.html')
    .pipe(minifyHTML(opts))
    .pipe(gulp.dest('_builds/_site/'));
});


gulp.task('json', function() {
 	gulp.src('_builds/_dev/_js/*.json')
    .pipe(connect.reload())
});

gulp.task('jsonminify', function () {
    return gulp.src(['_builds/_dev/_js/*.json'])
        .pipe(jsonminify())
        .pipe(gulp.dest('_builds/_site/js/'));
});


gulp.task('default',['html', 'coffee', 'js', 'json', 'compass', 'watch', 'connect', 'minify-css', 'minify-html', 'jsonminify'], function() {

}); 


