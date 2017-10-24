var webpack = require('webpack');
var merge = require('webpack-merge');
var UglifyJSPlugin = require('uglifyjs-webpack-plugin');

// Get npm script
var TARGET = process.env.npm_lifecycle_event;

// Get common config
var common = require('./webpack.common.config.js');

// If the script is "npm start"
if (TARGET === 'start') {
    module.exports = merge(common, {

        devtool: 'inline-source-map',
        devServer: {
            historyApiFallback: true,
            inline: true,
            host: 'localhost',
            proxy: {
                '/build': {
                    target: 'http://localhost:8080/build/',
                    // create a server on port 8080 to store files created by webpack
                    pathRewrite: {
                        '^/build': ''
                    }
                }
            }
        },
        plugins: [
            new webpack.HotModuleReplacementPlugin()  // This makes everything reloaded when you change files
        ]
    });
}

// If the script is 'npm run build'
if (TARGET === 'build') {
    module.exports = merge(common, {

        // We change to normal source mapping
        devtool: 'source-map',
        plugins: [
            new webpack.DefinePlugin({
                'process.env': {
                    'NODE_ENV': JSON.stringify('production')
                }
            }),
            new UglifyJSPlugin({
                comments: false, // remove comments
                mangle: true,
                compress: {
                    warnings: false, // Suppress uglification warnings
                    pure_getters: true,
                    unsafe: true,
                    unsafe_comps: true,
                    screw_ie8: true,
                    conditionals: true,
                    unused: true,
                    comparisons: true,
                    sequences: true,
                    dead_code: true,
                    evaluate: true,
                    if_return: true,
                    join_vars: true
                }
            }),
        ]

    });
}