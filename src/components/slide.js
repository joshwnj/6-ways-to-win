const renderChildren = require('../util/render-children')

module.exports = function slide (props, children) {
  return `<section id="${props.id}">
${renderChildren(children)}
</section>`
}
