import browserSync from 'browser-sync';


browserSync({
    'files': [
        'build/**/*'
    ],
    'watchOptions': {
        'ignoreInitial': true
    },
    'server': {
        'baseDir': 'build',
    },
    'port': 9000,
    'middleware': [],
    'reloadOnRestart': false,
    'notify': false,
    'open': false
    //'open': 'local',
    //'browser': 'chrome',
});
