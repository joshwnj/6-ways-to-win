const bespoke = require('bespoke')
const backdrop = require('bespoke-backdrop')
const classes = require('bespoke-classes')
const keys = require('bespoke-keys')
const hash = require('bespoke-hash')
const substeps = require('bespoke-substeps/dom')

const renderSlides = require('./slides')
document.getElementById('pres').innerHTML = renderSlides()

window.bespoke = bespoke.from('#pres', [
  //  backdrop(),
  classes(),
  keys(),
  hash(),
  substeps()
])

if (module.hot) {
  module.hot.accept()
}
