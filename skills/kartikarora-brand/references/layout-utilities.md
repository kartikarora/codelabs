# Layout Guidelines & Utilities

This reference guide provides container widths, border-radius settings, and standard helper classes.

## Container Widths

```css
--max-width: 1200px;        /* Standard container */
--max-width-narrow: 800px;  /* Narrow content (articles, forms) */
```

### Usage
```html
<div class="container" style="max-width: var(--max-width); margin: 0 auto; padding: var(--space-2xl) var(--space-md);">
  <!-- Content -->
</div>
```

## Border Radius

```css
--border-radius: 12px;     /* Standard radius */
--border-radius-sm: 6px;   /* Small radius */
```

## Utility Classes

Use the following helper classes to quick-style layout and text properties:

### Text Alignment
```html
<div class="text-center">Centered text</div>
```

### Text Color
```html
<p class="text-muted">Muted text color</p>
```

### Spacing Helper Classes
```html
<!-- Top Margin -->
<div class="mt-md">Top margin (1.5rem / 24px)</div>

<!-- Bottom Margin -->
<div class="mb-md">Bottom margin (1.5rem / 24px)</div>
```

## Media Layout Stability (CLS Prevention)

Consistent with `@kartikarora` system performance standards, always prioritize media layout stability. To prevent Cumulative Layout Shift (CLS) on variable connection speeds:

1. **Explicit Dimensions:** Always define `width` and `height` HTML attributes directly on `<img>`, `<video>`, and `<iframe>` elements to allow the browser to calculate aspect ratio spaces before download finishes.
2. **CSS Aspect Ratio Mapping:** Declare responsive constraints using the CSS `aspect-ratio` property:
```css
img.responsive-media {
  width: 100%;
  height: auto;
  aspect-ratio: 16 / 9; /* Sets dynamic height space automatically */
  object-fit: cover;
}
```
3. **Card Images:** Grid card images (`.card-image img`) MUST have fixed aspect ratios or standard height structures so the container does not shift sizing layout when loading asynchronously.


