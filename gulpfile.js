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
  return gulp.src('./assets/appicon.jpeg')
    .pipe(gulp.dest('./lib/assets/'))
})

// --------------------------------------------------------

gulp.task('default', function (callback) {
  runSequence('clean', ['sass', 'babel', 'copyAssets'], callback)
})

gulp.task('build', ['default'])
