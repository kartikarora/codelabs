# Typographic Identity & Blockquote Mandates

The `@kartikarora` brand features a bold typographic identity with strict rules for headings, body text, and high-impact pull quotes.

## Fonts
- **Sans-serif:** `var(--font-sans)` (Albert Sans)
- **Monospace:** `var(--font-mono)` (JetBrains Mono)

## Heading Ratios
```html
<h1>Main Title</h1>        <!-- 700 weight, -0.02em letter-spacing -->
<h2>Section Title</h2>      <!-- 700 weight -->
<h3>Subsection</h3>         <!-- 700 weight -->
```

## Blockquotes

### CSS Definition (Reference Only)
```css
blockquote {
    font-size: clamp(2rem, 6vw, 4.5rem);
    margin: clamp(var(--space-sm), 2vw, var(--space-md)) 0;
    padding-left: clamp(var(--space-md), 3vw, var(--space-lg));
    border-left: 6px solid var(--accent);
    font-weight: 700;
    color: var(--primary);
    line-height: 1.2;
    letter-spacing: -0.02em;
    font-style: italic;
}
```

### Strict Mandates
1. **HIGH IMPACT ONLY:** Use only for significant pull quotes or critical statements. Do not use for general citations or long-form excerpts.
2. **NO NESTED PARAGRAPHS:** For single-sentence quotes, place text directly inside the `<blockquote>` tag. Only use nested `<p>` tags if the quote spans multiple paragraphs.
3. **ZERO OVERRIDES:** Never override the `font-size`, `font-style`, or `border-left` properties. The fluid typography (`clamp`) and italic style are foundational to the brand's "loud" typographic identity.
4. **SEMANTIC TAG ONLY:** Always use the `<blockquote>` element; never attempt to replicate this style using `div` or `p` classes.
