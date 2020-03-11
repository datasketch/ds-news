require('dotenv').config()

const debug = require('debug')('ds-news')
const express = require('express')
const helmet = require('helmet')
const moment = require('moment')
const morgan = require('morgan')
const path = require('path')
const routes = require('./routes')
const api = require('./routes/api')

const { categories, menu } = require('./menu')

const app = express()

app.locals.env = process.env.NODE_ENV
app.locals.menu = menu
app.locals.categories = categories
app.locals.moment = moment
app.locals.capitalize = str =>
  str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
app.locals.moment.locale('es')

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

if (process.env.NODE_ENV === 'production') {
  app.use(helmet())
  app.use((req, res, next) => {
    if (req.headers['x-forwarded-proto'] !== 'https') {
      return res.redirect(['https://', req.get('Host'), req.url].join(''))
    }
    return next()
  })
} else {
  app.use(morgan('dev'))
}

app.use(express.static(path.join(__dirname, 'public')))
app.use('/', routes)
app.use('/api', api)

// Not found
app.use((req, res, next) => {
  res.render('404')
})

// Error handler
app.use((error, req, res, next) => {
  debug(error)
  res.render('500')
})

module.exports = app
