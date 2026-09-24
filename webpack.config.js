const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// One entry per page. Each page's HTML gets only its own bundle (`chunks`).
// Blockly is shared: every file imports the same 'blockly' package, so
// webpack includes it once per bundle and all the files register on it.
module.exports = {
  entry: {
    comparison: './comparison.js',
    playground: './playground.js',
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'build'),
    clean: true,
  },
  devtool: 'eval-cheap-module-source-map',
  devServer: {
    // The comparison page loads the original thumbnails at runtime by URL,
    // so serve them as they are rather than bundling them.
    static: {directory: path.resolve(__dirname, 'reference'), publicPath: '/reference'},
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'index.html',
      filename: 'index.html',
      chunks: ['comparison'],
    }),
    new HtmlWebpackPlugin({
      template: 'playground.html',
      filename: 'playground.html',
      chunks: ['playground'],
    }),
  ],
};
