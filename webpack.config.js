var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');


module.exports = {
  devtool: 'sourcemap',
  entry: {},
  module: {
    loaders: [
      {test: /\.js$/i, exclude: [/app\/lib/, /node_modules/], loader: 'ng-annotate!babel'},
      {test: /\.html$/i, loader: 'raw'},
      {test: /\.styl$/i, loader: 'style!css!stylus'},
      {test: /\.css$/i, loader: 'style!css'},
      {test: /\.woff(\?v=\d+\.\d+\.\d+)?$/i, loader: "url?limit=10000&mimetype=application/font-woff"},
      {test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/i, loader: "url?limit=10000&mimetype=application/font-woff"},
      {test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/i, loader: "url?limit=10000&mimetype=application/octet-stream"},
      {test: /\.eot(\?v=\d+\.\d+\.\d+)?$/i, loader: "file"},
      {test: /\.otf(\?v=\d+\.\d+\.\d+)?$/i, loader: "file"},
      {test: /\.svg(\?v=\d+\.\d+\.\d+)?$/i, loader: "url?limit=10000&mimetype=image/svg+xml"},
      {test: /\.(png|jpg)$/, loader: 'file?name=[path][name].[ext]?[hash]&context=/client'},
      // see https://github.com/devongovett/pdfkit/issues/478
      {test: /pdfkit|png-js/, loader: "transform?brfs"},
      // see https://github.com/Flipboard/react-canvas/issues/110
      {test: /\.js$/,include: /linebreak/, loader: "transform?brfs"},
      {test: /\.json$/, loader: "json-loader"}
    ]
  },
  plugins: [
    // Injects bundles in your index.html instead of wiring all manually.
    // It also adds hash to all injected assets so we don't have problems
    // with cache purging during deployment.
    new HtmlWebpackPlugin({
      template: 'client/index.html',
      inject: 'body',
      hash: true
    }),

    // Automatically move all modules defined outside of application directory to vendor bundle.
    // If you are using more complicated project structure, consider to specify common chunks manually.
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: function (module, count) {
        return module.resource && module.resource.indexOf(path.resolve(__dirname, 'client')) === -1;
      }
    })
  ]
};
