require('dotenv').config()

const connectToDB = require('./lib/db')
const debug = require('debug')('ds-news')
const express = require('express')
const http = require('http')
const nunjucks = require('nunjucks')

const app = express()
const port = process.env.PORT || 4000

nunjucks.configure('views', {
  autoescape: true,
  express: app
})

app.get('/', async (req, res, next) => {
  try {
    const db = await connectToDB()
    const posts = await db.collection('posts').find({}, { limit: 10 }).toArray()
    res.render('index.njk', { title: 'Datasketch News', posts })
  } catch (error) {
    debug(error)
    return next(error)
  }
})

app.use((req, res, next, error) => {
  process.exit(1)
})

const server = http.createServer(app)
server.listen(port, () => debug(`Server up in http://localhost:${port}`))
