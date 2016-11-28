const cmz = require('cmz')
const styles = cmz.inline('', `
.image {
  width: 80vw;
}
`, {

})

const tag = require('../util/tag').bind(null, styles)

module.exports = function () {
  return tag('slide.&', {}, [
    tag('img.image', { src: 'src/images/yahoo-answers.png' })
  ])
}
