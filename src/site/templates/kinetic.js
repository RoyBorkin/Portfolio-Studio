/*! Portfolio Studio. Copyright (c) 2026 Roy Borkin. All rights reserved. Unauthorized copying, modification or distribution is prohibited without written permission. */
// 22 — Kinetic : a studio landing with a live physics toy. A cluster of glossy "+" jacks is pulled
// toward a point and tumbles against itself; the pointer shoves them, a click bursts them, and every
// section change throws the cluster to a new place. Cards tilt toward the pointer with a moving sheen.
import { maskWords, still } from '../kit.js';

function shade(hex, f) { // f < 0 darker, f > 0 lighter
  const n = parseInt(hex.replace('#', '').slice(0, 6), 16); let r = n >> 16 & 255, g = n >> 8 & 255, b = n & 255;
  const t = f < 0 ? 0 : 255, p = Math.abs(f);
  r = Math.round((t - r) * p + r); g = Math.round((t - g) * p + g); b = Math.round((t - b) * p + b);
  return `rgb(${r},${g},${b})`;
}

export default {
  id: 'kinetic',
  name: 'Kinetic',
  blurb: 'A live physics cluster you can shove and burst, tilt cards with a sheen, a counter preloader.',
  cursor: 'ring',
  magnetic: 0.35,
  transition(from, to, dir, ax, pt, root) {
    const w = root.querySelector('.kn-wipe');
    const E = 'cubic-bezier(.19,1,.22,1)';
    return [
      w.animate([{ transform: `translateY(${dir > 0 ? 100 : -100}%)` }, { transform: 'none', offset: 0.42 }, { transform: 'none', offset: 0.5 }, { transform: `translateY(${dir > 0 ? -100 : 100}%)` }], { duration: 1200, easing: 'cubic-bezier(.76,0,.24,1)' }),
      from.animate([{ opacity: 1, transform: 'none' }, { opacity: 0, transform: `translateY(${-dir * 6}vh)`, offset: 0.45 }, { opacity: 0 }], { duration: 1200, easing: E, fill: 'forwards' }),
      to.animate([{ opacity: 0 }, { opacity: 0, offset: 0.48 }, { opacity: 1, transform: `translateY(${dir * 6}vh)`, offset: 0.49 }, { opacity: 1, transform: 'none' }], { duration: 1300, easing: E, fill: 'both' }),
    ];
  },
  variants: [
    { name: 'Signal blue', swatch: ['#f0f1fa', '#1a2ffb', '#0d0d12'],
      vars: { bg: '#f0f1fa', surface: '#ffffff', fg: '#0d0d12', muted: '#6a6e85', accent: '#1a2ffb', accent2: '#0d0d12', line: 'rgba(13,13,18,.1)', j1: '#1a2ffb', j2: '#ffffff', j3: '#26262b' },
      fonts: { display: 'Outfit:400;500;600', body: 'Outfit:400;500', mono: 'DM Mono:400;500' } },
    { name: 'Ember night', swatch: ['#0e0d0c', '#ff5a1f', '#f3efe8'],
      vars: { bg: '#0e0d0c', surface: '#1a1817', fg: '#f3efe8', muted: '#9a9089', accent: '#ff5a1f', accent2: '#f3efe8', line: 'rgba(243,239,232,.1)', j1: '#ff5a1f', j2: '#e9e2d8', j3: '#3a3633' },
      fonts: { display: 'Outfit:400;500;600', body: 'Outfit:400;500', mono: 'DM Mono:400;500' } },
    { name: 'Mint lab', swatch: ['#eef4ef', '#00a676', '#11201a'],
      vars: { bg: '#eef4ef', surface: '#ffffff', fg: '#11201a', muted: '#5d7268', accent: '#00a676', accent2: '#11201a', line: 'rgba(17,32,26,.1)', j1: '#00a676', j2: '#ffffff', j3: '#1d3b30' },
      fonts: { display: 'Outfit:400;500;600', body: 'Outfit:400;500', mono: 'DM Mono:400;500' } },
  ],
  layout: { works: [15, 15] },
  shell(c) {
    return {
      bg: '<canvas class="kn-cv"></canvas>',
      nav: `<header class="kn-top">
          <button class="kn-brand" data-go="0" data-hover>${c.logo()}<span>${c.esc(c.name)}</span></button>
          <nav class="kn-nav" aria-label="Sections">${c.secs.map((s) => `<a class="pf-nav-a" href="#${s.id}" data-go="${s.i}"><span class="pf-nav-l">${c.esc(s.label)}</span></a>`).join('')}</nav>
          <button class="kn-talk" data-contact data-hover data-cursor=""><span>Let’s talk</span><i>${c.I('email')}</i></button>
          ${c.menuBtn('kn-burger')}
        </header>
        <footer class="kn-foot"><span>${c.esc(c.P.location || '')}</span><span class="kn-cts">${c.contactLinks({ limit: 6 })}</span><span>© ${new Date().getFullYear()}</span></footer>
        <div class="kn-wipe" aria-hidden="true"></div>
        <div class="kn-load" aria-hidden="true"><span class="kn-n">000</span><i></i></div>
        ${c.drawer('kn-drawer')}`,
    };
  },
  home(c) {
    const P = c.P, ws = c.sec('works');
    return `<div class="kn-hero">
      <ul class="kn-tags">${c.roles.map((r) => `<li>${c.esc(r)}</li>`).join('')}</ul>
      <h1 class="kn-name">${maskWords(c.esc, c.name)}</h1>
      <p class="kn-tag">${c.esc(P.tagline || '')}</p>
      <div class="kn-cta">${ws ? `<button class="kn-btn kn-btn-p" data-go="${ws.i}" data-hover data-cursor="">${c.esc(ws.label)}</button>` : ''}${c.data.about?.resume?.url ? `<button class="kn-btn" data-open="resume" data-hover data-cursor="">${c.esc(c.data.about.resume.label || 'Resume')}</button>` : ''}</div>
      ${c.slot?.('bg') === false ? '' : '<p class="kn-hint">Push them around. Click to burst.</p>'}
    </div>`;
  },
  head(c, s) {
    return `<header class="pf-head"><span class="pf-head-n">(${s.n})</span><h2 class="pf-head-t">${maskWords(c.esc, s.title || s.label)}</h2>${s.subtitle ? `<p class="pf-head-s">${c.esc(s.subtitle)}</p>` : ''}</header>`;
  },
  mount(c, root, st) {
    const off = [];
    const cv = root.querySelector('.kn-cv');
    const g = cv.getContext('2d');
    const css = getComputedStyle(root);
    const cols = ['--j1', '--j2', '--j3'].map((k) => css.getPropertyValue(k).trim() || '#888888');
    let W = 0, H = 0, dpr = 1, R0 = 40;
    const bodies = [];
    let tx = 0, ty = 0, scale = 1, tScale = 1;
    const portrait = () => H > W;
    const targetFor = (id) => {
      if (id === 'home') return portrait() ? [W * 0.5, H * 0.66, 1] : [W * 0.68, H * 0.5, 1];
      return portrait() ? [W * 1.02, H * 1.04, 0.42] : [W * 0.99, H * 0.97, 0.5];
    };
    const retarget = (id) => { const t = targetFor(id); tx = t[0]; ty = t[1]; tScale = t[2]; };
    const size = () => {
      dpr = Math.min(2, devicePixelRatio || 1); W = cv.clientWidth; H = cv.clientHeight; cv.width = W * dpr; cv.height = H * dpr;
      R0 = Math.min(W, H) * (portrait() ? 0.085 : 0.07);
      const n = W < 600 ? 11 : 16;
      while (bodies.length < n) { const k = bodies.length; bodies.push({ x: W * 0.5 + (Math.random() - 0.5) * W * 0.6, y: -Math.random() * H * 0.6 - 40, vx: 0, vy: 0, a: Math.random() * 6.28, va: 0, b: Math.random() * 6.28, s: 0.8 + Math.random() * 0.45, col: k % 3 }); }
      bodies.length = n;
      retarget(root.dataset.cur || 'home');
    };
    size(); const ro = new ResizeObserver(() => { size(); if (still(root)) { packed(); draw(); } }); ro.observe(cv); off.push(() => ro.disconnect());
    // pointer
    let px = -999, py = -999, pvx = 0, pvy = 0, lpx = -999, lpy = -999;
    const mv = (e) => { const r = root.getBoundingClientRect(); px = e.clientX - r.left; py = e.clientY - r.top; };
    window.addEventListener('pointermove', mv, { passive: true }); off.push(() => window.removeEventListener('pointermove', mv));
    const burst = (x, y, f = 14) => bodies.forEach((b) => { const dx = b.x - x, dy = b.y - y, d = Math.hypot(dx, dy) || 1; const k = f * Math.min(1, 260 / d); b.vx += dx / d * k; b.vy += dy / d * k; b.va += (Math.random() - 0.5) * 0.3; });
    const click = (e) => { if (root.dataset.cur !== 'home' || e.target.closest('a,button,[data-hover]')) return; const r = root.getBoundingClientRect(); burst(e.clientX - r.left, e.clientY - r.top, 18); };
    root.addEventListener('pointerdown', click); off.push(() => root.removeEventListener('pointerdown', click));
    root._knGo = (id) => { retarget(id); burst(tx, ty, 6); bodies.forEach((b) => { b.vx += (tx - b.x) * 0.02; b.vy += (ty - b.y) * 0.02; }); };
    const drawJack = (b, r) => {
      const base = cols[b.col], hi = shade(base, 0.55), lo = shade(base, -0.45);
      const t = r * 0.42, L = r;
      const cb = Math.cos(b.b), sb = Math.sin(b.b);
      g.save(); g.translate(b.x, b.y); g.rotate(b.a);
      const bar = (len) => { const gr = g.createLinearGradient(0, -t / 2, 0, t / 2); gr.addColorStop(0, hi); gr.addColorStop(0.35, base); gr.addColorStop(1, lo); g.fillStyle = gr; g.beginPath(); g.roundRect(-len, -t / 2, len * 2, t, t / 2); g.fill(); };
      const hub = () => { const gr = g.createRadialGradient(-t * 0.25, -t * 0.3, t * 0.05, 0, 0, t * 0.8); gr.addColorStop(0, hi); gr.addColorStop(0.5, base); gr.addColorStop(1, lo); g.fillStyle = gr; g.beginPath(); g.arc(0, 0, t * 0.78, 0, 6.283); g.fill(); };
      const l2 = L * (0.35 + 0.65 * Math.abs(cb)); // second arm foreshortens as it tumbles
      const back = sb > 0;
      if (back) { g.save(); g.rotate(Math.PI / 2); bar(l2); g.restore(); }
      bar(L); hub();
      if (!back) { g.save(); g.rotate(Math.PI / 2); bar(l2); g.restore(); }
      g.restore();
    };
    const reduce = still(root);
    const step = () => {
      scale += (tScale - scale) * 0.05;
      pvx = lpx < -900 ? 0 : px - lpx; pvy = lpy < -900 ? 0 : py - lpy; lpx = px; lpy = py;
      for (const b of bodies) {
        b.vx += (tx - b.x) * 0.0016; b.vy += (ty - b.y) * 0.0016;
        b.vx *= 0.94; b.vy *= 0.94; b.x += b.vx; b.y += b.vy;
        b.va += (b.vx * 0.0006); b.va *= 0.96; b.a += b.va + 0.002; b.b += 0.01 + Math.hypot(b.vx, b.vy) * 0.006;
        const r = R0 * b.s * scale * 0.95, dx = b.x - px, dy = b.y - py, d = Math.hypot(dx, dy), PR = 46;
        if (d < PR + r && d > 0) { const o = PR + r - d; b.x += dx / d * o * 0.5; b.y += dy / d * o * 0.5; b.vx += dx / d * o * 0.12 + pvx * 0.12; b.vy += dy / d * o * 0.12 + pvy * 0.12; b.va += (dx * pvy - dy * pvx) * 0.00002; }
      }
      for (let i = 0; i < bodies.length; i++) for (let j = i + 1; j < bodies.length; j++) {
        const a = bodies[i], b = bodies[j], dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy) || 0.01, m = (a.s + b.s) * R0 * scale * 0.82;
        if (d < m) { const o = (m - d) / 2, nx = dx / d, ny = dy / d; a.x -= nx * o; a.y -= ny * o; b.x += nx * o; b.y += ny * o; const rv = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny; if (rv < 0) { const k = rv * 0.6; a.vx += nx * k; a.vy += ny * k; b.vx -= nx * k; b.vy -= ny * k; a.va -= k * 0.004; b.va += k * 0.004; } }
      }
    };
    function draw() {
      g.setTransform(dpr, 0, 0, dpr, 0, 0); g.clearRect(0, 0, W, H);
      [...bodies].sort((p, q) => p.s - q.s).forEach((b) => drawJack(b, R0 * b.s * scale));
    }
    function packed() { bodies.forEach((b, k) => { const ang = k * 2.4, rr = Math.sqrt(k) * R0 * 0.85 * tScale; b.x = tx + Math.cos(ang) * rr; b.y = ty + Math.sin(ang) * rr; }); scale = tScale; }
    if (reduce) { packed(); draw(); }
    else off.push(c.loop(() => { step(); draw(); }));
    // card tilt + sheen
    const tilt = (e) => {
      const card = e.target.closest?.('.pf-sec.is-on .pf-card, .pf-sec.is-on .pf-port-item'); if (!card) return;
      const r = card.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      card.style.setProperty('--rx', ((0.5 - y) * 8).toFixed(2) + 'deg'); card.style.setProperty('--ry', ((x - 0.5) * 10).toFixed(2) + 'deg');
      card.style.setProperty('--sx', (x * 100).toFixed(1) + '%'); card.style.setProperty('--sy', (y * 100).toFixed(1) + '%');
    };
    const untilt = (e) => { const card = e.target.closest?.('.pf-card, .pf-port-item'); if (card && !card.contains(e.relatedTarget)) { card.style.removeProperty('--rx'); card.style.removeProperty('--ry'); } };
    if (!reduce && c.slot?.('sections') !== false && matchMedia('(pointer:fine)').matches) { root.addEventListener('pointermove', tilt, { passive: true }); root.addEventListener('pointerout', untilt); off.push(() => { root.removeEventListener('pointermove', tilt); root.removeEventListener('pointerout', untilt); }); }
    // first visit: counter from 000, then the panel drops away and the jacks fall in
    const ld = root.querySelector('.kn-load');
    if (!window.__knIntro && !reduce && !st?.opts?.edit && !st?.opts?.section) {
      window.__knIntro = 1; ld.classList.add('is-on');
      const n = ld.querySelector('.kn-n'), bar = ld.querySelector('i'); const t0 = performance.now();
      const tick = (now) => { const p = Math.min(1, (now - t0) / 1300), e = 1 - Math.pow(1 - p, 3); n.textContent = String(Math.round(e * 100)).padStart(3, '0'); bar.style.transform = `scaleX(${e})`; if (p < 1) r2 = requestAnimationFrame(tick); else ld.animate([{ transform: 'none' }, { transform: 'translateY(-100%)' }], { duration: 900, delay: 120, easing: 'cubic-bezier(.76,0,.24,1)', fill: 'forwards' }).finished.then(() => ld.classList.remove('is-on')).catch(() => {}); };
      let r2 = requestAnimationFrame(tick); off.push(() => cancelAnimationFrame(r2));
    } else packed();
    return () => off.forEach((f) => f());
  },
  onLeave(c, from, to, root) { root._knGo?.(c.secs[to].id); },
  css: () => `
.pf[data-t=kinetic]{--pad-t:6.6em;--pad-r:2.6em;--pad-l:2.6em;--pad-b:4.6em;--radius:20px;--grain-o:0;--cursor:var(--accent);font-weight:400}
.pf[data-t=kinetic] .pf-cursor{--cl:#fff}
.kn-cv{position:absolute;inset:0;width:100%;height:100%}
/* chrome */
.kn-top{position:absolute;z-index:30;inset:0 0 auto;display:flex;align-items:center;gap:1.5em;padding:1.5em 2.6em}
.kn-brand{display:flex;align-items:center;gap:.65em;font-weight:600;letter-spacing:-.01em}
.kn-brand .pf-logo{height:1.8em}
.pf[data-v="0"] .kn-brand .pf-logo,.pf[data-v="2"] .kn-brand .pf-logo{filter:brightness(0)}
.pf[data-v="1"] .kn-brand .pf-logo{filter:brightness(0) invert(1)}
.kn-nav{margin:0 auto;display:flex;gap:.2em;padding:.3em;border-radius:999px;background:color-mix(in srgb,var(--surface) 75%,transparent);-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px)}
.kn-nav .pf-nav-a{padding:.55em 1.05em;border-radius:999px;font-family:var(--f-mono);font-size:.74em;text-transform:uppercase;letter-spacing:.04em;transition:background-color .3s,color .3s}
.kn-nav .pf-nav-a.is-cur{background:var(--fg);color:var(--bg)}
@media (hover:hover){.kn-nav .pf-nav-a:not(.is-cur):hover{background:var(--line)}}
.kn-talk{display:flex;align-items:center;gap:.7em;height:2.8em;padding:0 .35em 0 1.2em;border-radius:999px;background:var(--accent);color:#fff;font-weight:500;font-size:.9em}
.kn-talk i{display:grid;place-items:center;width:2.15em;height:2.15em;border-radius:50%;background:#fff;color:var(--accent);transition:rotate .5s cubic-bezier(.34,1.56,.64,1)}
@media (hover:hover){.kn-talk:hover i{rotate:-12deg}}
.kn-burger{display:none}
.kn-foot{position:absolute;z-index:20;left:2.6em;right:2.6em;bottom:1.2em;display:flex;align-items:center;gap:1.5em;font-family:var(--f-mono);font-size:.72em;text-transform:uppercase;letter-spacing:.04em;color:var(--muted)}
.kn-cts{margin:0 auto;display:flex;gap:.2em}
.kn-cts .pf-ct{width:2.6em;height:2.6em;display:grid;place-items:center;border-radius:50%;color:var(--fg);transition:background-color .25s}
@media (hover:hover){.kn-cts .pf-ct:hover{background:var(--line)}}
.kn-wipe{position:absolute;z-index:80;inset:0;background:var(--accent);transform:translateY(100%);pointer-events:none}
.kn-load{position:absolute;z-index:90;inset:0;background:var(--bg);display:none;align-items:flex-end;justify-content:space-between;padding:2.6em}
.kn-load.is-on{display:flex}
.kn-n{font-family:var(--f-mono);font-size:clamp(3em,10vw,9em);line-height:.8;letter-spacing:-.04em;color:var(--fg);font-variant-numeric:tabular-nums}
.kn-load i{position:absolute;left:0;right:0;top:0;height:3px;background:var(--accent);transform:scaleX(0);transform-origin:left}
/* hero */
.kn-hero{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:center;gap:1.3em;max-width:min(52%,40em);pointer-events:none}
.kn-hero :is(button,a){pointer-events:auto}
.kn-tags{display:flex;flex-wrap:wrap;gap:.4em}
.kn-tags li{padding:.4em .8em;border-radius:999px;border:1px solid var(--line);background:color-mix(in srgb,var(--bg) 70%,transparent);font-family:var(--f-mono);font-size:.7em;text-transform:uppercase;letter-spacing:.04em}
.kn-name{font-family:var(--f-display);font-weight:500;font-size:clamp(3.4em,13vmin,10em);line-height:.92;letter-spacing:-.05em}
.kn-tag{max-width:30ch;font-size:clamp(1.05em,2.4vmin,1.4em);line-height:1.35;color:var(--fg)}
.kn-cta{display:flex;gap:.5em}
.kn-btn{height:3.1em;padding:0 1.5em;border-radius:999px;border:1px solid var(--fg);font-weight:500;background:color-mix(in srgb,var(--bg) 60%,transparent);transition:background-color .25s,color .25s,border-color .25s}
.kn-btn-p{background:var(--fg);color:var(--bg)}
@media (hover:hover){.kn-btn:hover{background:var(--accent);border-color:var(--accent);color:#fff}}
.kn-btn:active{scale:.97}
.kn-hint{font-family:var(--f-mono);font-size:.7em;text-transform:uppercase;letter-spacing:.05em;color:var(--muted)}
.kn-tags,.kn-tag,.kn-cta,.kn-hint{opacity:0;translate:0 .8em;transition:opacity .8s .5s,translate 1s cubic-bezier(.19,1,.22,1) .5s}
.pf-sec-home.is-on :is(.kn-tags,.kn-tag,.kn-cta,.kn-hint),.pf[data-static] :is(.kn-tags,.kn-tag,.kn-cta,.kn-hint){opacity:1;translate:none}
/* sections */
.pf[data-t=kinetic] .pf-head-n{font-family:var(--f-mono);color:var(--accent)}
.pf[data-t=kinetic] .pf-head-t{font-weight:500;font-size:clamp(2.4em,7.6vmin,6em);letter-spacing:-.05em;line-height:.95}
.pf[data-t=kinetic] .pf-head-s{color:var(--muted)}
.pf[data-t=kinetic] :is(.pf-chip,.pf-tab,.pf-pg,.pf-igp,.pf-btn){border-radius:999px;border:1px solid var(--line);background:var(--surface);color:var(--fg)}
.pf[data-t=kinetic] :is(.pf-chip,.pf-tab){font-family:var(--f-mono);font-size:.72em;text-transform:uppercase;letter-spacing:.04em;padding:.7em 1.1em}
.pf[data-t=kinetic] :is(.pf-chip[aria-pressed=true],.pf-tab[aria-selected=true],.pf-btn:not(.pf-btn-ghost)){background:var(--fg);color:var(--bg);border-color:var(--fg)}
.pf[data-t=kinetic] :is(.pf-card,.pf-port-item){border:0;background:var(--surface);box-shadow:0 1px 0 var(--line),0 20px 40px -24px rgba(13,13,30,.25);transform:perspective(900px) rotateX(var(--rx,0deg)) rotateY(var(--ry,0deg));transition:transform .5s cubic-bezier(.19,1,.22,1),box-shadow .3s}
.pf[data-t=kinetic] :is(.pf-card,.pf-port-item)::after{content:"";position:absolute;inset:0;border-radius:inherit;pointer-events:none;background:radial-gradient(circle at var(--sx,50%) var(--sy,0%),rgba(255,255,255,.35),transparent 45%);opacity:0;transition:opacity .3s}
@media (hover:hover){.pf[data-t=kinetic] :is(.pf-card,.pf-port-item):hover::after{opacity:1}}
.pf[data-t=kinetic] .pf-card-media{margin:.45em .45em 0;border-radius:calc(var(--radius) - .45em)}
.pf[data-t=kinetic] .pf-card-meta{font-family:var(--f-mono);font-size:.64em;text-transform:uppercase;letter-spacing:.04em}
.pf[data-t=kinetic] .pf-card-title{font-weight:500}
.pf[data-t=kinetic] :is(.pf-xp,.pf-edu,.pf-skill){border:0;background:var(--surface)}
.pf[data-t=kinetic] .pf-stats dd{font-weight:500;letter-spacing:-.05em}
.pf[data-t=kinetic] .pf-port-t{font-weight:500;letter-spacing:-.03em}
.pf[data-t=kinetic] .pf-modal-box{background:var(--surface)}
/* responsive */
.pf[data-t=kinetic][data-w=sm] .kn-nav,.pf[data-t=kinetic][data-w=xs] .kn-nav{display:none}
.pf[data-t=kinetic][data-w=sm] .kn-talk{margin-left:auto}
.pf[data-t=kinetic][data-w=sm] .kn-burger,.pf[data-t=kinetic][data-w=xs] .kn-burger{display:block}
.pf[data-t=kinetic][data-w=xs] .kn-talk span{display:none}
.pf[data-t=kinetic][data-w=xs] .kn-talk{margin-left:auto;padding:0 .35em}
.pf[data-t=kinetic][data-w=xs]{--pad-r:1.2em;--pad-l:1.2em;--pad-t:5.4em;--pad-b:4.4em}
.pf[data-t=kinetic][data-w=xs] .kn-top{padding:1.1em 1.2em}
.pf[data-t=kinetic][data-w=xs] .kn-foot{left:1.2em;right:1.2em}
.pf[data-t=kinetic][data-w=xs] .kn-foot>span:not(.kn-cts){display:none}
.pf[data-t=kinetic][data-o=p] .kn-hero{max-width:none;justify-content:flex-start;padding-top:1em}
.pf[data-t=kinetic][data-o=p] .kn-name{font-size:clamp(3em,18vw,7em)}
.pf[data-t=kinetic][data-o=p] .kn-hint{display:none}
.pf[data-t=kinetic][data-h=tiny]{--pad-t:4.2em;--pad-b:3em}
.pf[data-t=kinetic][data-h=tiny] .kn-top{padding:.6em 1.6em}
.pf[data-t=kinetic][data-h=tiny] .kn-foot{bottom:.4em}
.pf[data-t=kinetic][data-h=tiny] :is(.kn-tags,.kn-hint){display:none}
.pf[data-t=kinetic][data-h=tiny] .kn-hero{gap:.7em}
`,
};
