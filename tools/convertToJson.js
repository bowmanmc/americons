const fs = require('fs');
const mkdirp = require('mkdirp');
const shapefile = require('shapefile');

const IN_DIR = 'shp';
const OUT_DIR = 'json';

mkdirp.sync(OUT_DIR);

let shpFile = `${IN_DIR}/cb_2015_us_state_500k.shp`;
let outFile = `${OUT_DIR}/cb_2015_us_state_500k.json`;
let out = fs.createWriteStream(outFile);

shapefile.open(shpFile).then(source => {
    out.write("{\"type\":\"FeatureCollection\",\"bbox\":");
    out.write(JSON.stringify(source.bbox));
    out.write(",\"features\":[");
    return source.read().then(function(result) {
        if (result.done) return;
        out.write(JSON.stringify(result.value));
        return source.read().then(function repeat(result) {
            if (result.done) return;
            out.write(",");
            out.write(JSON.stringify(result.value));
            return source.read().then(repeat);
        });
    }).then(function() {
        //out[out === process.stdout ? "write" : "end"]("]}\n");
        out.end("]}\n");
    });
});
