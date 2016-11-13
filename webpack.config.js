var webpack = require('webpack');
var path = require('path');

module.exports = {
  entry: ['babel-polyfill', './src/index.js'],
  output: {
    path: __dirname + '/build',
    filename: "bundle.js"
  },
  module: {
    loaders: [
      {test: path.join(__dirname, 'src'), exclude: /node_modules/, loader: 'babel-loader'}
    ]
  }
};
