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

const createPost = (imageUrl, title, slug, publishedDate, locale) => {
  return render(
    createElement('article', {
      attrs: {
        class: 'post flex flex-col sm:flex-row mb-8 -mx-2'
      },
      children: [
        createElement('div', {
          attrs: {
            class: 'w-full sm:w-3/12 px-2'
          },
          children: [
            createElement('img', {
              attrs: {
                class: 'post-image w-full',
                src: imageUrl,
                alt: title
              }
            })
          ]
        }),
        createElement('div', {
          attrs: {
            class: 'w-full sm:w-9/12 px-2'
          },
          children: [
            // date
            createElement('small', {
              attrs: {
                class: 'post-date font-lora text-xs'
              },
              children: [
                capitalize(window.moment(publishedDate).locale(locale).format('MMMM DD, YYYY'))
              ]
            }),
            // title
            createElement('h2', {
              attrs: {
                class: 'post-title mb-3 text-xl'
              },
              children: [
                createElement('a', {
                  attrs: {
                    class: 'text-dark-purple',
                    href: `/p/${slug}`
                  },
                  children: [title]
                })
              ]
            }),
            // content
            createElement('div', {
              attrs: {
                class: 'post-brief'
              }
            })
          ]
        })
      ]
    })
  )
}

window.createPost = createPost
