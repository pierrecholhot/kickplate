const path = require('path')
const express = require('express')
const favicon = require('serve-favicon')
const helmet = require('helmet')
const compression = require('compression')

const i18n = require('../admin/en')
const env = require('./env')

const isProduction = env.NODE_ENV === 'production'
const webpackConfigPath = '../webpack.config'
const publicPath = path.join(__dirname, '../public/')

const frontendData = {
  i18n,
  isProduction
}

const app = express()

if (isProduction) {
  app.use(compression())
} else {
  const webpack = require('webpack')
  const config = require(webpackConfigPath)
  const compiler = webpack(config)
  app.use(require('webpack-dev-middleware')(compiler, {
    quiet: true,
    publicPath: config.output.publicPath
  }))
  app.use(require('webpack-hot-middleware')(compiler))
}

app.use(helmet())
app.use(favicon('./public/favicon.ico'))
app.use(express.static('public'))

app.set('views', './app/views')
app.set('view engine', 'pug')

app.get('/', (req, res) => { res.render('index', frontendData) })
app.get('/terms', (req, res) => { res.render('terms', frontendData) })
app.get('/privacy', (req, res) => { res.render('privacy', frontendData) })

app.use((req, res, next) => {
  res.status(404)
  res.render('404', { ...frontendData, url: req.url })
})

app.listen(env.PORT, (err) => {
  console.log(
    err ? 'Server Error:' : 'Server is listening on port:',
    err ? err : env.PORT
  )
})
