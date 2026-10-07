/*! Portfolio Studio. Copyright (c) 2026 Roy Borkin. All rights reserved. Unauthorized copying, modification or distribution is prohibited without written permission. */
// Mix & match: build one site from parts of several templates.
// A site has four parts. Each can come from any template; empty means "the base template".
//   bg       — the background layer (canvas, gradients, fog…)
//   nav      — header: logo, contact buttons, footer, intro loader and the section transition
//   menu     — the section menu (and its phone burger + drawer), lifted out of another template's header
//   hero     — the main screen
//   sections — headings, cards, chips and panels of the other sections
// Borrowed parts take the base template's colors and fonts. Their CSS is filtered so a donor
// only styles the part it provides.

export const SLOTS = [
  { id: 'bg', label: 'Background', note: 'The layer behind everything: canvas, gradient, fog, physics toy.' },
  { id: 'nav', label: 'Header', note: 'Logo, contact button, footer, intro loader and the transition between sections.' },
  { id: 'menu', label: 'Menu', note: 'The section menu, and the menu button and panel on phones.' },
  { id: 'contacts', label: 'Contact info', note: 'Contact icons and the contact / “Let’s talk” button.' },
  { id: 'hero', label: 'Main screen', note: 'Your name, pitch, buttons and the main screen’s interactive piece.' },
  { id: 'sections', label: 'Section style', note: 'Headings, cards, filters and panels on every other section.' },
];
export const STD_VARS = ['bg', 'surface', 'fg', 'muted', 'accent', 'accent2', 'line'];

/** Which template provides each part. get(id) returns a template definition or undefined. */
export function mixParts(host, mix, get) {
  const pick = (k) => { const id = mix?.[k]; const d = id && id !== host.id ? get(id) : null; return d || host; };
  const parts = { bg: pick('bg'), nav: pick('nav'), hero: pick('hero'), sections: pick('sections') };
  parts.menu = (mix?.menu && get(mix.menu)) || parts.nav; // empty = the header's own menu
  parts.contacts = (mix?.contacts && CONTACT_SEL[mix.contacts] && get(mix.contacts)) || parts.nav; // empty = the header's own
  const involved = [...new Set([host, parts.bg, parts.nav, parts.menu, parts.contacts, parts.hero, parts.sections])];
  return { parts, involved, mixed: involved.length > 1 };
}
export const mixIds = (hostId, mix) => [...new Set([hostId, ...Object.values(mix || {}).filter((x) => x && typeof x === 'string'), ...Object.values(mix?.look || {}).map((x) => String(x || '').split(':')[0]).filter((x) => x && !/^\d+$/.test(x))])];
/** A look value: '' (Design), 'templateId:variant', or a bare variant number (older projects: the part's own template). */
export function parseLook(val, fallbackId) {
  const s = String(val ?? '');
  if (!s) return null;
  if (s.includes(':')) { const [id, v] = s.split(':'); return { id, v: +v | 0 }; }
  return fallbackId ? { id: fallbackId, v: +s | 0 } : null;
}

/* ── color helpers ── */
export function lum(c) {
  c = String(c || '').trim();
  let r, g, b;
  if (c.startsWith('rgb')) { const m = c.match(/[\d.]+/g) || [0, 0, 0]; [r, g, b] = m.map(Number); }
  else { let h = c.replace('#', ''); if (h.length === 3) h = [...h].map((x) => x + x).join(''); const n = parseInt(h.slice(0, 6), 16); if (Number.isNaN(n)) return 0.5; r = n >> 16 & 255; g = n >> 8 & 255; b = n & 255; }
  const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}
/** Donor variant that best matches the host palette: same light/dark, same index when possible. */
export function donorVariant(T, hostBg, hostIndex = 0) {
  const vs = T.variants || [];
  if (!vs.length) return 0;
  const dark = lum(hostBg) < 0.3;
  const ok = vs.map((v, i) => [i, (lum(v.vars?.bg) < 0.3) === dark]).filter(([, m]) => m).map(([i]) => i);
  if (ok.includes(hostIndex)) return hostIndex;
  return ok.length ? ok[0] : Math.min(hostIndex, vs.length - 1);
}

/* ── tiny CSS parser ── */
function blocks(css) {
  const out = []; let i = 0; const n = css.length;
  while (i < n) {
    const j = css.indexOf('{', i); if (j < 0) break;
    const pre = css.slice(i, j).trim();
    let d = 1, k = j + 1, q = '';
    for (; k < n && d; k++) { const ch = css[k]; if (q) { if (ch === q && css[k - 1] !== '\\') q = ''; continue; } if (ch === '"' || ch === "'") q = ch; else if (ch === '{') d++; else if (ch === '}') d--; }
    out.push({ pre, body: css.slice(j + 1, k - 1) });
    i = k;
  }
  return out;
}
function splitTop(s, sep) {
  const out = []; let d = 0, q = '', cur = '';
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (q) { cur += ch; if (ch === q && s[i - 1] !== '\\') q = ''; continue; }
    if (ch === '"' || ch === "'") { q = ch; cur += ch; continue; }
    if (ch === '(' || ch === '[') d++; else if (ch === ')' || ch === ']') d--;
    if (ch === sep && d === 0) { out.push(cur); cur = ''; } else cur += ch;
  }
  if (cur.trim()) out.push(cur);
  return out.map((x) => x.trim()).filter(Boolean);
}
const prefixCache = {};
function prefixOf(id, css) {
  if (prefixCache[id]) return prefixCache[id];
  const cnt = {};
  for (const m of css.matchAll(/\.([a-z]{2,3})-[a-z0-9]/g)) if (m[1] !== 'pf') cnt[m[1]] = (cnt[m[1]] || 0) + 1;
  const best = Object.entries(cnt).filter(([p]) => p !== 'k').sort((a, b) => b[1] - a[1])[0];
  return (prefixCache[id] = best ? best[0] : id.slice(0, 2));
}
const ROOT_ONLY = /^\.pf(\[[^\]]+\]|\.[\w-]+|:[\w-]+)*$/; // the page root itself, maybe qualified (no descendants)
function roleOf(sel, own) {
  sel = sel.replace(/:not\([^()]*\)/g, ''); // what a selector excludes doesn't say what it styles
  if (/\.pf-cursor\b/.test(sel)) return 'host';
  if (own.test(sel)) return 'own';
  if (/\.pf-(bg|grain)\b/.test(sel)) return 'bg';
  if (/\.pf-(drawer|burger|nav-[a-z]+|logo|wipe|shutter)\b/.test(sel) || /\.pf-ct\b/.test(sel) && !/\.pf-(sec|profile|modal|body)/.test(sel)) return 'nav';
  if (/\.pf-home\b|\.pf-sec-home(?![\w-])/.test(sel)) return 'hero';
  return 'sections';
}
function declRole(prop) {
  if (/^--pad-/.test(prop)) return 'nav';
  if (/^--(bg|surface|fg|muted|accent|accent2|line)$/.test(prop)) return 'host'; // only the base template sets the palette
  if (/^--(cursor|cl)$/.test(prop)) return 'host';
  if (/^background/.test(prop)) return 'bg';
  return 'sections';
}

/**
 * Filter (and rewrite) a template's CSS for a mixed site.
 * roles: Set of parts this template provides ('bg','nav','hero','sections'); host also gets 'host'.
 * dv: for donors, the variant index to emulate (rules for other variants are dropped).
 */
export function mixCss(T, css, roles, isHost, dv) {
  css = String(css || '').replace(/\/\*[\s\S]*?\*\//g, '');
  const id = T.id, pre = prefixOf(id, css);
  const own = new RegExp(`\\.(${pre})-[a-zA-Z0-9]`);
  const has = (r) => r === 'own' || roles.has(r) || (r === 'nav' && (roles.has('menu') || roles.has('contacts')));
  const hasDecl = (r) => r === 'own' || roles.has(r);
  // donors: rename keyframes so names cannot collide with the host's
  if (!isHost) {
    const names = [...new Set([...css.matchAll(/@(?:-webkit-)?keyframes\s+([\w-]+)/g)].map((m) => m[1]))];
    for (const nm of names) css = css.replace(new RegExp(`(?<![\\w-])${nm}(?![\\w-])`, 'g'), `${id}__${nm}`);
  }
  const tAttr = new RegExp(`\\[data-t=["']?${id}["']?\\]`, 'g');
  const fixSel = (s) => {
    if (!isHost) {
      let drop = false;
      s = s.replace(/\[data-v=["']?(\d+)["']?\]/g, (m, n) => { if (+n === dv) return ''; drop = true; return m; });
      if (drop) return null;
    }
    return s.replace(tAttr, '[data-t]');
  };
  const walk = (list) => {
    let out = '';
    for (const b of list) {
      if (/^@(media|supports|container)/.test(b.pre)) { const inner = walk(blocks(b.body)); if (inner) out += `${b.pre}{${inner}}`; continue; }
      if (b.pre.startsWith('@')) { out += `${b.pre}{${b.body}}`; continue; }
      const sels = splitTop(b.pre, ',').map(fixSel).filter(Boolean);
      if (!sels.length) continue;
      const keep = [], roots = [];
      for (const s of sels) { if (ROOT_ONLY.test(s)) roots.push(s); else if (has(roleOf(s, own))) keep.push(s); }
      if (keep.length) out += `${keep.join(',')}{${b.body}}`;
      if (roots.length) {
        const decls = splitTop(b.body, ';').filter((d) => { const p = d.split(':')[0].trim(); return hasDecl(declRole(p)); });
        if (decls.length) out += `${roots.join(',')}{${decls.join(';')}}`;
      }
    }
    return out;
  };
  return walk(blocks(css));
}

/** Extra custom properties a donor relies on (e.g. --j1, --ice), taken from its matched variant. */
export function donorVars(T, dv, hostVars) {
  const V = T.variants?.[dv]?.vars || {};
  return Object.entries(V).filter(([k]) => !STD_VARS.includes(k) && !(k in hostVars)).map(([k, v]) => `--${k}:${v};`).join('');
}

/** Each template's menu: element keys in elements.js (first key's selector is the main menu). */
export const MENU_KEYS = { terminal: ['tabs', 'sidebar'], glass: ['tabs'], deck: ['progress'], folio: ['spines'], traverse: ['nav', 'rail'], museum: ['nav', 'dots'], classic: ['nav', 'dots'], lab: ['nav', 'dots'] };
export const menuKeys = (id) => MENU_KEYS[id] || ['nav'];

/** Each template's contact info in its header/footer (icon row + contact button). Templates that keep
 *  contacts on the main screen (Bento, Gravity) are not offered: those go with the main screen. */
export const CONTACT_SEL = { atelier: '.at-cts,.at-talk', aura: '.au-cts,.au-say', blueprint: '.bp-tb-cts', classic: '.cl-cts', cyber: '.cy-cts,.cy-jack', deck: '.dk-hi', folio: '.fo-cts', forge: '.fg-cts', frost: '.fr-cts,.fr-talk', glass: '.lg-round[data-contact]', kinetic: '.kn-cts,.kn-talk', lab: '.lb-ct', marquee: '.mq-soc', museum: '.mu-cts', nexus: '.nx-foot', plus: '.pl-foot', poster: '.po-foot', runway: '.rw-cts,.rw-ct-btn', terminal: '.tm-cts,.tm-cts2', traverse: '.tv-social', vision: '.vi-rail' };
export const contactSels = (id) => (CONTACT_SEL[id] || '').split(',').filter(Boolean);

/**
 * "Own look": a borrowed part can keep its template's colors and fonts instead of following Design.
 * mix.look[part] = '' (follow Design) or a variant index of the part's template, as a string.
 * Returns [{ part, T, v }] for parts that keep their own look.
 */
export function ownLooks(hostId, mix, get) {
  const out = [], L = mix?.look || {};
  for (const k of ['bg', 'nav', 'menu', 'contacts', 'hero', 'sections']) {
    const lk = parseLook(L[k], mix?.[k] || null);
    if (!lk) continue;
    const T = get(lk.id); if (!T) continue;
    out.push({ part: k, T, v: Math.max(0, Math.min((T.variants?.length || 1) - 1, lk.v)) });
  }
  return out;
}
/** Google Fonts specs used by parts that keep their own look. */
export const ownLookFonts = (looks) => looks.flatMap(({ T, v }) => { const f = T.variants?.[v]?.fonts || {}; return [f.display, f.body, f.mono]; }).filter(Boolean);
/** Where each part's markup lives, for scoping its own palette. */
export const PART_SCOPE = { bg: '.pf-bg', nav: '.pf-part-nav', menu: '.pf-mix-menu', contacts: '.pf-mix-ct', hero: '.pf-sec-home', sections: '.pf-sec:not(.pf-sec-home),.pf-modal' };
