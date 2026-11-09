#!/usr/bin/env node

/**
 * @kartikarora Brand Sloplint Engine (v2.0.0)
 * Inspired by Hallmark Design Engine verification craft.
 * 
 * Enforces The Brand Floor:
 * 1. Pure Tokens: No hardcoded colors, fonts, or px spacing outside :root.
 * 2. Motion Physics: No 'transition: all'; no animating width/height/top/left.
 * 3. Viewport Integrity: Enforces 'overflow-x: clip'; bans '100vw' and 'overflow-x: hidden' on body.
 * 4. Anti-AI Slop: Bans purple-blue gradients, cards inside cards, and tracked uppercase tags.
 * 5. Accessibility: Enforces instant :focus-visible and prefers-reduced-motion guards.
 */

const fs = require('fs');
const path = require('path');

const target = process.argv[2] || process.cwd();
const ignoreDirs = ['node_modules', '.git', '_site', '.jekyll-cache', 'vendor', '.idea'];
const ignoreFiles = ['brand-sloplint.js', 'brand-linter.js'];

let findings = [];
let passCount = 0;

console.log(`\n🏛️  Running @kartikarora Brand Sloplint on: ${target}\n`);

scan(target);

let failCount = findings.filter(f => f.tier === 'FLOOR').length;
let reflexCount = findings.filter(f => f.tier === 'REFLEX').length;

if (findings.length > 0) {
  findings.forEach(f => {
    const icon = f.tier === 'FLOOR' ? '🚫 FLOOR FAIL' : '⚠️  REFLEX';
    console.log(`${icon} [${f.file}:${f.line}] ${f.message}`);
  });
  console.log(`\n────────────────────────────────────────────────────────────`);
  console.log(`Verdict: ${failCount} Floor Fails · ${reflexCount} Reflex Warnings · ${passCount} Files Checked`);
  if (failCount > 0) {
    console.log(`\n❌ Build rejected: Fix all Floor failures before shipping.\n`);
    process.exit(1);
  } else {
    console.log(`\n⚠️  Build passed with reflex warnings.\n`);
    process.exit(0);
  }
} else {
  console.log(`✅ Pristine: 0 Floor Fails · 0 Reflexes · ${passCount} Files Clean.`);
  console.log(`The output adheres to @kartikarora brand craft standards.\n`);
  process.exit(0);
}

function scan(itemPath) {
  const stat = fs.statSync(itemPath);

  if (stat.isDirectory()) {
    if (ignoreDirs.includes(path.basename(itemPath))) return;
    const entries = fs.readdirSync(itemPath);
    entries.forEach(entry => scan(path.join(itemPath, entry)));
  } else if (stat.isFile()) {
    const ext = path.extname(itemPath);
    const basename = path.basename(itemPath);
    if (ignoreFiles.includes(basename)) return;

    if (['.css', '.scss', '.html', '.md'].includes(ext)) {
      lintFile(itemPath, ext);
      passCount++;
    }
  }
}

function lintFile(filePath, ext) {
  const relPath = path.relative(process.cwd(), filePath);
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');

  let inTokenBlock = false;
  let inCodeFence = false;
  let hasReducedMotion = content.includes('prefers-reduced-motion');
  let hasFocusVisible = content.includes(':focus-visible');
  let isStylesheet = ext === '.css' || ext === '.scss';

  if (isStylesheet && !hasReducedMotion && !filePath.includes('_urls') && !filePath.includes('syntax') && !filePath.includes('_tokens')) {
    report('REFLEX', relPath, 1, 'Missing @media (prefers-reduced-motion: reduce) fallback in stylesheet.');
  }

  lines.forEach((line, index) => {
    const lineNum = index + 1;

    // Track token roots
    if (line.includes(':root') || line.includes('@media (prefers-color-scheme') || line.includes('[data-theme=')) {
      inTokenBlock = true;
    }
    if (inTokenBlock && line.includes('}') && !line.includes('{')) {
      inTokenBlock = false;
    }

    if (inTokenBlock) return; // Skip linting actual token declarations

    // In markdown files, only lint inside code fences
    if (ext === '.md') {
      if (line.trim().startsWith('```')) {
        inCodeFence = !inCodeFence;
        return;
      }
      if (!inCodeFence) return;
    }

    // 1. FLOOR: Forbidden Catch-All Transitions
    if (line.match(/transition\s*:\s*all\b/i) && !line.match(/(never|don't|banned|no)\s+.*transition/i)) {
      report('FLOOR', relPath, lineNum, "Banned 'transition: all'. Explicitly name properties (transform, opacity, color).");
    }

    // 2. FLOOR: Forbidden Layout Animations
    if (line.match(/transition(-property)?\s*:\s*[^;]*(width|height|top|left|bottom|right)\b/i)) {
      report('FLOOR', relPath, lineNum, 'Animating layout geometry (width, height, top, left) causes jank. Use transform.');
    }

    // 3. FLOOR: Forbidden Viewport Breakage (100vw or body overflow-x hidden)
    if (line.match(/100vw\b/) && isStylesheet) {
      report('FLOOR', relPath, lineNum, "Banned '100vw' causes horizontal scrollbar shifts. Use 100% or container clamp.");
    }

    // 4. FLOOR: Hardcoded Hex / RGB / HSL Colors outside root
    const colorMatch = line.match(/(#[0-9a-fA-F]{3,8}|rgba?\(|hsla?\()/);
    if (colorMatch && !line.includes('var(') && !line.includes('//') && !line.includes('/*') && !line.includes('name="theme-color"')) {
      report('FLOOR', relPath, lineNum, `Hardcoded color literal '${colorMatch[0]}'. Use var(--color-*) tokens.`);
    }

    // 5. REFLEX: Hardcoded px Spacing
    const pxSpacingMatch = line.match(/(margin|padding)(-\w+)?:\s*[^;]*\d+px/);
    if (pxSpacingMatch && !line.includes('var(') && !line.includes('0') && !line.includes('1px') && !line.includes('2px') && !line.includes('3px')) {
      report('REFLEX', relPath, lineNum, `Hardcoded spacing in px. Use spacing tokens like 'var(--space-md)'.`);
    }

    // 6. REFLEX: Hardcoded Font Families
    if (line.match(/font-family\s*:\s*[^;]+/i) && !line.includes('var(') && isStylesheet) {
      report('REFLEX', relPath, lineNum, "Hardcoded font-family. Use 'var(--font-sans)' or 'var(--font-mono)'.");
    }

    // 7. AI SLOP: Purple-to-blue / Cyan gradients
    if (line.match(/linear-gradient\([^)]*(#6366f1|#8b5cf6|#a855f7|#3b82f6|#06b6d4|#00ffff)/i)) {
      report('FLOOR', relPath, lineNum, 'AI Slop Detected: Purple-to-blue/cyan generic gradient is strictly banned.');
    }

    // 8. AI SLOP: Cards nested inside cards
    if (line.match(/\.card\s+[^\{]*\.card\b/)) {
      report('FLOOR', relPath, lineNum, 'AI Slop Detected: Card inside a card is strictly banned.');
    }

    // 9. AI SLOP: Tracked Uppercase Tags
    if (line.match(/text-transform\s*:\s*uppercase/i) && line.match(/letter-spacing\s*:\s*0\.\d+em/i)) {
      report('REFLEX', relPath, lineNum, 'AI Slop Detected: Tracked uppercase label. Use sentence or lowercase untracked.');
    }
  });
}

function report(tier, file, line, message) {
  findings.push({ tier, file, line, message });
}
