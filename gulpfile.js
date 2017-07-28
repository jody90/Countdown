var gulp       = require('gulp');
var watch      = require('gulp-watch');
var sass       = require('gulp-sass');
var uglify     = require('gulp-uglify');
var concat     = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
var cleanCss   = require('gulp-clean-css');
var rename     = require('gulp-rename');
var livereload = require('gulp-livereload');
var gutil      = require('gulp-util');
var dirSync    = require('gulp-directory-sync');
var server     = require('gulp-server-livereload');

var scripts = [
    './src/js/scripts.js'
];

var angularScripts = [
    './src/angular/app.js',
    './src/angular/controller/IndexController.js'
];

var sassFiles = './src/sass/*.scss';
var jsFiles = './src/js/*.js';
var imageFiles = './src/images';

function handleError(err) {
    console.error(err.toString());
    this.emit('end');
}

gulp.task('webserver', function() {
    gulp.src('')
    .pipe(server({
        livereload: true,
        directoryListing: false,
        open: false,
        port:3000
    }));
});

gulp.task('watch', function() {
    gulp.watch([sassFiles, jsFiles, angularScripts, imageFiles], ['sass', 'js', 'angular', 'images']);
})

gulp.task('images', function() {
    return gulp.src( '' )
        .pipe(dirSync( './src/images', './ressources/images', { printSummary: true } ))
        .on('error', handleError)
        .pipe(livereload());
})

gulp.task('js', function() {
    return gulp.src(jsFiles)
    .pipe(sourcemaps.init())
    .pipe(concat('scripts.min.js'))
    .pipe(gutil.env.env === 'production' ? uglify() : gutil.noop())
    .pipe(gutil.env.env === 'production' ? gutil.noop() : sourcemaps.write())
    .pipe(gulp.dest('./ressources/js'))
    .pipe(livereload());
});

gulp.task('angular', function() {
    return gulp.src(angularScripts)
        .pipe(sourcemaps.init())
        .pipe(concat('customAngular.min.js'))
        .pipe(gutil.env.env === 'production' ? gutil.noop() : sourcemaps.write())
        .pipe(gutil.env.env === 'production' ? uglify() : gutil.noop())
        .pipe(gulp.dest('./ressources/angular'))
        .pipe(livereload());
});

gulp.task('sass', function () {
    return gulp.src('./src/sass/style.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', handleError))
        .pipe(gutil.env.env === 'production' ? cleanCss() : gutil.noop())
        .pipe(gutil.env.env === 'production' ? gutil.noop() : sourcemaps.write())
        .pipe(rename({
            basename: "style.min"
        }))
        .pipe(gulp.dest('./ressources/css'))
        .pipe(livereload());
});

// Default Task
gulp.task('default', ['sass', 'js', 'angular', 'images', 'webserver', 'watch']);
