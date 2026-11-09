# Brand JavaScript API & Interactivity (v2.0.0)

The `@kartikarora` brand relies on the brand CDN JavaScript asset for handling interactions such as navigation toggle, tab switching, code copying, and syntax highlighting.

---

## Mandatory CDN Asset
```html
<script src="https://distribute.kartikarora.me/js/kartikarora.js" defer></script>
```

---

## Automated Capabilities
On document load (`DOMContentLoaded`), the script automatically initializes:
- **Accessible Mobile Navigation:** Binds toggle events with `aria-expanded` and `aria-hidden` attributes and Escape key handling.
- **Sliding Tabs:** Binds sliding indicators and full keyboard navigation (`ArrowRight`, `ArrowLeft`, `Home`, `End`).
- **Code Copying:** Injects accessible copy buttons into `<pre>` blocks with visual confirmation.
- **Syntax Highlighting:** Tokenizes `<pre><code class="language-*">` blocks (Kotlin, Swift, JS/TS, Python, CSS, Bash).

---

## Dynamic Re-initialization
If your application mutates the DOM dynamically (SPA routers, dynamic fetching):

```javascript
KartikArora.initNavigation();
KartikArora.initTabs();
KartikArora.initCodeCopy();
KartikArora.initSyntaxHighlighting();
```

---

## Custom Events

### Tabs Changed Event
```javascript
const tabs = document.querySelector('.tabs');
tabs.addEventListener('tabChanged', (e) => {
  console.log('Value:', e.detail.value); // e.g. "android"
  console.log('Index:', e.detail.index); // e.g. 0
});
```
