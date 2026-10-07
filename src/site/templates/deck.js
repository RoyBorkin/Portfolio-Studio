/*! Portfolio Studio. Copyright (c) 2026 Roy Borkin. All rights reserved. Unauthorized copying, modification or distribution is prohibited without written permission. */
// 20 — Deck : your site is a pitch deck. Slides advance under a two-tone wipe that names the next
// slide, a segmented progress bar doubles as navigation, a counter runs from 0 to 100 on the first
// visit, and the title slide is a sketchpad: drag on it and your strokes fade like chalk.
import { maskWords, still } from '../kit.js';

const mark = (root, i) => root.querySelectorAll('.dk-prog .pf-nav-a').forEach((a, k) => a.classList.toggle('is-done', k <= i));

export default {
  id: 'deck',
  name: 'Deck',
  blurb: 'Your site as a pitch deck: slide wipes, a progress bar you can click, a title slide you can draw on.',
  cursor: 'bubble',
  magnetic: 0.4,
  transition(from, to, dir, ax, pt, root) {
    const w = root.querySelector('.dk-wipe');
    w.querySelector('b').textContent = to.getAttribute('aria-label') || '';
    w.querySelector('small').textContent = `${String(+to.dataset.i + 1).padStart(2, '0')} / ${String(root.querySelectorAll('.pf-sec').length).padStart(2, '0')}`;
    const E = 'cubic-bezier(.76,0,.24,1)';
    const a = dir > 0 ? ['inset(0 0 0 100%)', 'inset(0 0 0 0)', 'inset(0 100% 0 0)'] : ['inset(0 100% 0 0)', 'inset(0 0 0 0)', 'inset(0 0 0 100%)'];
    return [
      w.animate([{ clipPath: a[0] }, { clipPath: a[1], offset: 0.4 }, { clipPath: a[1], offset: 0.6 }, { clipPath: a[2] }], { duration: 1250, easing: E }),
      w.querySelector('.dk-wl').animate([{ transform: `translateX(${dir * 12}vw)`, opacity: 0 }, { transform: 'none', opacity: 1, offset: 0.45 }, { transform: 'none', opacity: 1, offset: 0.55 }, { transform: `translateX(${-dir * 12}vw)`, opacity: 0 }], { duration: 1250, easing: E }),
      from.animate([{ transform: 'none' }, { transform: `translateX(${-dir * 6}vw)`, offset: 0.45 }, { opacity: 0, offset: 0.46 }, { opacity: 0 }], { duration: 1250, easing: E, fill: 'forwards' }),
      to.animate([{ opacity: 0 }, { opacity: 0, offset: 0.54 }, { opacity: 1, transform: `translateX(${dir * 6}vw)`, offset: 0.55 }, { opacity: 1, transform: 'none' }], { duration: 1250, easing: E, fill: 'both' }),
    ];
  },
  variants: [
    { name: 'Paper & ink', swatch: ['#f6f1e7', '#1a1c1c', '#49c5b6'],
      vars: { bg: '#f6f1e7', surface: '#ebe4d5', fg: '#1a1c1c', muted: '#6f6b62', accent: '#2fa898', accent2: '#ff9398', line: 'rgba(26,28,28,.14)', ink: '#1a1c1c', paper: '#f6f1e7' },
      fonts: { display: 'Archivo:800;900', body: 'Inter Tight:400;500;600', mono: 'JetBrains Mono:400' } },
    { name: 'Night shift', swatch: ['#121414', '#ede8df', '#ff9398'],
      vars: { bg: '#121414', surface: '#1d2020', fg: '#ede8df', muted: '#8b8f8a', accent: '#ff9398', accent2: '#49c5b6', line: 'rgba(237,232,223,.14)', ink: '#ede8df', paper: '#121414' },
      fonts: { display: 'Archivo:800;900', body: 'Inter Tight:400;500;600', mono: 'JetBrains Mono:400' } },
    { name: 'Sage', swatch: ['#dde3d5', '#1f2a24', '#f2a0b5'],
      vars: { bg: '#dde3d5', surface: '#cfd7c5', fg: '#1f2a24', muted: '#5f6b62', accent: '#e1708f', accent2: '#1f2a24', line: 'rgba(31,42,36,.15)', ink: '#1f2a24', paper: '#dde3d5' },
      fonts: { display: 'Archivo:800;900', body: 'Inter Tight:400;500;600', mono: 'JetBrains Mono:400' } },
  ],
  layout: { works: [15, 15] },
  shell(c) {
    const n = c.pad2(c.secs.length);
    return {
      nav: `<header class="dk-top">
          <button class="dk-brand" data-go="0" data-hover>${c.logo()}</button>
          <nav class="dk-prog" aria-label="Slides">${c.secs.map((s) => `<a class="pf-nav-a" href="#${s.id}" data-go="${s.i}" data-cursor="${c.esc(s.label)}"><i></i><span class="pf-nav-l">${c.esc(s.label)}</span></a>`).join('')}</nav>
          <button class="dk-hi" data-contact data-hover data-cursor="">Say hi</button>
        </header>
        <footer class="dk-foot"><span class="dk-who">${c.esc(c.name)}${c.P.location ? ` · ${c.esc(c.P.location)}` : ''}</span><span class="dk-count"><b>01</b><i>/</i>${n}</span>
          <span class="dk-arrows"><button data-prev aria-label="Previous slide" data-hover data-cursor="">${c.I('arrowLeft')}</button><button data-next aria-label="Next slide" data-hover data-cursor="">${c.I('arrow')}</button></span></footer>
        <div class="dk-wipe" aria-hidden="true"><div class="dk-wl"><small></small><b></b></div></div>
        <div class="dk-load" aria-hidden="true"><svg viewBox="0 0 200 120"><text x="100" y="92" text-anchor="middle">${c.esc((c.first[0] || '') + (c.last[0] || ''))}</text></svg><span class="dk-pct">0%</span></div>`,
    };
  },
  home(c) {
    const P = c.P, ws = c.sec('works');
    const run = c.roles.map((r) => `<span>${c.esc(r)}</span><i>✺</i>`).join('');
    return `<div class="dk-hero">
      <canvas class="dk-draw" ${''}aria-hidden="true"></canvas>
      <p class="dk-status"><i></i>${c.esc(P.status || 'Available for new work')}</p>
      <h1 class="dk-name"><span>${maskWords(c.esc, c.first.toUpperCase())}</span><span>${maskWords(c.esc, c.last.toUpperCase(), 1)}</span></h1>
      <div class="dk-low">
        <p class="dk-tag">${c.esc(P.tagline || '')}</p>
        <div class="dk-cta">${ws ? `<button class="dk-btn dk-btn-p" data-go="${ws.i}" data-hover data-cursor="">See ${c.esc(ws.label.toLowerCase())}</button>` : ''}<button class="dk-btn" data-contact data-hover data-cursor="">Say hi</button></div>
      </div>
      <p class="dk-hint">Drag anywhere to draw</p>
      <div class="dk-strip" aria-hidden="true"><div class="dk-run">${run}${run}${run}${run}</div></div>
    </div>`;
  },
  head(c, s) {
    return `<header class="pf-head"><span class="pf-head-n">${s.n} / ${c.pad2(c.secs.length)}</span><h2 class="pf-head-t">${maskWords(c.esc, (s.title || s.label).toUpperCase())}</h2>${s.subtitle ? `<p class="pf-head-s">${c.esc(s.subtitle)}</p>` : ''}</header>`;
  },
  mount(c, root, st) {
    const off = [];
    mark(root, Math.max(0, c.secs.findIndex((s) => s.id === root.dataset.cur)));
    const fine = matchMedia('(pointer:fine)').matches;
    // sketchpad
    const cv = root.querySelector('.dk-draw');
    if (cv && fine && !root.dataset.static) {
      cv.dataset.drag = ''; cv.dataset.cursor = 'Draw';
      const g = cv.getContext('2d'); let W = 0, H = 0, dpr = 1;
      const size = () => { dpr = Math.min(2, devicePixelRatio || 1); W = cv.clientWidth; H = cv.clientHeight; cv.width = W * dpr; cv.height = H * dpr; };
      size(); const ro = new ResizeObserver(size); ro.observe(cv); off.push(() => ro.disconnect());
      const strokes = []; let curS = null;
      const ink = getComputedStyle(root).getPropertyValue('--accent').trim();
      const pos = (e) => { const r = cv.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top, performance.now()]; };
      const down = (e) => { if (e.button !== 0) return; cv.setPointerCapture(e.pointerId); curS = { p: [pos(e)], born: performance.now() }; strokes.push(curS); root.classList.add('dk-drew'); kick(); };
      const move = (e) => { if (!curS) return; curS.p.push(pos(e)); kick(); };
      const up = () => { if (curS) curS.end = performance.now(); curS = null; };
      cv.addEventListener('pointerdown', down); cv.addEventListener('pointermove', move); cv.addEventListener('pointerup', up); cv.addEventListener('pointercancel', up);
      off.push(() => { cv.removeEventListener('pointerdown', down); cv.removeEventListener('pointermove', move); cv.removeEventListener('pointerup', up); cv.removeEventListener('pointercancel', up); });
      let raf = 0;
      const draw = () => {
        raf = 0; const now = performance.now();
        g.setTransform(dpr, 0, 0, dpr, 0, 0); g.clearRect(0, 0, W, H);
        g.lineCap = 'round'; g.lineJoin = 'round'; g.strokeStyle = ink;
        for (let k = strokes.length - 1; k >= 0; k--) {
          const s = strokes[k]; const age = s.end ? (now - s.end) / 2600 : 0;
          if (age >= 1) { strokes.splice(k, 1); continue; }
          g.globalAlpha = 1 - age * age; g.lineWidth = 9 * (1 - age * 0.5);
          g.beginPath(); s.p.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); g.stroke();
        }
        if (strokes.length) raf = requestAnimationFrame(draw);
      };
      const kick = () => { if (!raf) raf = requestAnimationFrame(draw); };
      off.push(() => cancelAnimationFrame(raf));
    }
    // first visit: count to 100 while the initials draw themselves, then the panel lifts
    const ld = root.querySelector('.dk-load');
    if (!window.__dkIntro && !still(root) && !st?.opts?.edit && !st?.opts?.section) {
      window.__dkIntro = 1;
      ld.classList.add('is-on');
      const pct = ld.querySelector('.dk-pct'); const t0 = performance.now();
      const step = (now) => {
        const p = Math.min(1, (now - t0) / 1500); pct.textContent = Math.round((1 - Math.pow(1 - p, 3)) * 100) + '%';
        if (p < 1) raf2 = requestAnimationFrame(step);
        else ld.animate([{ clipPath: 'inset(0 0 0 0)' }, { clipPath: 'inset(0 0 100% 0)' }], { duration: 900, delay: 150, easing: 'cubic-bezier(.76,0,.24,1)', fill: 'forwards' }).finished.then(() => ld.classList.remove('is-on')).catch(() => {});
      };
      let raf2 = requestAnimationFrame(step);
      off.push(() => cancelAnimationFrame(raf2));
    }
    return () => off.forEach((f) => f());
  },
  onLeave(c, from, to, root) { const b = root.querySelector('.dk-count b'); if (b) b.textContent = c.pad2(to + 1); mark(root, to); },
  onEnter(c, i, p, root) { const b = root.querySelector('.dk-count b'); if (b) b.textContent = c.pad2(i + 1); mark(root, i); },
  css: () => `
.pf[data-t=deck]{--pad-t:6.4em;--pad-r:2.6em;--pad-l:2.6em;--pad-b:5.4em;--radius:18px;--grain-o:0;--cursor:var(--ink);font-weight:400}
.pf[data-t=deck] .pf-cursor{--cl:var(--paper)}
.pf[data-t=deck] .pf-cursor .pf-cur-l{font-weight:700}
/* chrome */
.dk-top{position:absolute;z-index:30;inset:0 0 auto;display:flex;align-items:center;gap:2em;padding:1.5em 2.6em}
.dk-brand .pf-logo{height:2.2em}
.pf[data-v="0"] .dk-brand .pf-logo,.pf[data-v="2"] .dk-brand .pf-logo{filter:brightness(0)}
.pf[data-v="1"] .dk-brand .pf-logo{filter:brightness(0) invert(1)}
.dk-prog{flex:1;display:flex;gap:.4em}
.dk-prog .pf-nav-a{flex:1;display:flex;flex-direction:column;align-items:stretch;gap:.5em;padding:.6em 0;font-size:.74em;font-weight:500;color:var(--muted);transition:color .3s}
.dk-prog .pf-nav-a i{display:block;height:3px;border-radius:3px;background:var(--line);position:relative;overflow:hidden}
.dk-prog .pf-nav-a i::after{content:"";position:absolute;inset:0;background:var(--fg);transform:scaleX(0);transform-origin:left;transition:transform .7s cubic-bezier(.76,0,.24,1)}
.dk-prog .pf-nav-a.is-cur,.dk-prog .pf-nav-a:hover{color:var(--fg)}
.dk-prog .pf-nav-a.is-done i::after{transform:scaleX(1)}
.dk-hi{height:2.7em;padding:0 1.3em;border-radius:999px;background:var(--fg);color:var(--bg);font-weight:600;font-size:.88em}
.dk-foot{position:absolute;z-index:20;left:2.6em;right:2.6em;bottom:1.3em;display:flex;align-items:center;gap:1.4em;font-size:.84em}
.dk-who{color:var(--muted)}
.dk-count{margin-left:auto;font-family:var(--f-display);font-weight:900;font-size:2.2em;letter-spacing:-.04em;line-height:1;color:var(--muted)}
.dk-count b{color:var(--fg);font-weight:900}
.dk-count i{font-style:normal;margin:0 .1em;opacity:.5}
.dk-arrows{display:flex;gap:.35em}
.dk-arrows button{width:2.8em;height:2.8em;border-radius:50%;display:grid;place-items:center;border:1.5px solid var(--fg);transition:background-color .2s,color .2s}
@media (hover:hover){.dk-arrows button:hover{background:var(--fg);color:var(--bg)}}
.dk-arrows button:active{scale:.94}
/* wipe + loader */
.dk-wipe{position:absolute;z-index:80;inset:0;background:var(--ink);color:var(--paper);display:grid;place-items:center;clip-path:inset(0 0 0 100%);pointer-events:none}
.dk-wl{display:flex;flex-direction:column;align-items:center;gap:.4em}
.dk-wl small{font-family:var(--f-mono);font-size:.9em;opacity:.6}
.dk-wl b{font-family:var(--f-display);font-weight:900;font-size:clamp(3em,11vw,10em);letter-spacing:-.04em;line-height:.9;text-transform:uppercase}
.dk-load{position:absolute;z-index:90;inset:0;background:var(--ink);color:var(--paper);display:none;place-items:center}
.dk-load.is-on{display:grid}
.dk-load svg{width:min(60vw,420px);overflow:visible}
.dk-load text{font-family:var(--f-display);font-weight:900;font-size:110px;letter-spacing:-6px;fill:transparent;stroke:var(--paper);stroke-width:1.6;stroke-dasharray:900;stroke-dashoffset:900;animation:dkDraw 1.4s cubic-bezier(.65,0,.35,1) forwards,dkFill .4s 1.2s forwards}
@keyframes dkDraw{to{stroke-dashoffset:0}}
@keyframes dkFill{to{fill:var(--paper)}}
.dk-pct{position:absolute;left:2.6rem;bottom:2rem;font-family:var(--f-display);font-weight:900;font-size:clamp(3em,9vw,8em);letter-spacing:-.04em;line-height:1;font-variant-numeric:tabular-nums}
/* hero */
.dk-hero{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:center;gap:1.2em}
.dk-draw{position:absolute;inset:calc(var(--pad-t) * -1) calc(var(--pad-r) * -1) calc(var(--pad-b) * -1) calc(var(--pad-l) * -1);width:calc(100% + var(--pad-l) + var(--pad-r));height:calc(100% + var(--pad-t) + var(--pad-b));z-index:0;touch-action:none}
.dk-hero>*:not(.dk-draw){position:relative;z-index:1}
.dk-hero :is(.dk-status,.dk-name,.dk-tag,.dk-hint,.dk-strip){pointer-events:none}
.dk-status{display:inline-flex;align-self:flex-start;align-items:center;gap:.6em;padding:.5em 1em;border-radius:999px;border:1px solid var(--line);font-size:.85em;font-weight:500}
.dk-status i{width:.55em;height:.55em;border-radius:50%;background:var(--accent);box-shadow:0 0 0 0 var(--accent);animation:dkPulse 2s infinite}
@keyframes dkPulse{70%{box-shadow:0 0 0 .55em transparent}100%{box-shadow:0 0 0 0 transparent}}
.dk-name{display:flex;flex-direction:column;font-family:var(--f-display);font-weight:900;font-size:clamp(4em,21vmin,17em);line-height:.82;letter-spacing:-.055em;margin-left:-.04em}
.dk-name>span:last-child{padding-left:.9em}
.dk-low{display:flex;align-items:flex-end;justify-content:space-between;gap:2em;flex-wrap:wrap}
.dk-tag{max-width:36ch;font-size:1.05em;line-height:1.45}
.dk-cta{display:flex;gap:.5em}
.dk-btn{height:3.2em;padding:0 1.6em;border-radius:999px;border:1.5px solid var(--fg);font-weight:600;transition:background-color .2s,color .2s,rotate .3s cubic-bezier(.34,1.56,.64,1)}
.dk-btn-p{background:var(--fg);color:var(--bg)}
@media (hover:hover){.dk-btn:hover{rotate:-3deg}.dk-btn:not(.dk-btn-p):hover{background:var(--fg);color:var(--bg)}}
.dk-btn:active{scale:.96}
.dk-hint{position:absolute!important;right:0;top:0;font-family:var(--f-mono);font-size:.74em;color:var(--muted);transition:opacity .4s}
.pf:not([data-static]) .dk-drew .dk-hint,.dk-drew .dk-hint{opacity:0}
.pf[data-w=xs] .dk-hint,.pf[data-w=sm] .dk-hint{display:none}
.dk-strip{position:absolute!important;left:calc(var(--pad-l) * -1 - 2vw);right:calc(var(--pad-r) * -1 - 2vw);bottom:-2.6em;rotate:-2deg;background:var(--accent);color:var(--ink);overflow:hidden;padding:.5em 0}
.pf[data-v="1"] .dk-strip{color:#121414}
.dk-run{display:flex;align-items:center;width:max-content;animation:dkRun 26s linear infinite}
.dk-run span{font-family:var(--f-display);font-weight:900;font-size:1.25em;text-transform:uppercase;letter-spacing:-.01em;white-space:nowrap}
.dk-run i{font-style:normal;margin:0 .9em}
@keyframes dkRun{to{transform:translateX(-50%)}}
/* entrance */
.dk-status,.dk-low,.dk-strip{opacity:0;transition:opacity .8s .6s,translate .9s cubic-bezier(.23,1,.32,1) .6s}
.dk-low{translate:0 1em}.dk-strip{translate:0 120%}
.pf-sec-home.is-on :is(.dk-status,.dk-low,.dk-strip),.pf[data-static] :is(.dk-status,.dk-low,.dk-strip){opacity:1;translate:none}
/* sections */
.pf[data-t=deck] .pf-head{align-items:flex-end}
.pf[data-t=deck] .pf-head-n{order:2;margin-left:auto;font-family:var(--f-mono);color:var(--muted)}
.pf[data-t=deck] .pf-head-t{font-weight:900;font-size:clamp(2.6em,9vmin,7em);letter-spacing:-.05em;line-height:.85}
.pf[data-t=deck] .pf-head-s{order:3;color:var(--muted);font-size:.95em}
.pf[data-t=deck] :is(.pf-chip,.pf-tab,.pf-pg,.pf-igp,.pf-btn){border-radius:999px;border:1.5px solid var(--fg);background:transparent;color:var(--fg);font-weight:600}
.pf[data-t=deck] :is(.pf-chip[aria-pressed=true],.pf-tab[aria-selected=true],.pf-btn:not(.pf-btn-ghost)){background:var(--fg);color:var(--bg)}
.pf[data-t=deck] .pf-card{border:0;background:var(--surface);transition:transform .45s cubic-bezier(.34,1.56,.64,1)}
@media (hover:hover){.pf[data-t=deck] .pf-card:hover{transform:rotate(-1.2deg) scale(1.02)}}
.pf[data-t=deck] .pf-card-title{font-weight:600}
.pf[data-t=deck] .pf-card-kind{padding:.15em .6em;border-radius:999px;background:var(--bg)}
.pf[data-t=deck] .pf-stats dd{font-family:var(--f-display);font-weight:900;letter-spacing:-.04em}
.pf[data-t=deck] .pf-port-t{font-family:var(--f-display);font-weight:900;text-transform:uppercase;letter-spacing:-.03em}
.pf[data-t=deck] .pf-port-item{border:0;background:var(--surface)}
.pf[data-t=deck] :is(.pf-xp,.pf-edu,.pf-skill){border:0;background:var(--surface)}
.pf[data-t=deck] .pf-modal-box{background:var(--bg)}
/* responsive */
.pf[data-t=deck][data-w=sm] .dk-prog .pf-nav-l,.pf[data-t=deck][data-w=xs] .dk-prog .pf-nav-l{display:none}
.pf[data-t=deck][data-w=xs]{--pad-r:1.2em;--pad-l:1.2em;--pad-t:5em;--pad-b:5em}
.pf[data-t=deck][data-w=xs] .dk-top{padding:1.1em 1.2em;gap:1em}
.pf[data-t=deck][data-w=xs] .dk-foot{left:1.2em;right:1.2em;bottom:1em}
.pf[data-t=deck][data-w=xs] .dk-who{display:none}
.pf[data-t=deck][data-w=xs] .dk-count{margin-left:0;font-size:1.8em}
.pf[data-t=deck][data-w=xs] .dk-arrows{margin-left:auto}
.pf[data-t=deck][data-o=p] .dk-name{font-size:clamp(3.2em,21vw,9em)}
.pf[data-t=deck][data-o=p] .dk-name>span:last-child{padding-left:.4em}
.pf[data-t=deck][data-o=p] .dk-low{flex-direction:column;align-items:flex-start}
.pf[data-t=deck][data-o=p] .dk-strip{bottom:-1.6em}
.pf[data-t=deck][data-h=tiny]{--pad-t:4.2em;--pad-b:3.6em}
.pf[data-t=deck][data-h=tiny] .dk-top{padding:.7em 1.6em}
.pf[data-t=deck][data-h=tiny] .dk-foot{bottom:.5em}
.pf[data-t=deck][data-h=tiny] .dk-count{font-size:1.5em}
.pf[data-t=deck][data-h=tiny] .dk-arrows button{width:2.2em;height:2.2em}
.pf[data-t=deck][data-h=tiny] :is(.dk-status,.dk-strip,.dk-tag){display:none}
.pf[data-t=deck][data-h=tiny] .dk-name{font-size:clamp(3em,22vmin,8em)}
`,
};
