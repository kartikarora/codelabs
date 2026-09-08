---
name: kartikarora-brand
description: Implements the @kartikarora brand design system. Use when building or styling web pages, components, or documents that must adhere to @kartikarora's visual identity, including layout, colors, typography (like high-impact blockquotes), and interactive elements using the brand CDN.
version: 1.8.0
last-updated: 2026-09-08
maintained-by: Kartik Arora (@kartikarora)
---

# @kartikarora Brand Design System - AI Agent Skill Guide

This guide defines the **mandatory** standards for implementing the @kartikarora brand design system. AI agents MUST follow these instructions strictly to ensure visual and functional consistency across all branded projects.

## ⚠️ Strict Mandates for AI Agents

1.  **NO CUSTOM REPLICATION:** Never write custom CSS or JavaScript to replicate functionality already provided by the brand (e.g., button styles, navigation, tabs, spacing).
2.  **CDN FIRST:** Always include the brand CDN assets in the `<head>` of every HTML file.
3.  **TOKEN PREFERENCE:** Use CSS variables (`var(--accent)`, `var(--space-md)`, etc.) for all styling. Never use hardcoded hex codes or pixel values for brand-related properties.
4.  **SEMANTIC CLASSES:** Use the predefined brand classes (`.btn-primary`, `.tabs`, `.step-number`, etc.) instead of creating new ones.
5.  **NO OVERRIDES:** Avoid overriding brand styles unless specifically requested by the user for a unique project-specific need.
6.  **SYSTEM COLOR SCHEME:** Always respect the browser/OS `prefers-color-scheme`. Never implement a custom theme toggle, `data-theme` attribute, or local storage theme persistence.
7.  **SYNCHRONIZE COMPOSE THEME:** Any update to brand colors, tokens, or palette definitions in this skill MUST immediately and automatically be synchronized with the [`kartikarora-compose-theme`](../kartikarora-compose-theme/SKILL.md) skill (`references/Color.kt`, `references/Theme.kt`, and `SKILL.md`).

## 📦 Mandatory CDN Assets

Include these in the `<head>` of every project. **Do not attempt to bundle or copy these files locally.**

### CSS & Fonts
```html
<!-- Brand Identity CSS -->
<link href="https://distribute.kartikarora.me/css/kartikarora.css" rel="stylesheet">

<!-- Required Fonts & Icons -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Albert+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet">
```

### JavaScript

For JavaScript CDN assets, automated behavior, and API initialization methods (e.g. `KartikArora.initTabs()`), refer to **[Brand JavaScript API & Interactivity](references/javascript-api.md)**.


## 📐 Typographic & Blockquote Mandates

The brand has strict mandates on typography and pull quotes. For the full requirements and CSS definitions, refer to **[Typographic Identity & Blockquote Mandates](references/typography-blockquotes.md)**.

## 🛠 Reference Manual & Specifications

To access detailed specifications, guidelines, and markup templates, read these files:

- **[Design System Overview](references/design-system.md)**: Color tokens, static color palettes, spacing system, typography rules, hero and filter control layouts.
- **[Typographic Identity & Blockquote Mandates](references/typography-blockquotes.md)**: Standard font families, headings scale, blockquote definitions, and formatting rules.
- **[Brand JavaScript API & Interactivity](references/javascript-api.md)**: Details on automated JS capabilities, event listners, and manual re-initialization options.
- **[Component Usage Guidelines](references/components.md)**: Details on cards & grids, buttons, tabs (and custom event handlers), syntax highlighting, and Material Symbols.
- **[Component HTML Templates](references/templates.md)**: Pre-formatted, copy-pasteable HTML boilerplate blocks for layout grid, header, footer, tabs, etc.
- **[Layout Guidelines & Utilities](references/layout-utilities.md)**: Standard layout margins, container max-widths, border-radius configurations, and helper utility classes.
- **[Example Full Page Template](references/template-page.md)**: Boilerplate code showcasing correct implementation of components and CDN inclusion on a single web page.

### Brand Compliance Utilities
You can validate local web assets against brand design constraints using this Node.js scanning script:
- **[`brand-linter.js`](scripts/brand-linter.js)**: Scans directories to check for token violations (hardcoded hex/pixels/fonts) in CSS/HTML.

## ✨ Best Practices for AI Agents

1. **Use CSS Variables:** Always use brand tokens (e.g., `var(--accent)`) instead of hardcoded hex values or px counts.
2. **Respect the Spacing System:** Use variables like `var(--space-lg)` instead of manual sizing (e.g. `margin: 35px`).
3. **Keep Button Semantics:** CTA states MUST use `.btn-primary`, `.btn-secondary`, or `.btn-outline` exclusively.
4. **Language Attribution:** Always specify the programming language on code blocks (e.g. `class="language-js"`) for highlighters to map correctly.
5. **Mobile-First Responsive Design:** The brand CSS is mobile-first. Use media queries (`@media (min-width: 768px)`) for desktop adjustments.

## 🚫 Prohibited Patterns (Do NOT Do These)

❌ **Bundling Local Files:** Do not copy `kartikarora.css` or `kartikarora.js` into your project's local file system. Use the CDN links.
❌ **Hardcoded Hex Codes:** Do not use hex codes like `#0066cc`. Use `var(--accent)`.
❌ **Custom Button/Tab CSS/JS:** Do not write custom selectors or event listeners for components that are already implemented natively.
❌ **Redundant Fonts:** Do not import your own fonts if the brand fonts (`Albert Sans`, `JetBrains Mono`) are already available via the CDN.
❌ **Manual Theme Toggling:** Do not implement custom theme switchers or write to `localStorage` to save theme preferences.

## 🤖 AI Agent Implementation Checklist

Before finishing any branded implementation, verify the following:

- [ ] **Mandatory CDN:** Are `kartikarora.css`, `kartikarora.js`, and the required fonts included in the HTML `<head>`?
- [ ] **Semantic HTML:** Did you use `.btn-primary`, `.tabs`, `.tab-item`, etc. instead of custom classes?
- [ ] **Token Usage:** Are all colors and spacings using CSS variables (e.g., `var(--accent)`, `var(--space-md)`)?
- [ ] **Automatic Initialization:** Are you relying on the brand JS for tabs/nav interaction instead of writing your own?
- [ ] **Zero Overrides:** Have you avoided overriding brand styles with custom CSS?
- [ ] **System Theme Only:** Have you ensured there is no custom theme-switching logic or `data-theme` usage?
- [ ] **Material Symbols:** Are icons used in buttons where appropriate, and do they use the `.material-symbols-outlined` class?
- [ ] **Code Block Language:** Do all code blocks have the correct `language-*` class for syntax highlighting?
- [ ] **Responsive Design:** Have you verified the layout works on mobile and uses the brand's responsive spacing tokens?
- [ ] **Compose Theme Sync:** If brand color tokens or palette definitions were modified, have `kartikarora-compose-theme` and its Kotlin references been updated in lockstep?
