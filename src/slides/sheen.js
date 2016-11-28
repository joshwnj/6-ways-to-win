const cmz = require('cmz')
const styles = cmz.inline('', `
.grow {
  transform:scale(0.1);
}

.head {
  display: flex;
  align-items: center;
  background: url(src/images/sheen-head.png) 0 0 no-repeat;
}

.mouth {
  width: 100%;
  transform: translateX(-0.5vw);
  animation: talk 1s infinite ease-in-out;
}

.words {
  margin-top: 14vw;
}

@keyframes talk {
  0% { transform:translate(-0.5vw, 0); }
  10% { transform:translate(-0.5vw, 2vw);}
  30% { transform:translate(-0.5vw, 0);}
  40% { transform:translate(-0.5vw, 2vw);}
  50% { transform:translate(-0.5vw, 0);}
}

`, {
  '': 'flex-row',
  'grow': 'substep substep-grow',
  'head': 'substep substep-rotate',
  'words': 'substep substep-fade font-m'
})

const tag = require('../util/tag').bind(null, styles)

module.exports = function () {
  return tag('slide.&', {}, [
    tag('.grow', { 'data-order': 1 }, [
      tag('.head', { 'data-order': 1 }, [
        tag('img.mouth', { src: 'src/images/sheen-mouth.png' }),
      ])
    ]),
    tag('.words', { 'data-order': 2 }, 'winning')
  ])
}
