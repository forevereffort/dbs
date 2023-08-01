// Include gulp
var gulp = require('gulp'),
    sass = require('gulp-sass')(require('sass')),
    rename = require('gulp-rename'),
    gcmq = require('gulp-group-css-media-queries'),
    concat = require('gulp-concat'),
    terser = require('gulp-terser');

// Compile Sass
gulp.task('sass', function () {
    return gulp.src('files/css/build/*.scss')
        .pipe(sass({
            includePaths: require('node-normalize-scss').includePaths
        }))
        .pipe(gcmq())
        .pipe(sass({ outputStyle: 'compressed' }))
        .pipe(rename('main.min.css'))
        .pipe(gulp.dest('files/css'));
});

// Compile js
gulp.task('vendorScripts', function () {
    return gulp.src([
        'files/js/vendors/modernizr-2.8.3-respond-1.4.2.min.js',
        'files/js/vendors/jquery-3.6.4.min.js',
        'files/js/vendors/barba.umd.js',
        'files/js/vendors/imagesloaded.pkgd.js',
        'files/js/vendors/CustomEase.min.js',
        'files/js/vendors/gsap.min.js',
        'files/js/vendors/ScrollTrigger.min.js',
        'files/js/vendors/owl.carousel.js',
        'files/js/vendors/fancybox.umd.js',  
		'files/js/vendors/list.min.js'
    ])
        .pipe(concat('vendorScripts.js'))
        .pipe(rename('vendors.min.js'))
        .pipe(terser())
        .on('error', function (err) { console.log(err) })
        .pipe(gulp.dest('files/js'));
});

// Compile js
gulp.task('mainScript', function () {
    return gulp.src([
        'files/js/main.js',
    ])
        .pipe(concat('main.min.js'))
        .pipe(terser())
        .on('error', function (err) { console.log(err) })
        .pipe(gulp.dest('files/js'));
});

// Watch Files For Changes
gulp.task('watch', function () {
    gulp.watch('files/js/vendors/*.js', gulp.series('vendorScripts'));
    gulp.watch('files/js/main.js', gulp.series('mainScript'));
    gulp.watch('files/css/build/*.scss', gulp.series('sass'));
});

// run Task when gulp
gulp.task('default', gulp.series('vendorScripts', 'mainScript', 'sass', 'watch'));










