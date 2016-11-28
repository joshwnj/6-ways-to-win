const cmz = require('cmz')
const styles = cmz.inline('', `
.image {
  height: 60vh;
  -webkit-filter: drop-shadow(-4px 4px 0px #0FF);
}
`, {

})

const tag = require('../util/tag').bind(null, styles)

module.exports = function () {
  return tag('slide.&', {}, [
    tag('img.image', { src: 'src/images/hammer-and-screw.png' })
  ])
}
