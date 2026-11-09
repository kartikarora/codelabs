# Brand Components & Compositions (v2.0.0)

This guide details the usage, markup structure, and styling details for components and the **8 signature compositions** in the `@kartikarora` design system.

---

## 🏛️ The 8 Signature Brand Compositions

### 1. Engineering Spec (`.spec-grid`, `.spec-card`)
Used for displaying technical library specifications, platform architectures, and binary parameters.

### 2. Diff & Architecture Compare (`.diff-grid`, `.diff-pane`)
Shows side-by-side migration patterns (e.g. Imperative Views vs. Declarative Jetpack Compose).

### 3. Milestone Stream (`.timeline-stream`, `.timeline-item`)
Vertical stream for career, speaking, and project milestones with monospace dates and signal nodes.

### 4. Talk & Publication Index (`.index-table`)
Dense, tabular listing of conference talks, slidedecks, video recordings, and technical articles.

### 5. Bento Precision Grid (`.bento-grid`, `.bento-tile`)
Asymmetrical 12-column layout (e.g., 8-column lead card + 4-column telemetry tile) for showcasing deep technical projects with real screenshots.

### 6. Editorial Statement Lead (`.editorial-lead`)
An authoritative section opener with a prominent statement (`--text-display-s`) set before a long-form article or project case study.

### 7. Telemetry & Metric Row (`.telemetry-grid`, `.telemetry-metric`)
Tabular, high-impact numbers representing real metrics (e.g., 150K+ users, 45+ talks). Never invented or ungrounded claims.

### 8. Platform Switcher (`.interaction-canvas`)
Segmented canvas allowing users to inspect code samples across Android, Compose Multiplatform, and Web targets.

---

## 🔘 Buttons & CTA Controls

- **Primary CTA (`.btn .btn-primary`):** Solid Signal Cobalt background, white text. Used for main action.
- **Secondary CTA (`.btn .btn-secondary`):** Elevated Paper-Alt background with Hairline Rule.
- **Outline CTA (`.btn .btn-outline`):** Transparent background with Signal border.
- **Ghost CTA (`.btn .btn-ghost`):** Zero-border transparent action for subtle navigation.

*Mandate:* Never use `transition: all`. Button hover effects use micro transitions on `transform` and `background-color`.

---

## 📑 Accessible Tabs (`.tabs` & `.tab-item`)

Segmented controls powered by `kartikarora.js` featuring:
- Full ARIA compliance (`role="tablist"`, `role="tab"`, `aria-selected`).
- Arrow-key navigation (`ArrowRight`, `ArrowLeft`, `Home`, `End`).
- Smooth hardware-accelerated sliding indicator.
- Custom `tabChanged` event listener.
