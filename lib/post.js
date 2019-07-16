const connectDB = require('./db')
const debug = require('debug')('ds-news:lib:post')

module.exports = {
  getPosts: async (lang) => {
    try {
      const { Post } = await connectDB()
      const posts = await Post.find({ lang, state: 'published' })
        .populate({ path: 'tags', model: 'PostTag' })
        .sort({ publishedDate: -1 })
        .limit(4)
        .lean()
        .exec()
      return posts
    } catch (error) {
      debug(error)
      throw new Error(error)
    }
  },
  getPost: async (slug) => {
    try {
      const { Post } = await connectDB()
      const post = await Post.findOne({ slug })
        .populate({ path: 'authors', model: 'Author' })
        .populate({
          path: 'relatedPost',
          model: 'Post',
          populate: {
            path: 'tags',
            model: 'PostTag'
          }
        })
        .lean()
        .exec()
      return post
    } catch (error) {
      debug(error)
      throw new Error(error)
    }
  },
  getPostsByTag: async (lang, tag, page = 1) => {
    try {
      const { Post } = await connectDB()
      const posts = await Post.aggregate([
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
        { $skip: (page - 1) * 20 },
        { $limit: 20 }
      ]).exec()
      return posts
    } catch (error) {
      debug(error)
      throw new Error(error)
    }
  }
}
