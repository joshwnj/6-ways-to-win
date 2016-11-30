const cmz = require('cmz')
const styles = cmz.inline('', `
& {
  justify-content: space-around;
}

.old,
.new {
  display: flex;
  flex-direction: row;
  text-align: center;
}

.js-files,
.css-files {
  display: flex;
  flex-direction: column;
  margin-right: 1vw;
}

.file {
  margin: .2vw 1vw;
  width: 5vw;
  height: 5vw;
  background: #fff;
  border-radius: 10vw;
  border: .5vw solid #333;
  line-height: 5vw;
}

.divider {
  border-bottom: .5vw solid #000;
}

.arrow {
  width: 0;
  height: 5vw;
  border-left: .3vw dashed #000;
  margin-left: 4vw;
}

.output {
  font-size: 2vw;
}

.new {
  align-items: center;
}

.new .col:nth-child(2) {
  border-left: .3vw solid #000;
}

.new .col:nth-child(2) .file {

}

`, {
  '': 'flex-row',
  'js-files': 'substep substep-fade',
  'css-files': 'substep substep-fade',
  'new': 'substep substep-fade'
})

const tag = require('../util/tag').bind(null, styles)

module.exports = function () {
  return tag('slide.&', {}, [
    tag('.old', {}, [
      tag('.js-files', {}, [
        tag('.file', {}, 'js'),
        tag('.file', {}, 'js'),
        tag('.file', {}, 'js'),
        tag('.file', {}, 'js'),
        tag('.divider', {}, ''),
        tag('.arrow', {}, ''),
        tag('.point', {}, '▼'),
        tag('.output', {}, 'bundle.js')
      ]),
      tag('.css-files', {}, [
        tag('.file', {}, 'css'),
        tag('.file', {}, 'css'),
        tag('.file', {}, 'css'),
        tag('.file', {}, 'css'),
        tag('.divider', {}, ''),
        tag('.arrow', {}, ''),
        tag('.point', {}, '▼'),
        tag('.output', {}, 'bundle.css')
      ])
    ]),
    tag('.new', {}, `
<!-- http://codepen.io/Pestov/pen/BLpgm -->
<div class="tree">
	<ul>
		<li>
			<a href="#">js</a>
			<ul class="substep substep-fade">
				<li>
					<a href="#">js</a>
					<ul>
						<li>
							<a href="#">js</a>
						</li>
						<li>
							<a href="#">js</a>
						</li>
					</ul>
				</li>
				<li>
					<a href="#">js</a>
					<ul class="ui-dep">
						<li>
                                                  <a href="#">js</a>
                                                  <ul class="substep substep-fade css-dep">
                                                    <li><a href="#">css</a></li>
                                                  </ul>
                                                </li>
						<li>
                                                  <a href="#">js</a>
                                                  <ul class="substep substep-fade css-dep">
                                                    <li><a href="#">css</a></li>
                                                  </ul>
                                                </li>
						<li>
                                                  <a href="#">js</a>
                                                  <ul class="substep substep-fade css-dep">
                                                    <li><a href="#">css</a></li>
                                                  </ul>
                                                </li>
					</ul>
				</li>
			</ul>
		</li>
	</ul>
</div>
`)
  ])
}
