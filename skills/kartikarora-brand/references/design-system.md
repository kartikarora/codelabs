# Design System Overview (v2.0.0)

This reference guide details the core tokens, OKLCH color spectrum, typography ratios, and layout options for the `@kartikarora` brand.

---

## 🎨 Perceptual OKLCH Color Architecture

The brand uses **OKLCH (Lightness, Chroma, Hue)** color spaces to guarantee consistent contrast ratios, eliminate muddy grays in dark mode, and ensure visual harmony across light and dark system settings.

### Color Tokens

```css
:root {
  /* Light Canvas (Paper-Anchored) */
  --color-paper: oklch(98.5% 0.005 250);        /* Base canvas background */
  --color-paper-alt: oklch(96.0% 0.008 250);    /* Elevated cards & wells */
  --color-paper-sunken: oklch(93.5% 0.010 250); /* Code blocks & inputs */

  --color-ink: oklch(18.0% 0.015 255);          /* Primary high-contrast text */
  --color-ink-muted: oklch(46.0% 0.020 255);    /* Secondary / metadata text */
  --color-ink-faint: oklch(66.0% 0.018 255);    /* Disabled & placeholder text */

  --color-rule: oklch(88.0% 0.010 250);         /* Subtle hairline borders */
  --color-rule-strong: oklch(76.0% 0.015 250);  /* Interactive/card borders */

  /* The Signature Kartik Arora Signal: Precision Cobalt */
  --color-signal: oklch(52.0% 0.24 255);        /* High-contrast interactive accent */
  --color-signal-hover: oklch(46.0% 0.24 255);
  --color-signal-wash: oklch(52.0% 0.24 255 / 0.10); /* Translucent badges/tints */
  --color-signal-ink: oklch(99.0% 0 0);         /* Text on signal button */
  --color-focus: oklch(52.0% 0.24 255);         /* A11y focus ring */
}

@media (prefers-color-scheme: dark) {
  :root {
    /* Dark Canvas (Obsidian-Anchored) */
    --color-paper: oklch(14.0% 0.012 255);
    --color-paper-alt: oklch(18.5% 0.016 255);
    --color-paper-sunken: oklch(11.0% 0.010 255);

    --color-ink: oklch(94.0% 0.015 255);
    --color-ink-muted: oklch(72.0% 0.020 255);
    --color-ink-faint: oklch(48.0% 0.018 255);

    --color-rule: oklch(24.0% 0.018 255);
    --color-rule-strong: oklch(34.0% 0.025 255);

    /* Electric Cyan-Cobalt for Dark Canvas */
    --color-signal: oklch(68.0% 0.22 255);
    --color-signal-hover: oklch(74.0% 0.20 255);
    --color-signal-wash: oklch(68.0% 0.22 255 / 0.14);
    --color-signal-ink: oklch(10.0% 0.01 255);
    --color-focus: oklch(68.0% 0.22 255);
  }
}
```

---

## 📐 Fluid Typographic Scale

Typography scales dynamically via `clamp()` without breakpoint jumps.

```css
:root {
  --font-sans: "Albert Sans", system-ui, -apple-system, sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, monospace;

  --text-display: clamp(2.5rem, 5.5vw, 4.25rem);
  --text-display-s: clamp(1.85rem, 4vw, 2.75rem);
  --text-section: clamp(1.4rem, 2.75vw, 2.0rem);
  --text-title: 1.25rem;
  --text-lead: 1.125rem;
  --text-body: 1.0rem;
  --text-sm: 0.875rem;
  --text-xs: 0.75rem;
}
```

---

## 📏 8px Spacing Grid

Margins, padding, and gaps align to the 8px grid.

```css
--space-2xs: 0.25rem; /* 4px */
--space-xs:  0.5rem;  /* 8px */
--space-sm:  1.0rem;  /* 16px */
--space-md:  1.5rem;  /* 24px */
--space-lg:  2.0rem;  /* 32px */
--space-xl:  3.0rem;  /* 48px */
--space-2xl: 4.0rem;  /* 64px */
--space-3xl: 6.0rem;  /* 96px */
```

---

## ⚡ Interaction Motion Physics

Transitions follow Android Material emphasized easing:

```css
--ease-standard: cubic-bezier(0.2, 0, 0, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in: cubic-bezier(0.3, 0, 1, 1);
--dur-micro: 120ms;
--dur-short: 220ms;
--dur-medium: 320ms;
```
