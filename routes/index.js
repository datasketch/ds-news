const debug = require('debug')('ds-news:routes')
const express = require('express')
const { getPosts, getPost, getPostsByCategory } = require('../lib/post')
const { getSpecials } = require('../lib/special')
const { getMembers } = require('../lib/member')

const router = express.Router()

router.get('/', async (req, res, next) => {
  const { menu } = req.app.locals
  try {
    const posts = await getPosts(res.locals.locale)
    const specials = await getSpecials()
    const byCategory = await Promise.all(menu.map(({ key }) => getPostsByCategory(key, 1, 3)))
    const postsByCategory = menu.map((item, index) => {
      return {
        label: item.label,
        href: item.href,
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
  const { categories, menu } = req.app.locals
  if (!categories.includes(category)) {
    return next()
  }
  try {
    const posts = await getPostsByCategory(category)
    const section = menu.find((item) => item.key === category)
    res.render('category', { posts, category, section, title: section.label })
  } catch (error) {
    return next(error)
  }
})

router.get('/p', async (req, res, next) => {
  try {
    const posts = await getPosts(60)
    res.render('posts', { posts })
  } catch (error) {
    debug(error)
    return next(error)
  }
})

router.get('/p/:slug', async (req, res, next) => {
  return res.redirect(`https://www.datasketch.co/p/${req.params.slug}`)
  // try {
  //   const post = await getPost(req.params.slug)
  //   if (!post) {
  //     return next()
  //   }
  //   res.render('post', { post, title: post.title + ' · Datasketch News' })
  // } catch (error) {
  //   debug(error)
  //   return next(error)
  // }
})

router.get('/especiales', async (req, res, next) => {
  try {
    const specials = await getSpecials()
    res.render('specials', { specials, title: 'Especiales' })
  } catch (error) {
    return next(error)
  }
})

router.get('/quienes-somos', async (req, res, next) => {
  return res.redirect('https://www.datasketch.co/es/sobre-nosotras/')
  // try {
  //   const members = await getMembers()
  //   res.render('about', { members, title: 'Quiénes somos' })
  // } catch (error) {
  //   return next(error)
  // }
})

module.exports = router
