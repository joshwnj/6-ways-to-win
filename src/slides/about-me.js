const cmz = require('cmz')
const styles = cmz.inline('', `
.image {
  width: 25vw;
  margin-left: -2vw;
}

.image:nth-child(2) {
  width: 20vw;
}

.image:first-child {
  margin-left: 0;
}
`, {
  '': 'flex-row',
  'image': 'substep substep-fade-up'
})

const tag = require('../util/tag').bind(null, styles)

module.exports = function () {
  const srcs = [
    'src/images/alchemix.png',
    'src/images/x-team-logo.png',
    'src/images/css-modules-logo.png'
  ]

  const images = srcs.map( (src, i) => tag('img.image', { src: src, 'z-index': srcs.length - i }) )

  return tag('slide.&', {}, images)
}
