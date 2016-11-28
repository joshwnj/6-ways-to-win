const cmz = require('cmz')

const size = '25vw';
const styles = cmz.inline('', `
.stages {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.stage {
  width: ${size};
  height: ${size};
  margin-right: 4vw;
  background: #fff;
  border-radius: 200vw;
  text-align: center;
  line-height: ${size};
}

.stage:first-child {
  margin-left: 0;
}
`, {
  'stage': 'substep substep-fade-up font-m'
})

const tag = require('../util/tag').bind(null, styles)

module.exports = function () {
  return tag('slide.&', {}, [
    tag('.stages', {}, [
      tag('.stage', {}, 'Authoring'),
      tag('.stage', {}, 'Debugging'),
      tag('.stage', {}, 'Refactoring'),
    ])
  ])
}
