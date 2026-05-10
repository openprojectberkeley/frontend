#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ABOUT_DIRS = [
  'src/images/about/spring2026',
  'src/images/about/spring2025',
  'src/images/about/fall2025',
  'src/images/about/spring2024',
  'src/images/about/fall2023',
  'src/images/about/spring2023',
];

const THUMBNAIL_WIDTH = 400;

async function generateThumbnails() {
  for (const dir of ABOUT_DIRS) {
    if (!fs.existsSync(dir)) continue;

    const files = fs.readdirSync(dir);
    for (const file of files) {
      // Skip already-generated thumbnails
      if (file.includes('.thumb.')) continue;
      
      const ext = path.extname(file).toLowerCase();
      if (!['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) continue;

      const inputPath = path.join(dir, file);
      const thumbName = file.replace(/\.[^.]+$/, '.thumb.jpg');
      const outputPath = path.join(dir, thumbName);

      // Skip if thumbnail already exists
      if (fs.existsSync(outputPath)) continue;

      try {
        await sharp(inputPath)
          .resize(THUMBNAIL_WIDTH, THUMBNAIL_WIDTH * 1.2, { fit: 'cover' })
          .jpeg({ quality: 80, progressive: true })
          .toFile(outputPath);
        console.log(`✓ ${file} → ${thumbName}`);
      } catch (err) {
        console.error(`✗ ${file}:`, err.message);
      }
    }
  }
}

generateThumbnails().catch(err => {
  console.error('Thumbnail generation failed:', err);
  process.exit(1);
});
