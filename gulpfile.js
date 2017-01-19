var gulp = require('gulp');
sass = require("gulp-sass");//https://www.npmjs.org/package/gulp-sass


gulp.task('sass', function() {
    gulp.src('sass/style.scss')
        .pipe(sass({includePaths: require('node-neat').includePaths}).on('error', sass.logError)) // Converts Sass to CSS with gulp-sass
        .pipe(gulp.dest('./css/'));
});

//Watch Tasks
gulp.task('default', function(){
    gulp.watch('sass/style.scss',['sass']);
});