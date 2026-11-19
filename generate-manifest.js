const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, 'dist');
const codelabsDir = path.join(__dirname, 'codelabs');
const sourceDir = path.join(__dirname, 'source');
const output = [];
const codelabsDetail = [];

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
      
      // Filter out draft or unpublished codelabs from public feeds
      const statusList = Array.isArray(meta.status)
        ? meta.status.map(s => String(s).toLowerCase())
        : (meta.status ? [String(meta.status).toLowerCase()] : []);

      if (statusList.includes('draft')) {
        console.log(`Skipping draft codelab from public index/manifest: ${dir}`);
        return;
      }

      // Determine the image path
      let image = null;
      if (meta.image) {
        image = /^https?:\/\//i.test(meta.image) ? meta.image : `./${dir}/${meta.image}`;
      } else {
        // Fallback: Find the first jpeg/png image in img or images directory
        const imgDir = path.join(codelabPath, 'img');
        const imagesDir = path.join(codelabPath, 'images');
        if (fs.existsSync(imgDir)) {
          const images = fs.readdirSync(imgDir);
          const pic = images.find(f => /\.(jpe?g|png|svg)$/i.test(f));
          if (pic) image = `./${dir}/img/${pic}`;
        } else if (fs.existsSync(imagesDir)) {
          const images = fs.readdirSync(imagesDir);
          const pic = images.find(f => /\.(jpe?g|png|svg)$/i.test(f));
          if (pic) image = `./${dir}/images/${pic}`;
        }
      }

      const itemData = {
        id: meta.id || dir,
        title: meta.title || dir,
        summary: meta.summary || '',
        updated: meta.updated || new Date().toISOString(),
        duration: meta.duration || 0,
        category: meta.category || [],
        tags: meta.tags || [],
        url: `./${dir}/index.html`,
        canonicalUrl: `https://codelabs.kartikarora.me/${dir}/`,
        image: image,
        authors: meta.authors || 'Kartik Arora'
      };

      output.push(itemData);

      // Extract steps from source markdown if available
      const sourceMdPath = path.join(sourceDir, dir, 'codelab.md');
      let steps = [];
      if (fs.existsSync(sourceMdPath)) {
        const mdContent = fs.readFileSync(sourceMdPath, 'utf8');
        const stepMatches = mdContent.match(/^##\s+(.+)$/gm);
        if (stepMatches) {
          steps = stepMatches.map(s => s.replace(/^##\s+/, '').trim());
        }
      }

      codelabsDetail.push({
        ...itemData,
        steps: steps
      });
    }
  });
}

// 3. Write codelabs.json to dist and root
fs.writeFileSync(path.join(distDir, 'codelabs.json'), JSON.stringify(output, null, 2));
fs.writeFileSync(path.join(__dirname, 'codelabs.json'), JSON.stringify(output, null, 2));
console.log('Generated dist/codelabs.json and root codelabs.json');

// 4. Generate dynamic sitemap.xml in root and dist
const today = new Date().toISOString().split('T')[0];
let sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://codelabs.kartikarora.me/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>`;

output.forEach(item => {
  const itemDate = item.updated ? item.updated.split('T')[0] : today;
  sitemapXml += `
  <url>
    <loc>${item.canonicalUrl}</loc>
    <lastmod>${itemDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`;
});

sitemapXml += `
</urlset>
`;

fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemapXml);
fs.writeFileSync(path.join(__dirname, 'sitemap.xml'), sitemapXml);
console.log('Generated sitemap.xml');

// 5. Generate dynamic llms.txt (GEO standard)
let llmsTxt = `# Kartik Arora Codelabs

> Interactive technical tutorials, hands-on workshops, and step-by-step guides for mastering modern software engineering, Android development, and generative AI agents.

Welcome to the Codelabs portal by Kartik Arora ([codelabs.kartikarora.me](https://codelabs.kartikarora.me)). This site provides structured, step-by-step learning modules designed for developers, engineers, and AI practitioners.

## Author & Instructor
- **Author**: Kartik Arora
- **Website**: https://kartikarora.me
- **GitHub**: https://github.com/kartikarora
- **LinkedIn**: https://linkedin.com/in/arorakartik
- **Medium**: https://medium.com/@kartikarora

## Available Codelabs & Workshops
`;

// Group codelabs by primary category or list all
output.forEach(cl => {
  const durationStr = cl.duration ? ` (Duration: ~${cl.duration} mins)` : '';
  const tagsStr = (cl.tags && cl.tags.length > 0) ? ` | Tags: ${cl.tags.join(', ')}` : '';
  const mdUrl = `https://codelabs.kartikarora.me/${cl.id}/index.md`;
  llmsTxt += `\n- [${cl.title}](${cl.canonicalUrl}) ([Markdown](${mdUrl})): ${cl.summary}${durationStr}${tagsStr}`;
});

llmsTxt += `

## Machine-Readable Feeds & Full Digest
- [Codelabs JSON Feed](https://codelabs.kartikarora.me/codelabs.json): Complete catalog metadata in JSON format.
- [Extended Full Digest (llms-full.txt)](https://codelabs.kartikarora.me/llms-full.txt): Detailed step-by-step curriculum and outline for all codelabs.
- [Sitemap](https://codelabs.kartikarora.me/sitemap.xml): XML sitemap for search engines.
`;

fs.writeFileSync(path.join(distDir, 'llms.txt'), llmsTxt);
fs.writeFileSync(path.join(__dirname, 'llms.txt'), llmsTxt);
console.log('Generated llms.txt');

// 6. Generate dynamic llms-full.txt (Extended GEO Curriculum)
let llmsFullTxt = `# Kartik Arora Codelabs — Full Curriculum Digest

This document provides a comprehensive, full-text reference of all workshops and codelabs hosted at https://codelabs.kartikarora.me for AI models, agents, and answer engines.
`;

codelabsDetail.forEach((cl, idx) => {
  llmsFullTxt += `\n---\n\n## ${idx + 1}. ${cl.title}\n`;
  llmsFullTxt += `- **URL**: ${cl.canonicalUrl}\n`;
  llmsFullTxt += `- **Markdown Source**: https://codelabs.kartikarora.me/${cl.id}/index.md\n`;
  if (cl.category && cl.category.length > 0) {
    llmsFullTxt += `- **Categories**: ${cl.category.join(', ')}\n`;
  }
  if (cl.duration) {
    llmsFullTxt += `- **Estimated Duration**: ${cl.duration} minutes\n`;
  }
  llmsFullTxt += `- **Author**: ${cl.authors}\n`;
  llmsFullTxt += `- **Summary**: ${cl.summary}\n`;
  if (cl.steps && cl.steps.length > 0) {
    llmsFullTxt += `- **Steps** (${cl.steps.length}):\n`;
    cl.steps.forEach((step, sIdx) => {
      llmsFullTxt += `  ${sIdx + 1}. ${step}\n`;
    });
  }
});

llmsFullTxt += `
---

## About the Author
Kartik Arora is a Software Engineer and Google Developer Expert (GDE) for Android. He creates hands-on technical workshops, codelabs, and developer resources.
- Website: https://kartikarora.me
- GitHub: https://github.com/kartikarora
- LinkedIn: https://linkedin.com/in/arorakartik
- Medium: https://medium.com/@kartikarora
`;

fs.writeFileSync(path.join(distDir, 'llms-full.txt'), llmsFullTxt);
fs.writeFileSync(path.join(__dirname, 'llms-full.txt'), llmsFullTxt);
console.log('Generated llms-full.txt');

// 7. Dynamically update index.html with up-to-date JSON-LD and noscript fallback
const rootHtmlPath = path.join(__dirname, 'index.html');
if (fs.existsSync(rootHtmlPath)) {
  let html = fs.readFileSync(rootHtmlPath, 'utf8');

  // Generate structured data ItemList
  const itemListElements = output.map((cl, idx) => ({
    "@type": "ListItem",
    "position": idx + 1,
    "item": {
      "@type": "LearningResource",
      "name": cl.title,
      "description": cl.summary,
      "url": cl.canonicalUrl,
      "educationalLevel": "Beginner to Advanced",
      "author": { "@id": "https://codelabs.kartikarora.me/#author" },
      "timeRequired": cl.duration ? `PT${cl.duration}M` : undefined,
      "keywords": cl.tags || cl.category || []
    }
  }));

  const structuredDataObj = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://codelabs.kartikarora.me/#website",
        "url": "https://codelabs.kartikarora.me/",
        "name": "Kartik Arora Codelabs",
        "description": "Interactive technical tutorials, workshops, and step-by-step guides on Android, AI, Gemini, and Modern Web.",
        "inLanguage": "en-US",
        "publisher": {
          "@id": "https://codelabs.kartikarora.me/#author"
        }
      },
      {
        "@type": "Person",
        "@id": "https://codelabs.kartikarora.me/#author",
        "name": "Kartik Arora",
        "url": "https://kartikarora.me",
        "sameAs": [
          "https://github.com/kartikarora",
          "https://linkedin.com/in/arorakartik",
          "https://medium.com/@kartikarora"
        ],
        "jobTitle": "Software Engineer & Google Developer Expert (Android)"
      },
      {
        "@type": "ItemList",
        "@id": "https://codelabs.kartikarora.me/#codelabs-list",
        "name": "Technical Codelabs & Workshops",
        "itemListElement": itemListElements
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What are Kartik Arora's Codelabs?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Kartik Arora's Codelabs are hands-on, step-by-step interactive technical guides and workshops designed to teach modern software engineering, Android development, Jetpack Compose, and Generative AI workflows with Google Gemini."
            }
          },
          {
            "@type": "Question",
            "name": "What technologies are covered in these codelabs?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "The tutorials cover Android Studio, Jetpack Compose, screenshot testing, Gemini in Android Studio, Agent Mode, Model Context Protocol (MCP), Google GenAI Python SDK, and AI-assisted development workflows."
            }
          },
          {
            "@type": "Question",
            "name": "Are these codelabs free to use?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, all published codelabs on codelabs.kartikarora.me are freely accessible online and formatted for step-by-step self-paced learning."
            }
          }
        ]
      }
    ]
  };

  const jsonLdBlock = `  <script type="application/ld+json">\n  ${JSON.stringify(structuredDataObj, null, 2).split('\n').join('\n  ')}\n  </script>`;
  html = html.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/, jsonLdBlock);

  // Generate noscript fallback block
  let noscriptHtml = `        <noscript>\n`;
  output.forEach(cl => {
    noscriptHtml += `          <div class="card-grid-item">
            <div class="card-content">
              <div class="card-header">
                <h3 class="card-title">${cl.title}</h3>
              </div>
              <p class="card-body">${cl.summary}</p>
              <div class="card-footer">
                <a href="${cl.url}" class="btn btn-primary btn-sm">Start Codelab</a>
              </div>
            </div>
          </div>\n`;
  });
  noscriptHtml += `        </noscript>`;

  html = html.replace(/<noscript>[\s\S]*?<\/noscript>/, noscriptHtml);

  // Save updated root index.html and write to dist
  fs.writeFileSync(rootHtmlPath, html, 'utf8');
  fs.writeFileSync(path.join(distDir, 'index.html'), html, 'utf8');
  console.log('Updated index.html with fresh JSON-LD and noscript fallback');
}

// 8. Copy static portal files to dist
const staticFiles = [
  'robots.txt',
  'site.webmanifest'
];

staticFiles.forEach(fileName => {
  const srcPath = path.join(__dirname, fileName);
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, path.join(distDir, fileName));
    console.log(`Copied ${fileName} to dist`);
  }
});

// 9. Helper function to copy directories recursively
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

// 10. Copy each codelab directory directly to dist root and inject draft preview banners
if (fs.existsSync(codelabsDir)) {
  const dirs = fs.readdirSync(codelabsDir);
  dirs.forEach(dir => {
    const codelabPath = path.join(codelabsDir, dir);
    if (fs.statSync(codelabPath).isDirectory()) {
      copyRecursiveSync(codelabPath, path.join(distDir, dir));
      console.log(`Copied ${dir}/ to dist/${dir}`);

      // 10a. Copy raw source markdown as index.md for LLMs and AI agents
      const sourceMdPath = path.join(sourceDir, dir, 'codelab.md');
      if (fs.existsSync(sourceMdPath)) {
        fs.copyFileSync(sourceMdPath, path.join(distDir, dir, 'index.md'));
        console.log(`Copied source/${dir}/codelab.md to dist/${dir}/index.md`);
      }

      // 10b. Inject LLM discovery links and TechArticle JSON-LD schema into codelab index.html
      const codelabHtmlPath = path.join(distDir, dir, 'index.html');
      if (fs.existsSync(codelabHtmlPath)) {
        let codelabHtml = fs.readFileSync(codelabHtmlPath, 'utf8');

        // Extract metadata for JSON-LD
        let codelabTitle = dir;
        let codelabSummary = '';
        let codelabDuration = 0;
        let codelabTags = [];
        let codelabAuthor = 'Kartik Arora';

        const jsonPath = path.join(codelabPath, 'codelab.json');
        if (fs.existsSync(jsonPath)) {
          try {
            const meta = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
            codelabTitle = meta.title || dir;
            codelabSummary = meta.summary || '';
            codelabDuration = meta.duration || 0;
            codelabTags = meta.tags || meta.category || [];
            codelabAuthor = meta.authors || 'Kartik Arora';
          } catch(e) {}
        }

        const detailObj = codelabsDetail.find(d => d.id === dir);
        const stepsList = (detailObj && detailObj.steps) ? detailObj.steps : [];

        const howToSteps = stepsList.map((step, sIdx) => ({
          "@type": "HowToStep",
          "position": sIdx + 1,
          "name": step,
          "url": `https://codelabs.kartikarora.me/${dir}/#step-${sIdx + 1}`
        }));

        const techArticleSchema = {
          "@context": "https://schema.org",
          "@type": "TechArticle",
          "@id": `https://codelabs.kartikarora.me/${dir}/#article`,
          "headline": codelabTitle,
          "description": codelabSummary,
          "url": `https://codelabs.kartikarora.me/${dir}/`,
          "author": {
            "@type": "Person",
            "name": codelabAuthor,
            "url": "https://kartikarora.me"
          },
          "inLanguage": "en-US",
          "keywords": codelabTags,
          "timeRequired": codelabDuration ? `PT${codelabDuration}M` : undefined,
          "step": howToSteps.length > 0 ? howToSteps : undefined
        };

        const discoveryTags = `
  <!-- LLM and Machine-Readable Discovery Tags -->
  <link rel="alternate" type="text/markdown" href="./index.md" title="Clean Markdown Tutorial">
  <link rel="alternate" type="application/json" href="./codelab.json" title="Tutorial Metadata JSON">
  <script type="application/ld+json">
  ${JSON.stringify(techArticleSchema, null, 2).split('\n').join('\n  ')}
  </script>`;

        if (codelabHtml.includes('</head>')) {
          codelabHtml = codelabHtml.replace('</head>', discoveryTags + '\n</head>');
          fs.writeFileSync(codelabHtmlPath, codelabHtml, 'utf8');
        }
      }

      // Check if this codelab is a draft
      const jsonPath = path.join(codelabPath, 'codelab.json');
      if (fs.existsSync(jsonPath)) {
        const meta = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
        const statusList = Array.isArray(meta.status)
          ? meta.status.map(s => String(s).toLowerCase())
          : (meta.status ? [String(meta.status).toLowerCase()] : []);

        if (statusList.includes('draft')) {
          const draftTitle = meta.title || 'Hands-On Android Workshop';
          const draftSummary = meta.summary || 'Unpublished technical workshop.';
          const draftFeedbackUrl = meta.feedback || `mailto:hello@kartikarora.me?subject=${encodeURIComponent('Feedback: ' + draftTitle)}`;

          const isLightbuild = dir === 'lightbuild';
          const appName = 'ICanHazStream';
          const kotlinVer = isLightbuild ? '2.3.20' : '2.4.20';
          const buildSystem = isLightbuild ? 'Lightbuild 0.0.30' : 'Gradle 9.8.1';
          const studioVer = 'Canary';
          const jdkVer = isLightbuild ? '21' : '25 (Bundled)';
          const stepsCount = meta.duration ? `${meta.duration} mins` : 'Hands-On';

          const draftRightColumnHtml = `
  <!-- Draft Preview Right Sidebar Column (@kartikarora v2.0.0 Tokyo Neo-Brutalist) -->
  <style>
    #draft-sidebar-column {
      position: fixed;
      inset-block: 0;
      inset-inline-end: 0;
      inline-size: 300px;
      block-size: 100dvb;
      box-sizing: border-box;
      background: var(--color-paper-alt);
      border-inline-start: 2px solid var(--color-rule-strong);
      z-index: 9999;
      display: flex;
      flex-direction: column;
      overflow-y: auto;
      overscroll-behavior: contain;
      scrollbar-gutter: stable;
      font-family: var(--font-sans);
      color: var(--color-ink);
    }

    .draft-panel-header {
      padding: var(--space-md) var(--space-sm);
      background: var(--color-card);
      border-block-end: 2px solid var(--color-rule-strong);
    }

    .draft-panel-title {
      font-family: var(--font-display);
      font-size: 1.05rem;
      font-weight: 900;
      letter-spacing: -0.02em;
      line-height: 1.25;
      color: var(--color-ink);
      margin: var(--space-xs) 0 var(--space-2xs);
      text-wrap: balance;
    }

    .draft-panel-summary {
      margin: 0;
      font-size: var(--text-xs);
      color: var(--color-ink-muted);
      line-height: 1.5;
      text-wrap: pretty;
    }

    .draft-panel-body {
      padding: var(--space-sm);
      display: flex;
      flex-direction: column;
      gap: var(--space-sm);
      flex: 1 1 auto;
    }

    .draft-panel-box {
      background: var(--color-card);
      border: 2px solid var(--color-rule-strong);
      border-radius: var(--radius-sm);
      box-shadow: 3px 3px 0 var(--color-rule-strong);
      padding: var(--space-sm);
    }

    .draft-panel-label {
      font-family: var(--font-mono);
      font-size: var(--text-xs);
      font-weight: 700;
      color: var(--color-ink-muted);
      margin-block-end: var(--space-2xs);
    }

    .draft-status-row {
      display: flex;
      align-items: center;
      gap: var(--space-xs);
      font-family: var(--font-mono);
      font-size: var(--text-sm);
      font-weight: 700;
      color: var(--color-signal);
    }

    .draft-status-dot {
      display: inline-block;
      inline-size: 8px;
      block-size: 8px;
      background: var(--color-signal);
      border: 1px solid var(--color-rule-strong);
      flex-shrink: 0;
    }

    .draft-panel-subtext {
      font-size: var(--text-xs);
      color: var(--color-ink-muted);
      margin-block-start: var(--space-2xs);
    }

    .draft-spec-list {
      margin: 0;
      padding: 0;
    }

    .draft-spec-row {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      gap: var(--space-xs);
      padding-block: var(--space-2xs);
      border-block-end: 1px solid var(--color-rule);
    }

    .draft-spec-row:last-child {
      border-block-end: none;
      padding-block-end: 0;
    }

    .draft-spec-key {
      font-size: var(--text-xs);
      color: var(--color-ink-muted);
    }

    .draft-spec-value {
      margin: 0;
      font-family: var(--font-mono);
      font-size: var(--text-xs);
      font-weight: 700;
      font-variant-numeric: tabular-nums;
      color: var(--color-ink);
    }

    .draft-spec-value--signal {
      color: var(--color-signal);
    }

    .draft-notice {
      padding: var(--space-xs) var(--space-sm);
      background: var(--color-paper-sunken);
      border-inline-start: 3px solid var(--color-signal-secondary);
      border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
    }

    .draft-notice-label {
      font-family: var(--font-mono);
      font-size: var(--text-xs);
      font-weight: 700;
      color: var(--color-ink);
      margin-block-end: var(--space-2xs);
    }

    .draft-notice-text {
      margin: 0;
      font-size: var(--text-xs);
      color: var(--color-ink-muted);
      line-height: 1.5;
      text-wrap: pretty;
    }

    .draft-panel-footer {
      padding: var(--space-sm);
      background: var(--color-card);
      border-block-start: 2px solid var(--color-rule-strong);
    }

    .draft-feedback-btn {
      inline-size: 100%;
      box-sizing: border-box;
    }

    @media (min-width: 1200px) {
      body {
        margin-inline-end: 300px !important;
      }
    }

    @media (max-width: 1199px) {
      #draft-sidebar-column {
        display: none !important;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      #draft-sidebar-column,
      #draft-sidebar-column * {
        transition: none !important;
        animation: none !important;
      }
    }
  </style>

  <aside id="draft-sidebar-column" aria-label="Draft preview details">
    <div class="draft-panel-header">
      <span class="badge-secondary">Draft Preview</span>
      <h3 class="draft-panel-title">${draftTitle}</h3>
      <p class="draft-panel-summary">${draftSummary}</p>
    </div>

    <div class="draft-panel-body">
      <div class="draft-panel-box">
        <div class="draft-panel-label">Status</div>
        <div class="draft-status-row">
          <span class="draft-status-dot" aria-hidden="true"></span>
          <span>Draft (Unpublished)</span>
        </div>
        <div class="draft-panel-subtext">Not listed in public directory</div>
      </div>

      <div class="draft-panel-box">
        <div class="draft-panel-label">Workshop Specs</div>
        <dl class="draft-spec-list">
          <div class="draft-spec-row">
            <dt class="draft-spec-key">App:</dt>
            <dd class="draft-spec-value draft-spec-value--signal">${appName}</dd>
          </div>
          <div class="draft-spec-row">
            <dt class="draft-spec-key">Kotlin:</dt>
            <dd class="draft-spec-value">${kotlinVer}</dd>
          </div>
          <div class="draft-spec-row">
            <dt class="draft-spec-key">Build:</dt>
            <dd class="draft-spec-value">${buildSystem}</dd>
          </div>
          <div class="draft-spec-row">
            <dt class="draft-spec-key">Studio:</dt>
            <dd class="draft-spec-value">${studioVer}</dd>
          </div>
          <div class="draft-spec-row">
            <dt class="draft-spec-key">JDK:</dt>
            <dd class="draft-spec-value">${jdkVer}</dd>
          </div>
          <div class="draft-spec-row">
            <dt class="draft-spec-key">Duration:</dt>
            <dd class="draft-spec-value">${stepsCount}</dd>
          </div>
        </dl>
      </div>

      <div class="draft-notice">
        <div class="draft-notice-label">Draft Notice</div>
        <p class="draft-notice-text">
          This draft was generated with the help of AI and may contain mistakes. It is actively being reviewed by the author for correctness and ease of completion.
        </p>
      </div>
    </div>

    <div class="draft-panel-footer">
      <a href="${draftFeedbackUrl}" class="btn btn-primary draft-feedback-btn">Send Feedback</a>
    </div>
  </aside>`;

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
