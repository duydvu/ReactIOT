var path = require('path');
var autoprefixer = require('autoprefixer');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

// Declare paths
var BUILD_DIR = path.resolve(__dirname, 'public/build');
var APP_DIR = path.resolve(__dirname, 'src');

// Common config object
module.exports = {

    entry: APP_DIR + '/index.jsx',
    output: {
        filename: 'bundle.js',
        path: BUILD_DIR,
        publicPath: '/build/'
    },
    module: {
        rules: [
            {
                test: /\.(scss|sass)$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: [
                        {
                            loader: "css-loader",
                            options: { minimize: true }
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                plugins: function () {
                                    return [autoprefixer({
                                        browsers: ['last 3 versions', 'Firefox >= 20', 'iOS >=7']
                                    })]
                                }
                            }
                        },
                        {
                            loader: "sass-loader"
                        }
                    ]
                })
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            outputPath: 'images/'
                        }
                    }
                ]
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            outputPath: 'fonts/'
                        }
                    }
                ]
            },
            {
                test: /\.jsx?/,
                include: APP_DIR,
                loader: 'babel-loader'
            },
        ]
    },
    resolve: {
        // add alias for application code directory
        alias: {
            components: path.resolve(APP_DIR, 'components'),
            images: path.resolve(APP_DIR, 'images'),
            fonts: path.resolve(APP_DIR, 'fonts'),
        },
    },
    plugins: [
        new ExtractTextPlugin("styles.css"),
    ]

};