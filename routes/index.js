const debug = require('debug')('ds-news:routes')
const express = require('express')
const { getPosts, getPost, getPostsByCategory } = require('../lib/post')
const { getSpecials } = require('../lib/special')

const router = express.Router()

router.get('/', async (req, res, next) => {
  const { menu } = req.app.locals
  const lang = res.locals.locale
  try {
    const posts = await getPosts(res.locals.locale)
    const specials = await getSpecials()
    const byCategory = await Promise.all(menu.map(({ key }) => getPostsByCategory(lang, key, 1, 3)))
    const postsByCategory = menu.map((item, index) => {
      return {
        label: item.label[lang],
        href: item.href[lang],
        posts: byCategory[index]
      }
    })
    res.render('home', { highlighted: posts[0], posts: posts.slice(1), specials, postsByCategory })
  } catch (error) {
    debug(error)
    return next(error)
  }
})

router.get('/s/:category', async (req, res, next) => {
  const { category } = req.params
  const { categories } = req.app.locals
  const lang = res.locals.locale
  if (!categories[lang].includes(category)) {
    return next()
  }
  try {
    const search = lang === 'es' ? category : categories.es[categories.en.indexOf(category)]
    const posts = await getPostsByCategory(lang, search)
    res.render('tags', { posts, search, section: category })
  } catch (error) {
    return next(error)
  }
})

router.get('/p/:slug', async (req, res, next) => {
  try {
    const post = await getPost(req.params.slug)
    if (!post) {
      return next()
    }
    res.render('post', { post, title: post.title + ' · Datasketch News' })
  } catch (error) {
    debug(error)
    return next(error)
  }
})

router.get(['/especiales', '/specials'], async (req, res, next) => {
  try {
    const specials = await getSpecials()
    res.render('specials', { specials })
  } catch (error) {
    return next(error)
  }
})

module.exports = router
