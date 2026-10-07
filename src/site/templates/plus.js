/*! Portfolio Studio. Copyright (c) 2026 Roy Borkin. All rights reserved. Unauthorized copying, modification or distribution is prohibited without written permission. */
// 21 — Plus : museum signage. Stacked capitals at 0.8 leading, tiny labels, hairline cells, the "+"
// as the only ornament, and one iridescent orb that breathes and leans toward the pointer. Visitors
// can flip the whole site between light and dark from the header.
import { maskWords } from '../kit.js';

const GLYPH = { project: '●', post: '△', instagram: '⁂', linkedin: '◇' };

export default {
  id: 'plus',
  name: 'Plus',
  blurb: 'Museum-signage type, hairline cells, one iridescent orb, and a light/dark switch for visitors.',
  cursor: 'blend',
  magnetic: 0.3,
  transition(from, to, dir, ax, pt, root) {
    const w = root.querySelector('.pl-wipe');
    const E = 'cubic-bezier(.87,0,.13,1)';
    const k = dir > 0 ? ['inset(100% 0 0 0)', 'inset(0 0 0 0)', 'inset(0 0 100% 0)'] : ['inset(0 0 100% 0)', 'inset(0 0 0 0)', 'inset(100% 0 0 0)'];
    return [
      w.animate([{ clipPath: k[0] }, { clipPath: k[1], offset: 0.45 }, { clipPath: k[1], offset: 0.55 }, { clipPath: k[2] }], { duration: 1100, easing: E }),
      w.querySelector('i').animate([{ transform: 'rotate(-90deg) scale(.6)' }, { transform: 'rotate(0) scale(1)', offset: 0.5 }, { transform: 'rotate(90deg) scale(.6)' }], { duration: 1100, easing: E }),
      from.animate([{ opacity: 1 }, { opacity: 1, offset: 0.44 }, { opacity: 0, offset: 0.45 }, { opacity: 0 }], { duration: 1100, fill: 'forwards' }),
      to.animate([{ opacity: 0 }, { opacity: 0, offset: 0.55 }, { opacity: 1, offset: 0.56 }, { opacity: 1 }], { duration: 1100, fill: 'both' }),
    ];
  },
  variants: [
    { name: 'Parchment', swatch: ['#e5e4e0', '#1d1d1d', '#ff7eb6'],
      vars: { bg: '#e5e4e0', fg: '#1d1d1d', surface: '#ffffff', stone: '#d4d3ce', muted: '#6e6d69', line: '#bfbebe', accent: '#1d1d1d', accent2: '#ff7eb6', 'alt-bg': '#1b1b1b', 'alt-fg': '#e5e4e0', 'alt-surface': '#242424', 'alt-stone': '#2c2c2c', 'alt-muted': '#8f8e8a', 'alt-line': '#3a3a3a', o1: '#ffd23f', o2: '#ff7eb6', o3: '#7cc6ff', o4: '#b6f09c' },
      fonts: { display: 'Familjen Grotesk:400;500;700', body: 'Familjen Grotesk:400;500', mono: 'IBM Plex Mono:400;500' } },
    { name: 'Night studio', swatch: ['#121212', '#ecebe4', '#7a5cff'],
      vars: { bg: '#121212', fg: '#ecebe4', surface: '#1c1c1c', stone: '#242424', muted: '#8d8c87', line: '#333333', accent: '#ecebe4', accent2: '#7a5cff', 'alt-bg': '#ecebe4', 'alt-fg': '#121212', 'alt-surface': '#ffffff', 'alt-stone': '#d9d8d1', 'alt-muted': '#6d6c68', 'alt-line': '#c2c1bb', o1: '#7a5cff', o2: '#2ee6c5', o3: '#ff6b9a', o4: '#3d8bff' },
      fonts: { display: 'Familjen Grotesk:400;500;700', body: 'Familjen Grotesk:400;500', mono: 'IBM Plex Mono:400;500' } },
    { name: 'Signal', swatch: ['#f2f2f2', '#111111', '#ff3b1f'],
      vars: { bg: '#f2f2f2', fg: '#111111', surface: '#ffffff', stone: '#e3e3e3', muted: '#6b6b6b', line: '#c9c9c9', accent: '#ff3b1f', accent2: '#2b59ff', 'alt-bg': '#111111', 'alt-fg': '#f2f2f2', 'alt-surface': '#1a1a1a', 'alt-stone': '#222222', 'alt-muted': '#8a8a8a', 'alt-line': '#333333', o1: '#ff3b1f', o2: '#ff9a00', o3: '#2b59ff', o4: '#ffe14d' },
      fonts: { display: 'Familjen Grotesk:400;500;700', body: 'Familjen Grotesk:400;500', mono: 'IBM Plex Mono:400;500' } },
  ],
  layout: { works: [15, 15.5] },
  shell(c) {
    return {
      nav: `<header class="pl-top">
          <button class="pl-mark pl-cell" data-go="0" data-hover>${c.esc(c.first.toUpperCase())}<b>+</b>${c.esc(c.last.toUpperCase())}</button>
          <nav class="pl-nav" aria-label="Sections">${c.secs.map((s) => `<a class="pf-nav-a pl-cell" href="#${s.id}" data-go="${s.i}"><span class="pf-nav-n">${s.n}</span><span class="pf-nav-l">${c.esc(s.label)}</span></a>`).join('')}</nav>
          <button class="pl-mode pl-cell" aria-label="Switch light and dark" data-hover data-cursor=""><i></i><span>Mode</span></button>
          ${c.menuBtn('pl-burger')}
        </header>
        <footer class="pl-foot">${c.contacts.slice(0, 5).map((x) => `<a href="${c.esc(c.contactHref(x))}" ${/^https?:/.test(c.contactHref(x)) ? 'target="_blank" rel="noopener"' : ''} data-hover>${c.esc(x.label || x.type)}</a>`).join('<i>+</i>')}<span class="pl-copy">© ${new Date().getFullYear()} ${c.esc(c.name)}</span></footer>
        <div class="pl-wipe" aria-hidden="true"><i>+</i></div>
        ${c.drawer('pl-drawer')}`,
    };
  },
  home(c) {
    const P = c.P, ws = c.sec('works'), st = (c.data.about?.stats || []).slice(0, 4);
    return `<div class="pl-hero">
      <p class="pl-lab">${c.esc(P.intro || '')}</p>
      <h1 class="pl-name"><span>${maskWords(c.esc, c.first.toUpperCase() + '+')}</span><span>${maskWords(c.esc, c.last.toUpperCase(), 1)}</span></h1>
      <p class="pl-roles">${c.roles.map((r) => c.esc(r.toUpperCase())).join(' <b>+</b> ')}</p>
      <div class="pl-orbbox" aria-hidden="true"><div class="pl-orb"><i></i></div></div>
      <div class="pl-low"><p class="pl-tag">${c.esc(P.tagline || '')}</p>
        <div class="pl-cta">${ws ? `<button class="pl-btn pl-btn-p" data-go="${ws.i}" data-hover><span>${c.esc(ws.label)}</span><b>+</b></button>` : ''}<button class="pl-btn" data-contact data-hover><span>Contact</span><b>+</b></button></div></div>
      ${st.length ? `<dl class="pl-tally">${st.map((s) => `<div><dt>${c.esc(s.label)}</dt><dd>${c.esc(s.value)}</dd></div>`).join('')}</dl>` : ''}
    </div>`;
  },
  head(c, s) {
    return `<header class="pf-head"><span class="pf-head-n">${s.n}</span><h2 class="pf-head-t">${maskWords(c.esc, (s.title || s.label).toUpperCase().replace(/\s+/g, '+'))}</h2>${s.subtitle ? `<p class="pf-head-s">${c.esc(s.subtitle)}</p>` : ''}</header>`;
  },
  mount(c, root) {
    const off = [];
    const KEY = 'pf-plus-mode';
    let alt = false;
    try { alt = localStorage.getItem(KEY) === '1'; } catch { /* storage unavailable */ }
    root.classList.toggle('pl-alt', alt);
    const btn = root.querySelector('.pl-mode');
    const flip = () => { alt = !alt; root.classList.toggle('pl-alt', alt); try { localStorage.setItem(KEY, alt ? '1' : '0'); } catch { /* storage unavailable */ } };
    btn?.addEventListener('click', flip); off.push(() => btn?.removeEventListener('click', flip));
    // glyph-coded work kinds
    const tag = () => root.querySelectorAll('.pf-work:not([data-g])').forEach((b) => { b.dataset.g = ''; const t = b.querySelector('.pf-card-title'); if (t) t.insertAdjacentHTML('afterbegin', `<i class="pl-g">${GLYPH[b.dataset.kind] || '+'}</i>`); });
    if (c.slot?.('sections') !== false) { const mo = new MutationObserver(tag); root.querySelectorAll('.pf-grid').forEach((g) => mo.observe(g, { childList: true })); tag(); off.push(() => mo.disconnect()); }
    return () => { off.forEach((f) => f()); root.classList.remove('pl-alt'); };
  },
  css: () => `
.pf[data-t=plus]{--pad-t:6.6em;--pad-r:2.4em;--pad-l:2.4em;--pad-b:4.6em;--radius:0px;--grain-o:0;--cursor:#fff;font-weight:400;transition:background-color .6s,color .6s}
.pf[data-t=plus].pl-alt{--bg:var(--alt-bg);--fg:var(--alt-fg);--surface:var(--alt-surface);--stone:var(--alt-stone);--muted:var(--alt-muted);--line:var(--alt-line)}
.pf[data-t=plus].pl-alt:not([data-v="2"]){--accent:var(--alt-fg)}
/* header: a row of hairline cells */
.pl-top{position:absolute;z-index:30;inset:0 0 auto;display:flex;align-items:stretch;height:3.6em;border-bottom:1px solid var(--line)}
.pl-cell{display:flex;align-items:center;gap:.6em;padding:0 1.4em;border-right:1px solid var(--line);font-family:var(--f-mono);font-size:.74em;letter-spacing:.06em;text-transform:uppercase;transition:background-color .25s,color .25s}
.pl-mark{font-family:var(--f-display);font-size:1.02em;font-weight:500;letter-spacing:.01em}
.pl-mark b{font-weight:400;margin:0 .05em}
.pl-nav{display:flex;margin-left:auto;border-left:1px solid var(--line)}
.pl-nav .pf-nav-n{color:var(--muted)}
.pl-nav .pf-nav-a.is-cur{background:var(--fg);color:var(--bg)}
.pl-nav .pf-nav-a.is-cur .pf-nav-n{color:inherit;opacity:.6}
@media (hover:hover){.pl-cell:not(.is-cur):hover{background:var(--stone)}}
.pl-mode{border-right:0}
.pl-mode i{width:1.1em;height:1.1em;border-radius:50%;border:1px solid currentColor;background:linear-gradient(90deg,currentColor 50%,transparent 50%);transition:rotate .6s cubic-bezier(.87,0,.13,1)}
.pf.pl-alt .pl-mode i{rotate:180deg}
.pl-burger{display:none;align-self:center;margin:0 .6em}
.pl-drawer .pf-nav-a{font-weight:500;text-transform:uppercase;letter-spacing:-.02em;line-height:.95}
.pl-foot{position:absolute;z-index:20;inset:auto 0 0;height:2.8em;display:flex;align-items:center;gap:.9em;padding:0 2.4em;border-top:1px solid var(--line);font-family:var(--f-mono);font-size:.7em;letter-spacing:.06em;text-transform:uppercase}
.pl-foot i{font-style:normal;color:var(--muted)}
.pl-foot a{transition:color .2s}
@media (hover:hover){.pl-foot a:hover{color:var(--muted)}}
.pl-copy{margin-left:auto;color:var(--muted)}
.pl-wipe{position:absolute;z-index:80;inset:0;background:var(--fg);color:var(--bg);display:grid;place-items:center;clip-path:inset(100% 0 0 0);pointer-events:none}
.pl-wipe i{font-style:normal;font-family:var(--f-display);font-weight:400;font-size:42vmin;line-height:1}
/* hero */
.pl-hero{position:absolute;inset:0;display:grid;grid-template-columns:minmax(0,1.25fr) minmax(0,1fr);grid-template-rows:auto auto auto 1fr auto;column-gap:2em}
.pl-lab{grid-column:1;font-family:var(--f-mono);font-size:.72em;letter-spacing:.06em;text-transform:uppercase;color:var(--muted);margin-bottom:1em}
.pl-name{grid-column:1/-1;grid-row:2;position:relative;z-index:2;display:flex;flex-direction:column;font-family:var(--f-display);font-weight:400;font-size:clamp(4em,23vmin,18em);line-height:.8;letter-spacing:.005em;margin-left:-.04em}
.pl-name .k-m{padding-top:.06em}
.pl-roles{grid-column:1;grid-row:3;margin-top:1.4em;font-family:var(--f-mono);font-size:.74em;letter-spacing:.06em}
.pl-roles b{font-weight:400;color:var(--muted);margin:0 .3em}
.pl-orbbox{grid-column:2;grid-row:1/5;position:relative;display:grid;place-items:center;pointer-events:none}
.pl-orb{position:relative;width:min(48vmin,560px);aspect-ratio:1;border-radius:50%;overflow:hidden;translate:calc(var(--mx) * 2.4vmin) calc(var(--my) * 2vmin);animation:plMorph 11s ease-in-out infinite alternate;box-shadow:inset -3vmin -4vmin 7vmin rgba(0,0,0,.18),inset 2vmin 2vmin 5vmin rgba(255,255,255,.45)}
.pl-orb::before{content:"";position:absolute;inset:-25%;background:conic-gradient(from 0deg,var(--o1),var(--o2),var(--o3),var(--o4),var(--o1));filter:blur(4.5vmin) saturate(1.2);animation:plSpin 14s linear infinite}
.pl-orb::after{content:"";position:absolute;inset:0;border-radius:inherit;background:radial-gradient(circle at 32% 26%,rgba(255,255,255,.9),rgba(255,255,255,0) 26%),radial-gradient(circle at 70% 80%,rgba(255,255,255,.25),transparent 40%)}
.pl-orb i{position:absolute;inset:0;z-index:1;border-radius:inherit;background:radial-gradient(circle at calc(50% + var(--mx) * 30%) calc(50% + var(--my) * 30%),transparent 30%,rgba(0,0,0,.12) 75%)}
@keyframes plSpin{to{transform:rotate(1turn)}}
@keyframes plMorph{0%{border-radius:50%}50%{border-radius:47% 53% 51% 49% / 52% 47% 53% 48%}100%{border-radius:52% 48% 46% 54% / 48% 53% 47% 52%}}
.pl-low{grid-column:1;grid-row:5;display:flex;flex-direction:column;gap:1.2em;padding-bottom:1.4em}
.pl-tag{max-width:34ch;font-size:1.08em;line-height:1.4}
.pl-cta{display:flex;gap:.4em}
.pl-btn{display:inline-flex;align-items:center;gap:1.4em;height:3em;padding:0 1.2em;border-radius:10px;border:1px solid var(--fg);font-family:var(--f-mono);font-size:.76em;letter-spacing:.06em;text-transform:uppercase;transition:background-color .25s,color .25s}
.pl-btn b{font-weight:400;font-size:1.4em;transition:rotate .4s cubic-bezier(.87,0,.13,1)}
.pl-btn-p{background:var(--fg);color:var(--bg)}
@media (hover:hover){.pl-btn:hover b{rotate:90deg}.pl-btn:not(.pl-btn-p):hover{background:var(--fg);color:var(--bg)}}
.pl-btn:active{scale:.97}
.pl-tally{grid-column:2;grid-row:5;align-self:end;display:grid;grid-template-columns:repeat(auto-fit,minmax(6.5em,1fr));border-top:1px solid var(--line);margin-bottom:1.4em}
.pl-tally div{padding:.8em .9em 0;border-left:1px solid var(--line)}
.pl-tally dt{font-family:var(--f-mono);font-size:.66em;letter-spacing:.06em;text-transform:uppercase;color:var(--muted)}
.pl-tally dd{font-family:var(--f-display);font-size:clamp(1.8em,4.4vmin,3.4em);line-height:1;letter-spacing:-.02em}
.pl-lab,.pl-roles,.pl-low,.pl-tally{opacity:0;transition:opacity .9s .55s}
.pl-orb{scale:.85;opacity:0;transition:scale 1.4s cubic-bezier(.23,1,.32,1) .2s,opacity 1s .2s}
.pf-sec-home.is-on :is(.pl-lab,.pl-roles,.pl-low,.pl-tally),.pf[data-static] :is(.pl-lab,.pl-roles,.pl-low,.pl-tally){opacity:1}
.pf-sec-home.is-on .pl-orb,.pf[data-static] .pl-orb{scale:1;opacity:1}
/* sections */
.pf[data-t=plus] .pf-head{align-items:flex-end}
.pf[data-t=plus] .pf-head-n{font-family:var(--f-mono);font-size:.72em;color:var(--muted);align-self:flex-start}
.pf[data-t=plus] .pf-head-t{font-weight:400;font-size:clamp(2.8em,10vmin,8em);line-height:.8;letter-spacing:.005em}
.pf[data-t=plus] .pf-head-s{flex-basis:auto;margin-left:auto;max-width:32ch;font-size:.9em;color:var(--muted)}
.pf[data-t=plus] :is(.pf-chip,.pf-tab,.pf-pg,.pf-igp,.pf-btn){border-radius:10px;border:1px solid var(--line);background:transparent;color:var(--fg);font-family:var(--f-mono);font-size:.72em;letter-spacing:.05em;text-transform:uppercase}
.pf[data-t=plus] :is(.pf-chip,.pf-tab){padding:.75em 1.1em}
.pf[data-t=plus] :is(.pf-chip[aria-pressed=true],.pf-tab[aria-selected=true],.pf-btn:not(.pf-btn-ghost)){background:var(--fg);color:var(--bg);border-color:var(--fg)}
.pf[data-t=plus] .pf-card{background:var(--surface);border:0;border-radius:0;background-image:linear-gradient(var(--line) 1px,transparent 1px),linear-gradient(90deg,var(--line) 1px,transparent 1px);background-size:22px 22px;background-position:-1px -1px}
.pf[data-t=plus] .pf-card-media{margin:.6em .6em 0}
.pf[data-t=plus] .pf-card-body{background:var(--surface)}
.pf[data-t=plus] .pf-card-meta{font-family:var(--f-mono);font-size:.62em;letter-spacing:.06em;text-transform:uppercase}
.pf[data-t=plus] .pf-card-title{font-weight:500;text-transform:uppercase;font-size:.92em;letter-spacing:.01em}
.pl-g{font-style:normal;margin-right:.45em;color:var(--muted)}
.pf[data-t=plus] .pf-repo{background-image:none}
.pf[data-t=plus] :is(.pf-xp,.pf-edu,.pf-skill,.pf-port-item){background:var(--surface);border:0;border-radius:0}
.pf[data-t=plus] .pf-port-t{text-transform:uppercase;letter-spacing:.005em}
.pf[data-t=plus] .pf-stats dd{letter-spacing:-.02em}
.pf[data-t=plus] .pf-modal-box{border-radius:0;background:var(--bg)}
/* responsive */
.pf[data-t=plus][data-w=sm] .pl-nav,.pf[data-t=plus][data-w=xs] .pl-nav{display:none}
.pf[data-t=plus][data-w=sm] .pl-mode,.pf[data-t=plus][data-w=xs] .pl-mode{margin-left:auto;border-left:1px solid var(--line)}
.pf[data-t=plus][data-w=sm] .pl-burger,.pf[data-t=plus][data-w=xs] .pl-burger{display:block}
.pf[data-t=plus][data-w=xs]{--pad-r:1.2em;--pad-l:1.2em;--pad-t:5.2em;--pad-b:4em}
.pf[data-t=plus][data-w=xs] .pl-mode span,.pf[data-t=plus][data-w=xs] .pl-copy{display:none}
.pf[data-t=plus][data-w=xs] .pl-foot{padding:0 1.2em;overflow:hidden;white-space:nowrap}
.pf[data-t=plus][data-w=xs] .pf-head-s{display:none}
.pf[data-t=plus][data-o=p] .pl-hero{grid-template-columns:1fr;grid-template-rows:auto auto auto 1fr auto auto}
.pf[data-t=plus][data-o=p] .pl-orbbox{grid-column:1;grid-row:4}
.pf[data-t=plus][data-o=p] .pl-orb{width:min(62vw,40vh)}
.pf[data-t=plus][data-o=p] .pl-name{font-size:clamp(3.4em,22vw,9em)}
.pf[data-t=plus][data-o=p] .pl-tally{grid-column:1;grid-row:6;margin-bottom:.6em}
.pf[data-t=plus][data-o=p] .pl-low{padding-bottom:1em}
.pf[data-t=plus][data-w=xs][data-o=p] .pl-tag{display:none}
.pf[data-t=plus][data-h=tiny]{--pad-t:4.2em;--pad-b:3.2em}
.pf[data-t=plus][data-h=tiny] .pl-top{height:2.8em}
.pf[data-t=plus][data-h=tiny] .pl-foot{height:2.2em}
.pf[data-t=plus][data-h=tiny] :is(.pl-lab,.pl-tally,.pl-tag){display:none}
.pf[data-t=plus][data-h=tiny] .pl-name{font-size:clamp(3em,20vmin,8em)}
`,
};
