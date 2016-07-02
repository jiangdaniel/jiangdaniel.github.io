const gulp        = require('gulp');
const uglify      = require('gulp-uglify');
const ghPages     = require('gulp-gh-pages');
const sass        = require('gulp-ruby-sass');
const browserSync = require('browser-sync').create();
const vulcanize   = require('gulp-vulcanize');
const del         = require('del');
const runSequence = require('run-sequence');



// gulp.task('default', ['clean'], function(cb) {
//   // Uncomment 'cache-config' if you are going to use service workers.
//   runSequence(
//     ['ensureFiles', 'copy', 'styles'],
//     ['images', 'fonts', 'html'],
//     'vulcanize', // 'cache-config',
//     cb);
// });

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
gulp.task('deploy-gh-pages', function() {
  return gulp.src('dist/**/*')
    .pipe(ghPages());
});

gulp.task('serve', ['default'], function() {
    browserSync.init({
        port: 5000,
        notify: false,
        server: {
            baseDir: "dist"
        }
    });
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
  return gulp.src([
  'src/bower_components/webcomponentsjs/webcomponents-lite.min.js'
]).pipe(gulp.dest('dist/bower_components/webcomponentsjs'));
})

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
