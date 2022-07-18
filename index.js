const debug = require('debug')('ds-news')
const http = require('http')
const app = require('./app')

const port = process.env.PORT || 3000
const server = http.createServer(app)

server.listen(port, () => debug(`Server up in http://localhost:${port}`))
