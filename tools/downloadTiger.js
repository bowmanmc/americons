const http = require('http');
const fs = require('fs');
const mkdirp = require('mkdirp');
const Promise = require('bluebird');

const states = require('../states.config.js');
const OUT_DIR = 'zip';

function downloadFile(url, filename) {
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

function downloadFiles(calls) {
    // Queue these up and run ONE AT A TIME (so we play nice with the census' web server)
    Promise.each(calls, function(call) {
        return downloadFile(call.url, call.filename);
    });
}

function prepareDownloadCalls() {
    console.log('Downloading ' + states.length + ' Tiger SHP files...');
    let calls = [];
    states.forEach(state => {
        let url = `http://www2.census.gov/geo/tiger/GENZ2015/shp/cb_2015_${state.fips}_tract_500k.zip`;
        let filename = `${OUT_DIR}/${state.id}.zip`;
        calls.push({
            url: url,
            filename: filename
        });
    });

    return calls;
}

// Here's where the magic happens, create OUT_DIR and download the tiger
// shape files (zipped up) to it.
mkdirp.sync(OUT_DIR);
const calls = prepareDownloadCalls();
downloadFiles(calls);
