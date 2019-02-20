'use strict';

var gulp        = require('gulp'),
    sass        = require('gulp-sass'),
    autopref    = require('gulp-autoprefixer'),
    browserSync = require('browser-sync').create(),
    csso        = require('gulp-csso'),
    uglify      = require('gulp-uglifyjs'),
    cache       = require('gulp-cache'),
    nokey       = require('gulp-tinypng-nokey'),
    smartgrid   = require('smart-grid'),
    clean       = require('gulp-clean');

gulp.task('sass', function() {
    return gulp.src('src/sass/main.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('src/css/'))
        .pipe(browserSync.reload({stream:true}));
});

gulp.task('serve', function() {
    browserSync.init({
        server: {
            baseDir: 'src'
        },
        notify: false
    });
    browserSync.watch('src').on('change', browserSync.reload);
});

gulp.task('build', function(done) {
    var buildHtml = gulp.src('src/index.html')
        .pipe(gulp.dest('build/'));

    var buildCss = gulp.src('src/css/main.css')
        .pipe(autopref({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(csso())
        .pipe(gulp.dest('build/css/'));

    var buildImg = gulp.src('src/img/**/*')
        .pipe(cache(nokey()))
        .pipe(gulp.dest('build/img'));

    var buildJs = gulp.src('src/js/**/*')
        .pipe(uglify())
        .pipe(gulp.dest('build/js'));
    done();
});

var settings = {
    outputStyle: 'scss',
    columns: 12,
    offset: '30px',
    mobileFirst: false,
    container: {
        maxWidth: '1200px',
        fields: '0'
    },
    breakPoints: {
        lg: {
            width: '1100px',
            fields: '15px'
        },
        md: {
            width: '960px'
        },
        sm: {
            width: '780px',
        },
        xs: {
            width: '560px'
        }
    }
};

smartgrid('src/sass', settings);

gulp.task('start', function() {
    return gulp.src('start/**/*')
    .pipe(gulp.dest('src'))
});

gulp.task('clean', function() {
	return gulp.src([
		'src/index.html',
		'src/css/**/*',
		'src/img/**/*',
		'src/js/**/*',
		'src/sass/**/*'
	])
	.pipe(clean());
});

gulp.task('watch', function() {
    gulp.watch('src/**/*.html');
    gulp.watch('src/sass/**/*.scss', gulp.series('sass'));
});

gulp.task('default', gulp.series(
    gulp.parallel('sass'),
    gulp.parallel('watch', 'serve')
));
