require('dotenv').config()

const debug = require('debug')('ds-news')
const express = require('express')
const http = require('http')
const i18n = require('i18n')
const moment = require('moment')
const morgan = require('morgan')
const path = require('path')
const routes = require('./routes')
const { getPostsByTag } = require('./lib/post')
const { categories, menu } = require('./menu')

const app = express()
const port = process.env.PORT || 4000

i18n.configure({
  locales: ['es', 'en'],
  directory: path.join(__dirname, 'locales')
})

i18n.setLocale('es')

app.locals.menu = menu
app.locals.categories = categories
app.locals.moment = moment
app.locals.capitalize = str => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

app.use(morgan('dev'))
app.use(i18n.init)
app.use(express.static(path.join(__dirname, 'public')))
app.use((req, res, next) => {
  req.setLocale('es')
  app.locals.moment.locale(req.getLocale())
  next()
})
app.use('/', routes)

app.get('/api/tagged/:tag/:page', async (req, res, next) => {
  const { tag, page } = req.params
  const lang = res.locals.locale
  if (!categories.es.includes(tag)) {
    return res.json({ posts: [], message: 'Tag not found' })
  }
  try {
    const posts = await getPostsByTag(lang, tag, page)
    return res.json({ posts })
  } catch (error) {
    return res.status(500).json({ posts: [], message: error.message })
  }
})

// Not found
app.use((req, res, next) => {
  res.render('404')
})

// Error handler
app.use((error, req, res, next) => {
  debug(error)
  res.render('500')
})

const server = http.createServer(app)
server.listen(port, () => debug(`Server up in http://localhost:${port}`))
