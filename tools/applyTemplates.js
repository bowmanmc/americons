const ejs = require('ejs');
const fs = require('fs');

const CODES = JSON.parse(fs.readFileSync('fonts/americons.codes.json', 'utf8'));

const TPL_SCSS = 'tools/_icons.scss.ejs';
const TPL_HTML = 'tools/icons.html.ejs';
const OUT_SCSS = 'sass/_icons.scss';
const OUT_HTML = 'www/_includes/icons.html';


function generateScss() {

    const template = fs.readFileSync(TPL_SCSS, 'utf8');
    const output = ejs.render(template, {
        icons: CODES
    });
    fs.writeFileSync(OUT_SCSS, output);
}

function generateHtml() {
    const template = fs.readFileSync(TPL_HTML, 'utf8');
    const output = ejs.render(template, {
        icons: CODES
    });
    fs.writeFileSync(OUT_HTML, output);
}


generateScss();
generateHtml();
