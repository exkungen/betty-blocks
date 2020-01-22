var gulp          = require('gulp'),
    sass          = require('gulp-sass'),
    cleanCSS      = require('gulp-clean-css'),
    rtlcss        = require('gulp-rtlcss'),
    autoprefixer  = require('gulp-autoprefixer'),
    plumber       = require('gulp-plumber'),
    gutil         = require('gulp-util'),
    rename        = require('gulp-rename'),
    concat        = require('gulp-concat'),
    uglify        = require('gulp-uglify-es').default,
    svgSprite     = require('gulp-svg-sprite'),
    imagemin      = require('gulp-imagemin'),
    browserSync   = require('browser-sync').create();

var svgConfig = {
  mode: {
    symbol: {
      inline: true,
      prefix: ".svg %s-svg",
    }
  },
  shape: {
    id: {
      generator: function(name, file) {
        var svg_id = 'svg-' + name;
        return svg_id.replace(/\.[^/.]+$/, "");
      }
    }
  }
};

var onError = function( err ) {
  console.log('An error occurred:', gutil.colors.magenta(err.message));
  gutil.beep();
};

// Grab the package.json file for the version
var getPackageJson = function () {
  var fs = require('fs');

  return JSON.parse(fs.readFileSync( 'package.json', 'utf8'));
};
//
gulp.task('css', function() {
  gulp.src('./app/css/*.css')
      .pipe(cleanCSS())
      .pipe(gulp.dest('./dist/css/'));
});
// Scss
gulp.task('scss', function() {
  return gulp.src('./app/scss/*.scss')
  .pipe(plumber({ errorHandler: onError }))
  .pipe(sass())
  .pipe(autoprefixer())
  .pipe(cleanCSS())
  .pipe(concat('global.css'))
  .pipe(gulp.dest('./dist/css/'))
  .pipe(rtlcss())                     // Convert to RTL
  .pipe(rename({ basename: 'rtl' }))  // Rename to rtl.css
  .pipe(gulp.dest('./dist/css/'));             // Output RTL stylesheets (rtl.css)
});
//autoprefixer
gulp.task('autoprefixer', function () {
  var postcss      = require('gulp-postcss');
  var sourcemaps   = require('gulp-sourcemaps');
  var autoprefixer = require('autoprefixer');

  return gulp.src('./app/scss/*.scss')
      .pipe(sourcemaps.init())
      .pipe(postcss([ autoprefixer() ]))
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest('./dest'));
});
// Images
gulp.task('images', function() {
  return gulp.src('./app/images/*')
  .pipe(plumber({ errorHandler: onError }))
  .pipe(imagemin({ optimizationLevel: 7, progressive: true }))
  .pipe(gulp.dest('./dist/images'));
});

gulp.task('svg', function() {

  gulp.src('./app/svg/*.svg')
  .pipe(svgSprite(svgConfig))
  .pipe(gulp.dest('./dist/icons'));

});
//JS Lib
gulp.task('js-lib', function () {
  return gulp.src(['./node_modules/jquery/dist/jquery.js',
      './node_modules/bootstrap/dist/js/bootstrap.js', './app/js/lib/*.js'])
      .pipe(concat('vendor.js'))
      .pipe(rename({suffix: '.min'}))
      .pipe(uglify())
      .pipe(gulp.dest('./dist/js'));
});

//Javascript
gulp.task('js', function () {
  return gulp.src(['./app/js/*.js'])
      .pipe(concat('app.js'))
      .pipe(rename({suffix: '.min'}))
      .pipe(uglify())
      .pipe(gulp.dest('./dist/js'))
      .on('error', function(err) {
          console.error('Error in compress task', err.toString());
      });
});

// Watch
gulp.task('watch', function() {
    browserSync.init({
      server: {
        baseDir: "./"
    }
});
  gulp.watch('./app/scss/**/*.scss', ['scss']);
  gulp.watch('./app/images/src/*', ['images']);
  gulp.watch('./app/svg/*', ['svg']);
  gulp.watch('./app/js/**/*.js', ['js']);
  gulp.watch('./app/js/lib/**/*.js', ['js-lib']);
});


gulp.task('build', ['svg', 'scss', 'images','css', 'js']);
gulp.task('default', ['build', 'watch']);