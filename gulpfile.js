const gulp = require('gulp'),
    del = require("del"),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    clean = require('gulp-clean'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync').create(),
    imagemin = require('gulp-imagemin'),
    pug = require('gulp-pug');

const paths = {
    scripts: 'src/js/**/*.js',
    styles: 'dist/styles/**/*.css',
    sass: 'src/sass/**/*.scss',
    images: 'src/images/**/*',
    views: 'src/views/**/*.pug',
    destroot: "./dist"
};

// SASS Task
gulp.task('sass', function () {
    return gulp.src('./src/sass/**/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('dist/css'))
        .pipe(browserSync.stream());
});

// Clean Tasks
gulp.task("clean:js", function (cb) {
    del('dist/js', cb);
});

gulp.task("clean:css", function (cb) {
    del('dist/css', cb);
});

gulp.task("clean:html", function (cb) {
    del('dist/*.html', cb);
});

gulp.task("clean:images", function (cb) {
    del('dist/images', cb);
});

gulp.task("clean", ["clean:js", "clean:css", "clean:html", "clean:images"]);

// Copy Files to Dist

gulp.task("copy:css", ['sass'], function () {
    return gulp.src(paths.styles)
        .pipe(gulp.dest(paths.destroot + '/css'));
});

gulp.task("copy:js", function () {
    return gulp.src(paths.scripts)
        .pipe(gulp.dest(paths.destroot + '/js'));
});

gulp.task('copy:images', function () {
    return gulp.src(paths.images)
        .pipe(imagemin({
            optimizationLevel: 5
        }))
        .pipe(gulp.dest(paths.destroot + '/images'));
});

gulp.task("copy", ["views", "copy:css", "copy:js", "copy:images"]);

gulp.task('views', function buildHTML() {
    return gulp.src('src/views/*.pug')
        .pipe(pug({
            pretty: true
        }))
        .pipe(gulp.dest(paths.destroot))
});

// Browser Sync Task
gulp.task('serve', function () {

    browserSync.init({
        server: "dist/",
        host: '0.0.0.0'
    });

    gulp.watch(paths.sass, ['copy:css']);
    gulp.watch(paths.images, ['copy:images']);
    gulp.watch(paths.views, ['views']);
    gulp.watch(paths.scripts, ['copy:js']).on('change', browserSync.reload);
    gulp.watch("src/views/**/*.pug").on('change', browserSync.reload);
});

gulp.task('default', ['clean', 'copy']);