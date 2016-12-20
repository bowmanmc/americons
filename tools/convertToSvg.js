// d3 imports
const d3 = require('d3');
d3.geo = require('d3-geo');
d3.geo.projection = require('d3-geo-projection');
require('d3-selection-multi');

const fs = require('fs');
const jsdom = require('jsdom');
const mkdirp = require('mkdirp');
const Promise = require('bluebird');


const IN_DIR = 'json';
const OUT_DIR = 'svg';
const TIGER = require('../tiger.config.js');
const STATES = require('../states.config.js');
const SIZE = 1000;


function getFeature(features, stateId) {
    var i, feature;
    var len = features.length;
    for (i = 0; i < len; i++) {
        feature = features[i];
        //console.log(JSON.stringify(feature.properties));
        if (feature.properties.STUSPS === stateId) {
            return feature;
        }
    };
    console.log('ERROR: Couldn\'t find: ' + stateId);
}

function renderSvg(feature, state, outFile) {
    const deferred = Promise.pending();

    jsdom.env({
        html: '',
        src: [d3],
        done: function (err, window) {
            var $ = window.$;
            var projection = d3.geo.geoConicConformal();
            var path = d3.geo.geoPath().projection(projection);

            var centroid = d3.geo.geoCentroid(feature);
            var r = [centroid[0] * -1, centroid[1] * -1];
            projection.scale(1).translate([0, 0]).rotate(r);

            var b = path.bounds(feature),
            s = 0.95 / Math.max((b[1][0] - b[0][0]) / SIZE, (b[1][1] - b[0][1]) / SIZE),
            t = [(SIZE - s * (b[1][0] + b[0][0])) / 2, (SIZE - s * (b[1][1] + b[0][1])) / 2];

            projection.scale(s).translate(t);

            var svg = d3.select(window.document).select('body').append('svg');
            svg.attrs({
                'id': state.id,
                'height': SIZE,
                'width': SIZE
            });
            svg.append('path')
                .datum(feature)
                .attrs({
                    'class': 'state',
                    'd': path
                });

            var output = svg.node().parentNode.innerHTML;
            fs.writeFileSync(outFile, output);
            console.log('    ...wrote file: ' + outFile);
            deferred.resolve();
        }
    });

    return deferred.promise;
}

TIGER.files.forEach(tigerFile => {
    let filePath = `${IN_DIR}/${tigerFile.resolution}/${tigerFile.filename}.json`;
    console.log(`Processing JSON file: ${filePath}...`);

    let features = JSON.parse(fs.readFileSync(filePath, 'utf8')).features;

    Promise.each(STATES, function(state) {
        let feature = getFeature(features, state.id);
        let outPath = `${OUT_DIR}/${tigerFile.resolution}`;
        let outFile = `${outPath}/${state.id}.svg`;
        mkdirp.sync(outPath);
        return renderSvg(feature, state, outFile);
    });
});
