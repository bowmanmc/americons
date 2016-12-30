'use strict';

var webpack = require('webpack');
var NODE_MODULES = __dirname + '/node_modules';

module.exports = {
    context: __dirname + '/www/javascript',
    entry: './index.js',
    output: {
        path: __dirname + '/www/scripts',
        filename: 'site.js'
    },
    module: {
        loaders: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader'
        }]
    },
    // plugins: [
    //     new webpack.ProvidePlugin({
    //         '$': 'jquery',
    //         'jQuery': 'jquery',
    //         'window.jQuery': 'jquery'
    //     })
    // ],
    resolve: {
        alias: {
            // jquery: NODE_MODULES + '/jquery/dist/jquery.js'
            'prism': NODE_MODULES + '/prismjs/prism.js',
            'prism-line-numbers': NODE_MODULES + '/prismjs/plugins/line-numbers/prism-line-numbers.js'
        }
    }
};
