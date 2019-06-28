const debug = require('debug')('ds-news:lib:post')
const connectDB = require('./db')

module.exports = {
  getSpecials: async () => {
    try {
      const db = await connectDB()
      const specials = await db.collection('specials')
        .find({ state: 'published' })
        .sort({ publishedDate: -1 })
        .toArray()
      return specials
    } catch (error) {
      debug(error)
      throw new Error(error)
    }
  }
}
