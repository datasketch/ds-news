const debug = require('debug')('ds-news:lib:post')
const connectDB = require('./db')

const project = {
  altTitle: 1,
  content: 1,
  image: 1,
  isFeatured: 1,
  publishedDate: 1,
  slug: 1,
  title: 1
}

module.exports = {
  getPosts: async (lang) => {
    try {
      const db = await connectDB()
      const posts = await db.collection('posts').aggregate([
        { $match: { lang, state: 'published' } },
        {
          $lookup: {
            from: 'posttags',
            localField: 'tags',
            foreignField: '_id',
            as: 'tags'
          }
        },
        { $project: { ...project, tags: 1 } },
        { $sort: { publishedDate: -1 } },
        { $limit: 4 }
      ]).toArray()
      return posts
    } catch (error) {
      debug(error)
      throw new Error(error)
    }
  },
  getPost: async (slug) => {
    try {
      const db = await connectDB()
      const post = await db.collection('posts').aggregate([
        { $match: { slug } },
        {
          $lookup: {
            from: 'authors',
            localField: 'authors',
            foreignField: '_id',
            as: 'authors'
          }
        },
        {
          $lookup: {
            from: 'posts',
            localField: 'relatedPost',
            foreignField: '_id',
            as: 'related'
          }
        }
      ]).toArray()
      return post
    } catch (error) {
      debug(error)
      throw new Error(error)
    }
  },
  getPostsByTag: async (lang, tag, page = 1) => {
    try {
      const db = await connectDB()
      const posts = await db.collection('posts').aggregate([
        { $match: { lang } },
        { $sort: { publishedDate: -1 } },
        {
          $lookup: {
            from: 'posttags',
            localField: 'tags',
            foreignField: '_id',
            as: 'tags'
          }
        },
        {
          $unwind: '$tags'
        },
        { $match: { 'tags.key': tag } },
        { $project: project },
        { $skip: (page - 1) * 20 },
        { $limit: 20 }
      ]).toArray()
      return posts
    } catch (error) {
      debug(error)
      throw new Error(error)
    }
  }
}
