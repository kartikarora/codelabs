# Typographic Identity & Editorial Statements (v2.0.0)

The `@kartikarora` brand features an authoritative, clean typographic identity combining **Albert Sans** (Display & Body) and **JetBrains Mono** (Code, numbers, telemetry).

---

## Fonts & Sourcing

- **Display & Body:** `"Albert Sans", system-ui, -apple-system, sans-serif`
- **Code, Metrics & Telemetry:** `"JetBrains Mono", ui-monospace, monospace`

---

## Headings Rules

1. **Balance:** Every heading (`h1`–`h3`) carries `text-wrap: balance` and `-0.02em` letter-spacing.
2. **Measure Caps:** Heading measures ride directly on elements in character width:
   - `h1`: max-width `20ch`
   - `h2`: max-width `30ch`
   - `h3`: max-width `40ch`
3. **Never Accented Single Words:** A heading is one weight, one style, and one color. Never highlight or italicize a single word within a heading (e.g., `<h2>Build <span class="accent">faster</span> apps</h2>` is prohibited).

---

## The Editorial Statement (Reimagined Blockquote)

The brand pull quote has been elevated from an exaggerated italic block into a **commanding editorial statement**:

```html
<blockquote class="brand-statement">
  "Software should behave like a physical instrument: immediate, tactile, and predictable."
  <cite>— Kartik Arora, Droidcon Berlin</cite>
</blockquote>
```

### CSS Definition
```css
blockquote, .brand-statement {
  font-family: var(--font-sans);
  font-size: var(--text-section);
  line-height: 1.35;
  font-weight: 600;
  color: var(--color-ink);
  padding-left: var(--space-md);
  border-left: 3px solid var(--color-signal);
  margin: var(--space-xl) 0;
  max-width: 48ch;
  font-style: normal; /* No fake italics */
}

blockquote cite, .brand-statement cite {
  display: block;
  font-size: var(--text-sm);
  font-weight: 400;
  color: var(--color-ink-muted);
  font-family: var(--font-mono);
  margin-top: var(--space-xs);
  font-style: normal;
}
```

---

## Tabular Numbers

All numerical data, version numbers, dates, benchmarks, and telemetry metrics MUST use `font-variant-numeric: tabular-nums` in `JetBrains Mono` to prevent layout jank during transitions or updates.
