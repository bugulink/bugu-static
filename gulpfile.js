const gulp = require('gulp');
const qiniu = require('gulp-qiniu');
const pkg = require('./package.json');
const join = require('path').join;

const config = {
  accessKey: process.env.BUGU_STATIC_CDN_AK,
  secretKey: process.env.BUGU_STATIC_CDN_SK,
  bucket: process.env.BUGU_STATIC_CDN_BUCKET,
  private: false
};

gulp.task('release', () => {
  return gulp.src('dist/**')
    .pipe(qiniu(config, {
      dir: join('/', pkg.name, pkg.version)
    }));
});
