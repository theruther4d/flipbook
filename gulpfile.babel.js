import gulp from 'gulp';
import scss from 'gulp-sass';
import cssMin from 'gulp-minify-css';
import rename from 'gulp-rename';
import prefix from 'gulp-autoprefixer';
import ugly from 'gulp-uglify';
import del from 'del';
import babel from 'gulp-babel';

const OUTPUT_DIR = './dist';
const SCRIPT_DIR = './src/scripts/flipbook.js';
const STYLE_DIR = './src/css/main.scss';

gulp.task( 'default', ['clean', 'scripts', 'css'] );

gulp.task( 'clean', () => {
    del( OUTPUT_DIR );
});

gulp.task( 'scripts', () => {
    return gulp.src( SCRIPT_DIR )
        .pipe( babel( {
            presets: ['es2015']
        }))
        .pipe( ugly() )
        .pipe( rename( 'main.js' ) )
        .pipe( gulp.dest( OUTPUT_DIR ) );
});

gulp.task( 'css', () => {
    return gulp.src( STYLE_DIR )
        .pipe( scss() )
        .pipe( prefix() )
        .pipe( cssMin() )
        .pipe( rename( 'main.css' ) )
        .pipe( gulp.dest( OUTPUT_DIR ) );
});
