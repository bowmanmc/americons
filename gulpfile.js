const fs = require('fs');
const gulp = require('gulp');
const iconfont = require('gulp-iconfont');
const mkdirp = require('mkdirp');
const rename = require('gulp-rename');

const FONT_NAME = 'americons';
const FONT_DIR = 'fonts';
const RUN_TIME = Math.round(Date.now()/1000);


function buildTask(resolution) {
    mkdirp.sync(FONT_DIR);

    let outFile = `${FONT_DIR}/americons-${resolution}.codes.json`;
    let fontName = `${FONT_NAME}-${resolution}`;

    if (!resolution) {
        outFile = `${FONT_DIR}/americons.codes.json`;
        fontName = FONT_NAME;
        resolution = 'med'; // default resolution
    }

    return gulp.src([`svg/${resolution}/*.svg`])
        .pipe(iconfont({
            fontName: fontName,
            prependUnicode: false,
            formats: ['eot', 'svg', 'ttf', 'woff', 'woff2'],
            timestamp: RUN_TIME
        }))
        .on('glyphs', function(glyphs, options) {
            //console.log(glyphs, options);
            let codes = [];
            glyphs.forEach(glyph => {
                let name = glyph.name;
                let code = glyph.unicode[0].charCodeAt(0);
                let hex = code.toString(16);
                //console.log(`${name} - ${hex}`);
                codes.push({
                    name: name,
                    code: code,
                    hex: hex
                });
            });
            fs.writeFileSync(outFile, JSON.stringify(codes));
        })
        .pipe(gulp.dest(FONT_DIR));
}

gulp.task('fonts', ['fonts-default']);

gulp.task('fonts-default', function() {
    return buildTask();
});

gulp.task('fonts-low', function() {
    return buildTask('low');
});

gulp.task('fonts-med', function() {
    return buildTask('med');
});

gulp.task('fonts-high', function() {
    return buildTask('high');
});
