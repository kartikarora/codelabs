# Brand JavaScript API & Interactivity

The `@kartikarora` brand relies on the brand CDN JavaScript asset for handling interactions such as navigation toggle, tab switching, and syntax highlighting.

## Mandatory CDN Asset
Include this script tag in your HTML document:
```html
<!-- Brand Interaction JS -->
<script src="https://distribute.kartikarora.me/js/kartikarora.js"></script>
```

## Automated Capabilities
On document load (`DOMContentLoaded`), the brand script automatically initializes:
- **Mobile Navigation**: Binds click events to toggles (`#nav-toggle` and `#nav-links`).
- **Tabs**: Locates all `.tabs` containers, sets active indicators, and handles sliding transitions.
- **Syntax Highlighting**: Tokenizes `<pre><code class="language-*">` blocks and wraps them in a `.highlight` element.

## Dynamic Content & Manual Re-initialization
If your application updates the DOM dynamically (e.g., via Single Page App routing, AJAX fetching, or library frameworks like React/Vue), you must trigger manual re-initialization.

Use these global API methods exposed by the `KartikArora` namespace:

### Re-initialize Everything
```javascript
// Re-runs listeners and selectors for all brand components
KartikArora.initNavigation();
KartikArora.initTabs();
KartikArora.initSyntaxHighlighting();
```

### Re-initialize Specific Components
```javascript
// Re-bind navigation toggle
KartikArora.initNavigation();

// Re-evaluate tabs and their indicators
KartikArora.initTabs();

// Re-apply styles on code elements
KartikArora.initSyntaxHighlighting();
```

## Custom Events

### Tabs Changed Event
The tab component dispatches a custom `tabChanged` event containing current tab value and index metadata:
```javascript
const tabs = document.querySelector('.tabs');
tabs.addEventListener('tabChanged', (e) => {
  console.log('Selected Tab Value:', e.detail.value); // e.g. "android"
  console.log('Selected Tab Index:', e.detail.index); // e.g. 1
});
```

## Accessibility (ARIA) Guidelines for Mobile Navigation

When implementing custom navigation scripts or handling toggle states dynamically, always ensure proper ARIA attributes are updated synchronously to assist screen readers:

```javascript
const toggleButton = document.getElementById('nav-toggle');
const navLinksContainer = document.getElementById('nav-links');

function setNavigationState(isOpen) {
  if (isOpen) {
    navLinksContainer.classList.add('open');
    toggleButton.setAttribute('aria-expanded', 'true');
    navLinksContainer.setAttribute('aria-hidden', 'false');
  } else {
    navLinksContainer.classList.remove('open');
    toggleButton.setAttribute('aria-expanded', 'false');
    navLinksContainer.setAttribute('aria-hidden', 'true');
  }
}
```

