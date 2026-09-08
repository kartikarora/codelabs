# Design System Overview

This reference guide details the core tokens, colors, typography, and layout options for the `@kartikarora` brand.

## Layout System

The brand provides standard layout containers and sectioning classes:

```html
<!-- Main Container (1200px max-width) -->
<div class="container">
  <!-- Content -->
</div>

<!-- Narrow Container (800px max-width) -->
<div class="container-narrow">
  <!-- Articles/Forms -->
</div>

<!-- Section (adds standard vertical padding) -->
<section class="section">
  <div class="container">
    <!-- Section Header -->
    <div class="section-header">
      <h2 class="section-title">Section Title</h2>
      <p class="section-subtitle">Optional subtitle text</p>
    </div>

    <!-- Section Content -->
    
    <!-- Section Actions -->
    <div class="section-actions">
      <a href="#" class="btn btn-primary">Primary Action</a>
    </div>
  </div>
</section>
```

## Color System

The brand implements design tokens using CSS Custom Properties (Variables) that adapt automatically to system themes via `@media (prefers-color-scheme: dark)`.

### Token Definition Boilerplate
```css
:root {
  /* Fonts */
  --font-sans: 'Albert Sans', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-mono: 'JetBrains Mono', SFMono-Regular, Consolas, 'Liberation Mono', Menlo, monospace;

  /* Color System (Light Mode default) */
  --primary: #0d1117;
  --secondary: #57606a;
  --tertiary: #8c959f;
  --muted: #afb8c1;
  --accent: #0066cc;
  --accent-hover: #0052a3;
  --bg: #ffffff;
  --bg-alt: #f6f8fa;
  --card: #ffffff;
  --border: #d0d7de;
  --shadow: rgba(140, 149, 159, 0.15);
  --glow: rgba(0, 102, 204, 0.15);

  /* Component Specific (Tabs) */
  --tabs-bg: #f6f8fa;
  --tabs-item-bg-active: #ffffff;
  --tabs-text: #57606a;
  --tabs-text-active: #0d1117;
}

@media (prefers-color-scheme: dark) {
  :root {
    /* Color System (Dark Mode override) */
    --primary: #e6edf3;
    --secondary: #8b949e;
    --tertiary: #484f58;
    --muted: #30363d;
    --accent: #0099ff;
    --accent-hover: #33aaff;
    --bg: #0d1117;
    --bg-alt: #161b22;
    --card: #161b22;
    --border: #30363d;
    --shadow: rgba(0, 0, 0, 0.5);
    --glow: rgba(0, 153, 255, 0.2);

    /* Component Specific (Tabs) */
    --tabs-bg: #161b22;
    --tabs-item-bg-active: #0d1117;
    --tabs-text: #8b949e;
    --tabs-text-active: #e6edf3;
  }
}
```

### Usage
```css
.custom-element {
  color: var(--primary);
  background: var(--bg-alt);
  border: 1px solid var(--border);
}
```

## Glassmorphism Tokens
For premium interfaces (especially in Dark Mode), use translucent glass panels:
```css
.card-glass {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(12px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

@media (prefers-color-scheme: light) {
  .card-glass {
    background: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(12px) saturate(180%);
    border: 1px solid rgba(0, 0, 0, 0.06);
  }
}
```

## Focus & Active Outlines
Accessibility outlines to assist keyboard navigation replacing browser defaults:
```css
a:focus-visible,
button:focus-visible,
[tabindex="0"]:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 3px;
  box-shadow: 0 0 0 4px var(--glow);
}
```

## Typography

- **Sans-serif Font:** `var(--font-sans)` (`'Albert Sans', system-ui, -apple-system, sans-serif`)
- **Monospace Font:** `var(--font-mono)` (`'JetBrains Mono', monospace`)

### Fluid Typography Heading Tokens
Use CSS `clamp()` to scale headings dynamically without breakpoint bloat:
```css
:root {
  --font-size-h1: clamp(2.2rem, 5vw, 3.5rem);
  --font-size-h2: clamp(1.6rem, 4vw, 2.4rem);
  --font-size-h3: clamp(1.2rem, 3vw, 1.8rem);
}
```

### Headings
```html
<h1 style="font-size: var(--font-size-h1);">Main Title</h1>        <!-- Letter-spacing: -0.02em -->
<h2 style="font-size: var(--font-size-h2);">Section Title</h2>
<h3 style="font-size: var(--font-size-h3);">Subsection</h3>
```

### Paragraphs & Blockquotes
```html
<p>Regular paragraph text</p>
<p class="text-muted">Muted secondary text</p>

<blockquote>
  This is a high-impact pull quote.
</blockquote>
```

For full constraints and CSS definition of blockquotes, refer to the main [SKILL.md](../SKILL.md#blockquote-mandates).

## Spacing System

Use spacing tokens for consistent margins and padding:

```css
--space-xs:  0.5rem;  /* 8px */
--space-sm:  1rem;    /* 16px */
--space-md:  1.5rem;  /* 24px */
--space-lg:  2rem;    /* 32px */
--space-xl:  3rem;    /* 48px */
--space-2xl: 4rem;    /* 64px */
--space-3xl: 6rem;    /* 96px */
```

### Usage
```css
.section {
  padding: var(--space-2xl) var(--space-md);
  margin-bottom: var(--space-lg);
}
```

## Hero Section
Standardized hero section for landing pages.
```html
<section class="hero">
  <div class="container-narrow">
    <img src="/path/to/image.jpg" alt="Author Name" class="hero-img">
    <h1 class="hero-title">Author Name</h1>
    <p class="hero-subtitle">Professional Title | Role @ Company</p>
    <p class="hero-bio">A brief professional bio or introduction text.</p>
  </div>
</section>
```

## Filter Controls
Standardized controls for filtering lists or grids.
```html
<div class="filter-controls">
  <button class="filter-btn active" data-filter="all">All</button>
  <button class="filter-btn" data-filter="category-1">Category 1</button>
  <button class="filter-btn" data-filter="category-2">Category 2</button>
</div>
```
