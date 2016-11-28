const cmz = require('cmz')
const styles = cmz.inline('', `

.images {
  display: flex;
  flex-direction: column;
}

.images img {
  margin-top: 5vh;
  max-width: 20vw;
}

`, {
  '': 'flex-row',
  'file': 'file',
  'leaderboard-css': 'file substep substep-fade'
})

const tag = require('../util/tag').bind(null, styles)

module.exports = function () {
  return tag('slide.&', {}, [
    tag('.examples', {}, [
      tag('.file', {}, `avatar.css<code><pre>.avatar {
  ...
  width: 100%;
}</pre></code>`),
      tag('.leaderboard-css', {}, `leaderboard.css<code><pre>.leaderboard .avatar {
  width: 50%;
}
</pre></code>`),
    ]),
    tag('.images', {}, [
      tag('img.profile', { src: 'src/images/profile.png' }),
      tag('img.leaderboard', { src: 'src/images/leaderboard.png' }),
    ])
  ])
}
