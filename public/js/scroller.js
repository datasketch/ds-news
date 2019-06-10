const container = document.querySelector('#tagged-posts')
const tag = document.querySelector('#tag').value
const locale = document.querySelector('#lang').value

let page = 2
let loaded = 0

window.addEventListener('load', function (event) {
  const target = document.querySelector('#target')
  const options = {
    threshold: 1,
    rootMargin: '200px'
  }
  const observer = new IntersectionObserver(handleIntersect, options)
  observer.observe(target)
})

function handleIntersect (entries, observer) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const url = `/api/tagged/${tag}/${page}`
      page++
      loaded++
      fetch(url)
        .then(handleResponse)
        .then(({ posts }) => {
          if (!posts.length || loaded >= 3) {
            console.log('Observer will be disconnected')
            observer.disconnect()
          }
          posts.map(post => {
            const title = post.altTitle ? post.altTitle : post.title
            const article = window.createPost(post.image.secure_url, title, post.slug, post.publishedDate, locale)
            const brief = article.querySelector('.post-brief')
            brief.innerHTML = post.content.brief
            container.append(article)
          })
        })
    }
  })
}

function handleResponse (response) {
  if (response.ok) {
    return response.json()
  }
  // handle error
}
