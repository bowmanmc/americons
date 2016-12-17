const http = require('http');
const fs = require('fs');
const mkdirp = require('mkdirp');
const Promise = require('bluebird');

const TIGER_STATES = 'http://www2.census.gov/geo/tiger/GENZ2015/shp/cb_2015_us_state_500k.zip';
const OUT_DIR = 'zip';
const OUT_FILE = `${OUT_DIR}/cb_2015_us_state_500k.zip`;


function downloadFile() {
    const url = TIGER_STATES;
    const filename = OUT_FILE;
    const deferred = Promise.pending();

    console.log('downloading ' + filename + ' from ' + url);
    http.get(url, function(response) {
        let out = fs.createWriteStream(filename);
        console.log('    writing ' + filename);
        response.pipe(out);
        deferred.resolve();
    });

    return deferred.promise;
}

mkdirp.sync(OUT_DIR);
downloadFile().then(function() {
    console.log('COMPLETE!');
    console.log(TIGER_STATES + ' downloaded to ' + OUT_FILE);
});
