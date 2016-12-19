const fs = require('fs');
const mkdirp = require('mkdirp');
const SVGO = require('svgo');

const STATES = require('../states.config.js');
const IN_DIR = 'svg';
const OUT_DIR = 'svgo';


mkdirp.sync(OUT_DIR);
const svgo = new SVGO();

STATES.forEach(state => {

    let inPath = `${IN_DIR}/${state.id}.svg`;
    let outPath = `${OUT_DIR}/${state.id}.svg`;

    fs.readFile(inPath, 'utf8', function(err, data) {
        svgo.optimize(data, function(result) {
            fs.writeFileSync(outPath, result.data);
        });
    });

});
