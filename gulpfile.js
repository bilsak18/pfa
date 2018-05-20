const gulp = require('gulp');
const inject = require('gulp-inject');
const wiredep = require('wiredep').stream;
const nodemon = require('gulp-nodemon');

const injectSrc = ['./libs/css/*.css', './libs/js/*.js', './libs/sass/*.scss'];
const nodemonSrc = ['./app.js', './src/views/*.ejs'];

gulp.task('inject', () => {
    let options = {
        bowerJson: require('./bower.json'),
        directory: './libs/'
    };

    return gulp.src('./src/views/*.ejs')
        .pipe(wiredep(options))
        .pipe(inject(gulp.src(injectSrc), {relative: true}))
        .pipe(gulp.dest('./src/views'));
});

gulp.task('serve', ['inject'], () => {
    let options = {
        script: 'app.js',
        delayTime: 1,
        env: {
            'PORT': 5555
        },
        watch: '*.js'
    };

    return nodemon(options)
        .on('restart', () => {
            console.log('Server restarting...');
        });
});