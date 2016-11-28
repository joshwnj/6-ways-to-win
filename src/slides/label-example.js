const cmz = require('cmz')
const styles = cmz.inline('', `
.examples {
  display: flex;
  align-items: center;
}

.questions {
  text-align: left;
}

`, {
  'heading': 'font-m heading-shadow',
  'examples': 'flex-row',
  'file': 'file',
  'questions': 'font-m',
  'q': 'substep substep-fade'
})

const tag = require('../util/tag').bind(null, styles)

module.exports = function () {
  return tag('slide.&', {}, [
    tag('h1.heading', {}, 'c is for cascading'),
    tag('.examples', {}, [
      tag('.file', {}, `example.css<code><pre>.label {
  <span style="color: #F66">color: red;</span>
}

/*...1000 lines of code
or whatever...*/

.module .label {
  <span style="color: #3CC">color: blue;</span>
}
</pre></code>`),
      tag('.questions', {}, [
        tag('.q', {}, 'Q. Is there 1 label or 2?'),
        tag('.q', {}, 'Q. What colour is a label?'),
      ])
    ])
  ])
}
