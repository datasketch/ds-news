const autoprefixer = require('autoprefixer')
const cssnano = require('cssnano')
const purgecss = require('@fullhuman/postcss-purgecss')
const tailwindcss = require('tailwindcss')

const dev = [tailwindcss]
const prod = [
  ...dev,
  autoprefixer,
  cssnano({ preset: 'default' }),
  purgecss({
    content: ['./views/**/*.pug'],
    defaultExtractor: content => content.match(/[A-Za-z0-9-_:/]+/g) || []
  })
]

module.exports = {
  plugins: process.env.NODE_ENV === 'production' ? prod : dev
}
