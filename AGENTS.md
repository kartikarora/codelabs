# AI Agent Guide — Codelabs Repository

This document defines the rules, conventions, workflows, and specifications for AI coding assistants working in this repository.

---

## 🎯 Repository Overview

This repository hosts interactive codelabs and technical workshops published at [codelabs.kartikarora.me](https://codelabs.kartikarora.me).

Key components:
1. **Landing Portal (`index.html`)**: Built strictly with the **@kartikarora Brand Design System**.
2. **Source Tutorials (`source/`)**: Authored in Markdown following **Klaat** formatting guidelines.
3. **Codelab Artifacts (`codelabs/`)**: Static, interactive HTML exported by **Klaat** (`klaat`).
4. **Distribution Engine (`generate-manifest.js`)**: Node.js script assembling `dist/` and `dist/codelabs.json`.
5. **Hosting Platform**: Cloudflare Pages / Workers configured in `wrangler.toml`.

---

## 🎨 Brand Design System Mandates (`kartikarora-brand`)

All UI and landing page styling must adhere to the @kartikarora Brand Design System. The canonical skill instructions and reference specifications are located in [`skills/kartikarora-brand/SKILL.md`](skills/kartikarora-brand/SKILL.md).

When modifying `index.html` or any custom landing pages:

1. **Mandatory CDN Assets**:
   ```html
   <!-- Brand Identity CSS -->
   <link href="https://distribute.kartikarora.me/css/kartikarora.css" rel="stylesheet">

   <!-- Required Fonts & Icons -->
   <link rel="preconnect" href="https://fonts.googleapis.com">
   <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
   <link href="https://fonts.googleapis.com/css2?family=Albert+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet">

   <!-- Brand Interaction JS -->
   <script src="https://distribute.kartikarora.me/js/kartikarora.js" defer></script>
   ```
2. **Typography**: Headings and body use `var(--font-sans)` (Albert Sans) and code uses `var(--font-mono)` (JetBrains Mono).
3. **Color Tokens**: Always use CSS variables (`var(--primary)`, `var(--secondary)`, `var(--accent)`, `var(--bg)`, `var(--card)`, `var(--border)`). Never use hardcoded hex/RGB colors.
4. **Semantic Classes**: Use `.card-grid`, `.card-grid-item`, `.btn-primary`, `.tabs`, `.tab-item`, `.tech-tag`. Do not create custom CSS duplicates.
5. **System Color Scheme**: Always rely on system `prefers-color-scheme`. Never implement custom theme toggles or `localStorage` theme state.
6. **CLS Prevention**: Always specify explicit `width` and `height` on dynamic images (`<img width="400" height="200" loading="lazy">`).

---

## ✍️ Markdown Authoring Standards (`klaat-markdown-author`)

When creating or modifying codelabs under `source/<slug>/codelab.md`:

1. **Frontmatter Schema**:
   ```markdown
   ---
   id: unique-slug
   summary: Short single-sentence description of the tutorial.
   categories: AI, Android, Web
   environments: Web
   status: Published
   authors: Kartik Arora
   feedback_link: https://kartikarora.me
   tags: ai, gemini, agents
   ---
   ```
2. **Hierarchy**:
   - Level 1 heading for title: `# Codelab Title`
   - Level 2 heading for steps: `## Step Title`
   - Immediately below each step: `Duration: <minutes>` (e.g. `Duration: 5`)
   - Level 3 heading for sub-sections: `### Subtitle`
   - **No horizontal rules (`---`) between steps**.
3. **Callout / Info Box Syntax**:
   - Tips / Highlights: `> Content here {.special}`
   - Warnings / Cautions: `> Content here {.warning}`
4. **Code Blocks**:
   - Always specify programming language (`bash`, `cmd`, `json`, `kotlin`, `javascript`, `text`).
   - For outer prompt text enclosing inner code fences, use four backticks (````text ... ```kotlin ... ``` ````).
   - Precede file-specific blocks with bold filenames (`**Main.kt**`).

---

## ⚙️ Build & Export Commands (`klaat-cli`)

1. **Export a single codelab**:
   ```bash
   klaat export -o codelabs source/<slug>/codelab.md
   ```
2. **Regenerate distribution manifest**:
   ```bash
   node generate-manifest.js
   ```
3. **Run local preview server**:
   ```bash
   python3 -m http.server 8000 --directory dist
   ```
