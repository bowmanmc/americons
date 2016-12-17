const fs = require('fs');
const Promise = require('bluebird');
const unzip = require('unzip');


let zipFile = 'zip/cb_2015_us_state_500k.zip';
let outPath = 'shp';
console.log('Unziping ' + zipFile + ' to ' + outPath);
fs.createReadStream(zipFile).pipe(unzip.Extract({
    path: outPath
}));
