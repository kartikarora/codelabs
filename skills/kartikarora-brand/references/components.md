# Brand Components Reference

This guide details the usage, Javascript capabilities, events, and styling details for components in the `@kartikarora` design system.

For copy-paste markup snippets, see [Component HTML Templates](templates.md).

## Cards & Grids

The brand provides two standardized card layouts:
1. **Grid Layout (`.card-grid` & `.card-grid-item`)**: Best for visual-first contents (renders in 3 columns on desktop screens). Images fill the full width of the card and use `object-fit: cover` with a fixed 200px height.
2. **List Layout (`.card-list` & `.card-list-item`)**: Best for information-heavy contents (renders full width on desktop). Images use a strict 1:1 aspect ratio (200x200px) and use `object-fit: cover`.

*Best Practice:* Always wrap card images in a `.card-image` container for consistent aspect ratios and hover effects. Use `.tech-tag` for category labels or tech stack keywords.

## Buttons
- **Primary CTA (`.btn .btn-primary`)**: Used for the primary call-to-action.
- **Secondary CTA (`.btn .btn-secondary`)**: Renders transparent button with no border. Used for less important actions.
- **Outline CTA (`.btn .btn-outline`)**: Renders filled background with a border. Used for alternative paths.

*Best Practice:* Always include a Material Symbols icon when appropriate. Keep labels concise (1-3 words).

## Tabs (`.tabs` & `.tab-item`)
Used for switching between mutually exclusive options (typically 2-5 items).
- The brand JS automatically handles the sliding indicator animation and class toggling on load.
- Ensure one tab item is preconfigured with the `.active` class.
- Use `data-value` attributes for easy state retrieval.

### JavaScript Event Listening
The tabs component fires a custom `tabChanged` event:
```javascript
const tabs = document.querySelector('.tabs');
tabs.addEventListener('tabChanged', (e) => {
  console.log('Value:', e.detail.value); // e.g. "android"
  console.log('Index:', e.detail.index); // e.g. 1
});
```

## Code Blocks & Syntax Highlighting
Syntax highlighting is automated for `<pre><code class="language-*">` blocks.

### Supported Languages
- JavaScript/JS (`language-js`)
- Kotlin (`language-kotlin`)
- Swift (`language-swift`)
- Python (`language-python`)
- CSS (`language-css`)
- Bash/Shell (`language-bash`, `language-sh`, `language-shell`)

### Highlight CSS Classes (Ref Only)
- `.k` - Keywords (blue)
- `.s` - Strings (green)
- `.c` - Comments (gray, italic)
- `.nf` - Functions (purple)
- `.nb` - Built-ins (blue)
- `.kt` - Types (red)
- `.nc` - Classes (purple)
- `.m` - Numbers (blue)
- `.na` - Attributes/Properties (purple)
- `.nv` - Variables/Parameters (orange)
- `.o` - Operators (red)

## Material Symbols Icons
Use the `material-symbols-outlined` font with inline spans:
```html
<span class="material-symbols-outlined">home</span>
```
- `check_circle` (Success)
- `error` (Error)
- `info` (Info)
- `arrow_forward` (Nav)
- `download` (Download)
- `link` (External Link)
- `dark_mode` / `light_mode` (Theme toggle)

## Off-Canvas Mobile Navigation (`.nav-links`)
A smooth, hardware-accelerated drawer menu transition instead of toggling the `display` property.
- When on mobile layouts, `.nav-links` is positioned off-screen to the right.
- Add the class `.open` to `.nav-links` to slide the menu into view smoothly.
- **Transition Mandate:** Must use a fast 0.2s transition (`transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.2s ease, visibility 0.2s ease;`).

## Translucent Badges
Compact state tags with a translucent background, matching brand/utility accent colors:
- `.badge`: General styling base (rounded with bold, small text).
- `.badge-win`: Blue translucent theme (uses `var(--accent)`).
- `.badge-loss`: Red translucent theme (uses `#ff4444`).
- `.badge-draw`: Gray translucent theme (uses `var(--muted)`).

## Pure-CSS Tooltips (`.tooltip-container`)
An accessible, screen-reader friendly tooltip component that triggers on both mouse hover and keyboard focus:
- Container must have `tabindex="0"` for keyboard access.
- Tooltip text resides inside a `.tooltip-text` span within the container.
- If placed inside grid items, ensure the card has `.has-tooltips` class to allow overflow visibility.
- **Transition Mandate:** Must use a fast 0.2s fade transition for tooltip visibility.

