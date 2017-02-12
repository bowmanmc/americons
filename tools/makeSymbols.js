const ejs = require('ejs');
const fs = require('fs');
const rimraf = require('rimraf');

const SVG_DIR = 'svg/icons/';
const SYMBOLS_DIR = 'svg/symbols/';


rimraf.sync(SYMBOLS_DIR);
fs.mkdirSync(SYMBOLS_DIR);

const files = fs.readdirSync(SVG_DIR, 'utf-8');
let symbols = [];

files.forEach(file => {
    if (!file.endsWith('svg')) {
        console.log('Skipping: ' + file);
        return;
    }
    console.log('Processing SVG ' + file);
    let stateId = file.substr(0, file.indexOf('.svg'));
    console.log('    id: ' + stateId);
    let svgStr = '' + fs.readFileSync(SVG_DIR + file);
    const widthRx = /width="(\d*)"/g;
    let width = widthRx.exec(svgStr)[1];
    console.log('    Width: ' + width);
    const heightRx = /height="(\d*)"/g;
    let height = heightRx.exec(svgStr)[1];
    console.log('    Height: ' + height);
    let path = svgStr.replace(/<svg.*">/, '').replace(/<\/svg>/, '').replace(/class="americon" /, '');
    //console.log('    Path: ' + path);

    const template = fs.readFileSync('tools/_symbol.ejs', 'utf8');
    const output = ejs.render(template, {
        id: stateId,
        height: height,
        path: path,
        width: width
    });
    symbols.push(output);
    const outFile = `${SYMBOLS_DIR}/${stateId}.txt`;
    fs.writeFileSync(outFile, output);
});

console.log('Got ' + symbols.length + ' symbols for spritesheet');
const template = fs.readFileSync('tools/_symbols.ejs', 'utf8');
const output = ejs.render(template, {
    symbols: symbols
});
fs.writeFileSync('svg/symbols/spritesheet.svg', output);
