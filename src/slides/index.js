const cmz = require('cmz')
const styles = cmz.inline('', `

.heading-l {
  text-align: center;
  padding: 0 2vw;
}

.ewokBubble,
.bubble {
  width: 22vw;
  height: 22vw;
  background: #FFF;
  border-radius: 200vw;
}

.ewokBubble {
  max-width: 15vw;
  max-height: 15vw;
  border: .5vw solid #fff;
}

.bubbleText {
  font-weight: 800;
  text-align: center;
  line-height: 22vw;
}

.bubbleHeading {
  width: 70vw;
  padding-left: 2vw;
}

.bubbleImage {
  width: 17vw;
  padding: 2vw 3vw;
}

`, {
  'win': 'flex-row',
  'problem': 'flex-row',
  'problemHeading': 'font-l heading-shadow',
  'problemSub': 'font-s',
  'problemLabel': 'font-s heading-label',

  'bubbleText': 'font-xl',

  'winHeading': 'font-l heading-shadow',
  'winLabel': 'font-s heading-label',

  'heading-l': 'font-l heading-shadow',

  'image-full-h': 'full-h'
})

const tag = require('../util/tag').bind(null, styles)

function setDefaultBackdrop (id, attr) {
  const backdropAttr = 'data-bespoke-backdrop'

  attr = attr || {}
  if (!attr[backdropAttr]) {
    attr[backdropAttr] = `backdrop--${id}`
  }
  return attr
}

function heading (text, attr) {
  attr = setDefaultBackdrop('footer', attr)

  return tag('section', attr, [
    tag('h1.heading-l', {}, text)
  ])
}

function placeholder (text) {
  return tag('section', {}, [
    tag('p', {}, text)
  ])
}

function fullImage (src) {
  return tag('section', {}, [
    tag('img.image-full-h', { src })
  ])
}

function bubble (children) {
  return tag('.bubble', {}, [
    tag('.bubbleText', {}, children)
  ])
}

function win (num, text) {
  let b = (num === 2) ?
      tag('img.ewokBubble', { src: 'src/images/ewok-face-2.png' }) :
      bubble('🎉')

  const attr = setDefaultBackdrop('footer', {})
  return tag('section.win', attr, [
    b,
    tag('.bubbleHeading', {}, [
      tag('.winLabel', {}, `Way to Win #${num}`),
      tag('h1.winHeading', {}, `#${num}: ${text}`)
    ])
  ])
}

function problem (text, sub) {
  const attr = setDefaultBackdrop('footer', {})

  return tag('section.problem', attr, [
    // bubble(`!@#^`),
    bubble('☠️'),
    tag('.bubbleHeading', {}, [
      tag('.problemLabel', {}, 'problem'),
      tag('h1.problemHeading', {}, text),
      tag('h1.problemSub', {}, sub)
    ])
  ])
}

module.exports = function () {
  return [
    require('./title')(),

    require('./about-me')(),
    require('./campjs')(),
    require('./campjs-2')(),
    fullImage('src/images/shiny.jpg'),
    heading('18 months later'),

    require('./hammer')(),
    require('./yahoo-answers')(),
    require('./some-things-are-hard')(),
    heading('Could these things be related?'),

    tag('section', { class: 'flex-row' }, [
      bubble(tag('img.bubbleImage', { src: 'src/images/css-modules-logo.png' })),
      tag('.bubbleHeading', {}, [
        tag('h1.heading-l', { style: 'text-align: left' }, 'What are CSS&nbsp;Modules?')
      ])
    ]),
    require('./example-1b'),
    require('./js-modules-css-modules'),

    heading('At Least 6 Ways to <em>Win</em> with CSS Modules'),
    heading('Why <em>&ldquo;Win&rdquo;</em>?'),
    require('./curve-2')(),
    heading('That winning feeling'),
    fullImage('src/images/solitaire.gif'),
    require('./sheen')(),
    require('./defn-of-winning'),
    require('./stages')(),

    problem('CSS Modules might not have the features you&rsquo;re used to'),
    require('./nesting')(),
    require('./nesting-2')(),
    heading('CSS Modules automatically namespaces classes'),
    heading('Improve your code by deleting it'),
    win(1, 'Don&rsquo;t manually namespace your classes'),

    require('./magic')(),
    require('./compare-src-and-output')(),
    heading('CSS Modules is not exactly &ldquo;css in js&rdquo;...'),
    require('./ewok'),
    win(2, 'Write real css, with less hacks'),

    problem('CSS Modules will make you type more'),
    require('./example-html'),
    require('./example-1c'),
    require('./with-flow')(),
    win(3, 'Have an explicit mapping between CSS and the DOM'),

    problem('CSS Modules breaks some familiar patterns'),
    require('./label-example')(),
    require('./reusing-the-avatar')(),
    require('./logic-in-css')(),
    win(4, 'Embrace immutability'),

    problem('You&rsquo;ll need a build tool', 'like browserify or webpack'),
    placeholder('example: old bundling, new bundling'),
    win(5, 'Give your JS modules CSS dependencies'),

    tag('section', {}, [
      tag('h1.heading-l', { style: 'font-size: 16vw' }, 'FORC'),
      tag('div', { class: 'substep substep-fade', style: 'font-size: 5vw' }, 'Fear of Removing CSS')
    ]),
    placeholder('example: css in the tree'),
    win(6, 'Defeat FORC'),

    heading('Everything is a tradeoff'),
    require('./stages')(),

    heading('Thanks!'),

    // backdrops
    tag('div', { class: 'backdrop backdrop--footer' }, [
      tag('h1', {}, '@joshwnj')
    ])
  ].join('\n')
}
