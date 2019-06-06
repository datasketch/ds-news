require('dotenv').config()

const debug = require('debug')('ds-news')
const express = require('express')
const http = require('http')
const i18n = require('i18n')
const menu = require('./menu')
const moment = require('moment')
const morgan = require('morgan')
const path = require('path')
const { getPosts, getPost } = require('./lib/post')

const app = express()
const port = process.env.PORT || 4000

i18n.configure({
  locales: ['es', 'en'],
  directory: path.join(__dirname, 'locales')
})

app.locals.menu = menu
app.locals.moment = moment

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

app.use(morgan('dev'))
app.use(i18n.init)
app.use(express.static(path.join(__dirname, 'public')))

app.get('/', async (req, res, next) => {
  try {
    const posts = await getPosts()
    res.render('index', { posts: posts.slice(1), featured: posts[0] })
  } catch (error) {
    debug(error)
    return next(error)
  }
})

app.get('/p/:slug', async (req, res, next) => {
  try {
    const post = await getPost(req.params.slug)
    if (!post.length) {
      return next()
    }
    res.json({ post: post[0] })
  } catch (error) {
    debug(error)
    return next(error)
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
