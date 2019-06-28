require('dotenv').config()

const debug = require('debug')('ds-news')
const express = require('express')
const http = require('http')
const i18n = require('i18n')
const { tags, menu } = require('./menu')
const moment = require('moment')
const morgan = require('morgan')
const path = require('path')
const { getPosts, getPost, getPostsByTag } = require('./lib/post')
const { getSpecials } = require('./lib/special')

const app = express()
const port = process.env.PORT || 4000

i18n.configure({
  locales: ['es', 'en'],
  directory: path.join(__dirname, 'locales')
})

i18n.setLocale('es')

app.locals.menu = menu
app.locals.moment = moment
app.locals.capitalize = str => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

app.use(morgan('dev'))
app.use(i18n.init)
app.use(express.static(path.join(__dirname, 'public')))
app.use((req, res, next) => {
  req.setLocale('es')
  next()
})

app.get('/', async (req, res, next) => {
  try {
    const posts = await getPosts(res.locals.locale)
    res.render('home', { posts: posts.slice(1), featured: posts[0] })
  } catch (error) {
    debug(error)
    return next(error)
  }
})

app.get('/p/:slug', async (req, res, next) => {
  try {
    const data = await getPost(req.params.slug)
    if (!data.length) {
      return next()
    }
    const post = data[0]
    // res.json({ post })
    res.render('post', { post, title: post.title + ' · Datasketch News' })
  } catch (error) {
    debug(error)
    return next(error)
  }
})

app.get('/tags/:tag', async (req, res, next) => {
  const { tag } = req.params
  const lang = res.locals.locale
  if (!tags[lang].includes(tag)) {
    return next()
  }
  try {
    const search = lang === 'es' ? tag : tags.es[tags.en.indexOf(tag)]
    const posts = await getPostsByTag(lang, search)
    res.render('tags', { posts, search })
  } catch (error) {
    return next(error)
  }
})

app.get('/especiales', handleRoute)
app.get('/specials', handleRoute)

async function handleRoute (req, res, next) {
  try {
    const specials = await getSpecials()
    res.render('specials', { specials })
  } catch (error) {
    return next(error)
  }
}

app.get('/api/tagged/:tag/:page', async (req, res, next) => {
  const { tag, page } = req.params
  const lang = res.locals.locale
  if (!tags.es.includes(tag)) {
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
