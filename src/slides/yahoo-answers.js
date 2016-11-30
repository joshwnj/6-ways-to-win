const cmz = require('cmz')
const styles = cmz.inline('', `
.heading {
  margin-bottom: 5vh;
}

.image {
  width: 85vw;
}
`, {
  heading: 'font-s heading-shadow'
})

const tag = require('../util/tag').bind(null, styles)

module.exports = function () {
  return tag('slide.&', {}, [
    tag('h1.heading', {}, 'Can you hammer a screw into the wall?'),
    tag('img.image', { src: 'src/images/yahoo-answers.png' })
  ])
}
