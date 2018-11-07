const prod = process.env.NODE_ENV === 'production';

module.exports = {
  entry: {
    index: './src/index.js',
    'download.css': './src/download.less',
    'error.css': './src/error.less'
  },
  publicPath: prod ? process.env.BUGU_STATIC : 'http://localhost:8000/',
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