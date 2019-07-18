const express = require('express')
const { getPostsByCategory } = require('../lib/post')

const router = express.Router()

router.get('/:category/:page', async (req, res, next) => {
  const { category, page } = req.params
  if (!req.app.locals.categories.includes(category)) {
    return res.json({ posts: [], message: 'Category not found' })
  }
  try {
    const posts = await getPostsByCategory(category, page)
    return res.json({ posts })
  } catch (error) {
    return res.status(500).json({ posts: [], message: error.message })
  }
})

module.exports = router
