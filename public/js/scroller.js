const container = document.querySelector('#tagged-posts')
const category = document.querySelector('#category').value

let page = 2
let loaded = 0

window.addEventListener('load', function (event) {
  const target = document.querySelector('#target')
  const options = {
    threshold: 0.5,
    rootMargin: '200px'
  }
  const observer = new IntersectionObserver(handleIntersect, options)
  observer.observe(target)
})

function handleIntersect (entries, observer) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const url = `/api/${category}/${page}`
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
            const article = window.renderPostCard(post)
            const brief = article.querySelector('.content-brief')
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
