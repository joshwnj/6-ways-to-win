const cmz = require('cmz')
const styles = cmz.inline('', `
.heading {
  position: relative;
  line-height: 8.5vw;
}

.atleast {
  position: absolute;
  top: -2vw;
  left: -10vw;
  font-family: 'Courgette';
  font-size: 5vw;
  font-weight: 100;
  transform: rotate(-45deg);
  text-shadow: none;
}

.six {
  font-size: 20vw;
}

.ways-to {
  position: absolute;
  line-height: 5vw;
  margin: 1.5vw 0 0 .5vw;
}

.win {
  font-size: 12vw;
  text-transform: uppercase;
  font-weight: 800;
  font-style: italic;
}

.with {
  font-family: 'Courgette';
  font-weight: 100;
  letter-spacing: .01vw;
  font-size: 3vw;
  position: relative;
  top: -3vw;
  margin-left: 2vw;
}

.bubble {
  position: absolute;
  top: 50%;
  left: 50%;
  margin: -15vw 0 0 -25vw;
  width: 30vw;
  height: 30vw;
  background: #fff;
  border-radius: 200vw;
}
`, {
  'heading': 'font-l',
  'win': 'heading-shadow'
})

const tag = require('../util/tag').bind(null, styles)

module.exports = function () {
  return tag('section.&', {}, [
    tag('.bubble', {}, []),
    tag('h1.heading', {}, [
      tag('span.atleast', {}, 'At Least'),
      tag('span.six', {}, '6'),
      tag('span.ways-to', {}, 'ways<br/>to'),
      tag('.win', {}, 'Win!'),
      tag('span.with', {}, 'with'),
      tag('span', {}, 'CSS Modules')
    ])
  ])
}
