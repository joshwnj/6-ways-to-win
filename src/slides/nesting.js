const cmz = require('cmz')
const styles = cmz.inline('', `

.leaderboard {
  width: 40vw;
}

.rhs {
  position: relative;
  display: flex;
  flex-direction: row;
}

.leaderboard {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
}

.rewrite-1 ins {
  color: #0C9;
  text-decoration: none;
}

`, {
  '': 'flex-row',
  'file': 'file',
  'leaderboard': 'substep substep-out',
  'rewrite-1': 'file substep substep-fade'
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

.rank .avatar {
  ...
}

.rank .name {
  ...
}

.rank .score {
  ...
}
`)
    ])
  ])
}

function renderFileB () {
  return tag('.rewrite-1', {}, [
    'rewrite 1',
    tag('pre', {}, [
      tag('code', {},
`.rank {
  ...

<ins>    </ins>.avatar {
      ...
    }

<ins>    </ins>.name {
      ...
    }

<ins>    </ins>.score {
      ...
    }
}
`)
    ])
  ])
}

module.exports = function () {
  return tag('slide.&', {}, [
    renderFileA(),
    tag('.rhs', {}, [
      tag('img.leaderboard', { src: 'src/images/leaderboard.png' }),
      renderFileB()
    ])
  ])
}
