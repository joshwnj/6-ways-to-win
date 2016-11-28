const cmz = require('cmz')
const styles = cmz.inline('', `

.leaderboard {
  width: 40vw;
}

`, {
  '': 'flex-row',
  'file': 'file'
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

.avatar {
  ...
}

.name {
  ...
}

score {
  ...
}
`)
    ])
  ])
}

module.exports = function () {
  return tag('slide.&', {}, [
    renderFileA(),
    tag('img.leaderboard', { src: 'src/images/leaderboard.png' }),
  ])
}
