#!/usr/bin/env node

/**
 * @kartikarora Brand Linter
 * Scans directories for CSS/HTML files to check for brand token violations.
 * 
 * Rules checked:
 * 1. No hardcoded hex/rgb/hsl colors (except in design token definitions).
 * 2. No hardcoded spacing properties in px (should use var(--space-*)).
 * 3. No hardcoded fonts (should use var(--font-*)).
 * 4. No overrides of native brand class rules (e.g. custom button declarations).
 */

const fs = require('fs');
const path = require('path');

const targetDir = process.argv[2] || process.cwd();
const ignoreDirs = ['node_modules', '.git', '_site', '.jekyll-cache', 'vendor'];
const ignoreFiles = ['brand-linter.js', 'kartikarora.css'];

let exitCode = 0;

console.log(`🔍 Starting brand linter scanning: ${targetDir}`);
scanDir(targetDir);

if (exitCode === 0) {
  console.log('\n✅ Linter completed: No brand system violations found.');
} else {
  console.log('\n❌ Linter failed: Fix the token violations above.');
}
process.exit(exitCode);

function scanDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      if (ignoreDirs.includes(file)) continue;
      scanDir(fullPath);
    } else if (stat.isFile()) {
      if (ignoreFiles.includes(file)) continue;
      const ext = path.extname(file);
      if (ext === '.css' || ext === '.scss' || ext === '.html') {
        lintFile(fullPath);
      }
    }
  }
}

function lintFile(filePath) {
  const relativePath = path.relative(process.cwd(), filePath);
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');

  let inTokenBlock = false;

  lines.forEach((line, index) => {
    const lineNum = index + 1;

    // Track if we are inside variable definition blocks to allow static declarations
    if (line.includes(':root') || line.includes('@media (prefers-color-scheme')) {
      inTokenBlock = true;
    }
    if (inTokenBlock && line.includes('}')) {
      inTokenBlock = false;
    }

    if (inTokenBlock) return; // Skip lint rules on actual token definitions

    // Rule 1: No hardcoded colors (hex, rgb, hsl)
    const colorMatch = line.match(/(#[0-9a-fA-F]{3,8}|rgba?\(|hsla?\()/);
    if (colorMatch && !line.includes('var(')) {
      report(relativePath, lineNum, `Hardcoded color '${colorMatch[0]}' found. Use CSS variables instead.`);
    }

    // Rule 2: Spacing parameters (px values in margins/paddings)
    const spacingMatch = line.match(/(margin|padding)(-\w+)?:\s*[^;]*\d+px/);
    if (spacingMatch && !line.includes('var(') && !line.includes(' 0') && !line.includes(' 1px')) {
      report(relativePath, lineNum, `Hardcoded spacing in px found. Use spacing tokens like 'var(--space-md)' instead.`);
    }

    // Rule 3: Hardcoded Fonts
    const fontMatch = line.match(/font-family:\s*[^;]+/);
    if (fontMatch && !line.includes('var(')) {
      report(relativePath, lineNum, `Hardcoded font declaration found. Use 'var(--font-sans)' or 'var(--font-mono)'.`);
    }

    // Rule 4: Custom Component Overrides
    if (line.match(/^\s*\.btn(-primary|-secondary|-outline)?\s*\{/)) {
      report(relativePath, lineNum, `Custom button class definition detected. Refrain from overriding brand button styles.`);
    }
    if (line.match(/^\s*\.tabs\s*\{/)) {
      report(relativePath, lineNum, `Custom tabs class definition detected. Refrain from overriding brand tabs layout.`);
    }
  });
}

function report(file, line, message) {
  console.error(`⚠️  [${file}:${line}]: ${message}`);
  exitCode = 1;
}
