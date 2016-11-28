const cmz = require('cmz')
const styles = cmz.inline('', `
.heading {
  margin-bottom: 10vh;
}

.examples {
  display: flex;
}

.code {
  font-size: 1.5vw;
}

.code b {
  color: #f66;
}
`, {
  'heading': 'font-m heading-shadow',
  'examples': 'flex-row',
  'file': 'file'
})

const tag = require('../util/tag').bind(null, styles)

function renderCode () {
  return tag('.file', {}, [
    tag('pre', {}, [
      tag('code.code', {},
` 10: &lt;div class="\${ styles.outer }"&gt;
                           <b>^^^^^ property \`outer\`. Property not found in</b>
 10: &lt;div class="\${ styles.outer }"&gt;
                    <b>^^^^^^ object literal</b>`)
    ])
  ])
}

module.exports = function () {
  return tag('slide.&', {}, [
    tag('h1.heading', {}, 'Typechecking CSS'),
    tag('.examples', {}, [
      tag('img', { src: 'src/images/with-flow.png' }),
      renderCode()
    ])
  ])
}
