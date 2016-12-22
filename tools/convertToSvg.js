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
const OUT_DIR = 'svgraw';
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

function getContiguousIds() {
    var i, state;
    let len = STATES.length;
    let cont = [];
    for (i = 0; i < len; i++) {
        state = STATES[i];
        if (state.contiguous) {
            cont.push(state.id);
        }
    }
    return cont;
}

function renderData(data, id, projection, outFile) {
        const deferred = Promise.pending();

        jsdom.env({
            html: '',
            src: [d3],
            done: function (err, window) {
                var $ = window.$;

                var path = d3.geo.geoPath().projection(projection);

                var centroid = d3.geo.geoCentroid(data);
                projection.scale(1).translate([0, 0]);

                if (projection.rotate) {
                    var r = [centroid[0] * -1, centroid[1] * -1];
                    projection.rotate(r);
                }

                var b = path.bounds(data),
                s = 0.95 / Math.max((b[1][0] - b[0][0]) / SIZE, (b[1][1] - b[0][1]) / SIZE),
                t = [(SIZE - s * (b[1][0] + b[0][0])) / 2, (SIZE - s * (b[1][1] + b[0][1])) / 2];

                projection.scale(s).translate(t);

                var svg = d3.select(window.document).select('body').append('svg');
                svg.attrs({
                    'id': id,
                    'height': SIZE,
                    'width': SIZE
                });
                svg.append('path')
                    .datum(data)
                    .attrs({
                        'class': 'americon',
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

    let usa = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    let features = usa.features;

    let outPath = `${OUT_DIR}/${tigerFile.resolution}`;
    mkdirp.sync(outPath);

    Promise.each(STATES, function(state) {
        let feature = getFeature(features, state.id);
        let outFile = `${outPath}/${state.id.toLowerCase()}.svg`;
        let stateProjection = d3.geo.geoConicConformal();
        return renderData(feature, state.id, stateProjection, outFile);
    });

    // usa shape with ak and hi included
    let usaOut = `${outPath}/usa.svg`;
    let usaProjection = d3.geo.geoAlbersUsa();
    renderData(usa, 'usa', usaProjection, usaOut);

    // usa shape contiguous only
    let usacOut = `${outPath}/contiguous.svg`;
    let usacProjection = d3.geo.geoConicConformal();
    let contiguous = getContiguousIds();
    let usac = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    let featuresc = usa.features.filter(function(feature) {
        if (contiguous.indexOf(feature.properties.STUSPS) >= 0) {
            return feature;
        }
    });
    usac.features = featuresc;
    renderData(usac, 'contiguous', usacProjection, usacOut);
});
