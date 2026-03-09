const fs = require('fs');
const path = require('path');

const codelabsDir = path.join(__dirname, 'codelabs');
const output = [];

if (fs.existsSync(codelabsDir)) {
  const dirs = fs.readdirSync(codelabsDir);
  dirs.forEach(dir => {
    const jsonPath = path.join(codelabsDir, dir, 'codelab.json');
    if (fs.existsSync(jsonPath)) {
      const meta = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
      
      // Find the first jpeg image in the img directory
      let image = null;
      const imgDir = path.join(codelabsDir, dir, 'img');
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

fs.writeFileSync('codelabs.json', JSON.stringify(output, null, 2));
console.log('Generated codelabs.json');
