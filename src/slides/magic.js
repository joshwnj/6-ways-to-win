const cmz = require('cmz')

const styles = cmz.inline('', `
.image {
  width: 22vw;
  height: 22vw;
  background: #FFF;
  border: 0.5vw solid #fff;
  border-radius: 200vw;
}

.heading {
  width: 70vw;
  padding-left: 2vw;
  text-align: left;
}
`, {
  '': 'flex-row',
  'heading': 'font-l heading-shadow'
})

const tag = require('../util/tag').bind(null, styles)

module.exports = function () {
  return tag('slide.&', {}, [
    tag('img.image', { src: 'src/images/bowie.png' }),
    tag('h1.heading', {}, 'What kind of magic spell to use?')
  ])
}
