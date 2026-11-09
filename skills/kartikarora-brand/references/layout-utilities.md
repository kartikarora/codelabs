# Layout Guidelines & Utilities (v2.0.0)

This reference guide details container constraints, grid alignment, and Cumulative Layout Shift (CLS) prevention standards.

---

## Container Constraints

```css
--max-width: 1200px;        /* Standard content container */
--max-width-narrow: 800px;  /* Long-form articles and technical specs */
--gutter: clamp(1rem, 4vw, 2.5rem);
```

### Markup Usage
```html
<div class="container">
  <!-- Content adheres to 1200px cap and fluid gutters -->
</div>
```

---

## Viewport Integrity (Brand Floor Gate 2)

- `overflow-x: clip;` is mandated on both `html` and `body`.
- Never use `overflow-x: hidden;` on body (which breaks sticky positioning in certain mobile viewports).
- Never use `100vw` on full-width containers (which introduces scrollbar jumps). Use `100%`.

---

## Media Layout Stability (CLS Prevention)

To guarantee zero Cumulative Layout Shift:

1. **Explicit Dimensions:** Every `<img>`, `<video>`, `<canvas>`, and `<iframe>` must define explicit `width` and `height` attributes.
2. **Aspect Ratio Mapping:** Use CSS `aspect-ratio` on responsive images:
   ```css
   .media-preview {
     width: 100%;
     height: auto;
     aspect-ratio: 16 / 9;
     object-fit: cover;
   }
   ```
3. **Card Images:** Card media must use explicit container heights (e.g. `height: 200px`) with `object-fit: cover` to avoid jumping when loaded asynchronously.
