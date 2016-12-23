import browserSync from 'browser-sync';


browserSync({
    'files': [
        'site/**/*'
    ],
    'watchOptions': {
        'ignoreInitial': true
    },
    'server': {
        'baseDir': 'site',
    },
    'port': 9000,
    'middleware': [],
    'reloadOnRestart': false,
    'notify': false,
    'open': false
    //'open': 'local',
    //'browser': 'chrome',
});
