const commonEnv = require('common-env')()

module.exports = commonEnv.getOrElseAll({
  PORT: 8080,
  NODE_ENV: 'development',
})
