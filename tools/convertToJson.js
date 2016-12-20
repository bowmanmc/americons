const fs = require('fs');
const mkdirp = require('mkdirp');
const shapefile = require('shapefile');

const TIGER = require('../tiger.config.js');
const IN_DIR = 'shp';
const OUT_DIR = 'json';


TIGER.files.forEach(tigerFile => {

    let shpFile = `${IN_DIR}/${tigerFile.resolution}/${tigerFile.filename}.shp`;
    let outPath = `${OUT_DIR}/${tigerFile.resolution}`;
    let outFile = `${outPath}/${tigerFile.filename}.json`;
    mkdirp.sync(outPath);

    let out = fs.createWriteStream(outFile);

    shapefile.open(shpFile).then(source => {
        out.write('{\"type\":\"FeatureCollection\",\"bbox\":');
        out.write(JSON.stringify(source.bbox));
        out.write(',\"features\":[');
        return source.read().then(function(result) {
            if (result.done) return;
            out.write(JSON.stringify(result.value));
            return source.read().then(function repeat(result) {
                if (result.done) return;
                out.write(',');
                out.write(JSON.stringify(result.value));
                return source.read().then(repeat);
            });
        }).then(function() {
            out.end(']}\n');
        });
    });
});
