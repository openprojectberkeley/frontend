/*
 * Lite mode: the site with its expensive effects turned off, for phones,
 * tablets and slow machines.
 *
 * What goes: the logo physics, the pixel dissolves and swaps, the pixel title,
 * the stars' spin and scroll parallax, blur and drop-shadow animations,
 * backdrop blurs and the sliding page change. What stays is everything the
 * page says and the scroll story on the home page; the effects that go are
 * replaced by plain fades.
 *
 * Decided once, when the page loads, and never changed after - a device does
 * not become faster by being rotated, and switching mid-visit would remount
 * half the home page. Components read `isLite`; stylesheets read the
 * html.op-lite class.
 *
 *   ?lite=1 / ?lite=0   force it on or off for this tab, for testing on a
 *                       desktop or for checking the full version on a phone.
 *                       Remembered for the tab, so navigating keeps it.
 */
const STORAGE_KEY = 'op-lite';

function forced() {
  try {
    const value = new URLSearchParams(window.location.search).get('lite');

    if (value === '1' || value === '0') {
      window.sessionStorage.setItem(STORAGE_KEY, value);
      return value === '1';
    }

    const stored = window.sessionStorage.getItem(STORAGE_KEY);

    return stored === '1' || stored === '0' ? stored === '1' : null;
  } catch {
    return null;
  }
}

function detect() {
  if (typeof window === 'undefined') return false;

  const override = forced();

  if (override !== null) return override;

  // A touch screen with nothing to hover with: phones and tablets.
  const touch = window.matchMedia?.('(hover: none) and (pointer: coarse)').matches;
  // A machine that says it is small, or a reader who has asked for less data.
  const fewCores = navigator.hardwareConcurrency > 0 && navigator.hardwareConcurrency <= 4;
  const littleMemory = navigator.deviceMemory > 0 && navigator.deviceMemory <= 4;
  const saveData = Boolean(navigator.connection?.saveData);

  return Boolean(touch || fewCores || littleMemory || saveData);
}

export const isLite = detect();

/*
 * Puts the class on the root, or takes it off: a page prerendered by
 * react-snap carries whatever the snapshot's browser was, and the reader's
 * own device is what counts.
 */
export function applyLiteClass() {
  if (typeof document !== 'undefined') {
    document.documentElement.classList.toggle('op-lite', isLite);
  }
}
