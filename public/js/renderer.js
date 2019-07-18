const createElement = (tag, { attrs = {}, children = [] } = {}) => {
  return {
    tag,
    attrs,
    children
  }
}

const renderElement = ({ tag, attrs, children }) => {
  const element = document.createElement(tag)

  for (const [attr, value] of Object.entries(attrs)) {
    element.setAttribute(attr, value)
  }

  for (const child of children) {
    element.appendChild(render(child))
  }

  return element
}

const render = node => {
  if (typeof node === 'string') {
    return document.createTextNode(node)
  }
  return renderElement(node)
}

const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()

function renderPostCard (post) {
  return render(
    createElement('div', {
      attrs: {
        class: 'flex flex-col mb-10 h-auto overflow-hidden sm:flex-row sm:h-50'
      },
      children: [
        createElement('div', {
          attrs: {
            class: 'w-full flex-shrink-0 mr-0 mb-6 sm:mr-6 sm:w-50 lg:mb-0'
          },
          children: [
            createElement('img', {
              attrs: {
                src: post.image.secure_url,
                class: 'h-50 w-full object-cover object-center'
              }
            })
          ]
        }),
        createElement('div', {
          attrs: {
            class: 'flex-grow py-0 fade-out flex flex-col lg:py-3'
          },
          children: [
            createElement('div', { attrs: { class: 'flex-grow' } }),
            // tag
            createElement('p', {
              attrs: {
                class: 'text-xs'
              },
              children: [capitalize(window.moment(post.publishedDate).format('MMMM DD, YYYY'))]
            }),
            createElement('h2', {
              attrs: {
                class: 'font-playfair font-bold text-base hover:text-magenta mt-0 mb-2 lg:text-lg'
              },
              children: [
                createElement('a', {
                  attrs: {
                    href: `/p/${post.slug}`
                  },
                  children: [post.altTitle ? post.altTitle : post.title]
                })
              ]
            }),
            createElement('div', {
              attrs: {
                class: 'content-brief text-xs sm'
              }
            })
          ]
        })
      ]
    })
  )
}

window.renderPostCard = renderPostCard
