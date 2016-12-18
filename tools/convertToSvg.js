// d3 imports
const d3 = require('d3');
d3.geo = require('d3-geo');
d3.geo.projection = require('d3-geo-projection');
require('d3-selection-multi');

const fs = require('fs');
const jsdom = require('jsdom');
const mkdirp = require('mkdirp');


const OUT_DIR = 'svg';
const TIGER = require('../json/cb_2015_us_state_500k.json');
const STATES = require('../states.config.js');
const SIZE = 1000;


mkdirp.sync(OUT_DIR);
let features = TIGER.features;

function getFeature(stateId) {
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

STATES.forEach(state => {
    let feature = getFeature(state.id);
    let outFile = `${OUT_DIR}/${state.id}.svg`;

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
            //console.log('SVG: ' + output);
            fs.writeFileSync(outFile, output);
            console.log('Rendered ' + outFile);
        }
    });


});
