const ejs = require('ejs');
const fs = require('fs');

const TPL_ICONS = 'tools/_icons.scss.ejs';
const CODES = JSON.parse(fs.readFileSync('fonts/americons.codes.json', 'utf8'));
const OUT_PATH = 'sass/_icons.scss';


function generateScss() {

    const template = fs.readFileSync(TPL_ICONS, 'utf8');
    const output = ejs.render(template, {
        icons: CODES
    });
    fs.writeFileSync(OUT_PATH, output);
}

// generate sass
generateScss();
