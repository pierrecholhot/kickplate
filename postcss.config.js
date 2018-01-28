module.exports = {
  plugins: {
    'postcss-import': {},
    'postcss-cssnext': {
      browsers: ['last 2 versions', '> 5%'],
    },
    'postcss-simple-vars': {},
    cssnano: require('cssnano')({
      discardDuplicates: true
    })
  }
}
