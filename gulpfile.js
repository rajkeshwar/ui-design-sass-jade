var gulp        = require('gulp');
var browserSync = require('browser-sync');
var sass        = require('gulp-sass');
var prefix      = require('gulp-autoprefixer');
var cp          = require('child_process');
var jade        = require('gulp-jade');

var _disDir     = "_site";
/**
 * Wait for jekyll-build, then launch the Server
 */
gulp.task('browser-sync', ['sass'], function() {
    browserSync({
        server: {
            baseDir: _disDir
        },
        notify: false
    });
});

/**
 * Compile files from _scss into both _site/css (for live injecting) 
 * and site (for future static builds)
 */
gulp.task('sass', function () {
    return gulp.src('src/*.sass')
        .pipe(sass({
            includePaths: ['css'],
            onError: browserSync.notify
        }))
        .pipe(prefix(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
        .pipe(gulp.dest(_disDir))
        .pipe(browserSync.reload({stream:true}))
        .pipe(gulp.dest(_disDir));
});

/**
* Copy all static assets
*/
gulp.task('copy', function() {
  gulp.src('src/**/*.sass')
    .pipe(gulp.dest(_disDir));

  gulp.src('src/assets/**')
    .pipe(gulp.dest(_disDir + '/assets'));
});

gulp.task('jade', function(){
  return gulp.src('src/**/*.jade')
   .pipe(jade({
      pretty: true
   }))
   .pipe(gulp.dest('_site'));
});

/**
 * Watch scss files for changes & recompile
 * Watch html/md files, run jekyll & reload BrowserSync
 */
gulp.task('watch', function () {
    gulp.watch('src/**/*.sass', ['sass']);
    gulp.watch('src/**/*.jade', ['jade']);
    gulp.watch('src/assets/**', ['copy']);

    gulp.watch("_site/*.css").on('change', browserSync.reload);
    gulp.watch("_site/*.html").on('change', browserSync.reload);
});

/**
* Multi task to create the build 
*/
gulp.task('build', ['jade', 'sass', 'copy']);

/**
 * Default task, running just `gulp` will compile the sass,
 * compile the jekyll site, launch BrowserSync & watch files.
 */
gulp.task('default', ['build', 'browser-sync', 'watch']);
