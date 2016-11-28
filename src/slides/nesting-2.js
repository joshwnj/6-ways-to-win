const cmz = require('cmz')
const styles = cmz.inline('', `

.rhs {
  position: relative;
  display: flex;
  flex-direction: row;
}

.file del {
  color: #f66;
}

`, {
  '': 'flex-row nofade',
  'file': 'file',
  'rewrite-2': 'file'
})

const tag = require('../util/tag').bind(null, styles)

function renderFileA () {
  return tag('.file', {}, [
    'rank.css',
    tag('pre', {}, [
      tag('code', {},
`.rank {
  ...
}

<del>.rank </del>.avatar {
  ...
}

<del>.rank </del>.name {
  ...
}

<del>.rank </del>.score {
  ...
}
`)
    ])
  ])
}

function renderFileC () {
  return tag('.rewrite-2', {}, [
    'rewrite 2',
    tag('pre', {}, [
      tag('code', {},
`.rank {
  ...
}

.avatar {
  ...
}

.name {
  ...
}

.score {
  ...
}
`)
    ])
  ])
}

module.exports = function () {
  return tag('slide.&', {}, [
    renderFileA(),
    renderFileC()
  ])
}
