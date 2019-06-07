const tags = {
  es: ['derechos-humanos', 'genero', 'tecnologia-y-sociedad', 'medio-ambiente', 'arte-y-cultura', 'anticorrupcion'],
  en: ['human-rights', 'gender', 'technology-and-society', 'environment', 'art-and-culture', 'anticorruption']
}

const menu = [
  {
    label: { es: 'Derechos Humanos', en: 'Human Rights' },
    href: { es: 'derechos-humanos', en: 'human-rights' },
    key: 'derechos-humanos'
  },
  {
    label: { es: 'Género', en: 'Gender' },
    href: { es: 'genero', en: 'gender' },
    key: 'genero'
  },
  {
    label: { es: 'Medio Ambiente', en: 'Environment' },
    href: { es: 'medio-ambiente', en: 'environment' },
    key: 'medio-ambiente'
  },
  {
    label: { es: 'Arte y cultura', en: 'Art and Culture' },
    href: { es: 'arte-y-cultura', en: 'art-and-culture' },
    key: 'arte-y-cultura'
  },
  {
    label: { es: 'Tecnología y sociedad', en: 'Technology and Society' },
    href: { es: 'tecnologia-y-sociedad', en: 'technology-and-society' },
    key: 'tecnologia-y-sociedad'
  },
  {
    label: { es: 'Anticorrupción', en: 'Anticorruption' },
    href: { es: 'anticorrupcion', en: 'anticorruption' },
    key: 'anticorruption'
  }
]

module.exports = { tags, menu }
