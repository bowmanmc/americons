const fs = require('fs');
const gulp = require('gulp');
const iconfont = require('gulp-iconfont');
const mkdirp = require('mkdirp');
const rename = require('gulp-rename');

const FONT_NAME = 'americons';
const FONT_DIR = 'fonts';
const RUN_TIME = Math.round(Date.now()/1000);


gulp.task('fonts', function() {
    mkdirp.sync(FONT_DIR);

    let outFile = `${FONT_DIR}/americons.codes.json`;

    return gulp.src([`svg/*.svg`])
        .pipe(iconfont({
            fontName: FONT_NAME,
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
                codes.push({
                    name: name,
                    code: code,
                    hex: hex
                });
            });
            fs.writeFileSync(outFile, JSON.stringify(codes));
        })
        .pipe(gulp.dest(FONT_DIR));
});
