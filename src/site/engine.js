/*! Portfolio Studio. Copyright (c) 2026 Roy Borkin. All rights reserved. Unauthorized copying, modification or distribution is prohibited without written permission. */
/* Portfolio site engine — shared runtime for every template.
   One page, no document scrolling: sections are full-viewport layers that the
   wheel, swipe, keyboard and nav move between. Overflowing content is paged. */
import { ICONS, CONTACT_TYPES } from '../shared/icons.js';
import { googleFontsHref } from '../shared/fonts.js';
import { elementsCss, elementsFor } from '../shared/elements.js';
import { mixParts, mixCss, donorVariant, donorVars, menuKeys, contactSels, ownLooks, ownLookFonts, PART_SCOPE, lum } from '../shared/mix.js';
import { TEMPLATE_ELS } from '../shared/elements.js';
import { liKey, postToItem } from '../shared/linkedin.js';

const PF = (window.PF = window.PF || {});
PF.templates = PF.templates || {};
PF.register = (def) => { PF.templates[def.id] = def; };

/* ───────────────────────── helpers ───────────────────────── */
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const I = (n) => ICONS[n] || ICONS.link;
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const fmtDate = (s) => {
  if (!s) return '';
  const d = new Date(s);
  if (isNaN(d)) return esc(s);
  return MONTHS[d.getMonth()] + ' ' + d.getFullYear();
};
const ss = {
  get(k) { try { const v = sessionStorage.getItem(k); return v && JSON.parse(v); } catch { return null; } },
  set(k, v) { try { sessionStorage.setItem(k, JSON.stringify(v)); } catch { /* storage unavailable */ } },
};
const pad2 = (n) => String(n).padStart(2, '0');
const slug = (s) => String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'item';

/* Turn the many shapes of share links into embeddable URLs. */
export const embeds = {
  instagram(u) {
    if (!u) return '';
    const m = String(u).match(/instagram\.com\/(?:[\w.]+\/)?(p|reel|tv)\/([\w-]+)/);
    return m ? `https://www.instagram.com/${m[1]}/${m[2]}/embed/captioned/` : '';
  },
  linkedin(u) {
    if (!u) return '';
    u = String(u);
    const src = u.match(/src="([^"]+)"/); if (src) return src[1];
    if (/linkedin\.com\/embed\//.test(u)) return u;
    const urn = u.match(/urn:li:(share|activity|ugcPost):(\d+)/); if (urn) return `https://www.linkedin.com/embed/feed/update/urn:li:${urn[1]}:${urn[2]}`;
    const act = u.match(/activity[-:](\d{10,})/); if (act) return `https://www.linkedin.com/embed/feed/update/urn:li:activity:${act[1]}`;
    const ugc = u.match(/ugcPost[-:](\d{10,})/); if (ugc) return `https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:${ugc[1]}`;
    return '';
  },
  drive(u) {
    if (!u) return '';
    u = String(u).trim();
    let m = u.match(/drive\.google\.com\/file\/d\/([\w-]+)/); if (m) return `https://drive.google.com/file/d/${m[1]}/preview`;
    m = u.match(/drive\.google\.com\/(?:open|uc)\?(?:.*&)?id=([\w-]+)/); if (m) return `https://drive.google.com/file/d/${m[1]}/preview`;
    m = u.match(/drive\.google\.com\/drive\/(?:u\/\d\/)?folders\/([\w-]+)/); if (m) return `https://drive.google.com/embeddedfolderview?id=${m[1]}#grid`;
    m = u.match(/docs\.google\.com\/(document|presentation|spreadsheets)\/d\/([\w-]+)/); if (m) return `https://docs.google.com/${m[1]}/d/${m[2]}/${m[1] === 'presentation' ? 'embed' : 'preview'}`;
    return u;
  },
  youtube(u) {
    const m = String(u || '').match(/(?:youtu\.be\/|v=|shorts\/|embed\/)([\w-]{11})/);
    return m ? `https://www.youtube-nocookie.com/embed/${m[1]}` : '';
  },
};
PF.embeds = embeds;

/* ───────────────────────── context ───────────────────────── */
function makeCtx(data, opts) {
  const t = PF.templates[data.template] || Object.values(PF.templates)[0];
  const v = clamp(data.variant | 0, 0, (t.variants?.length || 1) - 1);
  const V = t.variants?.[v] || { vars: {}, fonts: {} };
  const P = data.profile || {};
  const assets = data.assets || {};
  const img = (ref) => {
    if (!ref) return '';
    if (typeof ref === 'string' && ref.startsWith('a:')) { const a = assets[ref.slice(2)]; return a ? (a.path || a.data || a.src || '') : ''; }
    return ref;
  };
  const secs = (data.sections || []).filter((s) => s.enabled !== false).map((s, i) => ({ ...s, i, n: pad2(i + 1) }));
  const contacts = (data.contacts || []).filter((c) => c.show !== false && c.value);
  const name = [P.firstName, P.lastName].filter(Boolean).join(' ');
  const ctx = {
    data, t, v, V, P, img, esc, I, secs, contacts, name, opts,
    first: P.firstName || '', last: P.lastName || '',
    roles: (P.roles && P.roles.length ? P.roles : [P.role]).filter(Boolean),
    opt: (k, def) => (V.opts && k in V.opts ? V.opts[k] : def),
    sec: (id) => secs.find((s) => s.id === id),
    fmtDate, pad2,
    contactHref(c) { const T = CONTACT_TYPES[c.type] || CONTACT_TYPES.custom; return T.href ? T.href(c.value) : c.value; },
    contactIcon(c) { return I((CONTACT_TYPES[c.type] || CONTACT_TYPES.custom).icon); },
    /** nav links; o.num shows numbers, o.cls adds classes */
    nav(o = {}) {
      return secs.map((s) => `<a class="pf-nav-a ${o.cls || ''}" href="#${esc(s.id)}" data-go="${s.i}" style="--i:${s.i}">${o.num ? `<span class="pf-nav-n">${s.n}</span>` : ''}<span class="pf-nav-l">${esc(s.label)}</span></a>`).join('');
    },
    /** contact links; o.text shows labels, o.limit caps count (rest open the contact sheet) */
    contactLinks(o = {}) {
      const list = o.limit ? contacts.slice(0, o.limit) : contacts;
      const more = o.limit && contacts.length > o.limit;
      return list.map((c) => `<a class="pf-ct ${o.cls || ''}" href="${esc(ctx.contactHref(c))}" ${/^https?:/.test(ctx.contactHref(c)) ? 'target="_blank" rel="noopener"' : ''} aria-label="${esc(c.label || c.type)}" title="${esc(c.label || c.type)}" data-hover>${ctx.contactIcon(c)}${o.text ? `<span>${esc(o.text === 'value' ? displayValue(c) : c.label)}</span>` : ''}</a>`).join('')
        + (more ? `<button class="pf-ct pf-ct-more ${o.cls || ''}" data-contact aria-label="All contact options" data-hover>${I('grid')}${o.text ? '<span>More</span>' : ''}</button>` : '');
    },
    logo(cls = '') {
      const src = img(P.logo);
      return src ? `<img class="pf-logo ${cls}" src="${esc(src)}" alt="${esc(name)} logo">` : `<span class="pf-logo pf-logo-txt ${cls}">${esc((P.firstName || '?')[0] + (P.lastName || '')[0] || '')}</span>`;
    },
    /** split text into per-character spans for staggered motion */
    split(text, cls = 'ch') {
      let k = 0;
      return String(text || '').split(' ').map((w) => `<span class="pf-w">${[...w].map((ch) => `<span class="${cls}" style="--c:${k++}">${esc(ch)}</span>`).join('')}</span>`).join('<span class="pf-sp"> </span>');
    },
    /** rAF loop that pauses when hidden and runs once in static/no-motion mode. Returns stop(). */
    loop(fn) {
      let raf = 0, alive = true, t0 = performance.now();
      const still = () => opts.static || document.getElementById('pf')?.dataset.motion === 'off' || matchMedia('(prefers-reduced-motion: reduce)').matches;
      const step = (now) => { if (!alive) return; fn((now - t0) / 1000); if (!still()) raf = requestAnimationFrame(step); };
      const vis = () => { cancelAnimationFrame(raf); if (!document.hidden && alive) raf = requestAnimationFrame(step); };
      document.addEventListener('visibilitychange', vis);
      raf = requestAnimationFrame(step);
      return () => { alive = false; cancelAnimationFrame(raf); document.removeEventListener('visibilitychange', vis); };
    },
    /** pointer in -1..1, smoothed by the engine */
    pointer() { const r = document.getElementById('pf'); return { x: r ? parseFloat(r.style.getPropertyValue('--mx')) || 0 : 0, y: r ? parseFloat(r.style.getPropertyValue('--my')) || 0 : 0 }; },
    menuBtn(cls = '') { return `<button class="pf-burger ${cls}" data-drawer aria-label="Menu" aria-expanded="false" data-hover><i></i><i></i></button>`; },
    drawer(cls = '') { return `<div class="pf-drawer ${cls}"><nav aria-label="Sections">${ctx.nav({ num: true })}</nav><div class="pf-drawer-ct">${ctx.contactLinks({ text: 'value' })}</div>${ctx.copyright ? `<p class="pf-copy">${esc(ctx.copyright)}</p>` : ''}</div>`; },
    head(sec, extra = '') {
      return `<header class="pf-head"><span class="pf-head-n">${sec.n}</span><h2 class="pf-head-t">${esc(sec.title || sec.label)}</h2>${sec.subtitle ? `<p class="pf-head-s">${esc(sec.subtitle)}</p>` : ''}${extra}</header>`;
    },
  };
  const S2 = data.site || {};
  ctx.copyright = S2.showCopyright === false ? '' : (S2.copyright || `© ${new Date().getFullYear()} ${name || ''}. All rights reserved.`).replace(/\{year\}/g, new Date().getFullYear()).replace(/\{name\}/g, name);
  // mix & match: which template provides each part
  const M = mixParts(t, data.mix, (id) => PF.templates[id]);
  const hostVars = { ...V.vars, ...Object.fromEntries(Object.entries(data.theme?.overrides || {}).filter(([, x]) => x)) };
  const cache = new Map();
  Object.assign(ctx, M, {
    hostVars,
    slot: (k) => M.parts[k] === t,
    dv: (T) => (T === t ? v : donorVariant(T, hostVars.bg, v)),
    /** context as seen by template T (donors get their own variant options and slot()) */
    for(T) {
      if (T === t) return ctx;
      if (cache.has(T)) return cache.get(T);
      const dv = donorVariant(T, hostVars.bg, v), DV = T.variants?.[dv] || { vars: {}, fonts: {} };
      const c2 = Object.assign(Object.create(ctx), { t: T, v: dv, V: DV, opt: (k, def) => (DV.opts && k in DV.opts ? DV.opts[k] : def), slot: (k) => M.parts[k] === T });
      cache.set(T, c2); return c2;
    },
  });
  return ctx;
}
/** run a hook on every template involved in the page */
function each(ctx, fn) { for (const T of ctx.involved) { try { fn(T, ctx.for(T)); } catch (e) { console.error('[template ' + T.id + ']', e); } } }
function displayValue(c) {
  if (c.type === 'email' || c.type === 'phone' || c.type === 'location') return c.value;
  try { const u = new URL(c.value); return (u.hostname.replace(/^www\./, '') + u.pathname).replace(/\/$/, ''); } catch { return c.value; }
}

/* ───────────────────────── theme ───────────────────────── */
const FALLBACK = { display: 'ui-sans-serif, system-ui, sans-serif', body: 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif', mono: 'ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace' };
function fontFamilyName(spec) { return spec ? spec.split(':')[0].trim() : ''; }
export function fontSpecs(data) {
  const t = PF.templates[data.template]; if (!t) return [];
  const V = t.variants?.[data.variant | 0] || {};
  const th = data.theme || {};
  const own = ownLookFonts(ownLooks(t.id, data.mix, (id) => PF.templates[id]));
  return [...new Set([th.fontDisplay || V.fonts?.display, th.fontBody || V.fonts?.body, th.fontMono || V.fonts?.mono, ...own].filter(Boolean))];
}
/** Palette + fonts for borrowed parts that keep their own look (scoped to the part's markup). */
function lookCss(ctx) {
  const P = ctx.parts;
  const scope = (part) => {
    if (part === 'menu') return P.menu !== P.nav ? '.pf-mix-menu' : menuKeys(P.menu.id).map((k) => TEMPLATE_ELS[P.menu.id]?.[k]?.[1]).filter(Boolean).concat('.pf-burger', '.pf-drawer').join(',');
    if (part === 'contacts') return P.contacts !== P.nav ? '.pf-mix-ct' : contactSels(P.contacts.id).join(',');
    return PART_SCOPE[part];
  };
  return ownLooks(ctx.t.id, ctx.data.mix, (id) => PF.templates[id]).map(({ part, T, v }) => {
    const sc = scope(part); if (!sc) return '';
    const V = T.variants?.[v] || {}, f = V.fonts || {};
    const vars = Object.entries(V.vars || {}).map(([k, x]) => `--${k}:${x};`).join('');
    const font = (k, fb) => `--f-${k}:${f[k] ? `"${fontFamilyName(f[k])}",` : ''}${k === 'display' && f.displayFallback ? f.displayFallback : fb};`;
    const fonts = font('display', FALLBACK.display) + font('body', FALLBACK.body) + font('mono', FALLBACK.mono);
    // a part whose light/dark differs from the page brings its own background, so its text stays readable
    const flip = (lum(V.vars?.bg) < 0.3) !== (lum(ctx.hostVars.bg) < 0.3);
    const paint = part === 'bg' ? 'background-color:var(--bg);' : part === 'hero' || part === 'sections' ? `color:var(--fg);font-family:var(--f-body);${flip ? 'background-color:var(--bg);' : ''}` : 'color:var(--fg);';
    return `\n/* ${part}: ${T.id}'s look (version ${v + 1}) */\n.pf :is(${sc}){${vars}${fonts}${paint}}`;
  }).join('');
}
PF.googleFontsHref = googleFontsHref; PF.fontSpecs = fontSpecs;

function themeCss(ctx) {
  const th = ctx.data.theme || {};
  const vars = { ...ctx.V.vars, ...Object.fromEntries(Object.entries(th.overrides || {}).filter(([, v]) => v)) };
  const f = { display: th.fontDisplay || ctx.V.fonts?.display, body: th.fontBody || ctx.V.fonts?.body, mono: th.fontMono || ctx.V.fonts?.mono };
  const lines = Object.entries(vars).map(([k, v]) => `--${k}:${v};`);
  const dfb = !th.fontDisplay && ctx.V.fonts?.displayFallback ? ctx.V.fonts.displayFallback : FALLBACK.display;
  lines.push(`--f-display:${f.display ? `"${fontFamilyName(f.display)}",` : ''}${dfb};`);
  lines.push(`--f-body:${f.body ? `"${fontFamilyName(f.body)}",` : ''}${FALLBACK.body};`);
  lines.push(`--f-mono:${f.mono ? `"${fontFamilyName(f.mono)}",` : ''}${FALLBACK.mono};`);
  lines.push(`--scale:${th.scale || 1};`);
  if (th.radius != null && th.radius !== '') lines.push(`--radius:${th.radius}px;`);
  return `.pf{${lines.join('')}}`;
}
function loadFonts(data) {
  const href = googleFontsHref(fontSpecs(data));
  let l = document.getElementById('pf-fonts');
  if (!href) return;
  if (!l) { l = document.createElement('link'); l.id = 'pf-fonts'; l.rel = 'stylesheet'; document.head.appendChild(l); }
  if (l.getAttribute('href') !== href) l.setAttribute('href', href);
}
function setStyle(id, css) {
  let s = document.getElementById(id);
  if (!s) { s = document.createElement('style'); s.id = id; document.head.appendChild(s); }
  if (s.textContent !== css) s.textContent = css;
}

function cssOf(T, c) { return typeof T.css === 'function' ? T.css(c) : T.css || ''; }
function templateCss(ctx) {
  const t = ctx.t;
  if (!ctx.mixed) return cssOf(t, ctx) + lookCss(ctx);
  const { parts } = ctx;
  let extra = '';
  const out = ctx.involved.map((T) => {
    const roles = new Set(Object.keys(parts).filter((k) => parts[k] === T));
    if (parts.nav === T) { roles.delete('menu'); roles.delete('contacts'); }
    if (T === t) roles.add('host');
    else extra += donorVars(T, ctx.dv(T), ctx.hostVars);
    return `/* ${T.id}: ${[...roles].join(',')} */\n` + mixCss(T, cssOf(T, ctx.for(T)), roles, T === t, ctx.dv(T));
  }).join('\n');
  return (extra ? `.pf{${extra}}\n` : '') + out + liftCss(parts) + lookCss(ctx);
}
/**
 * Menu and/or contact info from another template than the header: that template's header is rendered in a
 * .pf-mix-lift wrapper that is invisible except for the borrowed pieces; the header's own pieces are hidden.
 */
function liftCss(parts) {
  const A = parts.nav, M = parts.menu, C = parts.contacts;
  if (M === A && C === A) return '';
  const menuSel = (T) => menuKeys(T.id).map((k) => TEMPLATE_ELS[T.id]?.[k]?.[1]).filter(Boolean).join(',');
  let css = `\n/* lifted parts: ${M !== A ? `menu from ${M.id} ` : ''}${C !== A ? `contacts from ${C.id}` : ''} */\n.pf-mix-lift{display:contents;visibility:hidden}\n`;
  const hide = [];
  if (M !== A) {
    css += `.pf-mix-menu :is(${menuSel(M) || '.pf-nav-a'},.pf-burger,.pf-drawer){visibility:visible}\n`;
    if (menuSel(A)) hide.push(`.pf :is(${menuSel(A)}):not(.pf-mix-lift *)`);
    hide.push('.pf .pf-burger:not(.pf-mix-menu *)', '.pf .pf-drawer:not(.pf-mix-menu *)');
  }
  if (C !== A) {
    const cs = contactSels(C.id).join(','), ca = contactSels(A.id).join(',');
    if (cs) css += `.pf-mix-ct :is(${cs}){visibility:visible}\n`;
    if (ca) hide.push(`.pf :is(${ca}):not(.pf-mix-lift *)`);
  }
  return css + (hide.length ? `${hide.join(',')}{visibility:hidden!important;pointer-events:none!important}` : '');
}
/* user layout: element edits + section backgrounds */
function layoutCss(ctx) {
  const U = ctx.data.layout || {};
  let css = elementsCss(ctx.t.id, U.els || {}, ctx.data.mix);
  for (const [id, b] of Object.entries(U.secBg || {})) {
    if (!b || (!b.color && !b.image)) continue;
    const img = ctx.img(b.image), dim = +b.dim || 0;
    const layers = [];
    if (img) { if (dim) layers.push(`linear-gradient(rgba(0,0,0,${dim}),rgba(0,0,0,${dim}))`); layers.push(`url("${img.replace(/"/g, '%22')}") center/cover no-repeat`); }
    if (b.color) layers.push(b.color);
    css += `.pf .pf-sec-${id}{background:${layers.join(',')}!important}`;
    if (b.fg) css += `.pf .pf-sec-${id}{--fg:${b.fg};color:${b.fg}}`;
  }
  css += textFxCss({ data: ctx.data, ctx });
  return css;
}

/* ───────────────────────── components ───────────────────────── */
const KIND = {
  project: { label: 'Project', icon: 'briefcase' },
  post: { label: 'Post', icon: 'post' },
  instagram: { label: 'Instagram', icon: 'instagram' },
  linkedin: { label: 'LinkedIn', icon: 'linkedin' },
};
PF.KIND = KIND;

function mediaOrPh(ctx, src, kind, text, alt) {
  if (src) return `<img src="${esc(src)}" alt="${esc(alt || '')}" loading="lazy" decoding="async" draggable="false">`;
  return `<span class="pf-ph" data-kind="${esc(kind)}">${I((KIND[kind] || {}).icon || kind || 'spark')}<span class="pf-ph-t">${esc((text || '').slice(0, 90))}</span></span>`;
}

function worksCard(ctx, it, i) {
  const k = KIND[it.kind] || KIND.project;
  return `<button class="pf-card pf-work" data-kind="${esc(it.kind)}" data-open="work:${esc(it.id)}" style="--i:${i}" data-hover>
    <span class="pf-card-media">${mediaOrPh(ctx, ctx.img(it.image), it.kind, it.text, it.title)}${it.video ? `<span class="pf-play">${I('play')}</span>` : ''}</span>
    <span class="pf-card-body">
      <span class="pf-card-meta"><span class="pf-card-kind">${I(k.icon)}${esc(k.label)}</span><span class="pf-card-date">${fmtDate(it.date)}</span></span>
      <span class="pf-card-title">${esc(it.title || k.label)}</span>
    </span></button>`;
}
const LANG_COLORS = { JavaScript: '#f1e05a', TypeScript: '#3178c6', Python: '#3572A5', HTML: '#e34c26', CSS: '#563d7c', 'C++': '#f34b7d', 'C#': '#178600', C: '#555555', Java: '#b07219', Shell: '#89e051', Jupyter: '#DA5B0B', 'Jupyter Notebook': '#DA5B0B', Vue: '#41b883', Go: '#00ADD8', Rust: '#dea584', Swift: '#F05138', Kotlin: '#A97BFF', GDScript: '#355570', ShaderLab: '#222c37', HLSL: '#aace60', Processing: '#0096D8', Arduino: '#00979D', 'G-code': '#D08CF2', OpenSCAD: '#e5cd45' };
function repoCard(ctx, r, i) {
  return `<a class="pf-card pf-repo" href="${esc(r.html_url)}" target="_blank" rel="noopener" style="--i:${i}" data-hover>
    <span class="pf-repo-top">${I('github')}<span class="pf-repo-name">${esc(r.name.replace(/[-_]/g, ' '))}</span></span>
    <span class="pf-repo-desc">${esc(r.description || 'No description yet.')}</span>
    <span class="pf-repo-meta">${r.language ? `<span class="pf-lang"><i style="background:${LANG_COLORS[r.language] || 'currentColor'}"></i>${esc(r.language)}</span>` : ''}${r.stargazers_count ? `<span>${I('star')}${r.stargazers_count}</span>` : ''}<span>${fmtDate(r.pushed_at)}</span>${r.homepage ? `<span class="pf-repo-live" data-href="${esc(r.homepage)}">${I('external')}Live</span>` : ''}</span>
  </a>`;
}
function appCard(ctx, a, i) {
  const live = a.url || a.html;
  return `<button class="pf-card pf-app" ${live ? `data-open="app:${esc(a.id)}"` : 'disabled'} style="--i:${i}" data-hover>
    <span class="pf-card-media">${mediaOrPh(ctx, ctx.img(a.image), 'app', a.title, a.title)}</span>
    <span class="pf-card-body"><span class="pf-card-meta"><span class="pf-card-kind">${I('app')}${live ? 'Web app' : 'Coming soon'}</span><span class="pf-card-date">${fmtDate(a.date)}</span></span>
    <span class="pf-card-title">${esc(a.title)}</span><span class="pf-card-text">${esc(a.text || '')}</span></span></button>`;
}

function pagerShell(id, extraCls = '') {
  return `<div class="pf-pager ${extraCls}" data-pager="${id}"><div class="pf-grid" role="list"></div>
    <div class="pf-pager-nav" hidden><button class="pf-pg pf-pg-prev" data-page="-1" aria-label="Previous page" data-hover>${I('arrowLeft')}</button><span class="pf-pg-count"><b>1</b><span>/</span><span class="pf-pg-total">1</span></span><button class="pf-pg pf-pg-next" data-page="1" aria-label="Next page" data-hover>${I('arrow')}</button></div></div>`;
}
function tabsShell(name, tabs) {
  return `<div class="pf-tabs" role="tablist" data-tabs="${name}">${tabs.map((t, i) => `<button class="pf-tab" role="tab" aria-selected="${i === 0}" data-tab="${t.id}" data-hover>${t.icon ? I(t.icon) : ''}<span>${esc(t.label)}</span>${t.count != null ? `<em>${t.count}</em>` : ''}</button>`).join('')}</div>`;
}

function sectionBody(ctx, sec) {
  const d = ctx.data;
  if (sec.id === 'works') {
    const igOn = d.works?.instagram && ((d.works.instagram.mode && d.works.instagram.mode !== 'manual') || d.works.instagram.snapshot?.posts?.length);
    const kinds = [...new Set([...(d.works?.items || []).map((x) => x.kind), ...(igOn ? ['instagram'] : [])])];
    const chips = d.works?.showFilters !== false && kinds.length > 1
      ? `<div class="pf-chips" role="toolbar" aria-label="Filter works"><button class="pf-chip" aria-pressed="true" data-filter="all" data-hover>All</button>${kinds.map((k) => `<button class="pf-chip" aria-pressed="false" data-filter="${k}" data-hover>${I(KIND[k]?.icon || 'spark')}${esc(KIND[k]?.label || k)}</button>`).join('')}</div>` : '';
    return `<div class="pf-works"><div class="pf-works-top">${chips || '<span></span>'}<a class="pf-igp" target="_blank" rel="noopener" hidden data-hover></a></div>${pagerShell('works')}</div>`;
  }
  if (sec.id === 'sandbox') {
    const gh = d.sandbox?.github?.user;
    const tabs = [];
    if (gh) tabs.push({ id: 'code', label: 'GitHub', icon: 'github' });
    tabs.push({ id: 'apps', label: 'Web apps', icon: 'app', count: (d.sandbox?.apps || []).length });
    return `<div class="pf-sandbox">${tabsShell('sandbox', tabs)}<div class="pf-panels">${gh ? `<div class="pf-panel" data-panel="code">${pagerShell('repos')}<a class="pf-more" href="https://github.com/${esc(gh)}" target="_blank" rel="noopener" data-hover>${I('github')}<span>github.com/${esc(gh)}</span>${I('external')}</a></div>` : ''}<div class="pf-panel" data-panel="apps" ${gh ? 'hidden' : ''}>${pagerShell('apps')}</div></div></div>`;
  }
  if (sec.id === 'about') {
    const a = d.about || {};
    const tabs = [{ id: 'profile', label: 'Profile', icon: 'user' }];
    if (a.experience?.length) tabs.push({ id: 'xp', label: 'Experience', icon: 'briefcase' });
    if (a.education?.length) tabs.push({ id: 'edu', label: 'Education', icon: 'cap' });
    if (a.skills?.length) tabs.push({ id: 'skills', label: 'Skills', icon: 'spark' });
    const photo = ctx.img(a.photo || ctx.P.photo);
    return `<div class="pf-about">${tabsShell('about', tabs)}<div class="pf-panels">
      <div class="pf-panel pf-profile" data-panel="profile">
        ${photo ? `<figure class="pf-profile-img"><img src="${esc(photo)}" alt="${esc(ctx.name)}" draggable="false"></figure>` : ''}
        <div class="pf-profile-txt">
          <p class="pf-bio">${esc(a.bio || ctx.P.tagline || '')}</p>
          <button class="pf-link pf-bio-more" data-open="bio" data-hover>Read more</button>
          ${a.stats?.length ? `<dl class="pf-stats">${a.stats.map((s, i) => `<div style="--i:${i}"><dt>${esc(s.label)}</dt><dd>${esc(s.value)}</dd></div>`).join('')}</dl>` : ''}
          <div class="pf-profile-actions">${a.resume?.url ? `<button class="pf-btn" data-open="resume" data-hover>${I('file')}<span>${esc(a.resume.label || 'Resume')}</span></button>` : ''}<button class="pf-btn pf-btn-ghost" data-contact data-hover>${I('email')}<span>Contact</span></button></div>
          ${ctx.copyright ? `<p class="pf-copy">${esc(ctx.copyright)}</p>` : ''}
        </div>
      </div>
      ${a.experience?.length ? `<div class="pf-panel" data-panel="xp" hidden>${pagerShell('xp', 'pf-pager-list')}</div>` : ''}
      ${a.education?.length ? `<div class="pf-panel" data-panel="edu" hidden>${pagerShell('edu', 'pf-pager-list')}</div>` : ''}
      ${a.skills?.length ? `<div class="pf-panel" data-panel="skills" hidden>${pagerShell('skills', 'pf-pager-list')}</div>` : ''}
    </div></div>`;
  }
  if (sec.id === 'portfolio') {
    const items = d.portfolio?.items || [];
    return `<div class="pf-port" style="--n:${items.length}">${items.map((p, i) => `<button class="pf-port-item" data-open="port:${esc(p.id)}" style="--i:${i}" ${p.url ? '' : 'data-empty'} data-hover>
      <span class="pf-port-media">${mediaOrPh(ctx, ctx.img(p.image), 'post', p.title, p.title)}</span>
      <span class="pf-port-body"><span class="pf-port-n">${pad2(i + 1)}</span><span class="pf-port-t">${esc(p.title)}</span><span class="pf-port-s">${esc(p.text || '')}</span><span class="pf-port-cta">${I('file')}<span>${p.url ? 'Open portfolio' : 'Add a Google Drive link'}</span></span></span>
    </button>`).join('')}</div>`;
  }
  return '';
}

/* ───────────────────────── pager ───────────────────────── */
class Pager {
  constructor(el, { items, render, min = [15, 13], onEmpty, cols }) {
    this.el = el; this.grid = $('.pf-grid', el); this.nav = $('.pf-pager-nav', el);
    this.items = items; this.render = render; this.min = min; this.page = 0; this.per = 1; this.onEmpty = onEmpty; this.fixedCols = cols;
    this.layout = this.layout.bind(this);
    this.ro = new ResizeObserver(() => this.layout());
    this.ro.observe(this.el);
    el.__pager = this;
  }
  setItems(items) { this.items = items; this.page = 0; this.layout(true); }
  layout(force) {
    const r = this.grid.getBoundingClientRect();
    if (!r.width || !r.height) return;
    const fs = parseFloat(getComputedStyle(this.grid).fontSize) || 16;
    const cs = getComputedStyle(this.grid);
    const gx = parseFloat(cs.columnGap) || 0, gy = parseFloat(cs.rowGap) || 0;
    const mw = this.min[0] * fs, mh = this.min[1] * fs;
    const want = this.fixedCols ? +this.fixedCols() || 0 : 0; // user's "items per row" for this screen, 0 = automatic
    const cols = want > 0 ? want : Math.max(1, Math.floor((r.width + gx) / (mw + gx)));
    // a fixed column count keeps each card's proportions: narrower cards get shorter, wider ones taller
    const ch = want > 0 ? clamp(mh * (((r.width - gx * (cols - 1)) / cols) / mw), mh * 0.55, mh * 1.05) : mh;
    const rows = Math.max(1, Math.floor((r.height + gy) / (ch + gy)));
    const per = cols * rows;
    if (!force && per === this.per && cols === this.cols && this.drawn) return;
    const first = this.page * this.per;
    this.per = per; this.cols = cols; this.rows = rows;
    this.page = Math.floor(first / per);
    this.draw();
  }
  get pages() { return Math.max(1, Math.ceil(this.items.length / this.per)); }
  go(delta) {
    const p = clamp(this.page + delta, 0, this.pages - 1);
    if (p === this.page) return false;
    this.dir = delta; this.page = p; this.draw(); return true;
  }
  draw() {
    this.drawn = true;
    const g = this.grid;
    g.style.setProperty('--cols', this.cols); g.style.setProperty('--rows', this.rows);
    const slice = this.items.slice(this.page * this.per, this.page * this.per + this.per);
    g.innerHTML = slice.length ? slice.map((it, i) => this.render(it, i)).join('') : (this.onEmpty ? this.onEmpty() : '<p class="pf-empty">Nothing here yet.</p>');
    g.dataset.dir = this.dir > 0 ? 'next' : this.dir < 0 ? 'prev' : '';
    g.classList.remove('pf-paged'); void g.offsetWidth; g.classList.add('pf-paged');
    const n = this.pages;
    this.nav.hidden = n < 2;
    const b = $('b', this.nav); if (b) b.textContent = this.page + 1;
    const tt = $('.pf-pg-total', this.nav); if (tt) tt.textContent = n;
    const pv = $('.pf-pg-prev', this.nav), nx = $('.pf-pg-next', this.nav);
    if (pv) pv.disabled = this.page === 0; if (nx) nx.disabled = this.page >= n - 1;
  }
  destroy() { this.ro.disconnect(); }
}

/* ───────────────────────── transitions ───────────────────────── */
const EASE = 'cubic-bezier(.76,0,.24,1)';
const OUT = 'cubic-bezier(.16,1,.3,1)';
const TRANSITIONS = {
  fade(from, to) { return [from.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 380, easing: 'ease', fill: 'forwards' }), to.animate([{ opacity: 0, transform: 'scale(1.015)' }, { opacity: 1, transform: 'none' }], { duration: 700, delay: 180, easing: OUT, fill: 'both' })]; },
  slide(from, to, dir, ax) {
    const p = ax === 'x' ? 'X' : 'Y';
    return [from.animate([{ transform: 'none' }, { transform: `translate${p}(${-dir * 28}%)`, opacity: 0.3 }], { duration: 950, easing: EASE, fill: 'forwards' }),
      to.animate([{ transform: `translate${p}(${dir * 100}%)` }, { transform: 'none' }], { duration: 950, easing: EASE, fill: 'both' })];
  },
  depth(from, to, dir) {
    return [from.animate([{ transform: 'none', opacity: 1, filter: 'blur(0)' }, { transform: `scale(${dir > 0 ? 0.9 : 1.1})`, opacity: 0, filter: 'blur(10px)' }], { duration: 700, easing: EASE, fill: 'forwards' }),
      to.animate([{ transform: `scale(${dir > 0 ? 1.12 : 0.9})`, opacity: 0, filter: 'blur(10px)' }, { transform: 'none', opacity: 1, filter: 'blur(0)' }], { duration: 900, delay: 160, easing: OUT, fill: 'both' })];
  },
  curtain(from, to, dir) {
    const s = dir > 0 ? 'inset(100% 0 0 0)' : 'inset(0 0 100% 0)';
    return [from.animate([{ transform: 'none' }, { transform: `translateY(${-dir * 18}%) scale(.96)`, opacity: 0.5 }], { duration: 1000, easing: EASE, fill: 'forwards' }),
      to.animate([{ clipPath: s }, { clipPath: 'inset(0 0 0 0)' }], { duration: 1000, easing: EASE, fill: 'both' })];
  },
  circle(from, to, dir, ax, pt) {
    const at = `${pt.x}px ${pt.y}px`;
    return [from.animate([{ transform: 'none' }, { transform: 'scale(.94)', opacity: 0.4 }], { duration: 900, easing: EASE, fill: 'forwards' }),
      to.animate([{ clipPath: `circle(0% at ${at})` }, { clipPath: `circle(150% at ${at})` }], { duration: 1000, easing: 'cubic-bezier(.6,0,.2,1)', fill: 'both' })];
  },
  wipe(from, to, dir, ax, pt, root) {
    const w = $('.pf-wipe', root);
    const a = w.animate([{ transform: `translateY(${dir * 100}%)` }, { transform: 'none', offset: 0.45 }, { transform: 'none', offset: 0.55 }, { transform: `translateY(${-dir * 100}%)` }], { duration: 1100, easing: EASE });
    return [a, from.animate([{ opacity: 1 }, { opacity: 1, offset: 0.49 }, { opacity: 0, offset: 0.5 }, { opacity: 0 }], { duration: 1100, fill: 'forwards' }),
      to.animate([{ opacity: 0 }, { opacity: 0, offset: 0.5 }, { opacity: 1, offset: 0.51, transform: `translateY(${dir * 4}%)` }, { opacity: 1, transform: 'none' }], { duration: 1300, easing: OUT, fill: 'both' })];
  },
  glitch(from, to) {
    const k = [];
    for (let i = 0; i <= 8; i++) { const y = Math.random() * 80; k.push({ clipPath: i === 8 ? 'inset(0 0 0 0)' : `inset(${y}% 0 ${Math.max(0, 90 - y - Math.random() * 30)}% 0)`, transform: i === 8 ? 'none' : `translateX(${(Math.random() - 0.5) * 6}%)`, filter: i === 8 ? 'none' : `hue-rotate(${Math.random() * 90}deg)`, offset: i / 8 }); }
    return [from.animate([{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateX(-2%) skewX(-4deg)' }], { duration: 420, easing: 'steps(4)', fill: 'forwards' }), to.animate(k, { duration: 520, delay: 120, fill: 'both' })];
  },
  shutter(from, to, dir, ax, pt, root) {
    const sh = $('.pf-shutter', root);
    const bars = $$('i', sh);
    const anims = bars.map((b, i) => b.animate([{ transform: 'scaleY(0)', transformOrigin: dir > 0 ? 'bottom' : 'top' }, { transform: 'scaleY(1)', offset: 0.45 }, { transform: 'scaleY(1)', offset: 0.55, transformOrigin: dir > 0 ? 'top' : 'bottom' }, { transform: 'scaleY(0)', transformOrigin: dir > 0 ? 'top' : 'bottom' }], { duration: 1100, delay: i * 45, easing: EASE }));
    return [...anims, from.animate([{ opacity: 1 }, { opacity: 0, offset: 0.5 }, { opacity: 0 }], { duration: 1000, fill: 'forwards' }), to.animate([{ opacity: 0 }, { opacity: 0, offset: 0.5 }, { opacity: 1 }], { duration: 1200, fill: 'both' })];
  },
  flip(from, to, dir) {
    return [from.animate([{ transform: 'perspective(1600px) rotateX(0)', opacity: 1 }, { transform: `perspective(1600px) rotateX(${dir * 70}deg) translateZ(-200px)`, opacity: 0 }], { duration: 800, easing: EASE, fill: 'forwards' }),
      to.animate([{ transform: `perspective(1600px) rotateX(${-dir * 70}deg) translateZ(-200px)`, opacity: 0 }, { transform: 'perspective(1600px) rotateX(0)', opacity: 1 }], { duration: 900, delay: 250, easing: OUT, fill: 'both' })];
  },
};
TRANSITIONS.slideX = (f, t, d) => TRANSITIONS.slide(f, t, d, 'x');
TRANSITIONS.slideY = (f, t, d) => TRANSITIONS.slide(f, t, d, 'y');
TRANSITIONS.zoom = (from, to, dir) => [
  from.animate([{ transform: 'none', opacity: 1 }, { transform: `scale(${dir > 0 ? 1.25 : 0.8})`, opacity: 0 }], { duration: 650, easing: EASE, fill: 'forwards' }),
  to.animate([{ transform: `scale(${dir > 0 ? 0.8 : 1.25})`, opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 800, delay: 120, easing: OUT, fill: 'both' }),
];
TRANSITIONS.split = (from, to) => [
  to.animate([{ clipPath: 'inset(0 50% 0 50%)' }, { clipPath: 'inset(0 0 0 0)' }], { duration: 950, easing: EASE, fill: 'both' }),
  from.animate([{ transform: 'none', opacity: 1 }, { transform: 'scale(.92)', opacity: 0.2 }], { duration: 950, easing: EASE, fill: 'forwards' }),
];
TRANSITIONS.blur = (from, to) => [
  from.animate([{ filter: 'blur(0)', opacity: 1 }, { filter: 'blur(24px)', opacity: 0 }], { duration: 500, easing: 'ease-in', fill: 'forwards' }),
  to.animate([{ filter: 'blur(24px)', opacity: 0 }, { filter: 'blur(0)', opacity: 1 }], { duration: 700, delay: 250, easing: OUT, fill: 'both' }),
];
TRANSITIONS.push = (from, to, dir) => [
  from.animate([{ transform: 'none' }, { transform: `translateY(${-dir * 100}%)` }], { duration: 900, easing: EASE, fill: 'forwards' }),
  to.animate([{ transform: `translateY(${dir * 100}%)` }, { transform: 'none' }], { duration: 900, easing: EASE, fill: 'both' }),
];
PF.TRANSITIONS = TRANSITIONS;

/* ───────────────────────── cursor ───────────────────────── */
export const CURSOR_DEFAULTS = { style: 'template', size: 1, color: '', follow: 0.45, grow: true, labels: true, label: 'View', click: true, magnetic: -1, snap: 0, snapReach: 40, hideNative: false, image: '' };
export function cursorCfg(ctx) {
  const t = ctx.t, d = ctx.data;
  const u = { ...CURSOR_DEFAULTS, ...(d.cursor || {}) };
  const tdef = typeof t.cursor === 'string' ? t.cursor : t.cursor === false ? 'system' : 'dotring';
  let style = !u.style || u.style === 'template' ? tdef : u.style;
  if (d.theme?.cursor === false && (!d.cursor?.style || d.cursor.style === 'template')) style = 'system';
  if (style === 'image' && !ctx.img(u.image)) style = 'dotring';
  const magnetic = u.magnetic == null || +u.magnetic < 0 ? (t.magnetic ?? 0) : +u.magnetic;
  return { ...u, style, magnetic, size: clamp(+u.size || 1, 0.4, 3), follow: clamp(+u.follow, 0, 1) };
}
function cursorHtml(ctx, opts) {
  if (opts.static) return '';
  const c = cursorCfg(ctx);
  if (c.style === 'system' && !c.magnetic) return '';
  const st = [`--cs:${c.size}`]; if (c.color) st.push(`--cc:${esc(c.color)}`);
  return `<div class="pf-cursor" data-cs="${esc(c.style)}" ${c.hideNative || c.style === 'image' ? 'data-nonative' : ''} style="${st.join(';')}" aria-hidden="true">
    ${c.style === 'trail' ? '<canvas class="pf-cur-trail"></canvas>' : ''}${c.style === 'glow' ? '<i class="pf-cur-g"></i>' : ''}${c.style === 'crosshair' ? '<i class="pf-cur-x"></i><i class="pf-cur-y"></i>' : ''}
    <i class="pf-cur-d"></i><b class="pf-cur-r"><span class="pf-cur-l"></span></b>
    ${c.style === 'brackets' ? '<s class="pf-cur-br"><em></em><em></em><em></em><em></em></s>' : ''}${c.style === 'image' ? `<img class="pf-cur-img" src="${esc(ctx.img(c.image))}" alt="">` : ''}
    <span class="pf-cur-p"></span></div>`;
}
const HOVER_SEL = 'a,button,[data-hover],input,label,[data-cursor],[data-drag]';
const CARD_SEL = '.pf-work,.pf-port-item,.pf-app,.pf-repo';
const MAG_SEL = '[data-magnetic],[data-mag],.pf-btn,.pf-ct,.pf-nav-a,.pf-pg,.pf-chip,.pf-tab,.pf-burger,.pf-igp';
function bindCursor(st, on) {
  const { root } = st;
  const cfg = cursorCfg(st.ctx);
  const reduce = root.dataset.motion === 'off' || matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(pointer:fine)').matches;
  // magnetic buttons
  const strength = cfg.magnetic;
  let magEl = null;
  const release = (el) => {
    const cur = el.style.translate; if (!cur) return;
    el.style.translate = '';
    if (!reduce) { try { el.animate([{ translate: cur }, { translate: '0px 0px' }], { duration: 650, easing: 'cubic-bezier(.34,1.7,.5,1)' }); } catch { /* old browser */ } }
  };
  if (fine && !reduce) on(root, 'pointermove', (e) => {
    const m = e.target.closest?.(MAG_SEL);
    const ok = m && (m.matches('[data-magnetic]') || strength > 0) && root.contains(m) && !root.classList.contains('pf-editing');
    if (magEl && magEl !== m) { release(magEl); magEl = null; }
    if (!ok) return;
    if (m !== magEl) { const t = getComputedStyle(m).translate; if (t && t !== 'none' && !m.style.translate) return; magEl = m; }
    const r = m.getBoundingClientRect();
    const k = Math.max(strength, m.matches('[data-magnetic]') ? 0.35 : 0) * 0.45;
    const dx = (e.clientX - (r.left + r.width / 2)) * k, dy = (e.clientY - (r.top + r.height / 2)) * k;
    const cap = 14 + 22 * strength;
    m.style.translate = `${clamp(dx, -cap, cap).toFixed(1)}px ${clamp(dy, -cap, cap).toFixed(1)}px`;
  }, { passive: true });
  on(root, 'pointerleave', () => { if (magEl) { release(magEl); magEl = null; } });

  const el = $('.pf-cursor', root);
  if (!el || cfg.style === 'system' || !fine) return;
  const R = (s) => $(s, el);
  const d = R('.pf-cur-d'), r = R('.pf-cur-r'), l = R('.pf-cur-l'), p = R('.pf-cur-p'), br = R('.pf-cur-br'), im = R('.pf-cur-img'), g = R('.pf-cur-g'), xl = R('.pf-cur-x'), yl = R('.pf-cur-y'), cv = R('.pf-cur-trail');
  const k = reduce ? 1 : clamp(0.42 - cfg.follow * 0.37, 0.05, 0.6);
  let px = -200, py = -200, cx = px, cy = py, pcx = px, pcy = py, raf = 0, shown = false, tgt = null, label = '';
  let bx = 0, by = 0, bw = 22, bh = 22; const trail = [];
  let W = 0, H = 0, ctx2 = null, dpr = 1;
  if (cv) { ctx2 = cv.getContext('2d'); const size = () => { dpr = Math.min(2, devicePixelRatio || 1); W = root.clientWidth; H = root.clientHeight; cv.width = W * dpr; cv.height = H * dpr; }; size(); const ro = new ResizeObserver(size); ro.observe(root); st.cleanups.push(() => ro.disconnect()); }
  const col = () => getComputedStyle(el).getPropertyValue('--cc').trim() || getComputedStyle(root).getPropertyValue('--accent').trim();
  let trailCol = '';
  const labelOf = (h) => {
    if (!h || !cfg.labels) return '';
    const own = h.closest('[data-cursor]'); if (own) return own.dataset.cursor;
    if (h.closest('[data-drag]')) return 'Drag';
    if (h.closest(CARD_SEL)) return cfg.label || 'View';
    if (cfg.style === 'pill' || cfg.style === 'brackets' || cfg.style === 'crosshair') return h.getAttribute('aria-label') || h.title || (h.querySelector('.pf-nav-l')?.textContent || h.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 28);
    return '';
  };
  const setTarget = (h) => {
    tgt = h; label = labelOf(h);
    el.classList.toggle('is-hover', !!h && cfg.grow !== false);
    el.classList.toggle('is-label', !!label);
    if (label) { l.textContent = label; p.textContent = label; } else if (cfg.style !== 'crosshair') p.textContent = '';
  };
  // cursor snap: the drawn cursor is pulled toward the nearest button / link (the reverse of magnetic buttons)
  const snapK = clamp(+cfg.snap || 0, 0, 1), reach = clamp(+cfg.snapReach || 0, 0, 200);
  let cands = [], candAt = 0, sx = px, sy = py, snapEl = null, nativeHover = null;
  const SNAP_SEL = 'a,button,[data-hover],[data-cursor],' + MAG_SEL;
  const snapPoint = () => {
    if (!snapK) return null;
    const now = performance.now();
    if (now - candAt > 400) {
      candAt = now;
      const RR = root.getBoundingClientRect();
      cands = $$(SNAP_SEL, root).filter((x) => { if (x.closest('.pf-sec:not(.is-on),[hidden],.pf-mix-off,.pf-modal[hidden]')) return false; const q = x.getBoundingClientRect(); return q.width > 0 && q.height > 0 && q.width < RR.width * 0.4 && q.height < RR.height * 0.4 && getComputedStyle(x).visibility !== 'hidden'; });
    }
    const RR = root.getBoundingClientRect();
    let best = null, bd = Infinity;
    for (const x of cands) {
      const q = x.getBoundingClientRect(), l = q.left - RR.left, t = q.top - RR.top;
      const dx = Math.max(l - px, 0, px - (l + q.width)), dy = Math.max(t - py, 0, py - (t + q.height)), dist = Math.hypot(dx, dy);
      if (dist <= reach && dist < bd) { bd = dist; best = [l + q.width / 2, t + q.height / 2, x, l, t, q.width, q.height]; }
    }
    if (!best) return null;
    const fall = reach > 0 ? 1 - bd / (reach + 1) : 1; // full pull inside the element, fading to 0 at the edge of reach
    return [best[0], best[1], snapK * fall, best[2], best[3], best[4], best[5], best[6]];
  };
  const tick = () => {
    raf = 0;
    const sp = snapPoint();
    sx = sp ? px + (sp[0] - px) * sp[2] : px; sy = sp ? py + (sp[1] - py) * sp[2] : py;
    // the drawn cursor sits on an element it snapped to → treat that element as hovered (grow, label)
    const onEl = sp && sx >= sp[4] - 2 && sx <= sp[4] + sp[6] + 2 && sy >= sp[5] - 2 && sy <= sp[5] + sp[7] + 2 ? sp[3] : null;
    const want = nativeHover || onEl;
    snapEl = !nativeHover && onEl ? onEl : null;
    if (want !== tgt) setTarget(want);
    cx += (sx - cx) * k; cy += (sy - cy) * k;
    pcx += (sx - pcx) * Math.min(1, k * 0.8); pcy += (sy - pcy) * Math.min(1, k * 0.8);
    d.style.transform = `translate3d(${sx.toFixed(1)}px,${sy.toFixed(1)}px,0)`;
    r.style.transform = `translate3d(${cx.toFixed(1)}px,${cy.toFixed(1)}px,0)`;
    if (im) im.style.transform = `translate3d(${sx.toFixed(1)}px,${sy.toFixed(1)}px,0)`;
    if (g) g.style.transform = `translate3d(${cx.toFixed(1)}px,${cy.toFixed(1)}px,0)`;
    if (xl) xl.style.transform = `translate3d(${cx.toFixed(1)}px,0,0)`;
    if (yl) yl.style.transform = `translate3d(0,${cy.toFixed(1)}px,0)`;
    if (cfg.style === 'crosshair' && !label) p.textContent = `x ${String(Math.round(px)).padStart(4, '0')}  y ${String(Math.round(py)).padStart(4, '0')}`;
    p.style.transform = `translate3d(${(cfg.style === 'brackets' ? bx : pcx).toFixed(1)}px,${(cfg.style === 'brackets' ? by + bh : pcy).toFixed(1)}px,0)`;
    let moving = Math.abs(sx - cx) > 0.2 || Math.abs(sy - cy) > 0.2 || Math.abs(sx - pcx) > 0.2;
    if (br) {
      let tx = px - 11 * cfg.size, ty = py - 11 * cfg.size, tw = 22 * cfg.size, th = 22 * cfg.size;
      if (tgt && root.contains(tgt)) { const q = tgt.getBoundingClientRect(), RR = root.getBoundingClientRect(); if (q.width < RR.width * 0.7 && q.height < RR.height * 0.7) { tx = q.left - RR.left - 6; ty = q.top - RR.top - 6; tw = q.width + 12; th = q.height + 12; } }
      const kk = Math.min(1, k * 1.3);
      bx += (tx - bx) * kk; by += (ty - by) * kk; bw += (tw - bw) * kk; bh += (th - bh) * kk;
      br.style.transform = `translate3d(${bx.toFixed(1)}px,${by.toFixed(1)}px,0)`; br.style.width = bw.toFixed(1) + 'px'; br.style.height = bh.toFixed(1) + 'px';
      if (Math.abs(tx - bx) + Math.abs(ty - by) + Math.abs(tw - bw) + Math.abs(th - bh) > 0.5) moving = true;
    }
    if (ctx2) {
      trail.push([cx, cy]); if (trail.length > 26) trail.shift();
      if (!trailCol) trailCol = col();
      ctx2.setTransform(dpr, 0, 0, dpr, 0, 0); ctx2.clearRect(0, 0, W, H);
      ctx2.lineCap = 'round'; ctx2.strokeStyle = trailCol;
      for (let i = 1; i < trail.length; i++) { const a = trail[i - 1], b = trail[i]; ctx2.globalAlpha = i / trail.length; ctx2.lineWidth = (i / trail.length) * 7 * cfg.size; ctx2.beginPath(); ctx2.moveTo(a[0], a[1]); ctx2.lineTo(b[0], b[1]); ctx2.stroke(); }
      const last = trail[0]; if (last && (Math.abs(last[0] - px) > 0.5 || Math.abs(last[1] - py) > 0.5)) moving = true;
    }
    if (moving) raf = requestAnimationFrame(tick);
  };
  const kick = () => { if (!raf) raf = requestAnimationFrame(tick); };
  on(window, 'pointermove', (e) => {
    if (e.pointerType !== 'mouse') { if (shown) { root.classList.remove('pf-has-cursor'); shown = false; } return; }
    const RR = root.getBoundingClientRect(); px = e.clientX - RR.left; py = e.clientY - RR.top;
    if (!shown) { shown = true; cx = pcx = px; cy = pcy = py; bx = px; by = py; root.classList.add('pf-has-cursor'); }
    kick();
  }, { passive: true });
  on(root, 'pointerover', (e) => { const h = e.target.closest?.(HOVER_SEL); nativeHover = h && root.contains(h) ? h : null; setTarget(nativeHover || snapEl); kick(); });
  on(document, 'pointerleave', () => { el.classList.add('is-out'); });
  on(document, 'pointerenter', () => { el.classList.remove('is-out'); });
  // a click while the drawn cursor is snapped onto an element (and the real pointer is just beside it) presses that element
  on(root, 'click', (e) => {
    if (!snapEl || !e.isTrusted || e.target.closest?.(HOVER_SEL) || root.classList.contains('pf-editing')) return;
    e.preventDefault(); e.stopPropagation(); const t = snapEl; t.focus?.({ preventScroll: true }); t.click();
  }, true);
  on(window, 'pointerdown', (e) => {
    if (e.pointerType !== 'mouse') return;
    el.classList.add('is-down');
    if (cfg.click !== false && !reduce) {
      const rp = document.createElement('i'); rp.className = 'pf-cur-rip'; rp.style.transform = `translate3d(${sx}px,${sy}px,0)`; el.appendChild(rp);
      rp.animate([{ scale: 0.3, opacity: 0.6 }, { scale: 2.6, opacity: 0 }], { duration: 520, easing: 'cubic-bezier(.23,1,.32,1)' }).finished.then(() => rp.remove()).catch(() => rp.remove());
    }
  });
  on(window, 'pointerup', () => el.classList.remove('is-down'));
  // keep the label in sync when content under a resting pointer changes (section change, paging)
  st.cursorRefresh = () => { const h = document.elementFromPoint?.(px + root.getBoundingClientRect().left, py + root.getBoundingClientRect().top); const t = h?.closest?.(HOVER_SEL); nativeHover = t && root.contains(t) ? t : null; candAt = 0; setTarget(nativeHover || snapEl); kick(); };
  st.cleanups.push(() => cancelAnimationFrame(raf));
}


/* ───────────────────────── text animation ───────────────────────── */
// Visitor-facing text effects chosen in Design → Text animation. Three targets: the main name, section titles,
// and smaller text (pitch / subtitles). 'template' keeps each template's own effect, 'none' switches it off.
export const TEXT_FX = ['template', 'none', 'fade', 'rise', 'blur', 'zoom', 'words', 'letters', 'wave', 'scramble', 'typewriter'];
const TEXTFX_DEFAULTS = { on: true, name: 'template', heads: 'template', body: 'template', speed: 1, stagger: 1, replay: 'always' };
const NAME_SEL = { bento: '.bt-name h1', marquee: '' }; // marquee's name is a running loop: leave it alone
function textCfg(data) { return { ...TEXTFX_DEFAULTS, ...(data.textfx || {}) }; }
function textTargets(st) {
  const c = textCfg(st.data), h = st.ctx.parts?.hero?.id || st.ctx.t.id;
  const els = TEMPLATE_ELS[h] || {};
  const nameSel = h in NAME_SEL ? NAME_SEL[h] : (els.name?.[1] || els.title?.[1] || '.pf-home h1:not(.pf-sr)');
  const bodySel = [els.pitch?.[1], els.statement?.[1]].filter(Boolean).join(',');
  const pick = (k) => (c.on === false ? 'none' : c[k] || 'template');
  return [
    { k: 'name', fx: pick('name'), sel: nameSel ? nameSel.split(',').map((x) => '.pf-sec-home ' + x.trim()).join(',') : '' },
    { k: 'heads', fx: pick('heads'), sel: '.pf-head-t' },
    { k: 'body', fx: pick('body'), sel: [bodySel ? bodySel.split(',').map((x) => '.pf-sec-home ' + x.trim()).join(',') : '', '.pf-head-s'].filter(Boolean).join(',') },
  ].filter((t) => t.sel);
}
/** CSS for 'none' (switch the template's own text transitions off) and for split letters/words. */
function textFxCss(st) {
  const c = textCfg(st.data);
  let css = '.pf-tw,.pf-tc{display:inline-block;white-space:pre}.pf-tw-m{display:inline-block;overflow:hidden;vertical-align:top;padding-bottom:.08em;margin-bottom:-.08em}.pf-caret{display:inline-block;width:.06em;height:.9em;margin-left:.04em;vertical-align:-.05em;background:currentColor;animation:pfCaret .8s steps(1) infinite}@keyframes pfCaret{50%{opacity:0}}';
  for (const t of textTargets(st)) {
    if (t.fx === 'template') continue;
    // our effect (or none) replaces the template's own transition-based text reveal
    css += `.pf :is(${t.sel}),.pf :is(${t.sel}) *{transition-property:none!important}`;
  }
  return css;
}
function splitText(el, mode) {
  if (el.dataset.taSplit === mode) return [...el.querySelectorAll(mode === 'words' ? '.pf-tw' : '.pf-tc')];
  if (el.dataset.taSplit) { el.innerHTML = el.dataset.taHtml; }
  else el.dataset.taHtml = el.innerHTML;
  if (!el.hasAttribute('aria-label') && !el.querySelector('a,button')) el.setAttribute('aria-label', el.textContent.replace(/\s+/g, ' ').trim());
  const out = [];
  const walk = (node) => {
    for (const n of [...node.childNodes]) {
      if (n.nodeType === 3) {
        const txt = n.nodeValue; if (!txt.trim()) continue;
        const frag = document.createDocumentFragment();
        for (const part of txt.split(/(\s+)/)) {
          if (!part) continue;
          if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); continue; }
          if (mode === 'words') { const m = document.createElement('span'); m.className = 'pf-tw-m'; const w = document.createElement('span'); w.className = 'pf-tw'; w.textContent = part; w.setAttribute('aria-hidden', 'true'); m.appendChild(w); frag.appendChild(m); out.push(w); }
          else { const w = document.createElement('span'); w.className = 'pf-tw'; w.setAttribute('aria-hidden', 'true'); for (const ch of [...part]) { const s2 = document.createElement('span'); s2.className = 'pf-tc'; s2.textContent = ch; s2.dataset.ch = ch; w.appendChild(s2); out.push(s2); } frag.appendChild(w); }
        }
        n.replaceWith(frag);
      } else if (n.nodeType === 1 && !/^(svg|img|canvas|video|iframe)$/i.test(n.tagName)) walk(n);
    }
  };
  walk(el);
  el.dataset.taSplit = mode;
  return out;
}
const GLY = '!<>-_\\/[]{}=+*^?#01ABCDEFGHJKLMNPRSTUVWXYZ';
function playTextFx(st, sec, first) {
  const root = st.root;
  if (root.dataset.motion === 'off' || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const c = textCfg(st.data);
  if (c.replay === 'once' && !first) return;
  const sp = Math.max(0.3, Math.min(3, +c.speed || 1)), sg = Math.max(0.2, Math.min(3, +c.stagger || 1));
  const E = 'cubic-bezier(.16,1,.3,1)';
  for (const t of textTargets(st)) {
    if (t.fx === 'template') continue;
    if (t.fx === 'none') { sec.querySelectorAll(t.sel).forEach((el) => { el.dataset.taOn = 'none'; }); continue; }
    let base = 120;
    for (const el of sec.querySelectorAll(t.sel)) {
      if (!el.getClientRects().length) continue;
      el.dataset.taOn = t.fx;
      const D = (ms) => ms / sp;
      const whole = { fade: [{ opacity: 0 }, { opacity: 1 }], rise: [{ opacity: 0, transform: 'translateY(.5em)' }, { opacity: 1, transform: 'none' }], blur: [{ opacity: 0, filter: 'blur(14px)' }, { opacity: 1, filter: 'none' }], zoom: [{ opacity: 0, transform: 'scale(.86)' }, { opacity: 1, transform: 'none' }] }[t.fx];
      if (whole) { el.animate(whole, { duration: D(900), delay: D(base), easing: E, fill: 'backwards' }); base += 90; continue; }
      if (t.fx === 'words') {
        const ws = splitText(el, 'words');
        ws.forEach((w, i) => w.animate([{ transform: 'translateY(105%)' }, { transform: 'none' }], { duration: D(900), delay: D(base) + i * 70 * sg / sp, easing: E, fill: 'backwards' }));
        base += 90; continue;
      }
      const cs = splitText(el, 'letters');
      const per = (t.k === 'name' ? 38 : 16) * sg / sp;
      if (t.fx === 'letters') cs.forEach((ch, i) => ch.animate([{ opacity: 0, transform: 'translateY(.4em) rotate(6deg)' }, { opacity: 1, transform: 'none' }], { duration: D(700), delay: D(base) + i * per, easing: E, fill: 'backwards' }));
      else if (t.fx === 'wave') cs.forEach((ch, i) => ch.animate([{ transform: 'translateY(0)', opacity: 0 }, { transform: 'translateY(-.35em)', opacity: 1, offset: 0.4 }, { transform: 'translateY(0)', opacity: 1 }], { duration: D(800), delay: D(base) + i * per, easing: 'cubic-bezier(.34,1.56,.64,1)', fill: 'backwards' }));
      else if (t.fx === 'typewriter') {
        cs.forEach((ch, i) => ch.animate([{ opacity: 0 }, { opacity: 0, offset: 0.999 }, { opacity: 1 }], { duration: 1, delay: D(base) + i * per * 1.6, fill: 'backwards' }));
        const caret = document.createElement('span'); caret.className = 'pf-caret'; caret.setAttribute('aria-hidden', 'true'); el.appendChild(caret);
        setTimeout(() => caret.remove(), D(base) + cs.length * per * 1.6 + 900);
      } else if (t.fx === 'scramble') {
        const t0 = performance.now() + D(base), dur = D(500) + cs.length * per;
        const step = (now) => {
          if (!el.isConnected) return;
          const p = (now - t0) / dur;
          cs.forEach((ch, i) => { const at = i / cs.length; ch.textContent = p >= 1 || at < p ? ch.dataset.ch : (p < 0 ? ' ' : GLY[(Math.random() * GLY.length) | 0]); });
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      }
      base += 90;
    }
  }
}

/* ───────────────────────── runtime ───────────────────────── */
let S = null; // current site state

function render(data, opts = {}) {
  const prev = S;
  const keepIdx = prev ? prev.idx : null;
  if (prev) teardown(prev);
  const ctx = makeCtx(data, opts);
  const t = ctx.t;
  loadFonts(data);
  setStyle('pf-tcss', templateCss(ctx));
  setStyle('pf-vars', themeCss(ctx));
  setStyle('pf-custom', data.theme?.customCss || '');
  setStyle('pf-layout', layoutCss(ctx));
  document.documentElement.lang = data.site?.lang || 'en';
  document.documentElement.dir = data.site?.dir || 'ltr';
  if (!opts.static && data.site?.title) document.title = data.site.title;

  const P = ctx.parts;
  const shells = new Map(ctx.involved.map((T) => { try { return [T, T.shell ? T.shell(ctx.for(T)) : {}]; } catch (e) { console.error(e); return [T, {}]; } }));
  const off = (html) => (html ? `<div class="pf-mix-off" hidden>${html}</div>` : '');
  const others = (k, get, also) => ctx.involved.filter((T) => T !== P[k] && T !== also).map((T) => off(get(T))).join('');
  const lifted = [...new Set([P.menu, P.contacts])].filter((T) => T !== P.nav);
  const liftHtml = lifted.map((T) => `<div class="pf-mix-lift${T === P.menu ? ' pf-mix-menu' : ''}${T === P.contacts ? ' pf-mix-ct' : ''}">${shells.get(T).nav || ''}</div>`).join('');
  const homeOf = (T) => { try { return T.home ? T.home(ctx.for(T)) : ''; } catch (e) { console.error(e); return ''; } };
  const shell = { bg: (shells.get(P.bg).bg || '') + others('bg', (T) => shells.get(T).bg), nav: (ctx.data.mix?.look?.nav ? `<div class="pf-part-nav">${shells.get(P.nav).nav || ''}</div>` : (shells.get(P.nav).nav || '')) + liftHtml + ctx.involved.filter((T) => T !== P.nav && !lifted.includes(T)).map((T) => off(shells.get(T).nav)).join(''), overlay: shells.get(P.nav).overlay || '' };
  const ST = P.sections, SC = ctx.for(ST);
  const motion = opts.static ? 'off' : (data.theme?.motion || 'full');
  const root = document.getElementById('pf') || document.body.appendChild(Object.assign(document.createElement('div'), { id: 'pf' }));
  root.className = 'pf';
  Object.assign(root.dataset, { t: t.id, v: String(ctx.v), motion, grain: data.theme?.grain === false ? 'off' : 'on', fx3d: data.theme?.effects3d === false ? 'off' : 'on', axis: P.nav.axis || 'y' });
  if (ctx.mixed) root.dataset.mix = ctx.involved.filter((T) => T !== t).map((T) => T.id).join(' '); else delete root.dataset.mix;
  if (opts.static) root.dataset.static = '1'; else delete root.dataset.static;

  root.innerHTML = `
    <div class="pf-bg" aria-hidden="true">${shell.bg || ''}</div>
    ${shell.nav || ''}
    <main class="pf-stage">
      ${ctx.secs.map((s) => `<section class="pf-sec pf-sec-${s.id}" id="sec-${esc(s.id)}" data-sec="${esc(s.id)}" data-i="${s.i}" aria-label="${esc(s.label)}" style="--si:${s.i}">${s.id === 'home' ? `<div class="pf-home">${homeOf(P.hero)}${others('hero', homeOf)}</div>` : `<div class="pf-sec-in">${ST.head ? ST.head(SC, s) : ctx.head(s)}<div class="pf-body">${ST.body?.[s.id] ? ST.body[s.id](SC, s) : sectionBody(ctx, s)}</div></div>`}</section>`).join('')}
    </main>
    ${shell.overlay || ''}
    <div class="pf-wipe" aria-hidden="true"></div>
    <div class="pf-shutter" aria-hidden="true">${'<i></i>'.repeat(6)}</div>
    <div class="pf-grain" aria-hidden="true"></div>
    ${cursorHtml(ctx, opts)}
    <div class="pf-modal" role="dialog" aria-modal="true" aria-labelledby="pf-modal-t" hidden>
      <div class="pf-modal-scrim" data-close></div>
      <div class="pf-modal-box">
        <header class="pf-modal-h"><h3 id="pf-modal-t"></h3><div class="pf-modal-acts"><a class="pf-modal-ext" target="_blank" rel="noopener" hidden data-hover>${I('external')}<span>Open</span></a><button class="pf-modal-x" data-close aria-label="Close" data-hover>${I('close')}</button></div></header>
        <div class="pf-modal-b"></div>
      </div>
    </div>
    <div class="pf-live" aria-live="polite"></div>`;

  const st = { ctx, root, data, opts, idx: 0, lock: false, pagers: {}, cleanups: [], listeners: [] };
  S = st;
  const n = ctx.secs.length;
  let start = 0;
  if (keepIdx != null) start = clamp(keepIdx, 0, n - 1);
  else if (opts.section != null) start = clamp(typeof opts.section === 'number' ? opts.section : ctx.secs.findIndex((s) => s.id === opts.section), 0, n - 1);
  else { try { const h = decodeURIComponent(location.hash.slice(1)); const k = ctx.secs.findIndex((s) => s.id === h); if (k >= 0) start = k; } catch { /* no hash */ } }
  st.idx = start;
  $$('.pf-sec', root).forEach((el, i) => setActive(el, i === start));
  root.dataset.cur = ctx.secs[start]?.id || '';
  root.style.setProperty('--prog', n > 1 ? start / (n - 1) : 0);
  markNav(st);

  sizeClasses(st);
  initComponents(st);
  if (!opts.static) bindInput(st);
  if (opts.edit && !opts.static) bindEdit(st);
  each(ctx, (T, c) => { if (T.mount) { const r = T.mount(c, root, st); if (typeof r === 'function') st.cleanups.push(r); } });
  requestAnimationFrame(() => { root.classList.add('pf-ready'); enterHooks(st, start, null); });
  return st;
}

function setActive(el, on) {
  el.classList.toggle('is-on', on);
  el.toggleAttribute('inert', !on);
  el.setAttribute('aria-hidden', on ? 'false' : 'true');
  el.style.visibility = on ? '' : 'hidden';
}
function markNav(st) {
  $$('[data-go]', st.root).forEach((a) => {
    const on = +a.dataset.go === st.idx;
    a.classList.toggle('is-cur', on);
    if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
  });
}
function enterHooks(st, i, prevI) {
  each(st.ctx, (T, c) => { if (T.onEnter) T.onEnter(c, i, prevI, st.root); });
  if (st.ctx.secs[i]?.id === 'sandbox') st.ghAgain?.();
  st.seen = st.seen || new Set();
  const sec = $$('.pf-sec', st.root)[i];
  if (sec && !st.opts.static) { try { playTextFx(st, sec, !st.seen.has(i)); } catch (e) { console.error('[text fx]', e); } }
  st.seen.add(i);
  try { if (window.parent !== window) window.parent.postMessage({ type: 'pf:section', id: st.ctx.secs[i]?.id, i }, '*'); } catch { /* cross-origin */ }
}

function go(i, from = 'nav') {
  const st = S; if (!st) return;
  const n = st.ctx.secs.length;
  const U = st.data.layout || {};
  const want = i;
  if (U.loop && n > 1) i = ((i % n) + n) % n; else i = clamp(i, 0, n - 1);
  if (i === st.idx || st.lock) return;
  const dir = want > st.idx ? 1 : -1;
  const els = $$('.pf-sec', st.root);
  const a = els[st.idx], b = els[i];
  const prevI = st.idx;
  st.idx = i; st.lock = true;
  st.root.dataset.cur = st.ctx.secs[i].id;
  st.root.dataset.dir = dir > 0 ? 'next' : 'prev';
  st.root.style.setProperty('--prog', n > 1 ? i / (n - 1) : 0);
  markNav(st);
  try { history.replaceState(null, '', '#' + st.ctx.secs[i].id); } catch { /* sandboxed */ }
  b.style.visibility = ''; b.removeAttribute('inert'); b.setAttribute('aria-hidden', 'false');
  b.style.zIndex = 2; a.style.zIndex = 1;
  b.classList.remove('is-on');
  const motion = st.root.dataset.motion;
  const reduce = motion === 'off' || matchMedia('(prefers-reduced-motion: reduce)').matches;
  const tname = U.transition && U.transition !== 'default' ? U.transition : (st.ctx.parts.nav.transition || 'fade');
  const speed = Math.max(0.3, Math.min(3, +U.speed || 1));
  const fn = reduce ? TRANSITIONS.fade : (typeof tname === 'function' ? tname : TRANSITIONS[tname] || TRANSITIONS.fade);
  let anims = [];
  if (tname !== 'none' || reduce) { try { anims = fn(a, b, dir, U.transition && U.transition.startsWith('slide') ? (U.transition === 'slideX' ? 'x' : 'y') : (st.ctx.parts.nav.axis || 'y'), st.pt || { x: innerWidth / 2, y: innerHeight / 2 }, st.root, st.ctx) || []; } catch (e) { console.error(e); } }
  if (speed !== 1) anims.forEach((x) => { try { x.updatePlaybackRate(speed); } catch { /* old browser */ } });
  each(st.ctx, (T, c) => { if (T.onLeave) T.onLeave(c, prevI, i, st.root); });
  requestAnimationFrame(() => b.classList.add('is-on'));
  const done = () => {
    if (S !== st) return;
    a.classList.remove('is-on'); setActive(a, false); a.style.zIndex = ''; b.style.zIndex = '';
    anims.forEach((x) => { try { x.cancel(); } catch { /* finished */ } });
    a.style.transform = ''; a.style.opacity = '';
    setActive(b, true);
    st.lock = false;
    enterHooks(st, i, prevI);
    const live = $('.pf-live', st.root); if (live) live.textContent = st.ctx.secs[i].label;
    $$('.pf-pager', b).forEach((p) => p.__pager && p.__pager.layout(true));
    st.cursorRefresh?.();
  };
  if (!anims.length) done(); else Promise.all(anims.map((x) => x.finished.catch(() => {}))).then(() => setTimeout(done, 20));
  // safety: never stay locked
  setTimeout(() => { if (st.lock && st.idx === i) done(); }, 2400 / speed);
}
PF.go = (i) => go(typeof i === 'string' ? S?.ctx.secs.findIndex((s) => s.id === i) : i);
PF.next = () => S && go(S.idx + 1);
PF.prev = () => S && go(S.idx - 1);

function sizeClasses(st) {
  const r = st.root;
  const upd = () => {
    const w = r.clientWidth || innerWidth, h = r.clientHeight || innerHeight;
    r.dataset.w = w < 560 ? 'xs' : w < 860 ? 'sm' : w < 1240 ? 'md' : 'lg';
    r.dataset.h = h < 440 ? 'tiny' : h < 640 ? 'short' : 'ok';
    r.dataset.o = w >= h ? 'l' : 'p';
  };
  upd();
  const ro = new ResizeObserver(upd); ro.observe(r);
  st.cleanups.push(() => ro.disconnect());
}

/* ───────────────────────── data-driven components ───────────────────────── */
function worksItems(st) {
  const d = st.data;
  let items = [...(d.works?.items || [])];
  if (st.igExtra) items = items.concat(st.igExtra);
  if (st.liExtra) items = items.concat(st.liExtra);
  return items.sort((a, b) => (new Date(b.date || 0)) - (new Date(a.date || 0)));
}
function initComponents(st) {
  const { root, ctx, data } = st;
  const L = ctx.parts.sections.layout || {};
  const dens = Math.max(0.6, Math.min(1.8, +(data.layout?.density) || 1));
  const group = { works: 'works', repos: 'code', apps: 'code' };
  const mk = (key, items, render, min, onEmpty) => {
    const el = $(`[data-pager="${key}"]`, root);
    if (!el) return;
    const cols = group[key] ? () => colsFor(st, group[key]) : null;
    st.pagers[key] = new Pager(el, { items, render: (it, i) => render(ctx, it, i), min: [min[0] * dens, min[1] * dens], onEmpty, cols });
    st.cleanups.push(() => st.pagers[key].destroy());
  };
  mk('works', worksItems(st), worksCard, L.works || [15, 15]);
  mk('apps', data.sandbox?.apps || [], appCard, L.apps || [16, 15], () => '<p class="pf-empty">No web apps yet.</p>');
  mk('xp', data.about?.experience || [], (c, x, i) => `<article class="pf-xp" style="--i:${i}"><header><h4>${esc(x.title)}</h4><span>${esc(x.years || '')}</span></header><p class="pf-xp-org">${esc([x.org, x.place].filter(Boolean).join(' — '))}</p><p class="pf-xp-t">${esc(x.text || '')}</p></article>`, L.xp || [24, 9.5]);
  mk('edu', data.about?.education || [], (c, x, i) => `<article class="pf-edu" style="--i:${i}"><h4>${esc(x.title)}</h4><p>${esc(x.place || '')}</p><span>${esc(x.years || '')}</span></article>`, L.edu || [20, 6]);
  mk('skills', data.about?.skills || [], (c, x, i) => `<article class="pf-skill" style="--i:${i}"><h4>${esc(x.group)}</h4><ul>${String(x.items || '').split(',').map((s) => s.trim()).filter(Boolean).map((s) => `<li>${esc(s)}</li>`).join('')}</ul></article>`, L.skills || [22, 11]);
  const gh = data.sandbox?.github;
  if (gh?.user) {
    mk('repos', [], repoCard, L.repos || [17, 10], () => `<p class="pf-empty">${st.ghError ? esc(st.ghError) : '<span class="pf-spin"></span>Loading GitHub projects…'}</p>`);
    if (!st.opts.static) {
      loadRepos(st, gh);
      // check again when the visitor opens SandBox or comes back to the tab
      const again = () => { if (!document.hidden && S === st) loadRepos(st, gh); };
      document.addEventListener('visibilitychange', again); st.cleanups.push(() => document.removeEventListener('visibilitychange', again));
      st.ghAgain = again;
    }
  }
  const li = data.works?.linkedin;
  if (li?.mode === 'github') { if (li.snapshot) applyLinkedIn(st, li, li.snapshot, true); if (!st.opts.static) loadLinkedIn(st, li); }
  const ig = data.works?.instagram;
  if (ig) { if (ig.snapshot) applyInstagram(st, ig, ig.snapshot); if (!st.opts.static && ig.mode && ig.mode !== 'manual') loadInstagram(st, ig); else igProfile(st, ig, ig.snapshot?.profile); }
  $$('.pf-bio', root).forEach((p) => {
    const btn = p.nextElementSibling;
    const check = () => { if (btn) btn.hidden = p.scrollHeight <= p.clientHeight + 2; };
    const ro = new ResizeObserver(check); ro.observe(p); st.cleanups.push(() => ro.disconnect()); check();
  });
}
/** Screen class used by "items per row": desktop, laptop (incl. tablet landscape), tabletP, phoneP, phoneL. */
export function screenClass(w, h) {
  if (h > w) return w < 560 ? 'phoneP' : 'tabletP';
  if (h < 500 && w < 1240) return 'phoneL';
  return w >= 1240 ? 'desktop' : 'laptop';
}
function colsFor(st, group) {
  const c = st.data.layout?.cols?.[group]; if (!c) return 0;
  const r = st.root; return +c[screenClass(r.clientWidth || innerWidth, r.clientHeight || innerHeight)] || 0;
}
/* GitHub projects: show the last list at once, then always ask GitHub again (at most once a minute, to stay well
   inside its 60-requests-an-hour limit) and redraw when anything changed: new, deleted, renamed or updated repos. */
const GH_FRESH = 60 * 1000;
function showRepos(st, gh, repos) {
  if (S !== st) return;
  const hide = new Set((gh.hide || []).map((s) => s.toLowerCase()));
  const pinned = (gh.pinned || []).map((s) => s.toLowerCase());
  let list = repos.filter((r) => (gh.includeForks || !r.fork) && !hide.has(r.name.toLowerCase()) && !r.archived);
  list.sort((a, b) => { const pa = pinned.indexOf(a.name.toLowerCase()), pb = pinned.indexOf(b.name.toLowerCase()); if (pa !== pb) return (pa < 0 ? 999 : pa) - (pb < 0 ? 999 : pb); return new Date(b.pushed_at) - new Date(a.pushed_at); });
  if (gh.limit) list = list.slice(0, gh.limit);
  st.ghError = list.length ? '' : 'No public repositories to show yet.';
  const sig = list.map((r) => r.id + ':' + r.pushed_at + ':' + r.name + ':' + (r.description || '') + ':' + r.stargazers_count).join('|');
  if (sig === st.ghSig) return; // nothing changed: don't redraw (keeps the visitor's page)
  st.ghSig = sig;
  st.pagers.repos?.setItems(list);
}
async function loadRepos(st, gh, force) {
  const key = 'pf-gh-' + gh.user;
  const cached = ss.get(key);
  const repos0 = cached && (Array.isArray(cached) ? cached : cached.repos);
  const at = cached && !Array.isArray(cached) ? cached.at || 0 : 0;
  if (repos0 && !st.ghSig) showRepos(st, gh, repos0);
  if (!force && repos0 && Date.now() - at < GH_FRESH) return;
  if (st.ghBusy) return; st.ghBusy = true;
  try {
    const r = await fetch(`https://api.github.com/users/${encodeURIComponent(gh.user)}/repos?per_page=100&sort=pushed&_=${Math.floor(Date.now() / GH_FRESH)}`, { cache: 'no-store' });
    if (!r.ok) throw new Error(r.status === 404 ? `No GitHub user named “${gh.user}”.` : r.status === 403 || r.status === 429 ? 'GitHub rate limit reached. Projects will load again in a few minutes.' : 'GitHub is not responding right now.');
    const repos = await r.json(); ss.set(key, { at: Date.now(), repos });
    showRepos(st, gh, repos);
  } catch (e) {
    if (S !== st || repos0) return; // keep showing the last list if GitHub is briefly unavailable
    st.ghError = e.message && !/fetch/i.test(e.message) ? e.message : 'Could not reach GitHub. Check your connection and reload.';
    st.pagers.repos?.setItems([]);
  } finally { st.ghBusy = false; }
}
/* Instagram: GitHub-synced JSON, a feed service URL, or a token used from the page. */
function normIg(j) {
  if (!j) return null;
  const arr = Array.isArray(j) ? j : j.posts || j.data || j.items || [];
  const prof = j.profile || (j.username ? { username: j.username, name: j.full_name || j.name, avatar: j.profilePictureUrl || j.profile_picture_url, followers: j.followersCount ?? j.followers_count, posts: j.mediaCount ?? j.media_count } : null);
  const posts = arr.map((p) => ({
    id: String(p.id || p.permalink || p.url || Math.random()),
    url: p.permalink || p.url || p.link,
    image: p.image || p.sizes?.medium?.mediaUrl || ((p.media_type || p.mediaType) === 'VIDEO' ? (p.thumbnail_url || p.thumbnailUrl) : (p.media_url || p.mediaUrl)) || p.thumbnail_url || p.thumbnailUrl,
    text: p.text ?? p.caption ?? p.prunedCaption ?? '',
    date: p.date || p.timestamp || p.taken_at,
    type: p.type || p.media_type || p.mediaType,
  })).filter((p) => p.url);
  return { profile: prof, posts, updated: j.updated };
}
function applyInstagram(st, ig, feed, quiet) {
  const n = normIg(feed); if (!n) return;
  const have = new Set((st.data.works?.items || []).map((x) => (String(x.url || '').match(/\/(p|reel|tv)\/([\w-]+)/) || [])[2]).filter(Boolean));
  st.igExtra = n.posts.filter((p) => !have.has((String(p.url).match(/\/(p|reel|tv)\/([\w-]+)/) || [])[2])).slice(0, ig.limit || 24)
    .map((p) => ({ id: 'ig-' + p.id, kind: 'instagram', title: (p.text || 'Instagram post').split('\n')[0].slice(0, 80), date: p.date, image: p.image, url: p.url, text: p.text || '', video: /VIDEO|REEL/i.test(p.type || '') }));
  if (!quiet) st.pagers.works?.setItems(filterWorks(st, st.filter || 'all'));
  igProfile(st, ig, n.profile);
}
async function loadInstagram(st, ig) {
  let feed = null;
  try {
    if (ig.mode === 'github') {
      const r = await fetch((ig.jsonPath || 'data/instagram.json') + '?v=' + Math.floor(Date.now() / 600000), { cache: 'no-cache' });
      if (r.ok) feed = await r.json();
    } else if (ig.mode === 'feed' && ig.feedUrl) {
      const r = await fetch(ig.feedUrl); if (r.ok) feed = await r.json();
    } else if (ig.mode === 'token' && ig.token) {
      const key = 'pf-ig-' + ig.token.slice(-10);
      feed = ss.get(key);
      if (!feed) {
        const base = 'https://graph.instagram.com';
        const tk = encodeURIComponent(ig.token);
        const [me, media] = await Promise.all([
          fetch(`${base}/me?fields=username,name,profile_picture_url,followers_count,media_count&access_token=${tk}`).then((r) => r.json()).catch(() => ({})),
          fetch(`${base}/me/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp&limit=${ig.limit || 24}&access_token=${tk}`).then((r) => r.json()),
        ]);
        feed = { profile: me && me.username ? { username: me.username, name: me.name, avatar: me.profile_picture_url, followers: me.followers_count, posts: me.media_count } : null, posts: media.data || [] };
        ss.set(key, feed);
      }
    }
  } catch { feed = null; }
  if (S !== st) return;
  if (feed) applyInstagram(st, ig, feed); else igProfile(st, ig, ig.snapshot?.profile);
}
function igProfile(st, ig, prof) {
  const el = $('.pf-igp', st.root); if (!el) return;
  const user = (prof && prof.username) || (ig.username || '').replace(/^@/, '');
  if (!user) { el.hidden = true; return; }
  const n = (v) => (v == null ? '' : v >= 1e6 ? (v / 1e6).toFixed(1) + 'M' : v >= 1e4 ? Math.round(v / 1e3) + 'K' : String(v));
  el.href = 'https://www.instagram.com/' + encodeURIComponent(user) + '/';
  el.innerHTML = `${prof?.avatar ? `<img src="${esc(prof.avatar)}" alt="">` : `<span class="pf-igp-av">${I('instagram')}</span>`}<span class="pf-igp-t"><b>@${esc(user)}</b><small>${[prof?.posts != null ? n(prof.posts) + ' posts' : '', prof?.followers != null ? n(prof.followers) + ' followers' : ''].filter(Boolean).join(' · ') || 'Instagram'}</small></span><span class="pf-igp-f">Follow</span>`;
  el.hidden = false;
}
/* LinkedIn: data/linkedin.json, kept fresh by the GitHub workflow from a feed service. */
function applyLinkedIn(st, li, feed, quiet) {
  const posts = Array.isArray(feed?.posts) ? feed.posts : [];
  const have = new Set((st.data.works?.items || []).filter((x) => x.kind === 'linkedin').map((x) => liKey(x.url)));
  st.liExtra = posts.filter((p) => p.url && !have.has(p.key || liKey(p.url))).slice(0, li.limit || 24).map((p) => postToItem({ ...p, key: p.key || liKey(p.url) }));
  if (!quiet) st.pagers.works?.setItems(filterWorks(st, st.filter || 'all'));
}
async function loadLinkedIn(st, li) {
  try {
    const r = await fetch('data/linkedin.json?v=' + Math.floor(Date.now() / 600000), { cache: 'no-cache' });
    if (!r.ok || S !== st) return;
    applyLinkedIn(st, li, await r.json());
  } catch { /* opened from file:// or not published yet: keep what's in the project */ }
}
function filterWorks(st, f) { const all = worksItems(st); return f === 'all' ? all : all.filter((x) => x.kind === f); }

/* ───────────────────────── modal ───────────────────────── */
function openModal(st, { title, url, html, ext, kind }) {
  const m = $('.pf-modal', st.root); if (!m) return;
  $('#pf-modal-t', m).textContent = title || '';
  const e = $('.pf-modal-ext', m);
  if (ext) { e.hidden = false; e.href = ext; } else e.hidden = true;
  const body = $('.pf-modal-b', m);
  m.dataset.kind = kind || '';
  body.innerHTML = url ? `<iframe src="${esc(url)}" title="${esc(title || '')}" loading="lazy" allow="autoplay; encrypted-media; fullscreen; clipboard-write" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe><div class="pf-modal-load"><span class="pf-spin"></span></div>` : html || '';
  const fr = $('iframe', body); if (fr) fr.addEventListener('load', () => body.classList.add('is-loaded'), { once: true });
  m.hidden = false; st.root.classList.add('pf-modal-open');
  st.lastFocus = document.activeElement;
  requestAnimationFrame(() => { m.classList.add('is-open'); $('.pf-modal-x', m).focus({ preventScroll: true }); });
}
function closeModal(st) {
  const m = $('.pf-modal', st.root); if (!m || m.hidden) return;
  m.classList.remove('is-open'); st.root.classList.remove('pf-modal-open');
  setTimeout(() => { m.hidden = true; $('.pf-modal-b', m).innerHTML = ''; $('.pf-modal-b', m).classList.remove('is-loaded'); }, 320);
  st.lastFocus?.focus?.({ preventScroll: true });
}
PF.openModal = (o) => S && openModal(S, o);
PF.closeModal = () => S && closeModal(S);

function handleOpen(st, key) {
  const d = st.data, ctx = st.ctx;
  const [type, id] = key.split(':');
  if (type === 'work') {
    const it = worksItems(st).find((x) => x.id === id); if (!it) return;
    if (it.kind === 'instagram') {
      const u = embeds.instagram(it.url);
      return openModal(st, u ? { title: it.title || 'Instagram', url: u, ext: it.url, kind: 'social' } : { title: it.title, html: workHtml(ctx, it), ext: it.url });
    }
    if (it.kind === 'linkedin') {
      const u = embeds.linkedin(it.url || it.embed);
      return openModal(st, u ? { title: it.title || 'LinkedIn', url: u, ext: /^https?:/.test(it.url) ? it.url : '', kind: 'social' } : { title: it.title, html: workHtml(ctx, it), ext: it.url });
    }
    const yt = embeds.youtube(it.url);
    return openModal(st, { title: it.title, html: workHtml(ctx, it, yt), ext: /^https?:/.test(it.url || '') ? it.url : '' });
  }
  if (type === 'app') {
    const a = (d.sandbox?.apps || []).find((x) => x.id === id); if (!a) return;
    if (a.html) {
      const src = ctx.img(a.html);
      if (src && !src.startsWith('data:')) return openModal(st, { title: a.title, url: src, ext: src, kind: 'app' });
      return openModal(st, { title: a.title, html: `<iframe title="${esc(a.title)}" sandbox="allow-scripts allow-forms allow-pointer-lock allow-popups allow-modals allow-downloads" src="${esc(src)}"></iframe>`, kind: 'app' });
    }
    return openModal(st, { title: a.title, url: a.url, ext: a.url, kind: 'app' });
  }
  if (type === 'port') {
    const p = (d.portfolio?.items || []).find((x) => x.id === id); if (!p) return;
    if (!p.url) return openModal(st, { title: p.title, html: `<div class="pf-note">${I('folder')}<p>Paste a Google Drive share link for “${esc(p.title)}” in the builder. Set the file to “Anyone with the link can view” so it shows here.</p></div>` });
    return openModal(st, { title: p.title, url: embeds.drive(p.url), ext: p.url, kind: 'doc' });
  }
  if (key === 'resume') {
    const r = d.about?.resume; if (!r?.url) return;
    return openModal(st, { title: r.label || 'Resume', url: embeds.drive(r.url), ext: r.url, kind: 'doc' });
  }
  if (key === 'bio') {
    return openModal(st, { title: ctx.sec('about')?.title || 'About', html: `<div class="pf-prose"><p>${esc(d.about?.bio || '').replace(/\n+/g, '</p><p>')}</p></div>` });
  }
}
function workHtml(ctx, it, yt) {
  const src = ctx.img(it.image);
  const k = KIND[it.kind] || KIND.project;
  return `<article class="pf-detail">${yt ? `<div class="pf-detail-media is-video"><iframe src="${esc(yt)}" title="${esc(it.title)}" allowfullscreen></iframe></div>` : src ? `<figure class="pf-detail-media"><img src="${esc(src)}" alt="${esc(it.title)}"></figure>` : ''}
    <div class="pf-detail-txt"><p class="pf-detail-meta">${I(k.icon)}<span>${esc(k.label)}</span><span>${fmtDate(it.date)}</span></p><h4>${esc(it.title)}</h4><div class="pf-prose"><p>${esc(it.text || '').replace(/\n+/g, '</p><p>')}</p></div>
    ${it.tags?.length ? `<ul class="pf-tags">${it.tags.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>` : ''}
    ${/^https?:/.test(it.url || '') ? `<a class="pf-btn" href="${esc(it.url)}" target="_blank" rel="noopener" data-hover>${I('external')}<span>${it.kind === 'instagram' ? 'View on Instagram' : it.kind === 'linkedin' ? 'View on LinkedIn' : 'Visit project'}</span></a>` : ''}</div></article>`;
}
function contactSheet(st) {
  const ctx = st.ctx;
  openModal(st, {
    title: 'Get in touch', kind: 'contact',
    html: `<ul class="pf-sheet">${ctx.contacts.map((c, i) => `<li style="--i:${i}"><a href="${esc(ctx.contactHref(c))}" ${/^https?:/.test(ctx.contactHref(c)) ? 'target="_blank" rel="noopener"' : ''} data-hover>${ctx.contactIcon(c)}<span><b>${esc(c.label || c.type)}</b><small>${esc(displayValue(c))}</small></span></a>${c.type === 'email' || c.type === 'phone' ? `<button class="pf-copy" data-copy="${esc(c.value)}" aria-label="Copy ${esc(c.label)}" data-hover>${I('copy')}</button>` : ''}</li>`).join('')}</ul>`,
  });
}

/* ───────────────────────── input ───────────────────────── */
function bindInput(st) {
  const { root } = st;
  const on = (el, ev, fn, o) => { el.addEventListener(ev, fn, o); st.listeners.push(() => el.removeEventListener(ev, fn, o)); };
  const modalOpen = () => !$('.pf-modal', root).hidden;
  const pagerOf = (el) => (el && el.closest ? el.closest('.pf-pager') : null) || $('.pf-sec.is-on .pf-panel:not([hidden]) .pf-pager, .pf-sec.is-on .pf-pager', root);

  // clicks
  on(root, 'click', (e) => {
    const dr = e.target.closest('[data-drawer]');
    if (dr) { const o = root.classList.toggle('pf-drawer-open'); $$('[data-drawer]', root).forEach((b) => b.setAttribute('aria-expanded', o)); return; }
    if (e.target.closest('.pf-drawer a')) root.classList.remove('pf-drawer-open');
    const t = e.target.closest('[data-go],[data-open],[data-close],[data-page],[data-tab],[data-filter],[data-contact],[data-copy],[data-next],[data-prev],.pf-repo-live');
    if (!t || !root.contains(t)) return;
    if (t.matches('.pf-repo-live')) { e.preventDefault(); e.stopPropagation(); window.open(t.dataset.href, '_blank', 'noopener'); return; }
    if (t.dataset.go != null) { e.preventDefault(); closeModal(st); go(+t.dataset.go); return; }
    if (t.dataset.next != null) { e.preventDefault(); go(st.idx + 1); return; }
    if (t.dataset.prev != null) { e.preventDefault(); go(st.idx - 1); return; }
    if (t.dataset.open) { e.preventDefault(); handleOpen(st, t.dataset.open); return; }
    if (t.dataset.close != null) { closeModal(st); return; }
    if (t.dataset.contact != null) { e.preventDefault(); contactSheet(st); return; }
    if (t.dataset.copy) { navigator.clipboard?.writeText(t.dataset.copy).then(() => { t.innerHTML = I('check'); setTimeout(() => (t.innerHTML = I('copy')), 1400); }).catch(() => {}); return; }
    if (t.dataset.page) { const p = t.closest('.pf-pager'); p?.__pager?.go(+t.dataset.page); return; }
    if (t.dataset.tab) {
      const box = t.closest('.pf-tabs'); const wrap = box.parentElement;
      $$('.pf-tab', box).forEach((b) => b.setAttribute('aria-selected', b === t ? 'true' : 'false'));
      $$('.pf-panel', wrap).forEach((p) => { const show = p.dataset.panel === t.dataset.tab; p.hidden = !show; if (show) { p.classList.remove('pf-paged'); void p.offsetWidth; p.classList.add('pf-paged'); $$('.pf-pager', p).forEach((x) => x.__pager?.layout(true)); } });
      return;
    }
    if (t.dataset.filter) {
      $$('.pf-chip', t.parentElement).forEach((b) => b.setAttribute('aria-pressed', b === t ? 'true' : 'false'));
      st.filter = t.dataset.filter; st.pagers.works?.setItems(filterWorks(st, t.dataset.filter));
    }
  });

  // wheel: one gesture = one step
  let acc = 0, last = 0, consumed = false, hacc = 0;
  const U = st.data.layout || {};
  on(root, 'wheel', (e) => {
    if (modalOpen()) return;
    if (U.wheel === false) return;
    if (e.target.closest('[data-scrollable]')) return;
    e.preventDefault();
    const now = performance.now();
    if (now - last > 200) { acc = 0; hacc = 0; consumed = false; }
    last = now;
    if (consumed || st.lock) return;
    const ax = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? 'x' : 'y';
    if (ax === 'x') {
      hacc += e.deltaX;
      if (Math.abs(hacc) > 40) { const p = pagerOf(e.target); if (p?.__pager?.go(Math.sign(hacc))) consumed = true; else if (st.ctx.parts.nav.axis === 'x') { go(st.idx + Math.sign(hacc)); consumed = true; } hacc = 0; }
      return;
    }
    acc += e.deltaMode === 1 ? e.deltaY * 30 : e.deltaY;
    if (Math.abs(acc) > 45) { consumed = true; go(st.idx + Math.sign(acc)); acc = 0; }
  }, { passive: false });

  // touch: vertical swipe → section; horizontal swipe on a pager → page
  let tx = 0, ty = 0, tt = 0, tgt = null;
  on(root, 'touchstart', (e) => { if (e.touches.length !== 1) return; tx = e.touches[0].clientX; ty = e.touches[0].clientY; tt = performance.now(); tgt = e.target; }, { passive: true });
  on(root, 'touchmove', (e) => { if (!modalOpen() && !e.target.closest('[data-scrollable]')) e.preventDefault(); }, { passive: false });
  on(root, 'touchend', (e) => {
    if (modalOpen() || !tgt || tgt.closest('[data-drag]')) return;
    const dx = e.changedTouches[0].clientX - tx, dy = e.changedTouches[0].clientY - ty;
    const dt = performance.now() - tt;
    if (dt > 900) return;
    if (U.swipe === false) return;
    if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 48) go(st.idx + (dy < 0 ? 1 : -1));
    else if (Math.abs(dx) > 44) {
      const p = tgt.closest('.pf-pager');
      if (p?.__pager) p.__pager.go(dx < 0 ? 1 : -1);
      else if (st.ctx.parts.nav.axis === 'x') go(st.idx + (dx < 0 ? 1 : -1));
    }
    tgt = null;
  }, { passive: true });

  // keyboard
  on(window, 'keydown', (e) => {
    if (e.target.closest && e.target.closest('input,textarea,select,[contenteditable]')) return;
    if (modalOpen()) { if (e.key === 'Escape') closeModal(st); return; }
    if (e.key === 'Escape') root.classList.remove('pf-drawer-open');
    let stop = false; each(st.ctx, (T, c) => { if (T.onKey && T.onKey(c, e, st.root) === false) stop = true; }); if (stop) return;
    if (U.keys === false || st.opts.edit) return;
    const k = e.key;
    if (['ArrowDown', 'PageDown'].includes(k) || (k === ' ' && !e.target.closest('button,a'))) { e.preventDefault(); go(st.idx + 1); }
    else if (['ArrowUp', 'PageUp'].includes(k)) { e.preventDefault(); go(st.idx - 1); }
    else if (k === 'Home') go(0);
    else if (k === 'End') go(st.ctx.secs.length - 1);
    else if (k === 'ArrowRight' || k === 'ArrowLeft') {
      const d = k === 'ArrowRight' ? 1 : -1;
      const p = pagerOf(null);
      if (!(p?.__pager?.go(d)) && st.ctx.parts.nav.axis === 'x') go(st.idx + d);
    } else if (/^[1-9]$/.test(k) && !e.metaKey && !e.ctrlKey) { const i = +k - 1; if (i < st.ctx.secs.length) go(i); }
  });
  on(window, 'hashchange', () => { const k = st.ctx.secs.findIndex((s) => s.id === location.hash.slice(1)); if (k >= 0) go(k); });

  // pointer → CSS vars (--mx/--my in -1..1, --px/--py in px), smoothed
  const fine = matchMedia('(pointer:fine)').matches;
  let tmx = 0, tmy = 0, mx = 0, my = 0, px = innerWidth / 2, py = innerHeight / 2, cx = px, cy = py, raf = 0;
  const reduce = root.dataset.motion === 'off' || matchMedia('(prefers-reduced-motion: reduce)').matches;
  const tick = () => {
    mx += (tmx - mx) * 0.085; my += (tmy - my) * 0.085; cx += (px - cx) * 0.22; cy += (py - cy) * 0.22;
    root.style.setProperty('--mx', mx.toFixed(4)); root.style.setProperty('--my', my.toFixed(4));
    root.style.setProperty('--px', cx.toFixed(1) + 'px'); root.style.setProperty('--py', cy.toFixed(1) + 'px');
    if (Math.abs(tmx - mx) > 0.0005 || Math.abs(tmy - my) > 0.0005 || Math.abs(px - cx) > 0.3 || Math.abs(py - cy) > 0.3) raf = requestAnimationFrame(tick); else raf = 0;
  };
  const kick = () => { if (!raf && !reduce) raf = requestAnimationFrame(tick); };
  on(window, 'pointermove', (e) => {
    const r = root.getBoundingClientRect();
    px = e.clientX - r.left; py = e.clientY - r.top;
    tmx = clamp((px / r.width) * 2 - 1, -1, 1); tmy = clamp((py / r.height) * 2 - 1, -1, 1);
    st.pt = { x: px, y: py };
    kick();
  }, { passive: true });
  on(document, 'pointerleave', () => { tmx = 0; tmy = 0; kick(); });
  // device tilt on phones and tablets
  const orient = (e) => { if (e.gamma == null) return; tmx = clamp(e.gamma / 30, -1, 1); tmy = clamp((e.beta - 45) / 30, -1, 1); kick(); };
  if (!fine && 'DeviceOrientationEvent' in window) {
    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
      on(root, 'touchend', function ask() { DeviceOrientationEvent.requestPermission().then((s) => { if (s === 'granted') on(window, 'deviceorientation', orient); }).catch(() => {}); root.removeEventListener('touchend', ask); }, { once: true });
    } else on(window, 'deviceorientation', orient);
  }
  bindCursor(st, on);
  st.cleanups.push(() => cancelAnimationFrame(raf));
}

/* ───────────────────────── layout editing (builder canvas) ───────────────────────── */
function bindEdit(st) {
  const { root } = st;
  const list = elementsFor(st.ctx.t.id, st.data.mix);
  root.classList.add('pf-editing');
  const box = document.createElement('div'); box.className = 'pf-edit';
  box.innerHTML = '<div class="pf-edit-hov"><b></b></div><div class="pf-edit-sel"><b></b><i data-h="se" title="Drag to resize"></i><i data-h="nw" title="Drag to resize"></i></div>';
  root.appendChild(box);
  const hov = $('.pf-edit-hov', box), sel = $('.pf-edit-sel', box), lab = $('b', sel), hlab = $('b', hov);
  const post = (m) => { try { window.parent.postMessage(m, '*'); } catch { /* no parent */ } };
  const scope = () => st.opts.scope === 'p' ? 'p' : 'all';
  const cur = (key) => { const v = (st.data.layout?.els || {})[key] || {}; return scope() === 'p' ? { x: 0, y: 0, s: 1, ...v, ...(v.p || {}) } : { x: 0, y: 0, s: 1, ...v }; };
  const pick = (t, ev) => {
    let best = null, bestEl = null;
    for (const e of list) { const m = t.closest?.(e.sel); if (m && root.contains(m) && !box.contains(m) && (!bestEl || bestEl.contains(m))) { best = e; bestEl = m; } }
    // Decorative elements that ignore the pointer (big background numbers, glows, canvases) never become the event
    // target, so also look for one under the point. It wins when it is smaller than what the target gave.
    if (ev && ev.clientX != null) {
      const area = (el) => { const r = el.getBoundingClientRect(); return r.width * r.height; };
      let ghost = null, ghostEl = null;
      for (const e of list) for (const el of visibleOf(e)) {
        if (getComputedStyle(el).pointerEvents !== 'none' || box.contains(el)) continue;
        const r = el.getBoundingClientRect();
        if (ev.clientX < r.left || ev.clientX > r.right || ev.clientY < r.top || ev.clientY > r.bottom) continue;
        if (!ghostEl || area(el) < area(ghostEl)) { ghost = e; ghostEl = el; }
      }
      if (ghostEl && (!bestEl || area(ghostEl) < area(bestEl))) { best = ghost; bestEl = ghostEl; }
    }
    return best ? { e: best, el: bestEl } : null;
  };
  const visibleOf = (e) => $$(e.sel, root).filter((x) => { const sec = x.closest('.pf-sec'); if (sec && !sec.classList.contains('is-on')) return false; const r = x.getBoundingClientRect(); return r.width > 0 && r.height > 0; });
  const rectOf = (els) => { let l = 1e9, t = 1e9, r = -1e9, b = -1e9; const R = root.getBoundingClientRect(); els.forEach((x) => { const q = x.getBoundingClientRect(); l = Math.min(l, q.left); t = Math.min(t, q.top); r = Math.max(r, q.right); b = Math.max(b, q.bottom); }); return { l: l - R.left, t: t - R.top, w: r - l, h: b - t }; };
  const place = (node, rc) => { node.style.transform = `translate(${rc.l}px,${rc.t}px)`; node.style.width = rc.w + 'px'; node.style.height = rc.h + 'px'; };
  let hovE = null, drag = null, raf = 0;
  const loop = () => {
    const sk = st.opts.selKey, se = sk && list.find((x) => x.key === sk);
    const vis = se ? visibleOf(se) : [];
    sel.hidden = !vis.length;
    if (vis.length) { place(sel, rectOf(vis)); const v = cur(sk); lab.textContent = `${se.label} · ${Math.round((v.s || 1) * 100)}%`; }
    hov.hidden = !hovE || (se && hovE.key === se.key);
    if (hovE) { const hv = visibleOf(hovE); if (hv.length) { place(hov, rectOf(hv)); hlab.textContent = hovE.label; } else hov.hidden = true; }
    raf = requestAnimationFrame(loop);
  };
  raf = requestAnimationFrame(loop);
  const select = (key) => { st.opts.selKey = key; post({ type: 'pf:select', key }); };
  const live = (key, v) => {
    const els = { ...(st.data.layout?.els || {}) }; const old = els[key] || {};
    els[key] = scope() === 'p' ? { ...old, p: { ...(old.p || {}), ...v } } : { ...old, ...v };
    setStyle('pf-layout', layoutCss({ ...st.ctx, data: { ...st.data, layout: { ...(st.data.layout || {}), els } } }));
    return els[key];
  };
  const opts = { capture: true };
  let lastPick = 0;
  const onOver = (e) => { if (drag) return; const now = performance.now(); if (e.type === 'pointermove' && now - lastPick < 70) return; lastPick = now; const m = pick(e.target, e); hovE = m ? m.e : null; };
  const onDown = (e) => {
    if (box.contains(e.target) && e.target.closest('.pf-edit-sel')) {
      const key = st.opts.selKey; if (!key) return;
      e.preventDefault(); e.stopPropagation();
      const v = cur(key), rc = sel.getBoundingClientRect();
      drag = { key, mode: e.target.dataset.h ? 'scale' : 'move', sx: e.clientX, sy: e.clientY, v, cx: rc.left + rc.width / 2, cy: rc.top + rc.height / 2, d0: Math.hypot(e.clientX - (rc.left + rc.width / 2), e.clientY - (rc.top + rc.height / 2)) || 1 };
      sel.setPointerCapture?.(e.pointerId); root.classList.add('pf-edit-drag');
      return;
    }
    const m = pick(e.target, e);
    e.preventDefault(); e.stopPropagation();
    if (m) select(m.e.key); else { st.opts.selKey = null; post({ type: 'pf:select', key: null }); }
  };
  const onMove = (e) => {
    if (!drag) return;
    const W = root.clientWidth, H = root.clientHeight;
    if (drag.mode === 'move') drag.last = { x: +(drag.v.x + ((e.clientX - drag.sx) / W) * 100).toFixed(2), y: +(drag.v.y + ((e.clientY - drag.sy) / H) * 100).toFixed(2) };
    else drag.last = { s: +Math.max(0.2, Math.min(4, drag.v.s * (Math.hypot(e.clientX - drag.cx, e.clientY - drag.cy) / drag.d0))).toFixed(3) };
    live(drag.key, drag.last);
  };
  const onUp = () => { if (!drag) return; const d = drag; drag = null; root.classList.remove('pf-edit-drag'); if (d.last) post({ type: 'pf:elset', key: d.key, scope: scope(), v: d.last }); };
  const stop = (e) => { if (!box.contains(e.target)) { e.preventDefault(); e.stopPropagation(); } };
  const onKey = (e) => {
    const key = st.opts.selKey; if (!key || e.target.closest?.('input,textarea')) return;
    const step = e.shiftKey ? 2 : 0.5, v = cur(key);
    const map = { ArrowLeft: { x: v.x - step }, ArrowRight: { x: v.x + step }, ArrowUp: { y: v.y - step }, ArrowDown: { y: v.y + step } };
    if (map[e.key]) { e.preventDefault(); e.stopImmediatePropagation(); const nv = Object.fromEntries(Object.entries(map[e.key]).map(([k, x]) => [k, +x.toFixed(2)])); live(key, nv); post({ type: 'pf:elset', key, scope: scope(), v: nv }); }
    else if (e.key === 'Delete' || e.key === 'Backspace') { e.preventDefault(); post({ type: 'pf:elset', key, scope: scope(), v: { hide: true } }); }
    else if (e.key === 'Escape') { st.opts.selKey = null; post({ type: 'pf:select', key: null }); }
  };
  root.addEventListener('pointerover', onOver, opts); root.addEventListener('pointermove', onOver, opts);
  root.addEventListener('pointerdown', onDown, opts);
  root.addEventListener('click', stop, opts);
  window.addEventListener('pointermove', onMove);
  window.addEventListener('pointerup', onUp);
  window.addEventListener('keydown', onKey, true);
  st.cleanups.push(() => { cancelAnimationFrame(raf); root.removeEventListener('pointerover', onOver, opts); root.removeEventListener('pointermove', onOver, opts); root.removeEventListener('pointerdown', onDown, opts); root.removeEventListener('click', stop, opts); window.removeEventListener('pointermove', onMove); window.removeEventListener('pointerup', onUp); window.removeEventListener('keydown', onKey, true); root.classList.remove('pf-editing'); box.remove(); });
}

function teardown(st) {
  st.cleanups.forEach((f) => { try { f(); } catch { /* ignore */ } });
  st.listeners.forEach((f) => f());
}

/* ───────────────────────── boot + builder bridge ───────────────────────── */
PF.boot = (data, opts = {}) => render(data, opts);
PF.state = () => S;
window.addEventListener('message', (e) => {
  const m = e.data; if (!m || typeof m !== 'object') return;
  if (m.type === 'pf:update' && m.data) {
    const assets = m.assets || S?.data.assets || {};
    render({ ...m.data, assets }, { ...(S?.opts || {}), ...(m.opts || {}) });
  } else if (m.type === 'pf:layout' && S && m.layout) {
    S.data = { ...S.data, layout: m.layout }; S.ctx.data = S.data;
    setStyle('pf-layout', layoutCss(S.ctx));
    Object.values(S.pagers).forEach((p) => p.layout(true));
  } else if (m.type === 'pf:select' && S) {
    S.opts.selKey = m.key || null;
  } else if (m.type === 'pf:replayText' && S) {
    const sec = $$('.pf-sec', S.root)[S.idx]; if (sec) playTextFx(S, sec, true);
  } else if (m.type === 'pf:goto' && S) {
    const i = typeof m.i === 'number' ? m.i : S.ctx.secs.findIndex((s) => s.id === m.i);
    if (i >= 0) go(i);
  }
});
function autoBoot() {
  if (window.PF_DATA && !S) render(window.PF_DATA, window.PF_OPTS || {});
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', autoBoot); else setTimeout(autoBoot, 0);
export default PF;
