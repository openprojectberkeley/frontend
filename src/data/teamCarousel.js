/*
 * The semesters in the about page's team carousel, newest first: the carousel
 * opens on the first one.
 *
 * Each semester's photo is a stack of parallax layers in
 * images/about/<semester>/carousel_<code>/ - layer1.webp the background, each
 * higher layer a cut-out in front of the one before (the PNGs beside them are
 * the sources). The folder is found from the label, so "Fall 2026" reads
 * images/about/fall2026/; adding a semester is adding its folder and a line
 * here.
 *
 *   parallax  how far its layers travel (1 when left out)
 *   shiftX    moves the photo sideways, as a share of the frame's width
 *             (negative is left)
 *   zoom      enlarges it (1 when left out)
 */
export const carouselSemesters = [
  { label: 'Spring 2026', parallax: 0.6, zoom: 1.05 },
  { label: 'Fall 2025', parallax: 0.6, shiftX: -0.03 },
  { label: 'Spring 2025' },
  { label: 'Fall 2024' },
  { label: 'Spring 2024' },
  { label: 'Fall 2023' },
  { label: 'Spring 2023', parallax: 0.6 },
];
