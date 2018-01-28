const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const env = require('./server/env.js')

const isProduction = env.NODE_ENV === 'production'
const context = __dirname + '/app'
const entry = ['./scripts/index.js']

if (!isProduction) {
  entry.push('webpack-hot-middleware/client')
}

const output = { path: __dirname + '/public/dynamic', filename: 'bundle.js' }
const rules = []

rules.push({
  test: /\.js$/,
  exclude: /(node_modules|bower_components)/,
  use: {
    loader: 'babel-loader',
    options: {
      presets: ['env']
    }
  }
})

rules.push({
  test: /\.css$/,
  use: isProduction ? ExtractTextPlugin.extract({
    fallback: "style-loader",
    use: [{ loader: 'css-loader', options: { minimize: isProduction } }, 'postcss-loader']
  }) : [{ loader: 'style-loader' }, { loader: 'css-loader' }]
})

rules.push({
  test: /\.(jpe?g|gif|webp|png|svg|woff|woff2|eot|ttf|wav|mp3)$/,
  use: [{
    loader: 'file-loader',
    query: {
      name: '[name].[ext]'
    }
  }],
})

const productionPlugins = [
  new webpack.DefinePlugin({ 'process.env.NODE_ENV': JSON.stringify(env.NODE_ENV) }),
  new webpack.optimize.UglifyJsPlugin({
    comments: false,
    mangle: true,
    compress: {
      sequences: true,
      dead_code: true,
      conditionals: true,
      booleans: true,
      unused: true,
      if_return: true,
      join_vars: true,
      drop_console: true,
      screw_ie8: true,
    }
  }),
  new ExtractTextPlugin({ filename: 'bundle.css', allChunks: true, ignoreOrder: true }),
  new OptimizeCssAssetsPlugin({
    assetNameRegExp: /\.css$/,
    cssProcessor: require('cssnano'),
    cssProcessorOptions: { discardComments: { removeAll: true } },
    canPrint: true
  })
]

const developmentPlugins = [
  new ExtractTextPlugin({ filename: 'bundle.css', allChunks: true, ignoreOrder: true }),
  new OptimizeCssAssetsPlugin({
    assetNameRegExp: /\.css$/,
    cssProcessor: require('cssnano'),
    cssProcessorOptions: { discardComments: { removeAll: true } },
    canPrint: true
  }),
  new webpack.NamedModulesPlugin(),
  new webpack.HotModuleReplacementPlugin()
]

const plugins = isProduction ? productionPlugins : developmentPlugins

module.exports = {
  context,
  entry,
  output,
  module: { rules },
  plugins
}
