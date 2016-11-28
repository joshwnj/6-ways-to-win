const cmz = require('cmz')
const styles = cmz.inline('', `
.bg {
  min-height: 101vh;
  animation: zoomin 40s infinite ease-in-out;
}

@keyframes zoomin {
  0% { transform:scale(1.0); }
  50% { transform:scale(1.2); }
  100% { transform:scale(1.0); }
}

.images {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;

  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.image {
  width: 20vw;
  margin-left: -2vw;
  border: 0.5vw solid #fff;
  border-radius: 200vw;
}

.image:first-child {
  margin-left: 0;
}
`, {
  'image': 'substep substep-fade-up'
})

const tag = require('../util/tag').bind(null, styles)

module.exports = function () {
  return tag('slide.&', {}, [
    tag('img.bg', { src: 'src/images/campjs-bg.png' }),
    tag('.images', {}, [
      tag('img.image', { src: 'src/images/mark.jpg', style: 'z-index: 3' }),
      tag('img.image', { src: 'src/images/sokra.jpg', style: 'z-index: 2' }),
      tag('img.image', { src: 'src/images/glen.jpg', style: 'z-index: 1' })
    ])
  ])
}

module.exports.styles = styles
