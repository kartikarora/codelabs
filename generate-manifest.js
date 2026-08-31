const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, 'dist');
const codelabsDir = path.join(__dirname, 'codelabs');
const output = [];

// 1. Clean and create dist directory
if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true, force: true });
}
fs.mkdirSync(distDir, { recursive: true });

// 2. Process codelabs and collect metadata
if (fs.existsSync(codelabsDir)) {
  const dirs = fs.readdirSync(codelabsDir);
  dirs.forEach(dir => {
    const codelabPath = path.join(codelabsDir, dir);
    if (!fs.statSync(codelabPath).isDirectory()) return;

    const jsonPath = path.join(codelabPath, 'codelab.json');
    if (fs.existsSync(jsonPath)) {
      const meta = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
      
      // Filter out draft or unpublished codelabs from manifest
      const statusList = Array.isArray(meta.status)
        ? meta.status.map(s => String(s).toLowerCase())
        : (meta.status ? [String(meta.status).toLowerCase()] : []);

      if (statusList.includes('draft')) {
        console.log(`Skipping draft codelab from manifest: ${dir}`);
        return;
      }

      // Determine the image path
      let image = null;
      if (meta.image) {
        image = `./${dir}/${meta.image}`;
      } else {
        // Fallback: Find the first jpeg image in the img directory
        const imgDir = path.join(codelabPath, 'img');
        if (fs.existsSync(imgDir)) {
          const images = fs.readdirSync(imgDir);
          const jpeg = images.find(f => f.toLowerCase().endsWith('.jpeg') || f.toLowerCase().endsWith('.jpg'));
          if (jpeg) {
            image = `./${dir}/img/${jpeg}`;
          }
        }
      }

      // Ensure we have the necessary fields for the card
      output.push({
        id: meta.id,
        title: meta.title,
        summary: meta.summary,
        updated: meta.updated,
        duration: meta.duration,
        category: meta.category || [],
        tags: meta.tags || [],
        url: `./${dir}/index.html`,
        image: image
      });
    }
  });
}

// 3. Write codelabs.json to dist
fs.writeFileSync(path.join(distDir, 'codelabs.json'), JSON.stringify(output, null, 2));
console.log('Generated dist/codelabs.json');

// 4. Copy index.html to dist
fs.copyFileSync(path.join(__dirname, 'index.html'), path.join(distDir, 'index.html'));
console.log('Copied index.html to dist');

// 5. Helper function to copy directories recursively
function copyRecursiveSync(src, dest) {
  const stats = fs.statSync(src);
  if (stats.isDirectory()) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    fs.readdirSync(src).forEach(child => {
      if (child === '.DS_Store' || child === '.git') return;
      copyRecursiveSync(path.join(src, child), path.join(dest, child));
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

// 6. Copy each codelab directory directly to dist root and inject draft preview banners
if (fs.existsSync(codelabsDir)) {
  const dirs = fs.readdirSync(codelabsDir);
  dirs.forEach(dir => {
    const codelabPath = path.join(codelabsDir, dir);
    if (fs.statSync(codelabPath).isDirectory()) {
      copyRecursiveSync(codelabPath, path.join(distDir, dir));
      console.log(`Copied ${dir}/ to dist/${dir}`);

      // Check if this codelab is a draft
      const jsonPath = path.join(codelabPath, 'codelab.json');
      if (fs.existsSync(jsonPath)) {
        const meta = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
        const statusList = Array.isArray(meta.status)
          ? meta.status.map(s => String(s).toLowerCase())
          : (meta.status ? [String(meta.status).toLowerCase()] : []);

        if (statusList.includes('draft')) {
          const floatingBadgeHtml = `
  <!-- Floating Draft Preview Watermark -->
  <aside id="draft-floating-badge" style="position: fixed; bottom: 24px; right: 24px; z-index: 999999; display: flex; align-items: center; gap: 10px; padding: 8px 16px; background: rgba(22, 27, 34, 0.92); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border: 1px solid #d29922; border-radius: 9999px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5); pointer-events: auto; user-select: none;">
    <span style="display: inline-flex; align-items: center; justify-content: center; padding: 2px 8px; border-radius: 9999px; background: rgba(210, 153, 34, 0.2); border: 1px solid #d29922; color: #d29922; font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">Draft</span>
    <span style="font-family: 'Space Grotesk', -apple-system, sans-serif; font-size: 12px; font-weight: 600; color: #e6edf3;">Unpublished Preview</span>
    <span style="font-family: 'Space Grotesk', -apple-system, sans-serif; font-size: 11px; color: #8b949e;">• Internal Review</span>
  </aside>`;

          // 1. Create physical /preview directory with full assets to prevent 404 on refresh
          const previewDir = path.join(distDir, dir, 'preview');
          copyRecursiveSync(codelabPath, previewDir);
          console.log(`Created physical preview directory at dist/${dir}/preview`);

          // Inject floating watermark badge into dist/${dir}/preview/index.html
          const previewHtmlPath = path.join(previewDir, 'index.html');
          if (fs.existsSync(previewHtmlPath)) {
            let prevHtml = fs.readFileSync(previewHtmlPath, 'utf8');
            if (prevHtml.includes('</body>')) {
              prevHtml = prevHtml.replace('</body>', floatingBadgeHtml + '\n</body>');
            } else {
              prevHtml += floatingBadgeHtml;
            }
            fs.writeFileSync(previewHtmlPath, prevHtml, 'utf8');
          }

          // 2. Add client-side redirect and floating badge in dist/${dir}/index.html
          const rootHtmlPath = path.join(distDir, dir, 'index.html');
          if (fs.existsSync(rootHtmlPath)) {
            const redirectScript = `
  <!-- Draft Auto-Route to /preview/ -->
  <script>
    (function() {
      try {
        if (!window.location.pathname.includes('/preview')) {
          var clean = window.location.pathname.replace(/\\/index\\.html$/, '').replace(/\\/+$/, '');
          window.location.replace(clean + '/preview/' + window.location.search + window.location.hash);
        }
      } catch(e) {}
    })();
  </script>`;
            let rootHtml = fs.readFileSync(rootHtmlPath, 'utf8');
            if (rootHtml.includes('<head>')) {
              rootHtml = rootHtml.replace('<head>', '<head>\n' + redirectScript);
            } else {
              rootHtml = redirectScript + '\n' + rootHtml;
            }
            if (rootHtml.includes('</body>')) {
              rootHtml = rootHtml.replace('</body>', floatingBadgeHtml + '\n</body>');
            }
            fs.writeFileSync(rootHtmlPath, rootHtml, 'utf8');
          }
        }
      }
    }
  });
}
