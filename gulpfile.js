 // Include gulp
var gulp = require('gulp'),
    sass = require('gulp-sass'),
    rename = require('gulp-rename'),
    gcmq = require('gulp-group-css-media-queries'),
    concat = require('gulp-concat'),
    terser = require('gulp-terser');

// Compile Sass
gulp.task('sass', function () {
    return gulp.src('css/build/*.scss')
    .pipe(sass({
        includePaths: require('node-normalize-scss').includePaths
    }))
    .pipe(gcmq())
    .pipe(sass({outputStyle: 'compressed'}))
    .pipe(rename('main.min.css'))
    .pipe(gulp.dest('css'));
});

// Compile js
gulp.task('vendorScripts', function() {
    return gulp.src([
        'js/vendors/modernizr-2.8.3-respond-1.4.2.min.js',
        'js/vendors/jquery-3.4.1.min.js',
        'js/vendors/detect.js',
        'js/vendors/imagesloaded.min.js',
        'js/vendors/gsap.min.js',
        'js/vendors/ScrollTrigger.min.js',
        'js/vendors/isotope.pkgd.min.js',
        'js/vendors/jquery.mCustomScrollbar.concat.min.js',
        'js/vendors/owl.carousel.min.js',
        'js/vendors/timeline-min.js',
        'js/vendors/fancybox.umd.js',
        'js/vendors/sprestlib.min.js',
        ])
        .pipe(concat('vendorScripts.js'))
        .pipe(rename('vendors.min.js'))
        .pipe(terser())
        .on('error', function (err) { console.log( err ) })
        .pipe(gulp.dest('js'));
});

// Watch Files For Changes
gulp.task('watch', function () {
    gulp.watch('js/vendors/*.js', gulp.series('vendorScripts'));
    gulp.watch('css/build/*.scss', gulp.series('sass'));
});

// run Task when gulp
gulp.task('default', gulp.series('vendorScripts', 'sass', 'watch'));
