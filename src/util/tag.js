const renderChildren = require('./render-children')

module.exports = function tag (styles, name, attr, children) {
  const parts = name.split('.')
  const type = parts[0] || 'div'
  const classname = parts[1]

  const output = []
  output.push(`<${type} `)

  if (classname) {
    attr = attr || {}

    // '&' is shorthand for the root classname of the cmz module
    attr.class = styles(classname === '&' ? '' : classname)
  }

  if (attr) {
    Object.keys(attr).forEach(key => output.push(`${key}="${attr[key]}" `))
  }

  if (typeof children === 'undefined') {
    output.push('/>')
  }
  else {
    output.push(`>${renderChildren(children)}</${type}>`)
  }

  return output.join('')
}
