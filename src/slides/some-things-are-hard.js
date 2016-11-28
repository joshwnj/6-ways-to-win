const cmz = require('cmz')
const styles = cmz.inline('', `
.bubble {
  width: 22vw;
  height: 22vw;
  background: #FFF;
  border-radius: 200vw;
}

.bubbleImage {
  width: 20vw;
  padding: 4vw 2.5vw;
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
    tag('.bubble', {}, tag('img.bubbleImage', { src: 'src/images/hammer-and-screw-small-2.png' })),
    tag('h1.heading', {}, 'Some things are <em>very difficult</em> to do with CSS&nbsp;Modules')
  ])
}
