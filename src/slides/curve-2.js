const cmz = require('cmz')
const styles = cmz.inline('', `
.heading {
  margin-bottom: 10vh;
}

.images {
  display: flex;
  flex-direction: row;
}

.image {
  height: 30vw;
  max-width: 30vw;
  margin-left: -4vw;
  border: 0.5vw solid #fff;
  border-radius: 200vw;
}

.image:first-child {
  margin-left: 0;
}
`, {
  'heading': 'font-l heading-shadow',
  'image': 'substep substep-fade-up'
})

const tag = require('../util/tag').bind(null, styles)

module.exports = function () {
  const srcs = [
    'src/images/feels-good.png',
    'src/images/fine.png',
    'src/images/homer-bomb.gif'
  ]

  const images = srcs.map( (src, i) => tag('img.image', { src: src, 'z-index': srcs.length - i }) )

  return tag('slide.&', {}, [
    tag('h1.heading', {}, '3 Stages of CSS'),
    tag('.images', {}, images)
  ])
}
