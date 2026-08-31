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
          const draftRightColumnHtml = `
  <!-- Draft Preview Right Sidebar Column (Brand Design System) -->
  <aside id="draft-sidebar-column" style="
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    width: 280px;
    height: 100vh;
    box-sizing: border-box;
    background: var(--bg-alt, #161b22);
    border-left: 1px solid var(--border, #30363d);
    z-index: 9999;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    font-family: var(--font-sans, 'Space Grotesk', -apple-system, sans-serif);
    color: var(--primary, #e6edf3);
  ">
    <!-- Header -->
    <div style="padding: 20px 18px; border-bottom: 1px solid var(--border, #30363d);">
      <div style="display: inline-flex; align-items: center; gap: 6px; padding: 3px 8px; border-radius: 4px; background: var(--glow, rgba(0, 153, 255, 0.15)); border: 1px solid var(--accent, #0099ff); color: var(--accent, #0099ff); font-family: var(--font-mono, 'JetBrains Mono', monospace); font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 10px;">
        <span>Draft Preview</span>
      </div>
      <h3 style="margin: 0 0 6px 0; font-size: 15px; font-weight: 700; color: var(--primary, #e6edf3); line-height: 1.3;">Gemini in Android Studio</h3>
      <p style="margin: 0; font-size: 12px; color: var(--secondary, #8b949e); line-height: 1.4;">Unpublished technical workshop currently under internal review.</p>
    </div>

    <!-- Metadata Sections -->
    <div style="padding: 18px; display: flex; flex-direction: column; gap: 14px; flex: 1;">
      <!-- Card: Review Status -->
      <div style="background: var(--card, #161b22); border: 1px solid var(--border, #30363d); border-radius: 8px; padding: 12px;">
        <div style="font-family: var(--font-mono, 'JetBrains Mono', monospace); font-size: 10px; font-weight: 600; color: var(--secondary, #8b949e); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">Status</div>
        <div style="display: flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 600; color: var(--accent, #0099ff);">
          <span style="display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: var(--accent, #0099ff);"></span>
          <span>Draft (Unpublished)</span>
        </div>
        <div style="font-size: 11px; color: var(--secondary, #8b949e); margin-top: 4px;">Not listed in public directory</div>
      </div>

      <!-- Card: Workshop Specs -->
      <div style="background: var(--card, #161b22); border: 1px solid var(--border, #30363d); border-radius: 8px; padding: 12px; font-size: 12px;">
        <div style="font-family: var(--font-mono, 'JetBrains Mono', monospace); font-size: 10px; font-weight: 600; color: var(--secondary, #8b949e); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px;">Workshop Specs</div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
          <span style="color: var(--secondary, #8b949e);">App:</span>
          <span style="color: var(--accent, #0099ff); font-family: var(--font-mono, 'JetBrains Mono', monospace); font-size: 11px;">ICanHazStream</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
          <span style="color: var(--secondary, #8b949e);">Kotlin:</span>
          <span style="color: var(--primary, #e6edf3); font-family: var(--font-mono, 'JetBrains Mono', monospace); font-size: 11px;">2.4.10</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
          <span style="color: var(--secondary, #8b949e);">Studio:</span>
          <span style="color: var(--primary, #e6edf3); font-family: var(--font-mono, 'JetBrains Mono', monospace); font-size: 11px;">Quail / Canary</span>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <span style="color: var(--secondary, #8b949e);">Steps:</span>
          <span style="color: var(--primary, #e6edf3); font-family: var(--font-mono, 'JetBrains Mono', monospace); font-size: 11px;">17 (3 Acts)</span>
        </div>
      </div>

      <!-- Card: Review Guidance -->
      <div style="background: var(--card, #161b22); border: 1px solid var(--border, #30363d); border-radius: 8px; padding: 12px;">
        <div style="font-family: var(--font-mono, 'JetBrains Mono', monospace); font-size: 10px; font-weight: 600; color: var(--secondary, #8b949e); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">Review Notice</div>
        <p style="margin: 0; font-size: 11px; color: var(--secondary, #8b949e); line-height: 1.4;">
          This tutorial is in private preview. If you encounter missing dependencies or API changes, please report them.
        </p>
      </div>
    </div>

    <!-- Footer Action -->
    <div style="padding: 16px 18px; border-top: 1px solid var(--border, #30363d);">
      <a href="mailto:hello@kartikarora.me?subject=Feedback:%20Gemini%20in%20Android%20Studio%20Workshop" style="display: flex; align-items: center; justify-content: center; width: 100%; box-sizing: border-box; padding: 10px 14px; background: var(--accent, #0099ff); color: var(--bg, #0d1117); font-family: var(--font-sans, 'Space Grotesk', sans-serif); font-size: 12px; font-weight: 700; text-decoration: none; border-radius: 6px; text-align: center;">
        Send Feedback
      </a>
    </div>
  </aside>

  <style>
    @media (min-width: 1200px) {
      body {
        margin-right: 280px !important;
      }
    }
    @media (max-width: 1199px) {
      #draft-sidebar-column {
        display: none !important;
      }
    }
  </style>`;

          // 1. Create physical /preview directory with full assets to prevent 404 on refresh
          const previewDir = path.join(distDir, dir, 'preview');
          copyRecursiveSync(codelabPath, previewDir);
          console.log(`Created physical preview directory at dist/${dir}/preview`);

          // Inject right sidebar into dist/${dir}/preview/index.html
          const previewHtmlPath = path.join(previewDir, 'index.html');
          if (fs.existsSync(previewHtmlPath)) {
            let prevHtml = fs.readFileSync(previewHtmlPath, 'utf8');
            if (prevHtml.includes('</body>')) {
              prevHtml = prevHtml.replace('</body>', draftRightColumnHtml + '\n</body>');
            } else {
              prevHtml += draftRightColumnHtml;
            }
            fs.writeFileSync(previewHtmlPath, prevHtml, 'utf8');
          }

          // 2. Add client-side redirect and right sidebar in dist/${dir}/index.html
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
              rootHtml = rootHtml.replace('</body>', draftRightColumnHtml + '\n</body>');
            }
            fs.writeFileSync(rootHtmlPath, rootHtml, 'utf8');
          }
        }
      }
    }
  });
}
