module.exports = {
  entry: {
    index: './src/index.js',
    'download.css': './src/download.less'
  },
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