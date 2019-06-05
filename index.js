require('dotenv').config()

const http = require('http')
const express = require('express')
const debug = require('debug')('ds-news')
const connectToDB = require('./lib/db')

const app = express()
const port = process.env.PORT || 4000

app.get('/', async (req, res, next) => {
  try {
    const db = await connectToDB()
    const posts = await db.collection('posts').find({}, { limit: 10 }).toArray()
    res.json({ posts })
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
