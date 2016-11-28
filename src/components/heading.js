const renderChildren = require('../util/render-children')

module.exports = function heading (props, children) {
  return `<h1>${renderChildren(children)}</h1>`
}
