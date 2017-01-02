const archiver = require('archiver');
const copydir = require('copy-dir');
const fs = require('fs');
const mkdirp = require('mkdirp');
const pkg = require('../package.json');
const rimraf = require('rimraf');

const DIST = 'americons';

mkdirp.sync(DIST);
const folders = ['css', 'fonts', 'sass', 'svg'];

folders.forEach(folder => {
    console.log(`Copying ${folder} to ${DIST}/${folder}`)
    mkdirp.sync(`${DIST}/${folder}`);
    copydir.sync(folder, `${DIST}/${folder}`);
});

var output = fs.createWriteStream('Americons-' + pkg.version + '.zip');
var archive = archiver('zip', {
    store: true
});

output.on('close', function() {
    console.log(archive.pointer() + ' total bytes');
    rimraf(DIST, function() {});
});

archive.pipe(output);

archive.directory(DIST);
archive.finalize();
