module.exports = `
      <section class="cm-example">
        <div class="files">
          <div class="file css">
index.css
        <code><pre>
<span class="import substep" data-order=2>.root</span> {
  display: flex;
}

<span class="import substep" data-order=3>.avatar</span> {
  width: 30px;
  border-radius: 30px;
}

.name {
  font-size: small;
  font-weight: 800;
}
        </pre></code></div>

          <div class="file js">
index.html
<code><pre>
<span class="import substep" data-order=1></span>&lt;div class="<span class="import substep" data-order=2>root</span>"&gt;
  &lt;img class="<span class="import substep" data-order=3>avatar</span>" src="{{ props.avatarUrl }}" /&gt;
  &lt;span class="<span class="import substep" data-order=4>heading</span>"&gt;{{ props.name }}&lt;/span&gt;
&lt;/div&gt;
          </pre></code></div>
        </div>
      </section>
`
