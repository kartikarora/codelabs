---
name: kartikarora-brand
description: Implements the @kartikarora brand design system (v2.0.0). Hallmark-grade design engine for building or styling web pages, apps, components, and documents adhering to @kartikarora's visual identity, tactile interaction principles, OKLCH perceptual spectrum, and signature macrostructures.
version: 2.0.0
last-updated: 2026-11-05
maintained-by: Kartik Arora (@kartikarora)
---

# @kartikarora Brand Design System (v2.0.0)

This skill defines the official **Hallmark-Grade Design System** for `@kartikarora`. It unites **Interaction Design** (tactile ergonomics, purposeful motion) with **Systems Engineering Precision** (clean architecture, terminal craft, Android Material physics).

AI agents MUST follow these instructions strictly to ensure visual and functional excellence across all branded projects.

---

## 🏛️ The Brand Floor (Inviolable Mandates)

These 10 rules bind every output in every harness. None are waivable.

1. **Pure Token Strictness:** Every color, font, spacing, radius, and duration must reference declared CSS tokens (`var(--color-*)`, `var(--space-*)`, `var(--text-*)`). Zero literal hex/rgb/hsl or pixel margins outside the token root.
2. **Viewport Integrity:** `overflow-x: clip` on both `html` and `body`. Never `hidden`, never `100vw`.
3. **No Catch-All Transitions:** Never `transition: all`. Never animate layout dimensions (`width`, `height`, `top`, `left`). Use only `transform` and `opacity`.
4. **Immediate Keyboard Focus:** Every interactive element has `:focus-visible` with high-contrast signal outline (`outline: 2px solid var(--color-focus); outline-offset: 2px;`), appearing instantly with zero transition delay.
5. **Reduced-Motion Fallback:** Every animation and transition must be suppressed under `@media (prefers-reduced-motion: reduce)`.
6. **Zero AI Slop:** 
   - No purple-to-blue or cyan gradients.
   - No cards nested inside cards.
   - No floating emoji circles masquerading as feature icons.
   - No fake metric counters or invented statistics.
   - No tracked uppercase pill tags (`FEATURE`, `UPDATE`). Tags and badges are sentence-case or lowercase in body/mono font.
7. **Typographic Discipline:**
   - Maximum 2 font families: **Albert Sans** (Display & Body) + **JetBrains Mono** (Code, telemetry, tabular numbers).
   - `text-wrap: balance` on all headings (`h1`–`h3`); `text-wrap: pretty` on all body paragraphs.
   - Never an accented or italicized single word in a roman headline.
8. **Visible Fold Budget:** The hero headline, single-sentence summary, and primary action must be fully visible within 1280×800 without scrolling. Word density capped at ~80 words per screen view.
9. **Media Layout Stability:** All `<img>`, `<video>`, and canvases must specify explicit `width`, `height`, and `aspect-ratio` to guarantee zero Cumulative Layout Shift (CLS).
10. **Compose Parity:** Any color, token, or design concept introduced in CSS must map directly to its Jetpack Compose counterpart in [`kartikarora-compose-theme`](../kartikarora-compose-theme/SKILL.md).

---

## 📦 Mandatory CDN Assets

Include these in the `<head>` of every HTML document. **Do not attempt to bundle or copy these files locally.**

```html
<!-- Brand Identity CSS (v2.0) -->
<link href="https://distribute.kartikarora.me/css/kartikarora.css" rel="stylesheet">

<!-- Required Fonts & Icons -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Albert+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet">

<!-- Brand Interaction & A11y JS -->
<script src="https://distribute.kartikarora.me/js/kartikarora.js" defer></script>
```

---

## 📐 The 8 Signature Brand Compositions

Move beyond the repetitive 3-column card grid. Use the composition tailored to the content's purpose:

1. **Engineering Spec (`.spec-grid`, `.spec-card`):** Key-value technical breakdowns, platform targets, binary sizes.
2. **Diff & Architecture Compare (`.diff-grid`, `.diff-pane`):** Side-by-side code or architecture evolution.
3. **Milestone Stream (`.timeline-stream`, `.timeline-item`):** Chronological stream of career, speaking, and project milestones.
4. **Talk & Publication Index (`.index-table`, `.index-row`):** Dense, scannable tabular index of conference talks, decks, and articles.
5. **Bento Precision Grid (`.bento-grid`, `.bento-tile`):** Asymmetrical visual grid (8+4 or 7+5) where lead projects hold prominence.
6. **Editorial Statement Lead (`.editorial-lead`, `.editorial-quote`):** Unitalicized, balanced statement anchoring an essay or talk.
7. **Telemetry & Numbers (`.telemetry-grid`, `.telemetry-metric`):** Verified statistics with tabular numerals.
8. **Platform Switcher (`.interaction-canvas`):** Segmented tab canvas toggling between Android, CMP, and Web code.

For full code snippets, consult **[Component HTML Templates](references/templates.md)**.

---

## 🛠 Reference Manual & Specifications

To access detailed specifications, guidelines, and markup templates, read these files:

- **[Design System Overview](references/design-system.md)**: OKLCH color spectrum, paper/ink/signal layers, spacing system, fluid typography scale.
- **[Typographic Identity & Editorial Statements](references/typography-blockquotes.md)**: Font pairing, balanced headings, statement blockquotes, tabular numbers.
- **[Component Usage Guidelines](references/components.md)**: Details on the 8 signature compositions, buttons, tabs, code blocks, and badges.
- **[Component HTML Templates](references/templates.md)**: Copy-pasteable boilerplate blocks for all 8 compositions and layout elements.
- **[Layout Guidelines & Utilities](references/layout-utilities.md)**: Container widths, 12-column grid, responsive rules, media stability.
- **[Brand JavaScript API & Interactivity](references/javascript-api.md)**: Accessible navigation, tab events, keyboard controls, code copying.
- **[Example Full Page Template](references/template-page.md)**: Complete production-grade page demonstrating The Floor in action.
- **[Migration Guide (v1.8.0 to v2.0.0)](references/migration-v1-to-v2.md)**: Automated migration helper, non-destructive safety guarantees, and token mappings.

---

## 🔍 Brand Verification Tooling

To ensure compliance before handing off any branded work, run the automated brand linter:

```bash
node skills/kartikarora-brand/scripts/brand-sloplint.js <directory-or-file>
```

The script verifies token purity, catches forbidden transitions, detects unclipped viewports, and enforces anti-slop rules.
