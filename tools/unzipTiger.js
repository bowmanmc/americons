const fs = require('fs');
const unzip = require('unzip');

const TIGER = require('../tiger.config.js');
const IN_DIR = 'zip';
const OUT_DIR = 'shp';

TIGER.files.forEach(file => {
    let inPath = `${IN_DIR}/${file.filename}.zip`;
    let outPath = `${OUT_DIR}/${file.resolution}`;
    console.log(`Unzipping ${inPath} to ${outPath}...`);
    fs.createReadStream(inPath).pipe(unzip.Extract({
        path: outPath
    }));
});
