# @kartikarora Brand Migration Guide: v1.8.0 &rarr; v2.0.0

This guide provides step-by-step instructions and automated tooling for migrating consumer applications, websites, and native themes from **v1.8.0** to **v2.0.0** of the `@kartikarora` design system without breaking layouts, corrupting custom CSS, or losing backward compatibility.

---

## 🌟 What's New in v2.0.0

1. **Option 03 Minimalist Artifact Studio (Dark-First Experience):**
   - Signature pitch-black canvas (`#000000`) with bone-white text (`#F0F4F8`) and electric indigo signal accents (`#818CF8`).
   - Retains full light-mode fidelity (`#FFFFFF` paper canvas with `#0066CC` Precision Cobalt).
2. **Semantic Token Names:**
   - Standardized CSS tokens (`--color-paper`, `--color-ink`, `--color-signal`, `--color-rule`, `--radius-md`).
   - Legacy short aliases (`--bg`, `--primary`, `--accent`, `--border`) remain fully supported in `:root` for backward compatibility.
3. **Typography Standard:**
   - **Albert Sans** for Display & Body.
   - **JetBrains Mono** with `font-variant-numeric: tabular-nums` for code blocks, CLI snippets, and telemetry data.
   - `-0.03em` tracking on display hero headlines.
4. **Native Multiplatform Parity:**
   - **Jetpack Compose / Compose Multiplatform:** Material 3 semantic color mapping in [`Color.kt`](../../kartikarora-compose-theme/references/Color.kt).
   - **Apple SwiftUI:** Native semantic tokens with dynamic `UIColor`/`NSColor` light/dark support in [`Color.swift`](../../kartikarora-swiftui/references/Color.swift).
5. **Hallmark-Grade Floor Standards:**
   - `overflow-x: clip` (never `hidden`).
   - Instant `:focus-visible` outlines.
   - Zero catch-all transitions (`transition: all` is prohibited; use specific properties or `var(--transition)`).

---

## 🔄 Token Mapping Reference

| 1.8.0 Token / Property | 2.0.0 Semantic Token | Light Mode Hex | Dark Mode (Studio) Hex | Notes |
| :--- | :--- | :--- | :--- | :--- |
| `var(--bg)` | `var(--color-paper)` | `#FFFFFF` | `#000000` | Canvas base background |
| `var(--bg-alt)` | `var(--color-paper-alt)` | `#F6F8FA` | `#0A0A0A` | Elevated surfaces / wells |
| `var(--card)` | `var(--color-card)` | `#FFFFFF` | `#0A0A0A` | Card backgrounds |
| `var(--primary)` | `var(--color-ink)` | `#0D1117` | `#F0F4F8` | Primary display & body text |
| `var(--secondary)` | `var(--color-ink-muted)` | `#57606A` | `#8C9BA5` | Secondary text & subtitles |
| `var(--tertiary)` / `var(--muted)` | `var(--color-ink-faint)` | `#8D96A0` | `#8C9BA5` | Subtle / tertiary text |
| `var(--accent)` | `var(--color-signal)` | `#0066CC` | `#818CF8` | Interactive signal accent |
| `var(--accent-hover)` | `var(--color-signal-hover)` | `#0052A3` | `#A5B4FC` | Hover / pressed state |
| `var(--border)` | `var(--color-rule)` | `rgba(31,35,40,0.12)` | `rgba(255,255,255,0.08)` | Hairline dividers |
| `var(--border-radius)` | `var(--radius-md)` | `12px` | `12px` | Standard corner radius |
| `var(--border-radius-sm)` | `var(--radius-sm)` | `6px` | `6px` | Tag / input radius |

---

## 🤖 Automated Migration Helper

The design system includes an automated migration helper script (`scripts/migrate-1.8-to-2.0.js`) that performs safe, regex-guided AST transforms with word-boundary protection.

### 1. Preview Changes (Dry Run)
Before modifying any files, run a dry-run analysis to preview planned upgrades:
```bash
make migrate ARGS="--dry-run"
# or
node scripts/migrate-1.8-to-2.0.js --dry-run
```

### 2. Apply Migration with Automatic Backup
Run the migration script on your repository or a specific directory:
```bash
make migrate
# or target a specific subfolder:
node scripts/migrate-1.8-to-2.0.js ./src
```
> **Safety Guarantee:** A timestamped backup is automatically created at `.migration-backups/backup-<timestamp>/` containing original files and a cryptographic `manifest.json`.

### 3. Rollback (Instant Revert)
If any layout or custom rule requires manual inspection, restore your previous state instantly:
```bash
make migrate ARGS="--rollback"
# or
node scripts/migrate-1.8-to-2.0.js --rollback
```

### 4. CI/CD Compliance Check
To ensure no 1.8.0 relics or deprecated CDN URLs exist in pull requests:
```bash
make migrate-check
# or
node scripts/migrate-1.8-to-2.0.js --check
```

---

## 📱 Native Kotlin Compose Theme Migration

In Jetpack Compose or Compose Multiplatform codebases:
```kotlin
// ❌ 1.8.0 Legacy Tokens
val bg = KartikAroraColors.LightBackground
val accent = KartikAroraColors.LightAccent

// ✅ 2.0.0 Semantic Tokens
val bg = KartikAroraColors.LightPaper
val signal = KartikAroraColors.LightSignal
```
*(Note: Legacy aliases like `LightBackground` and `LightAccent` are preserved in `Color.kt` to prevent compilation errors).*

---

## 🍏 Native SwiftUI Integration

To consume brand tokens in iOS and macOS projects:
1. Install the SwiftUI skill:
   ```bash
   npx skills install https://distribute.kartikarora.me/ai/kartikarora-swiftui.skill
   ```
2. Apply adaptive brand styling:
   ```swift
   import SwiftUI

   struct MyView: View {
       var body: some View {
           VStack {
               Text("Option 03 Studio")
                   .font(.brandTitle)
                   .foregroundColor(Color.brand.ink)
               BrandButton("Action", style: .primary) {
                   // action
               }
           }
           .brandStudioTheme() // or .brandTheme() for light/dark adaptive
       }
   }
   ```
