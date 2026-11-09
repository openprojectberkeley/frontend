/*
 * The header's two washes, --header-scrim (the dark one) and --header-wash
 * (the pale one), for the pages that scroll it between them: the home page's
 * hero and the board page.
 *
 * Written on the header itself rather than on the root. A custom property on
 * the root is inherited by every element on the page, so changing it every
 * frame of a scroll made the browser restyle the whole document to answer a
 * question only the header's backdrop asks. On the header it restyles the
 * header.
 *
 * Each value is only written when it has actually changed, and clearHeaderTone
 * puts the header back to the defaults in Header.module.css - the dark wash,
 * none of the pale one - so the next page never inherits wherever the last
 * one left it.
 */
const written = { '--header-scrim': null, '--header-wash': null };

function header() {
  return document.getElementById('header');
}

function write(name, value) {
  const text = value.toFixed(3);

  if (written[name] === text) return;

  const element = header();

  if (!element) return;

  written[name] = text;
  element.style.setProperty(name, text);
}

export function setHeaderTone(scrim, wash) {
  write('--header-scrim', scrim);
  write('--header-wash', wash);
}

export function clearHeaderTone() {
  const element = header();

  Object.keys(written).forEach((name) => {
    written[name] = null;
    element?.style.removeProperty(name);
  });
}
