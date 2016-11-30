const cmz = require('cmz')

// use this for the browser screenshot
cmz('../components/rank.css')

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
  display: flex;
  background: white;
}

.avatar {
  width: 5rem;
  border-radius: 10rem;
}

.name {
  font-weight: bold;
}

.score {
  color: grey;
}
`)
    ])
  ])
}

module.exports = function () {
  return tag('slide.&', {}, [
    renderFileA(),
    tag('img.leaderboard', { src: 'src/images/css-output.png' }),
  ])
}
