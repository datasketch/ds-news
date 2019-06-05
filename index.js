require('dotenv').config()

const connectToDB = require('./db')
const debug = require('debug')('ds-news')
const express = require('express')
const http = require('http')
const path = require('path')

const app = express()
const port = process.env.PORT || 4000

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

app.use(express.static(path.join(__dirname, 'public')))

app.get('/', async (req, res, next) => {
  try {
    const db = await connectToDB()
    const posts = await db.collection('posts').find({}).sort({ publishedDate: -1 }).limit(20).toArray()
    res.render('index', { title: 'Datasketch News', posts })
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
