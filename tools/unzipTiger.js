const fs = require('fs');
const Promise = require('bluebird');
const unzip = require('unzip');

const states = require('../states.config.js');
const IN_DIR = 'zip';
const OUT_DIR = 'shp';

states.forEach(state => {
    let zipFile = `${IN_DIR}/${state.id}.zip`;
    let outPath = `${OUT_DIR}/${state.id}`;
    console.log('Unziping ' + zipFile + ' to ' + outPath);
    fs.createReadStream(zipFile).pipe(unzip.Extract({
        path: outPath
    }));
});
