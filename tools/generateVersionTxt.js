const execSync = require('sync-exec');
const fs = require('fs');
const moment = require('moment');
const os = require('os');
const pkg = require('../package.json');


let out = 'fonts/version.txt';
let now = moment();

let rev = 'Not Available';
let branch = 'Not Available';
try {
    rev = execSync('git rev-parse HEAD').stdout.trim();
    branch = execSync('git rev-parse --abbrev-ref HEAD').stdout.trim();
}
catch (err) {
    console.log('Error running "git rev-parse HEAD"');
    console.log('    ' + err.message);
}

fs.appendFileSync(out, '\nAmericons');
fs.appendFileSync(out, '\n===================');
fs.appendFileSync(out, '\nName: ' + pkg.name);
fs.appendFileSync(out, '\nDescription: ' + pkg.description);
fs.appendFileSync(out, '\nURL: https://github.com/bowmanmc/americons');
fs.appendFileSync(out, '\nVersion: ' + pkg.version);
fs.appendFileSync(out, '\nGit Branch: ' + branch);
fs.appendFileSync(out, '\nGit Revision: ' + rev);
fs.appendFileSync(out, '\nBuild Time: ' + now.format('YYYY-MM-DD HH:mm:ss'));
fs.appendFileSync(out, '\nBuild Host: ' + os.hostname() + ' [' + os.platform() + ']');
fs.appendFileSync(out, '\n');
fs.appendFileSync(out, '\n');
