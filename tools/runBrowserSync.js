import browserSync from 'browser-sync';


browserSync({
    'files': [
        'www/**/*'
    ],
    'watchOptions': {
        'ignoreInitial': true
    },
    'server': {
        'baseDir': 'www',
    },
    'port': 9000,
    'middleware': [],
    'reloadOnRestart': false,
    'notify': false,
    'open': false
    //'open': 'local',
    //'browser': 'chrome',
});
