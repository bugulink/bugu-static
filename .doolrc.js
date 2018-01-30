const prod = process.env.NODE_ENV === 'production';

module.exports = {
  entry: {
    index: './src/index.js',
    'download.css': './src/download.less',
    'error.css': './src/error.less'
  },
  publicPath: prod ? process.env.BUGU_STATIC : '/',
  babelPlugins: ['transform-runtime'],
  devServer: {
    historyApiFallback: {
      rewrites: [{
        from: /./,
        to: '/index.html'
      }]
    }
  }
}