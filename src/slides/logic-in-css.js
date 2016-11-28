const cmz = require('cmz')
const styles = cmz.inline('', `
.examples-1,
.examples-2 {
  display: flex;
  align-items: center;
}

.examples-2 {
  align-items: baseline;
  margin-top: -30vh;
}

.logic {
  white-space: pre;
}

`, {
  'heading': 'font-l heading-shadow',
  'examples-1': 'flex-row substep substep-out',
  'examples-2': 'flex-row substep substep-fade',
  'file': 'file',
  'logic': 'font-s'
})

const tag = require('../util/tag').bind(null, styles)

module.exports = function () {
  return tag('slide.&', {}, [
    tag('h1.heading', {}, 'There&rsquo;s Logic in our CSS!'),
    tag('.examples-1', {}, [
      tag('.file', {}, `<code><pre>.leaderboard .avatar {
  width: 50%;
}</pre></code>`),
      tag('code.logic', {}, `<b>if</b> the Avatar appears within a Leaderboard,
<b>then</b> make it smaller`)
    ]),
    tag('.examples-2', {}, [
      tag('.file', {}, `<code><pre>.avatar {
  ...
}

.big {
  width: 100%;
}

.small {
  width: 50%;
}</pre></code>`),
      tag('.file', {}, `<code><pre>
// normal avatar
Avatar()

// avatar in a leaderboard
Avatar({ small: true })
</pre></code>`)
    ])
  ])
}
