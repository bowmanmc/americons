/*
"fonts": "npm-run-all fonts:fonts fonts:version templates",
"lint:sass": "sass-lint -c .sass-lint.yml -v",
"prefonts:sass": "npm-run-all lint:sass",
"fonts:sass": "node-sass --source-map true --include-path sass sass/americons.scss css/americons.css",
"postfonts:sass": "postcss -c postcss.americons.config.json",
*/
const execSync = require('sync-exec');
const fs = require('fs');
const gulp = require('gulp');
const moment = require('moment');
const os = require('os');
const rimraf = require('rimraf');

const pkg = require('../package.json');
const FONTS_DIR = './src/font/fonts';


console.log(`Cleaning ${FONTS_DIR}...`);
rimraf.sync(FONTS_DIR);

require('./gulpfile.js');
gulp.start('fonts', function() {
    console.log('DONE!');

    let out = `${FONTS_DIR}/version.txt`;
    let now = moment();

    let rev = 'Not Available';
    let branch = 'Not Available';
    try {
        rev = execSync('git rev-parse HEAD').stdout.trim();
        branch = execSync('git rev-parse --abbrev-ref HEAD').stdout.trim();
    }
    catch (err) {
        console.log('Error running "git rev-parse HEAD"');
        console.log('    ' + err.message);
    }

    fs.appendFileSync(out, '\nAmericons');
    fs.appendFileSync(out, '\n===================');
    fs.appendFileSync(out, '\nName: ' + pkg.name);
    fs.appendFileSync(out, '\nDescription: ' + pkg.description);
    fs.appendFileSync(out, '\nURL: https://github.com/bowmanmc/americons');
    fs.appendFileSync(out, '\nVersion: ' + pkg.version);
    fs.appendFileSync(out, '\nGit Branch: ' + branch);
    fs.appendFileSync(out, '\nGit Revision: ' + rev);
    fs.appendFileSync(out, '\nBuild Time: ' + now.format('YYYY-MM-DD HH:mm:ss'));
    fs.appendFileSync(out, '\nBuild Host: ' + os.hostname() + ' [' + os.platform() + ']');
    fs.appendFileSync(out, '\n\n');


});
