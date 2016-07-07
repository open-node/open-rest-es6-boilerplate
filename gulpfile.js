var gulp = require('gulp'),
    apidoc = require('gulp-apidoc');

gulp.task('apidoc',function(done) {
              apidoc({
                  src: "./src",
                  dest: "./docs",
                  debug: true,
                  includeFilters: [ ".*\\.es$", ".*\\.js$" ]
              }, done);
});

gulp.task('apidoc:watch', function() {
  gulp.watch('./src/**/*', {interval: 1000, mode: 'poll'}, ['apidoc']);
});

gulp.task('default', ['apidoc:watch']);
