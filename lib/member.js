const connectDB = require('./db')
const debug = require('debug')('ds-news:lib:member')

module.exports = {
  getMembers: async () => {
    try {
      const { Member } = await connectDB()
      const members = await Member.find({ visible: true })
        .lean()
        .exec()
      return members
    } catch (error) {
      debug(error)
      throw new Error(error)
    }
  }
}
