module.exports = `
      <section class="cm-example">
        <div class="files">
          <div class="file css">
index.css
        <code><pre>
<span class="import substep" data-order=1>.root</span> {
  display: flex;
}

<span class="import substep" data-order=1>.avatar</span> {
  width: 30px;
  border-radius: 30px;
}

<span class="import substep" data-order=1>.name</span> {
  font-size: small;
  font-weight: 800;
}
        </pre></code></div>

          <div class="file js">
index.js
<code><pre>
<span class="import substep" data-order=1>import styles from './index.css'</span>

export default function (props) {
  return \`
    &lt;div class=\${<span class="import substep" data-order=1>styles.root</span>}&gt;
      &lt;img class=\${<span class="import substep" data-order=1>styles.avatar</span>} src=\${props.avatarUrl} /&gt;
      &lt;span class=\${<span class="import substep" data-order=1>styles.name</span>}&gt;\${props.name}&lt;/span&gt;
    &lt;/div&gt;
  \`
}
          </pre></code></div>
        </div>
      </section>
`
