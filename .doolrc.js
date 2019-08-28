const pkg = require('./package.json');

const host = process.env.BUGU_STATIC_HOST;
const publicPath = process.env.NODE_ENV === 'production'
  ? `${host}/${pkg.name}/${pkg.version}/`
  : 'http://localhost:8000/';

module.exports = {
  entry: {
    index: './src/index.js',
    'download.css': './src/download.less',
    'error.css': './src/error.less'
  },
  publicPath: publicPath,
  babelPlugins: ['@babel/plugin-transform-runtime'],
  devServer: {
    historyApiFallback: {
      rewrites: [{
        from: /./,
        to: '/index.html'
      }]
    }
  }
}