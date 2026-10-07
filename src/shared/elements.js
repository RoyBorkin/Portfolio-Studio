/*! Portfolio Studio. Copyright (c) 2026 Roy Borkin. All rights reserved. Unauthorized copying, modification or distribution is prohibited without written permission. */
import { menuKeys, contactSels, CONTACT_SEL } from './mix.js';
// Elements a user can hide, move and resize. Keys are stable; selectors point at template markup.
// [label, selector, baseTranslate?] — baseTranslate keeps a template's own centering when the user moves it.
export const COMMON_ELS = {
  sectionNumber: ['Section numbers', '.pf-head-n'],
  sectionTitle: ['Section titles', '.pf-head-t'],
  sectionSubtitle: ['Section subtitles', '.pf-head-s'],
  filters: ['Filters and tabs', '.pf-chips, .pf-tabs'],
  igProfile: ['Instagram profile card', '.pf-igp'],
  pager: ['Page arrows', '.pf-pager-nav'],
  cardMeta: ['Card type and date', '.pf-card-meta'],
  cardTitle: ['Card titles', '.pf-card-title'],
  githubLink: ['GitHub profile link', '.pf-more'],
  aboutPhoto: ['About photo', '.pf-profile-img'],
  bio: ['Bio', '.pf-bio, .pf-bio-more'],
  stats: ['About numbers', '.pf-stats'],
  aboutButtons: ['About buttons', '.pf-profile-actions'],
  portfolioText: ['Portfolio descriptions', '.pf-port-s'],
  grain: ['Film grain', '.pf-grain'],
  heading: ['Whole section headings', '.pf-head'],
  content: ['Section content', '.pf-body'],
  cards: ['Cards', '.pf-card'],
  portfolioCards: ['Portfolio cards', '.pf-port-item'],
  experience: ['Experience entries', '.pf-xp, .pf-edu'],
  skills: ['Skills', '.pf-skill'],
  drawer: ['Phone menu panel', '.pf-drawer'],
  copyright: ['Copyright line', '.pf-copy'],
};

export const TEMPLATE_ELS = {
  vision: { brand: ['Logo and name', '.vi-mark'], nav: ['Menu', '.vi-nav'], contacts: ['Contact icons', '.vi-rail'], counter: ['Section counter', '.vi-count'], name: ['Big name', '.vi-word'], portrait: ['Portrait', '.vi-fig'], roles: ['Roles list', '.vi-roles'], pitch: ['Pitch', '.vi-tag'], location: ['Location', '.vi-loc'], button: ['Works button', '.vi-more'], glow: ['Background glow', '.vi-glow'] },
  poster: { brand: ['Name and role', '.po-id'], nav: ['Menu', '.po-nav'], year: ['Year label', '.po-yr'], contacts: ['Contact bar', '.po-foot'], name: ['Vertical last name', '.po-spine'], first: ['First name', '.po-first'], field: ['Color block', '.po-field'], sun: ['Circle', '.po-sun'], portrait: ['Portrait', '.po-cut'], pitch: ['Pitch and roles', '.po-blurb'], location: ['Location', '.po-place'], button: ['Works button', '.po-go'] },
  nexus: { brand: ['Logo', '.nx-brand'], code: ['Barcode', '.nx-code'], coords: ['Pointer readout', '.nx-xy'], nav: ['Menu', '.nx-nav'], contacts: ['Contact icons', '.nx-foot'], name: ['Stacked name', '.nx-name'], welcome: ['Welcome label', '.nx-wel'], portrait: ['Portrait', '.nx-fig'], callouts: ['Role callouts', '.nx-lines, .nx-call'], stats: ['Stats and pitch', '.nx-stats'], button: ['Start button', '.nx-start'], globe: ['3D globe', '.nx-globe'], grid: ['Background grid', '.nx-grid'] },
  runway: { brand: ['Logo', '.rw-brand'], nav: ['Menu', '.rw-nav'], contactBtn: ['Contact button', '.rw-ct-btn'], side: ['Dots and vertical title', '.rw-side'], contacts: ['Contact icons', '.rw-cts'], arrows: ['Arrows and counter', '.rw-arrows'], ghost: ['Ghost initials', '.rw-ghost'], portrait: ['Portrait', '.rw-fig'], name: ['Name', '.rw-name'], credits: ['Details list', '.rw-credits'], stat: ['Big number', '.rw-big'], buttons: ['Buttons', '.rw-split'], pitch: ['Pitch', '.rw-tag'] },
  lab: { brand: ['Brand word', '.lb-brand'], nav: ['Menu', '.lb-nav'], contacts: ['Contact icons', '.lb-ct'], index: ['Big section number (background)', '.lb-idx'], name: ['Big word', '.lb-word'], side: ['Side note', '.lb-side'], slab: ['Color slab', '.lb-slab'], portrait: ['Portrait', '.lb-fig'], roles: ['Roles card', '.lb-roles'], message: ['Message card', '.lb-msg'], stat: ['Stat card', '.lb-stat'], latest: ['Latest work pill', '.lb-pill'], pitch: ['Pitch', '.lb-tag'], dots: ['Dot grid', '.lb-dots'] },
  bento: { brand: ['Logo and name', '.bt-brand'], nav: ['Menu', '.bt-nav'], nameTile: ['Name tile', '.bt-name'], photoTile: ['Photo tile', '.bt-photo'], sketchTile: ['Sketch tile', '.bt-sketch'], statTile: ['Numbers tile', '.bt-stat'], worksTile: ['Works tile', '.bt-works'], contactTile: ['Contact tile', '.bt-talk'] },
  traverse: { brand: ['Name', '.tv-brand'], nav: ['Menu', '.tv-nav'], rail: ['Side rail', '.tv-rail'], footer: ['Slider progress', '.tv-foot'], ghost: ['Ghost word', '.tv-ghost'], spot: ['Spotlight', '.tv-spot'], text: ['Hero text', '.tv-txt, .tv-b-txt'], portrait: ['Portrait', '.tv-obj, .tv-b-img'], buttons: ['Buttons', '.tv-cta, .tv-about'] },
  museum: { brand: ['Logo', '.mu-brand'], nav: ['Menu', '.mu-nav'], contacts: ['Contact icons', '.mu-cts'], dots: ['Side dots', '.mu-dots'], footer: ['Progress', '.mu-foot'], intro: ['Greeting', '.mu-eyebrow'], name: ['Name', '.mu-h'], pitch: ['Pitch', '.mu-p'], button: ['Button', '.mu-btn'], portrait: ['Portrait', '.mu-fig'], shapes: ['Geometric shapes', '.mu-tri, .mu-x, .mu-ring, .mu-dot, .mu-vtri, .mu-grid, .mu-bars, .mu-arc, .mu-halo, .mu-sun, .mu-sun2'], label: ['Role label', '.mu-label'] },
  forge: { brand: ['Name', '.fg-brand'], nav: ['Menu', '.fg-nav'], contacts: ['Contact icons', '.fg-cts'], hint: ['Drag hint', '.fg-hint'], object: ['3D logo', '.fg-obj', '-50% -50%'], specs: ['Spec list', '.fg-spec'], title: ['Name and pitch', '.fg-title'], ticker: ['Roles ticker', '.fg-ticker'], floor: ['Grid floor', '.fg-floor'] },
  terminal: { titlebar: ['Title bar', '.tm-title'], sidebar: ['File tree', '.tm-side'], tabs: ['File tabs', '.tm-tabs'], status: ['Status bar', '.tm-status'], code: ['Code', '.tm-code'], preview: ['Photo preview', '.tm-prev'] },
  blueprint: { brand: ['Logo', '.bp-brand'], nav: ['Menu', '.bp-nav'], frame: ['Sheet frame', '.bp-frame'], titleBlock: ['Title block (contacts)', '.bp-tb'], crosshair: ['Crosshair', '.bp-cross'], intro: ['Greeting', '.bp-note'], name: ['Name', '.bp-name'], roles: ['Roles', '.bp-roles'], pitch: ['Pitch', '.bp-tag'], button: ['Button', '.bp-go'], drawing: ['Drawing', '.bp-draw'], field: ['Grid or contours', '.bp-grid, .bp-topo'] },
  classic: { brand: ['Logo', '.cl-brand'], nav: ['Menu', '.cl-nav'], dots: ['Side dots', '.cl-dots'], contacts: ['Contact icons', '.cl-cts'], hint: ['Scroll hint', '.cl-hint'], intro: ['Greeting', '.cl-hi'], name: ['Name', '.cl-name'], typed: ['Typed roles', '.cl-type'], buttons: ['Buttons', '.cl-cta'], photo: ['Background photo', '.cl-photo'] },
  cyber: { brand: ['Logo and name', '.cy-id'], nav: ['Menu', '.cy-nav'], contactBtn: ['Contact button', '.cy-jack'], sign: ['Neon sign', '.cy-sign', '0 -50%'], footer: ['Status bar', '.cy-foot'], intro: ['Greeting', '.cy-tagline-top'], name: ['Name', '.cy-name'], roles: ['Roles', '.cy-roles'], pitch: ['Pitch', '.cy-pitch'], buttons: ['Buttons', '.cy-cta'], portrait: ['Portrait', '.cy-figbox'], hud: ['Stat meters', '.cy-hud'], sun: ['Sun', '.cy-sun', '-50% 0'], floor: ['Grid floor', '.cy-floor'], fx: ['Rain or glyphs', '.cy-fx'] },
  glass: { brand: ['Name pill', '.lg-brand'], clock: ['Clock', '.lg-time'], contactBtn: ['Contact button', '.lg-round'], tabs: ['Tab bar', '.lg-tabs', '-50% 0'], intro: ['Greeting', '.lg-hi'], name: ['Name', '.lg-name'], roles: ['Roles pill', '.lg-roles'], pitch: ['Pitch', '.lg-pitch'], buttons: ['Buttons', '.lg-cta'], portrait: ['Portrait window', '.lg-portrait'], stat: ['Stat widget', '.lg-w-stat'], now: ['Now widget', '.lg-w-now'], contacts: ['Contact widget', '.lg-w-ct'], lens: ['Glass lens', '.lg-lens'] },
  gravity: { brand: ['Logo and name', '.gv-brand'], nav: ['Menu', '.gv-nav'], help: ['Keyboard help', '.gv-help'], intro: ['Greeting', '.gv-hi'], name: ['Name', '.gv-name'], roles: ['Roles', '.gv-roles'], pitch: ['Pitch', '.gv-pitch'], buttons: ['Buttons', '.gv-cta'], tip: ['Tip', '.gv-tip'], keys: ['Keycap area', '.gv-world'] },
  folio: { spines: ['Section spines', '.fo-spines'], contacts: ['Contact pill', '.fo-corner', '-100% 0'], photo: ['Photo', '.fo-photo'], kicker: ['Logo and location', '.fo-kicker'], name: ['Name', '.fo-name'], roles: ['Roles', '.fo-roles'], pitch: ['Pitch', '.fo-pitch'], index: ['Section index', '.fo-index'] },
  marquee: { brand: ['Logo', '.mq-brand'], nav: ['Menu', '.mq-nav'], location: ['Location', '.mq-loc'], footer: ['Footer', '.mq-foot'], portrait: ['Portrait', '.mq-fig'], role: ['Role and globe', '.mq-role'], buttons: ['Buttons', '.mq-cta'], name: ['Running name', '.mq-run'] },
  aura: { brand: ['Logo', '.au-brand'], nav: ['Menu', '.au-nav'], say: ['Hello button', '.au-say'], footer: ['Clocks and contacts', '.au-foot'], index: ['Section index', '.au-idx'], name: ['Name', '.au-name'], pitch: ['Pitch', '.au-tag'], button: ['Button', '.au-go'], glow: ['Gradient', '.au-gl'] },
  atelier: { brand: ['Logo', '.at-mark'], nav: ['Menu', '.at-nav'], contactBtn: ['Contact button', '.at-talk'], footer: ['Footer', '.at-foot'], words: ['Drifting words', '.at-w'], kicker: ['Intro line', '.at-kicker'], statement: ['Statement', '.at-say'], portrait: ['Portrait', '.at-fig'], question: ['Question and options', '.at-ask'], band: ['Running band', '.at-band'] },
  deck: { brand: ['Logo', '.dk-brand'], progress: ['Slide progress', '.dk-prog'], greeting: ['Greeting', '.dk-hi'], footer: ['Footer', '.dk-foot'], status: ['Status', '.dk-status'], name: ['Name', '.dk-name'], pitch: ['Pitch', '.dk-tag'], buttons: ['Buttons', '.dk-cta'], hint: ['Drawing hint', '.dk-hint'], strip: ['Running strip', '.dk-strip'], pad: ['Drawing area', '.dk-draw'] },
  plus: { brand: ['Logo', '.pl-mark'], nav: ['Menu', '.pl-nav'], mode: ['Light/dark switch', '.pl-mode'], footer: ['Footer', '.pl-foot'], label: ['Label', '.pl-lab'], name: ['Name', '.pl-name'], roles: ['Roles', '.pl-roles'], orb: ['Orb', '.pl-orbbox'], pitch: ['Pitch', '.pl-tag'], buttons: ['Buttons', '.pl-cta'], tally: ['Numbers', '.pl-tally'] },
  kinetic: { brand: ['Logo', '.kn-brand'], nav: ['Menu', '.kn-nav'], contactBtn: ['Contact button', '.kn-talk'], footer: ['Footer', '.kn-foot'], tags: ['Role tags', '.kn-tags'], name: ['Name', '.kn-name'], pitch: ['Pitch', '.kn-tag'], buttons: ['Buttons', '.kn-cta'], hint: ['Hint', '.kn-hint'], toy: ['Physics cluster', '.kn-cv'] },
  frost: { brand: ['Logo', '.fr-brand'], nav: ['Menu', '.fr-nav'], clock: ['Clock', '.fr-clock'], contactBtn: ['Contact button', '.fr-talk'], footer: ['Footer', '.fr-foot'], kicker: ['Status line', '.fr-kick'], name: ['Name', '.fr-name'], roles: ['Roles', '.fr-roles'], pitch: ['Pitch', '.fr-tag'], buttons: ['Buttons', '.fr-cta'], readout: ['Read-out panel', '.fr-read'], hint: ['Hint', '.fr-hint'], crystal: ['Crystal and snow', '.fr-cv'], fog: ['Fog', '.fr-fog'] },
};

/** Which part of the page each element belongs to (default: hero). Generated from where the markup lives. */
export const ELEMENT_PARTS = {'vision':{'nav':'brand nav contacts counter','bg':'glow'},'poster':{'nav':'brand nav year contacts'},'nexus':{'nav':'brand code coords nav contacts','bg':'globe grid'},'runway':{'nav':'brand nav contactBtn side contacts arrows','bg':'ghost'},'lab':{'nav':'brand nav contacts index','bg':'dots'},'bento':{'nav':'brand nav'},'traverse':{'nav':'brand nav rail footer','bg':'ghost spot'},'museum':{'nav':'brand nav contacts dots footer'},'forge':{'nav':'brand nav contacts hint object','bg':'floor'},'terminal':{'nav':'titlebar sidebar tabs status'},'blueprint':{'nav':'brand nav frame titleBlock crosshair','bg':'field'},'classic':{'nav':'brand nav dots contacts hint','bg':'photo'},'cyber':{'nav':'brand nav contactBtn sign footer','bg':'sun floor fx'},'glass':{'nav':'brand clock contactBtn tabs lens'},'gravity':{'nav':'brand nav help'},'folio':{'nav':'spines contacts'},'marquee':{'nav':'brand nav location footer'},'aura':{'nav':'brand nav say footer index','bg':'glow'},'atelier':{'nav':'brand nav contactBtn footer'},'deck':{'nav':'brand progress greeting footer'},'plus':{'nav':'brand nav mode footer'},'kinetic':{'nav':'brand nav contactBtn footer','bg':'toy'},'frost':{'nav':'brand nav clock contactBtn footer','bg':'crystal fog'}};

const partOf = (t, key) => { const m = ELEMENT_PARTS[t] || {}; return (m.nav || '').split(' ').includes(key) ? (menuKeys(t).includes(key) ? 'menu' : 'nav') : (m.bg || '').split(' ').includes(key) ? 'bg' : 'hero'; };
/**
 * Full list for a page: [{ key, label, sel, base, group, from }]
 * With a mix, each part's elements come from the template that provides that part. Elements of a
 * borrowed part are keyed "<template>:<key>" so edits stay with that template's markup.
 */
export function elementsFor(templateId, mix = {}) {
  const owner = { bg: mix?.bg || templateId, nav: mix?.nav || templateId, hero: mix?.hero || templateId };
  owner.menu = mix?.menu || owner.nav;
  owner.contacts = (mix?.contacts && CONTACT_SEL[mix.contacts]) ? mix.contacts : owner.nav;
  const out = [];
  const keyOf = (t, key) => (t === templateId ? key : `${t}:${key}`);
  for (const part of ['nav', 'menu', 'contacts', 'hero', 'bg']) {
    const t = owner[part], els = TEMPLATE_ELS[t] || {};
    if (part === 'contacts') {
      contactSels(t).forEach((sel, i) => {
        const hit = Object.entries(els).find(([, v]) => v[1] === sel);
        const label = hit ? hit[1][0] : /talk|btn|say|jack|round|-hi/.test(sel) ? 'Contact button' : 'Contact icons';
        out.push({ key: keyOf(t, hit ? hit[0] : 'ct' + i), label, sel, base: hit?.[1][2] || '', group: 'contacts', from: t });
      });
      continue;
    }
    for (const [key, [label, sel, base]] of Object.entries(els)) {
      if (partOf(t, key) !== part) continue;
      if (part === 'nav' && contactSels(t).includes(sel)) continue; // listed under Contact info
      out.push({ key: keyOf(t, key), label, sel, base: base || '', group: part === 'hero' ? 'home' : part, from: t });
    }
  }
  for (const [key, [label, sel, base]] of Object.entries(COMMON_ELS)) out.push({ key: 'c-' + key, label, sel, base: base || '', group: 'sections', from: '' });
  return out;
}

/** CSS for the user's element edits. els[key] = { hide, x, y, s, r, o, p: {…} } (p = tall screens). r = rotation°, o = opacity 0–1. */
export function elementsCss(templateId, els = {}, mix) {
  const list = elementsFor(templateId, mix);
  const rule = (e, v, pre) => {
    const out = [];
    const sel = e.sel.split(',').map((s) => `${pre} ${s.trim()}`).join(',');
    if (v.hide) out.push(`${sel}{display:none!important}`);
    const x = +v.x || 0, y = +v.y || 0, s = v.s == null ? 1 : +v.s;
    const r = +v.r || 0, o = v.o == null ? 1 : Math.max(0, Math.min(1, +v.o));
    if (x || y || (s !== 1 && s > 0) || r || o !== 1) {
      const [bx = '0px', by = '0px'] = (e.base || '').split(' ').filter(Boolean);
      const parts = [];
      if (x || y) parts.push(`translate:calc(${bx} + ${x}vw) calc(${by} + ${y}vh)!important`);
      if (s !== 1 && s > 0) parts.push(`scale:${s}!important`);
      if (r) parts.push(`rotate:${r}deg!important`);
      if (o !== 1) parts.push(`opacity:${o}!important`);
      out.push(`${sel}{${parts.join(';')}}`);
    }
    return out.join('');
  };
  let css = '';
  for (const e of list) {
    const v = els[e.key]; if (!v) continue;
    if (v.p) { css += rule(e, v, '.pf:not([data-o=p])'); css += rule(e, { ...v, ...v.p }, '.pf[data-o=p]'); }
    else css += rule(e, v, '.pf');
  }
  return css;
}
