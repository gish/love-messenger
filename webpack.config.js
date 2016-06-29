var path = require('path')

module.exports = {
  entry: './index.js',
  target: 'node',
  output: {
    path: path.join(__dirname),
    filename: 'dist.js'
  },
  module: {
    noParse: /node_modules\/json-schema\/lib\/validate\.js/,
    loaders: [{
      test: /\.js$/,
      loaders: ['babel-loader']
    }, {
      test: /\.json$/,
      loader: 'json-loader'
    }]
  }
}
