const cmz = require('cmz')
const styles = cmz.inline('', `

.images {
  display: flex;
  flex-direction: column;
}

.images img {
  margin-top: 5vh;
  max-width: 30vw;
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
  width: 10rem;
}</pre></code>`),
      tag('.leaderboard-css', {}, `leaderboard.css<code><pre>.leaderboard .avatar {
  width: 5rem;
}
</pre></code>`),
    ]),
    tag('.images', {}, [
      tag('img.profile', { src: 'src/images/profile.png' }),
      tag('img.leaderboard', { src: 'src/images/leaderboard.png' }),
    ])
  ])
}
