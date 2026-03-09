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
      
      // Find the first jpeg image in the img directory
      let image = null;
      const imgDir = path.join(codelabPath, 'img');
      if (fs.existsSync(imgDir)) {
        const images = fs.readdirSync(imgDir);
        const jpeg = images.find(f => f.toLowerCase().endsWith('.jpeg') || f.toLowerCase().endsWith('.jpg'));
        if (jpeg) {
          image = `./codelabs/${dir}/img/${jpeg}`;
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
        url: `./codelabs/${dir}/index.html`,
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

// 6. Copy codelabs directory to dist
if (fs.existsSync(codelabsDir)) {
  copyRecursiveSync(codelabsDir, path.join(distDir, 'codelabs'));
  console.log('Copied codelabs/ to dist');
}
