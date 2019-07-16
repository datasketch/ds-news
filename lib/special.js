const connectDB = require('./db')
const debug = require('debug')('ds-news:lib:post')

module.exports = {
  getSpecials: async () => {
    try {
      const { Special } = await connectDB()
      const specials = await Special.find({ state: 'published' })
        .sort({ publishedDate: -1 })
        .lean()
        .exec()
      return specials
    } catch (error) {
      debug(error)
      throw new Error(error)
    }
  }
}
