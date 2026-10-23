#!/usr/bin/env node
/*
 * Smaller copies of the community photos for the hero's moment strip.
 *
 * The cards cap at 24rem and scale by at most ~1.16, so on a 2x screen the
 * pixels actually drawn are under 900px wide. The originals are phone photos,
 * several of them 4000px and tens of megabytes, and every card is in the DOM
 * at once. 1400px on the long edge stays sharp at that size with a little
 * headroom, and is what the strip scrolls.
 *
 * Output is PNG, as the scene asks for, under src/images/community/thumb.
 * Sources smaller than the cap are copied across without being enlarged.
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const SOURCE_DIR = path.join('src', 'images', 'community');
const THUMB_DIR = path.join(SOURCE_DIR, 'thumb');
const MAX_EDGE = 1400;
const EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp']);

async function generateCommunityThumbs() {
  fs.mkdirSync(THUMB_DIR, { recursive: true });

  const files = fs
    .readdirSync(SOURCE_DIR)
    .filter((file) => EXTENSIONS.has(path.extname(file).toLowerCase()))
    .sort();

  for (const file of files) {
    const inputPath = path.join(SOURCE_DIR, file);
    const thumbName = `${path.basename(file, path.extname(file))}.png`;
    const outputPath = path.join(THUMB_DIR, thumbName);

    const before = fs.statSync(inputPath).size;
    await sharp(inputPath)
      .rotate()
      .resize({
        width: MAX_EDGE,
        height: MAX_EDGE,
        fit: 'inside',
        withoutEnlargement: true,
      })
      .png({ compressionLevel: 9, adaptiveFiltering: true })
      .toFile(outputPath);

    const after = fs.statSync(outputPath).size;
    const meta = await sharp(outputPath).metadata();
    console.log(
      `✓ ${file} → thumb/${thumbName}  ${meta.width}x${meta.height}  ${(before / 1024 / 1024).toFixed(1)}MB → ${(after / 1024 / 1024).toFixed(1)}MB`
    );
  }
}

generateCommunityThumbs().catch((err) => {
  console.error('Community thumbnail generation failed:', err);
  process.exit(1);
});
