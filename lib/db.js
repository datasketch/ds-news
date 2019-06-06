const { MongoClient } = require('mongodb')
const debug = require('debug')('ds-news:lib:db')

let connection

async function connectToDB () {
  if (connection) {
    return connection
  }

  try {
    const client = await MongoClient.connect(process.env.MONGO_URI, { useNewUrlParser: true })
    connection = client.db()
  } catch (error) {
    debug(error)
    throw new Error(error)
  }

  return connection
}

module.exports = connectToDB
