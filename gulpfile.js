const gulp = require('gulp')
const del = require('del')
const sass = require('gulp-sass')
const babel = require('gulp-babel')
const runSequence = require('run-sequence')

gulp.task('clean', () => {
  return del(['./lib/**', './build/**', './dist/**'])
})

gulp.task('sass', () => {
  return gulp.src('./src/client/styling/main.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./lib/client/styling/'))
})

gulp.task('babel', () => {
  return gulp.src('./src/**/*.js')
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(gulp.dest('./lib/'))
})

gulp.task('copyAssets', () => {
  // App icon
  return gulp.src('./assets/appicon.png')
    .pipe(gulp.dest('./lib/assets/'))
})

gulp.task('copyMiniplayerAssets', () => {
  // App icon
  return gulp.src('./assets/miniplayer/**')
    .pipe(gulp.dest('./lib/miniplayer/bundled/'))
})

gulp.task('copyMiniplayer', () => {
  // App icon
  return gulp.src('./src/miniplayer/**')
    .pipe(gulp.dest('./lib/miniplayer/'))
})

// --------------------------------------------------------

gulp.task('default', function (callback) {
  runSequence('clean', ['sass', 'babel', 'copyAssets', 'copyMiniplayer', 'copyMiniplayerAssets'], callback)
})

gulp.task('build', ['default'])
