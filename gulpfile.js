var gulp = require('gulp');
    sass = require('gulp-sass'),
    browserSync = require('browser-sync'),
    reload = browserSync.reload,
    autoprefixer = require('gulp-autoprefixer'),
    browserify = require('gulp-browserify'),
    clean = require('gulp-clean'),
    concat = require('gulp-concat'),
    merge = require('merge-stream'),
    newer = require('gulp-newer'),
    imagemin = require('gulp-imagemin'),
    injectPartials = require('gulp-inject-partials'),
    minify = require('gulp-minify'),
    rename = require('gulp-rename'),
    cssmin = require('gulp-cssmin'),
    htmlmin = require('gulp-htmlmin');

var SOURCEPATHS = {
  sassSource: 'src/scss/*.scss',
  htmlSource: 'src/*.html',
  htmlPartialSource: 'src/partial/*.html',
  jsSource: 'src/js/*.js',
  imgSource: 'src/img/**'
};

var APPPATH = {
  root: 'app/',
  css: 'app/css',
  js: 'app/js',
  fonts: 'app/fonts',
  img: 'app/img'
};

gulp.task('clean-html', function () {
  return gulp.src(APPPATH.root + '/*.html', { read: false, force: true })
         .pipe(clean());
});

gulp.task('clean-scripts', function () {
  return gulp.src(APPPATH.js + '/*.js', { read: false, force: true })
         .pipe(clean());
});

gulp.task('sass', function () {
  var bootstrapCSS = gulp.src('./node_modules/bootstrap/dist/css/bootstrap.css');
  var sassFiles;
  sassFiles =  gulp.src(SOURCEPATHS.sassSource)
         .pipe(autoprefixer())
         .pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError));

  return merge(sassFiles, bootstrapCSS)
         .pipe(concat('app.css'))
         .pipe(gulp.dest(APPPATH.css));
});

gulp.task('images', function () {
  return gulp.src(SOURCEPATHS.imgSource)
         .pipe(newer(APPPATH.img))
         .pipe(imagemin())
         .pipe(gulp.dest(APPPATH.img));
});


gulp.task('moveFonts', function () {
  return gulp.src('./node_modules/bootstrap/dist/fonts/*.{eot,svg,ttf,woff,woff2}')
         .pipe(gulp.dest(APPPATH.fonts));
});

gulp.task('scripts', ['clean-scripts'], function () {
  return gulp.src(SOURCEPATHS.jsSource)
         .pipe(concat('main.js'))
         .pipe(browserify())
         .pipe(gulp.dest(APPPATH.js));
});

gulp.task('compress' , function () {
  return gulp.src(SOURCEPATHS.jsSource)
         .pipe(concat('main.js'))
         .pipe(browserify())
         .pipe(minify())
         .pipe(gulp.dest(APPPATH.js));
});

gulp.task('compresscss', function () {
  var bootstrapCSS = gulp.src('./node_modules/bootstrap/dist/css/bootstrap.css');
  var sassFiles;
  sassFiles =  gulp.src(SOURCEPATHS.sassSource)
         .pipe(autoprefixer())
         .pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError));

  return merge(sassFiles, bootstrapCSS)
         .pipe(concat('app.css'))
         .pipe(cssmin())
         .pipe(rename({suffix: '.min'}))
         .pipe(gulp.dest(APPPATH.css));
});


gulp.task('html', function () {
  return gulp.src(SOURCEPATHS.htmlSource)
         .pipe(injectPartials())
         .pipe(gulp.dest(APPPATH.root));
});

gulp.task('minifyHtml', function () {
  return gulp.src(SOURCEPATHS.htmlSource)
         .pipe(injectPartials())
         .pipe(htmlmin({collapseWhitespace:true}))
         .pipe(gulp.dest(APPPATH.root));
});

gulp.task('serve', ['sass'], function () {
  browserSync.init([APPPATH.css + '/*.css', APPPATH.root + '/*.html', APPPATH.root + '/*.js'], {
    server: {
      baseDir: APPPATH.root
    }
  });
});

/*
gulp.task('copy', ['clean-html'] ,function () {
  return gulp.src(SOURCEPATHS.htmlSource)
         .pipe(gulp.dest(APPPATH.root))
});
*/

gulp.task('watch', ['serve', 'sass', 'clean-html', 'clean-scripts' , 'scripts', 'moveFonts', 'images', 'html'], function () {
  gulp.watch([SOURCEPATHS.sassSource], ['sass']);
  // gulp.watch([SOURCEPATHS.htmlSource], ['copy']);
  gulp.watch([SOURCEPATHS.jsSource], ['scripts']);
  gulp.watch([SOURCEPATHS.htmlSource, SOURCEPATHS.htmlPartialSource], ['html'])
});

gulp.task('default', ['watch']);

gulp.task('production', ['minifyHtml', 'compresscss', 'compress'])
