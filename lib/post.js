const debug = require('debug')('ds-news:lib:post')
const connectDB = require('./db')

module.exports = {
  getPosts: async (lang) => {
    try {
      const db = await connectDB()
      const posts = await db.collection('posts')
        .find({ lang, state: 'published' }, {
          altTitle: 1,
          content: 1,
          image: 1,
          isFeatured: 1,
          publishedDate: 1,
          slug: 1,
          title: 1
        })
        .sort({ publishedDate: -1 })
        .limit(26).toArray()
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
        {
          $project: {
            altTitle: 1,
            content: 1,
            image: 1,
            isFeatured: 1,
            publishedDate: 1,
            slug: 1,
            title: 1
          }
        },
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
