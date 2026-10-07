/*! Portfolio Studio. Copyright (c) 2026 Roy Borkin. All rights reserved. Unauthorized copying, modification or distribution is prohibited without written permission. */
// Google Fonts helpers shared by the site engine and the builder.
export function googleFontsHref(specs) {
  const fam = [...new Set(specs.filter(Boolean))].map((s) => {
    const [f, w] = s.split(':');
    const ws = (w || '400;700').replace(/,/g, ';').split(';').map((x) => x.trim()).filter(Boolean).sort((a, b) => a - b);
    const fam = 'family=' + f.trim().replace(/ /g, '+');
    if (ws.some((x) => x.startsWith('i'))) { // "i300" = italic 300
      const t = [...new Set(ws.map((x) => (x.startsWith('i') ? '1,' + x.slice(1) : '0,' + x)))].sort((a, b) => (a[0] - b[0]) || (a.slice(2) - b.slice(2)));
      return fam + ':ital,wght@' + t.join(';');
    }
    return fam + ':wght@' + [...new Set(ws)].join(';');
  });
  return fam.length ? 'https://fonts.googleapis.com/css2?' + fam.join('&') + '&display=swap' : '';
}
export function fontSpecsFor(def, data) {
  const V = def?.variants?.[data.variant | 0] || {};
  const th = data.theme || {};
  return [th.fontDisplay || V.fonts?.display, th.fontBody || V.fonts?.body, th.fontMono || V.fonts?.mono].filter(Boolean);
}
// A curated list for the font pickers. Weights requested: a sensible spread.
export const FONT_LIST = {
  display: ['Anton', 'Archivo', 'Big Shoulders Display', 'Bodoni Moda', 'Bricolage Grotesque', 'Chakra Petch', 'Chivo', 'Comfortaa', 'Dela Gothic One', 'DM Serif Display', 'Fraunces', 'Instrument Serif', 'Josefin Sans', 'Jost', 'League Gothic', 'Manrope', 'Michroma', 'Montserrat', 'Outfit', 'Playfair Display', 'Red Hat Display', 'Saira Condensed', 'Sora', 'Space Grotesk', 'Syncopate', 'Syne', 'Unbounded', 'Urbanist', 'Architects Daughter', 'B612 Mono', 'VT323', 'Share Tech Mono', 'Rubik', 'Heebo', 'Assistant', 'Secular One', 'Frank Ruhl Libre'],
  body: ['Archivo', 'B612', 'Chivo', 'DM Sans', 'IBM Plex Sans', 'Instrument Sans', 'Inter Tight', 'Jost', 'Manrope', 'Montserrat', 'Mulish', 'Outfit', 'Red Hat Text', 'Sora', 'Space Grotesk', 'Urbanist', 'Cormorant Garamond', 'Source Serif 4', 'IBM Plex Mono', 'Heebo', 'Assistant', 'Rubik', 'Noto Sans Hebrew'],
  mono: ['B612 Mono', 'Chivo Mono', 'DM Mono', 'Geist Mono', 'IBM Plex Mono', 'JetBrains Mono', 'Martian Mono', 'Red Hat Mono', 'Share Tech Mono', 'Space Mono', 'VT323'],
};
