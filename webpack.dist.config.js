var webpack = require('webpack');
var path    = require('path');
var config  = require('./webpack.config');
var compression = require("compression-webpack-plugin");
var copyFiles = require("copy-webpack-plugin");

config.output = {
  filename: '[name].bundle.js',
  publicPath: '',
  path: path.resolve(__dirname, 'dist')
};

config.plugins = config.plugins.concat([

  // Reduces bundles total size
  new webpack.optimize.UglifyJsPlugin({
    mangle: {

      // You can specify all variables that should not be mangled.
      // For example if your vendor dependency doesn't use modules
      // and relies on global variables. Most of angular modules relies on
      // angular global variable, so we should keep it unchanged
      except: ['$super', '$', 'exports', 'require', 'angular']
    }
  }),

  // creates *.gz compressed versions of assets
  new compression({
    asset: "[path].gz[query]",
    algorithm: "gzip",
    test: /\.js$|\.html$|\.map$/,
    threshold: 10240,
    minRatio: 0.8
  }),

  new copyFiles([
    { from: 'client/assets', to: 'assets' },
    { from: 'client/assets/icons' },
    { from: 'client/assets/deploy' }
    ])
]);

module.exports = config;
