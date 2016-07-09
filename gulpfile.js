const gulp        = require('gulp');
const uglify      = require('gulp-uglify');
const ghPages     = require('gulp-gh-pages');
const sass        = require('gulp-ruby-sass');
const browserSync = require('browser-sync').create();
const reload      = browserSync.reload;
const vulcanize   = require('gulp-vulcanize');
const del         = require('del');
const runSequence = require('run-sequence');


gulp.task('default', ['clean'], function() {
  return runSequence(
    ['copy', 'vulcanize']
  );
});

gulp.task('scripts', function() {
  return gulp.src('src/*.js')
  .pipe(uglify())
  .pipe(gulp.dest('dist'));
});

/* Deploy to gh-pages */
gulp.task('deploy-gh-pages', ['default'], function() {
  return gulp.src('dist/**/*')
    .pipe(ghPages());
});

gulp.task('serve', function() {
    browserSync.init({
        port: 5000,
        notify: false,
        server: {
            baseDir: "src"
        }
    });

    gulp.watch(['src/**/*.html', '!app/bower_components/**/*.html'], reload);
    gulp.watch(['src/**/*.css'], reload);
    gulp.watch(['src/**/*.js'], reload);
    gulp.watch(['src/images/**/*'], reload);
});

gulp.task('copy', ['copy-bower'], function() {
  return gulp.src([
    'src/*',
    '!src/elements',
    '!src/bower_components',
    '!**/.DS_Store'
  ])
  .pipe(gulp.dest('dist/'));
});

gulp.task('copy-bower', function() {
  return runSequence(
    ['copy-webcomponentsjs', 'copy-pagejs']
  );
});

gulp.task('copy-webcomponentsjs', function() {
  return gulp.src([
  'src/bower_components/webcomponentsjs/webcomponents-lite.min.js'
]).pipe(gulp.dest('dist/bower_components/webcomponentsjs'));
});

gulp.task('copy-pagejs', function() {
  return gulp.src([
  'src/bower_components/page/page.js'
]).pipe(gulp.dest('dist/bower_components/page'));
});

gulp.task('clean', function() {
  return del(['./dist/']);
});

gulp.task('vulcanize', function() {
  return gulp.src('./src/elements/elements.html')
    .pipe(vulcanize({
      stripComments: true,
      inlineCss: true,
      inlineScripts: true
    }))
    .pipe(gulp.dest('dist/elements/'));
});
