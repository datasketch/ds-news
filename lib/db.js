const mongoose = require('mongoose')
const debug = require('debug')('ds-news:lib:db')

// const MONGO_URI = process.env.NODE_ENV === 'production' ? process.env.MONGO_URI : 'mongodb://127.0.0.1:27017/datasketch'

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/datasketch'

let db, Post, Special, Author, PostTag, Member

async function connectToDB () {
  if (db) {
    return { db, Post, Special, Author, PostTag, Member }
  }

  try {
    db = await mongoose.connect(MONGO_URI, { useNewUrlParser: true })
    Post = mongoose.model('Post', new mongoose.Schema({}), 'posts')
    Special = mongoose.model('Special', new mongoose.Schema({}), 'specials')
    Author = mongoose.model('Author', new mongoose.Schema({}), 'authors')
    PostTag = mongoose.model('PostTag', new mongoose.Schema({}), 'posttags')
    Member = mongoose.model('Member', new mongoose.Schema({}), 'members')
  } catch (error) {
    debug(error)
    throw new Error(error)
  }

  return { db, Post, Special, Author, PostTag, Member }
}

module.exports = connectToDB
