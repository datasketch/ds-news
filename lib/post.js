const debug = require('debug')('ds-news:lib:post')
const connectDB = require('./db')

module.exports = {
  getPosts: async () => {
    try {
      const db = await connectDB()
      const posts = await db.collection('posts')
        .aggregate([
          { $match: { state: 'published' } },
          { $sort: { publishedDate: -1 } },
          { $limit: 6 },
          {
            $lookup: {
              from: 'posttags',
              localField: 'tags',
              foreignField: '_id',
              as: 'tags'
            }
          },
          {
            $project: {
              altTitle: 1,
              content: 1,
              image: 1,
              isFeatured: 1,
              publishedDate: 1,
              slug: 1,
              tags: 1,
              title: 1
            }
          }
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
        }
      ]).toArray()
      return post
    } catch (error) {
      debug(error)
      throw new Error(error)
    }
  }
}
