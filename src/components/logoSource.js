/*
 * A logo file, ready to be drawn onto a canvas at a useful size.
 *
 * An image element or a canvas takes an SVG at the size the file says it is, and many
 * logo files say very little: 154 by 18, 98 by 18, or 28 by 28 for a drawing
 * whose own viewBox is two and a half times as wide as it is tall. Drawn into a
 * bitmap at that size and then shown at a row's height, a logo comes out blurred
 * or squashed. A file with a viewBox and no size at all is taken as 300 by 150,
 * whatever shape it really is.
 *
 * So an SVG is read, given a size that matches its own viewBox at `height`
 * pixels tall, and handed back as a blob URL along with its true aspect. Any
 * other file, or an SVG that cannot be read, comes back as it was, with no
 * aspect, and the caller falls back to the image's natural size.
 */

const RASTER_HEIGHT = 320;
const cache = new Map();

const isSvg = (src) => /^data:image\/svg\+xml/i.test(src) || /\.svg(?:[?#]|$)/i.test(src);

export default function logoSource(src, height = RASTER_HEIGHT) {
  const key = `${height}@${src}`;
  const found = cache.get(key);

  if (found) {
    return found;
  }

  const unchanged = { src, aspect: null };
  const made = !isSvg(src)
    ? Promise.resolve(unchanged)
    : fetch(src)
        .then((response) => response.text())
        .then((text) => {
          const svg = new DOMParser().parseFromString(text, 'image/svg+xml').documentElement;

          if (!svg || svg.nodeName.toLowerCase() !== 'svg') {
            return unchanged;
          }

          let box = (svg.getAttribute('viewBox') || '').trim().split(/[\s,]+/).map(Number);

          if (box.length !== 4 || !(box[2] > 0 && box[3] > 0)) {
            const width = parseFloat(svg.getAttribute('width'));
            const tall = parseFloat(svg.getAttribute('height'));

            if (!(width > 0 && tall > 0)) {
              return unchanged;
            }

            box = [0, 0, width, tall];
            svg.setAttribute('viewBox', box.join(' '));
          }

          const aspect = box[2] / box[3];

          // A size in the root's own style wins over its width and height, so
          // one copied off a web page (Square's says inline-size: 88px) would
          // squeeze the drawing back down inside the box set below.
          const style = (svg.getAttribute('style') || '')
            .split(';')
            .filter((rule) => !/^\s*(?:(?:min-|max-)?(?:width|height|inline-size|block-size))\s*:/i.test(rule))
            .join(';')
            .trim();

          if (style) svg.setAttribute('style', style);
          else svg.removeAttribute('style');

          svg.setAttribute('width', String(Math.max(1, Math.round(height * aspect))));
          svg.setAttribute('height', String(height));

          const blob = new Blob([new XMLSerializer().serializeToString(svg)], {
            type: 'image/svg+xml',
          });

          return { src: URL.createObjectURL(blob), aspect };
        })
        .catch(() => unchanged);

  cache.set(key, made);

  return made;
}
