#!/usr/bin/env node
/*
 * Smaller copies of the community photos for the hero's moment strip.
 *
 * The cards cap at 24rem and scale by at most ~1.16, so on a 2x screen the
 * pixels actually drawn are under 900px wide, and always 4:3. The originals are
 * phone photos, several of them 4000px and tens of megabytes.
 *
 * So each one is cut to exactly what a card shows: 960x720, cropped from the
 * centre, which is the same crop the card's object-fit: cover would make. That
 * also means a portrait photo is not decoded at twice the height anyone sees.
 * JPEG rather than PNG because these are photographs: PNG is about twenty times
 * the size here for nothing visible. Anything transparent is flattened on white.
 *
 * Output goes under src/images/community/thumb, and communityMoments.js imports
 * from there. Re-run with `npm run thumbs:community` after adding a photo.
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const SOURCE_DIR = path.join('src', 'images', 'community');
const THUMB_DIR = path.join(SOURCE_DIR, 'thumb');
const WIDTH = 960;
const HEIGHT = 720;
const QUALITY = 78;
const EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp']);

async function generateCommunityThumbs() {
  fs.mkdirSync(THUMB_DIR, { recursive: true });

  const files = fs
    .readdirSync(SOURCE_DIR)
    .filter((file) => EXTENSIONS.has(path.extname(file).toLowerCase()))
    .sort();

  for (const file of files) {
    const inputPath = path.join(SOURCE_DIR, file);
    const thumbName = `${path.basename(file, path.extname(file))}.jpg`;
    const outputPath = path.join(THUMB_DIR, thumbName);

    const before = fs.statSync(inputPath).size;
    await sharp(inputPath)
      .rotate()
      .resize({ width: WIDTH, height: HEIGHT, fit: 'cover', position: 'centre' })
      .flatten({ background: '#ffffff' })
      .jpeg({ quality: QUALITY, mozjpeg: true })
      .toFile(outputPath);

    const after = fs.statSync(outputPath).size;
    console.log(
      `✓ ${file} → thumb/${thumbName}  ${(before / 1024 / 1024).toFixed(1)}MB → ${(after / 1024).toFixed(0)}KB`
    );
  }
}

generateCommunityThumbs().catch((err) => {
  console.error('Community thumbnail generation failed:', err);
  process.exit(1);
});
