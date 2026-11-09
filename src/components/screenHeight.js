/*
 * One screen, in pixels, as the stylesheets mean it: 100vh.
 *
 * Not window.innerHeight. On a phone the browser's toolbar folds away as the
 * page scrolls and comes back when it turns round, and innerHeight follows
 * it - while vh, which every height on the home page is laid out in, is the
 * large viewport's and stays put. A playhead measured in innerHeights was
 * therefore rescaled every time the toolbar moved: the same scroll position
 * read as two different moments of the timeline, and the scenes jumped back
 * and forth under the reader's thumb.
 *
 * Read off a hidden 100vh box, once, and again only after a resize.
 */
let probe = null;
let cached = null;

if (typeof window !== 'undefined') {
  // Registered when this module first loads, so before any component's own
  // resize listener: whatever they schedule on a resize reads the new value.
  window.addEventListener('resize', () => {
    cached = null;
  });
}

export default function screenHeight() {
  if (cached !== null) {
    return cached;
  }

  if (!probe) {
    probe = document.createElement('div');
    probe.setAttribute('aria-hidden', 'true');
    probe.style.cssText =
      'position:absolute;top:0;left:0;width:0;height:100vh;visibility:hidden;pointer-events:none;';
    document.body.appendChild(probe);
  }

  cached = probe.offsetHeight || window.innerHeight;

  return cached;
}
