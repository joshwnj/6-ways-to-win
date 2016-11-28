module.exports = `
      <section class="cm-example">
        <div class="font-m label substep substep-fade substep-drop-v" data-order=1>
          <div>a component</div>
          
          <span class="line"></span>
          
        </div>

        <div class="files">
          <div class="file css">

            <div class="substep substep-fade substep-drop-v font-s font-label" data-order=2>Styles</div>
index.css
        <code><pre>
<span class="import substep" data-order=4>.root</span> {
  display: flex;
}

<span class="import substep" data-order=5>.avatar</span> {
  width: 30px;
  border-radius: 30px;
}

<span class="import substep" data-order=6>.name</span> {
  font-size: small;
  font-weight: 800;
}
        </pre></code></div>

          <div class="file js">

            <div class="substep substep-fade substep-drop-v font-s font-label" data-order=2>DOM &amp; Logic</div>
index.js
<code><pre>
<span class="import substep" data-order=3>import styles from './index.css'</span>

export default function (props) {
  return \`
    &lt;div class=\${<span class="import substep" data-order=4>styles.root</span>}&gt;
      &lt;img class=\${<span class="import substep" data-order=5>styles.avatar</span>} src=\${props.avatarUrl} /&gt;
      &lt;span class=\${<span class="import substep" data-order=6>styles.name</span>}&gt;\${props.name}&lt;/span&gt;
    &lt;/div&gt;
  \`
}
          </pre></code></div>
        </div>
      </section>
`
