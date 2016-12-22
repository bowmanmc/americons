const filesize = require('filesize');
const fs = require('fs');
const glob = require('glob');
const mkdirp = require('mkdirp');
const path = require('path');
const SVGO = require('svgo');

const IN_DIR = 'svgraw';
const OUT_DIR = 'svg';

const svgo = new SVGO();


let matcher = `${IN_DIR}/**/*.svg`;

function getFileSize(filepath) {
    let fd = fs.openSync(filepath, 'r');
    let stats = fs.fstatSync(fd);
    let fsize = filesize(stats.size);
    fs.closeSync(fd);
    return fsize;
}

glob(matcher, function(err, files) {
    files.forEach(file => {
        let outFile = file.replace(IN_DIR, OUT_DIR);
        let outDir = path.dirname(outFile);
        mkdirp.sync(outDir);
        let inSize = getFileSize(file);
        fs.readFile(file, 'utf8', function(err, data) {
            svgo.optimize(data, function(result) {
                fs.writeFileSync(outFile, result.data);
                let outSize = getFileSize(outFile);
                let filename = path.basename(outFile);
                console.log(`Optimized ${file} from ${inSize} to ${outSize} in ${outFile}`);
            });
        });
    });
});
