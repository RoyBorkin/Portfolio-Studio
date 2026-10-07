/*! Portfolio Studio. Copyright (c) 2026 Roy Borkin. All rights reserved. Unauthorized copying, modification or distribution is prohibited without written permission. */
// 15 — Gravity (free design) : a maker's desk. The letters of your name are keycaps that drop into
// the screen under real physics: grab them, throw them, push them with the cursor, and on a phone
// tilt the device to pour them around. Contact keys sit in the pile too and still work as links.
const R = (a, b) => a + Math.random() * (b - a);
export default {
  id: 'gravity',
  name: 'Gravity',
  blurb: 'Your name as physical keycaps: grab, throw, and tilt your phone to move them.',
  transition(from, to, dir) {
    return [
      from.animate([{ transform: 'none', opacity: 1 }, { transform: `translateY(${-dir * 6}%) rotate(${-dir * 1.5}deg)`, opacity: 0 }], { duration: 420, easing: 'cubic-bezier(.5,0,.75,0)', fill: 'forwards' }),
      to.animate([{ transform: `translateY(${dir * -40}%)`, opacity: 0 }, { transform: 'translateY(2.5%)', opacity: 1, offset: 0.62 }, { transform: 'translateY(-.8%)', offset: 0.82 }, { transform: 'none', opacity: 1 }], { duration: 900, delay: 220, easing: 'cubic-bezier(.3,0,.4,1)', fill: 'both' }),
    ];
  },
  variants: [
    { name: 'Workbench', swatch: ['#d9d7d2', '#efece6', '#ff6a2b'],
      vars: { bg: '#d8d6d0', surface: '#efece6', fg: '#1f1e1c', muted: '#6e6b65', accent: '#ff6a2b', accent2: '#cc9932', line: 'rgba(31,30,28,.14)', cap: '#f1eee8', capSide: '#bdb8ae', capFg: '#2a2825', capA: '#ff6a2b', capAFg: '#fff', capB: '#3a3d44', capBFg: '#f1eee8' },
      fonts: { display: 'Space Grotesk:500;700', body: 'Space Grotesk:400;500', mono: 'JetBrains Mono:400;500' } },
    { name: 'Arcade', swatch: ['#1b2140', '#ffcf3f', '#ff4f7b'],
      vars: { bg: '#1a2040', surface: '#252c55', fg: '#f6f3ff', muted: '#a3a8cf', accent: '#ffcf3f', accent2: '#4fd1ff', line: 'rgba(246,243,255,.14)', cap: '#ff4f7b', capSide: '#b92f55', capFg: '#fff', capA: '#ffcf3f', capAFg: '#2a2000', capB: '#4fd1ff', capBFg: '#06263a' },
      fonts: { display: 'Rubik:500;800', body: 'Rubik:400;500', mono: 'JetBrains Mono:400;500' } },
    { name: 'Mono', swatch: ['#f4f4f2', '#111111', '#e6e6e3'],
      vars: { bg: '#f3f3f1', surface: '#ffffff', fg: '#111111', muted: '#6d6d6a', accent: '#111111', accent2: '#8a8a86', line: 'rgba(17,17,17,.12)', cap: '#141414', capSide: '#000000', capFg: '#f3f3f1', capA: '#ffffff', capAFg: '#111', capB: '#dcdcd8', capBFg: '#111' },
      fonts: { display: 'IBM Plex Sans:500;700', body: 'IBM Plex Sans:400;500', mono: 'IBM Plex Mono:400;500' } },
  ],
  layout: { works: [15, 15] },
  shell(c) {
    return {
      bg: `<div class="gv-mat"></div>`,
      nav: `<header class="gv-top"><button class="gv-brand" data-go="0" data-hover>${c.logo()}<span>${c.esc(c.name)}</span></button><nav class="gv-nav" aria-label="Sections">${c.secs.map((s) => `<a class="pf-nav-a" href="#${s.id}" data-go="${s.i}"><kbd>${s.i + 1}</kbd><span class="pf-nav-l">${c.esc(s.label)}</span></a>`).join('')}</nav>${c.menuBtn()}</header>
        <p class="gv-help" aria-hidden="true">Press <kbd>1</kbd>–<kbd>${c.secs.length}</kbd> or <kbd>↑</kbd><kbd>↓</kbd> to move around</p>
        ${c.drawer()}`,
    };
  },
  home(c) {
    const P = c.P, ws = c.sec('works');
    const letters = [...(c.first + ' ' + c.last)].filter((ch) => ch.trim());
    const cts = c.contacts.slice(0, 5);
    const caps = [
      ...letters.map((ch, i) => `<span class="gv-cap" data-k="${i}" style="--w:1">${c.esc(ch.toUpperCase())}</span>`),
      `<span class="gv-cap gv-a" style="--w:1.6"><small>${c.esc((c.roles[0] || '').split(' ')[0])}</small></span>`,
      `<span class="gv-cap gv-b" style="--w:1.3"><img src="${c.esc(c.img(P.logo))}" alt="" draggable="false"></span>`,
      ...cts.map((ct) => `<a class="gv-cap gv-ct" href="${c.esc(c.contactHref(ct))}" ${/^https?:/.test(c.contactHref(ct)) ? 'target="_blank" rel="noopener"' : ''} style="--w:.8" aria-label="${c.esc(ct.label || ct.type)}" draggable="false">${c.contactIcon(ct)}</a>`),
    ].join('');
    return `<div class="gv-hero">
      <div class="gv-txt">
        <p class="gv-hi">${c.esc(P.intro || '')}</p>
        <h1 class="gv-name">${c.esc(c.name)}</h1>
        <p class="gv-roles">${c.roles.map((r) => c.esc(r)).join(' / ')}</p>
        <p class="gv-pitch">${c.esc(P.tagline || '')}</p>
        <div class="gv-cta">${ws ? `<button class="gv-key" data-go="${ws.i}" data-hover><span>${c.esc(ws.label)}</span><kbd>↵</kbd></button>` : ''}${c.data.about?.resume?.url ? `<button class="gv-key gv-key-2" data-open="resume" data-hover><span>${c.esc(c.data.about.resume.label || 'Resume')}</span></button>` : ''}</div>
        <p class="gv-tip"><i></i>Grab a key and throw it</p>
      </div>
      <div class="gv-world" data-drag aria-hidden="true">${caps}</div>
    </div>`;
  },
  mount(c, root) {
    const world = root.querySelector('.gv-world'); if (!world) return;
    const els = [...world.querySelectorAll('.gv-cap')];
    const still = root.dataset.static || root.dataset.motion === 'off' || matchMedia('(prefers-reduced-motion: reduce)').matches;
    let W = 0, H = 0, unit = 60;
    const bodies = els.map((el) => ({ el, w: parseFloat(el.style.getPropertyValue('--w')) || 1, x: 0, y: 0, vx: 0, vy: 0, a: 0, va: 0, r: 0 }));
    const layout = (scatter) => {
      W = world.clientWidth; H = world.clientHeight;
      unit = Math.max(40, Math.min(120, Math.sqrt((W * H) / (bodies.reduce((s, b) => s + b.w * b.w, 0) * 2.1))));
      world.style.setProperty('--u', unit + 'px');
      bodies.forEach((b, i) => {
        b.r = (unit * b.w) / 2 * 0.98;
        if (scatter) { b.x = R(b.r, W - b.r); b.y = -R(b.r, H * 1.2) - i * 18; b.vx = R(-2, 2); b.vy = 0; b.a = R(-0.6, 0.6); b.va = R(-0.05, 0.05); }
      });
    };
    const settle = () => { // static pose: packed rows at the bottom
      let x = 0, y = H; const row = [];
      bodies.forEach((b) => { const d = b.r * 2; if (x + d > W) { x = 0; y -= unit * 1.05; } b.x = x + b.r; b.y = y - b.r; b.a = R(-0.15, 0.15); x += d * 1.02; row.push(b); });
    };
    layout(true);
    if (still) { settle(); draw(); }
    const ro = new ResizeObserver(() => { const ow = W, oh = H; layout(false); bodies.forEach((b) => { b.x *= W / (ow || W); b.y *= H / (oh || H); }); if (still) { settle(); draw(); } });
    ro.observe(world);
    function draw() { for (const b of bodies) b.el.style.transform = `translate(${(b.x - b.r).toFixed(1)}px,${(b.y - b.r).toFixed(1)}px) rotate(${b.a.toFixed(3)}rad)`; }
    if (still) return () => ro.disconnect();
    // gravity: down by default, tilt on phones
    let gx = 0, gy = 1;
    const orient = (e) => { if (e.gamma == null) return; gx = Math.max(-1, Math.min(1, e.gamma / 45)); gy = Math.max(-1, Math.min(1, (e.beta - 20) / 45)); if (Math.abs(gy) < 0.15 && Math.abs(gx) < 0.15) gy = 0.4; };
    window.addEventListener('deviceorientation', orient);
    // pointer: drag and push
    let grab = null, px = -1e4, py = -1e4, pvx = 0, pvy = 0, lt = 0;
    const local = (e) => { const r = world.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
    const down = (e) => {
      const cap = e.target.closest?.('.gv-cap'); if (!cap || !world.contains(cap)) return;
      const b = bodies.find((x) => x.el === cap); const [x, y] = local(e);
      grab = { b, ox: b.x - x, oy: b.y - y, sx: e.clientX, sy: e.clientY, moved: false, link: cap.tagName === 'A' };
      cap.setPointerCapture?.(e.pointerId); cap.classList.add('is-grab'); e.preventDefault();
    };
    const move = (e) => {
      const [x, y] = local(e); const now = performance.now(); const dt = Math.max(8, now - lt);
      pvx = (x - px) / dt * 16; pvy = (y - py) / dt * 16; px = x; py = y; lt = now;
      if (grab) { if (Math.abs(e.clientX - grab.sx) + Math.abs(e.clientY - grab.sy) > 6) grab.moved = true; }
    };
    const up = (e) => {
      if (!grab) return; const g = grab; grab = null; g.b.el.classList.remove('is-grab');
      if (g.moved) { g.b.vx = Math.max(-40, Math.min(40, pvx)); g.b.vy = Math.max(-40, Math.min(40, pvy)); }
      else if (g.link) { g.b.el.click(); }
      else { g.b.vy = -14; g.b.va = R(-0.3, 0.3); }
    };
    world.addEventListener('pointerdown', down); window.addEventListener('pointermove', move, { passive: true }); window.addEventListener('pointerup', up);
    world.addEventListener('click', (e) => { const a = e.target.closest?.('.gv-ct'); if (a && e.isTrusted) e.preventDefault(); });
    const leave = () => { px = py = -1e4; }; world.addEventListener('pointerleave', leave);
    let woke = false;
    const stop = c.loop(() => {
      if (root.dataset.cur !== 'home') { woke = false; return; }
      if (!woke) { woke = true; layout(true); }
      const G = 0.55, SUB = 3;
      for (let s = 0; s < SUB; s++) {
        for (const b of bodies) {
          if (grab && grab.b === b) { const tx = px + grab.ox, ty = py + grab.oy; b.vx = (tx - b.x) * 0.35; b.vy = (ty - b.y) * 0.35; b.va *= 0.8; }
          else { b.vx += (gx * G) / SUB; b.vy += (gy * G) / SUB; }
          // cursor push
          const dx = b.x - px, dy = b.y - py, d2 = dx * dx + dy * dy, rr = (b.r + unit * 0.5) ** 2;
          if (!grab && d2 < rr && d2 > 1) { const d = Math.sqrt(d2), f = (1 - d / Math.sqrt(rr)) * 1.2 / SUB; b.vx += (dx / d) * f + pvx * 0.02; b.vy += (dy / d) * f + pvy * 0.02; }
          b.x += b.vx / SUB; b.y += b.vy / SUB; b.a += b.va / SUB;
          // walls with friction → spin
          if (b.y > H - b.r) { b.y = H - b.r; if (b.vy > 0) b.vy *= -0.35; b.va += (b.vx / b.r - b.va) * 0.3; b.vx *= 0.92; }
          if (b.y < b.r - H * 1.5) { b.y = b.r - H * 1.5; b.vy = Math.abs(b.vy) * 0.3; }
          if (b.x < b.r) { b.x = b.r; if (b.vx < 0) b.vx *= -0.4; b.va += (-b.vy / b.r - b.va) * 0.2; }
          if (b.x > W - b.r) { b.x = W - b.r; if (b.vx > 0) b.vx *= -0.4; b.va += (b.vy / b.r - b.va) * 0.2; }
        }
        // pairwise collisions
        for (let i = 0; i < bodies.length; i++) for (let j = i + 1; j < bodies.length; j++) {
          const A = bodies[i], B = bodies[j]; const dx = B.x - A.x, dy = B.y - A.y, min = A.r + B.r, d2 = dx * dx + dy * dy;
          if (d2 >= min * min || d2 === 0) continue;
          const d = Math.sqrt(d2), nx = dx / d, ny = dy / d, pen = (min - d) * 0.5;
          const ma = A.w * A.w, mb = B.w * B.w, ta = mb / (ma + mb), tb = ma / (ma + mb);
          A.x -= nx * pen * ta * 2; A.y -= ny * pen * ta * 2; B.x += nx * pen * tb * 2; B.y += ny * pen * tb * 2;
          const rv = (B.vx - A.vx) * nx + (B.vy - A.vy) * ny;
          if (rv < 0) { const imp = -(1.25) * rv; A.vx -= nx * imp * ta; A.vy -= ny * imp * ta; B.vx += nx * imp * tb; B.vy += ny * imp * tb; }
          const tvx = (B.vx - A.vx) - rv * nx, tvy = (B.vy - A.vy) - rv * ny, tang = tvx * -ny + tvy * nx;
          A.va += tang * 0.004; B.va -= tang * 0.004;
        }
      }
      for (const b of bodies) { b.va *= 0.97; b.vx *= 0.995; if (Math.abs(b.va) < 0.0005 && b.y > H - b.r - 2) b.a += (Math.round(b.a / (Math.PI / 2)) * (Math.PI / 2) - b.a) * 0.02; }
      pvx *= 0.8; pvy *= 0.8;
      draw();
    });
    return () => { stop(); ro.disconnect(); window.removeEventListener('deviceorientation', orient); world.removeEventListener('pointerdown', down); window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); };
  },
  css: () => `
.pf[data-t=gravity]{--pad-t:5.4em;--pad-r:2.4em;--pad-l:3.4em;--pad-b:2.4em;--radius:16px;--grain-o:.05}
.gv-mat{position:absolute;inset:0;background-image:radial-gradient(color-mix(in srgb,var(--fg) 14%,transparent) 1px,transparent 1.2px);background-size:24px 24px;mask-image:linear-gradient(transparent,#000 30%)}
.pf[data-v="0"] .gv-mat{background-color:#d3d1cb}
.gv-top{position:absolute;z-index:20;inset:0 0 auto;display:flex;align-items:center;justify-content:space-between;padding:1.1em 2em 1.1em 3.4em}
.gv-brand{display:flex;align-items:center;gap:.7em;font-family:var(--f-display);font-weight:700;font-size:.95em}
.gv-brand .pf-logo{height:2em}
.pf[data-v="0"] .gv-brand .pf-logo,.pf[data-v="2"] .gv-brand .pf-logo{filter:brightness(0)}
.pf[data-v="1"] .gv-brand .pf-logo{filter:brightness(0) invert(1)}
.gv-nav{display:flex;gap:1.2em;font-size:.86em}
.gv-nav .pf-nav-a{display:flex;align-items:center;gap:.5em;color:var(--muted);transition:color .2s}
.gv-nav .pf-nav-a:hover,.gv-nav .pf-nav-a.is-cur{color:var(--fg)}
.pf[data-t=gravity] kbd{display:inline-grid;place-items:center;min-width:1.7em;height:1.7em;padding:0 .35em;border-radius:.4em;font-family:var(--f-mono);font-size:.78em;background:var(--cap);color:var(--capFg);box-shadow:0 2px 0 var(--capSide),0 3px 6px -2px rgba(0,0,0,.25);transition:transform .12s,box-shadow .12s}
.gv-nav .pf-nav-a.is-cur kbd{background:var(--capA);color:var(--capAFg);transform:translateY(2px);box-shadow:0 0 0 var(--capSide)}
.gv-help{position:absolute;z-index:20;left:3.4em;bottom:1.1em;font-size:.74em;color:var(--muted);display:flex;align-items:center;gap:.35em;transition:opacity .4s}
.pf:not([data-cur=home]) .gv-help{opacity:0}
/* hero */
.gv-hero{position:absolute;inset:0;display:grid;grid-template-columns:minmax(0,.9fr) minmax(0,1.3fr);gap:2em}
.gv-txt{display:flex;flex-direction:column;justify-content:center;gap:1em;align-items:flex-start;z-index:2;padding-bottom:2em}
.gv-hi{font-family:var(--f-mono);font-size:.8em;color:var(--muted)}
.gv-name{font-family:var(--f-display);font-weight:700;font-size:clamp(2.4em,7vmin,5.6em);line-height:.95;letter-spacing:-.04em}
.pf[data-v="1"] .gv-name{font-weight:800;letter-spacing:-.03em}
.gv-roles{font-family:var(--f-mono);font-size:.82em;color:var(--accent2)}
.pf[data-v="0"] .gv-roles{color:#9a6f1c}
.pf[data-v="2"] .gv-roles{color:var(--muted)}
.gv-pitch{max-width:38ch;line-height:1.55;color:var(--muted)}
.gv-cta{display:flex;flex-wrap:wrap;gap:.7em;margin-top:.4em}
.gv-key{display:inline-flex;align-items:center;gap:.9em;padding:.85em 1.2em;border-radius:.8em;font-weight:600;font-size:.9em;background:var(--capA);color:var(--capAFg);box-shadow:0 5px 0 color-mix(in srgb,var(--capA) 55%,#000),0 8px 16px -6px rgba(0,0,0,.3);transition:transform .1s,box-shadow .1s}
.gv-key:hover{transform:translateY(1px);box-shadow:0 4px 0 color-mix(in srgb,var(--capA) 55%,#000),0 6px 12px -6px rgba(0,0,0,.3)}
.gv-key:active{transform:translateY(5px);box-shadow:0 0 0 color-mix(in srgb,var(--capA) 55%,#000)}
.gv-key kbd{background:rgba(255,255,255,.25)!important;color:inherit!important;box-shadow:none!important}
.gv-key-2{background:var(--cap);color:var(--capFg);box-shadow:0 5px 0 var(--capSide),0 8px 16px -6px rgba(0,0,0,.3)}
.gv-key-2:hover{box-shadow:0 4px 0 var(--capSide),0 6px 12px -6px rgba(0,0,0,.3)}
.gv-key-2:active{box-shadow:0 0 0 var(--capSide)}
.gv-tip{display:flex;align-items:center;gap:.6em;font-size:.76em;color:var(--muted);margin-top:.6em}
.gv-tip i{width:1.6em;height:1px;background:currentColor}
.gv-world{position:relative;margin:calc(var(--pad-t) * -1) calc(var(--pad-r) * -1) calc(var(--pad-b) * -1) 0;overflow:hidden;touch-action:none;--u:64px}
.gv-cap{position:absolute;left:0;top:0;width:calc(var(--u) * var(--w));height:calc(var(--u) * var(--w));display:grid;place-items:center;border-radius:22%;background:linear-gradient(180deg,color-mix(in srgb,var(--cap) 86%,#fff) 0%,var(--cap) 60%);color:var(--capFg);font-family:var(--f-display);font-weight:700;font-size:calc(var(--u) * var(--w) * .46);line-height:1;box-shadow:inset 0 -.09em 0 var(--capSide),inset 0 0 0 .02em color-mix(in srgb,var(--capSide) 60%,transparent),0 .06em .1em rgba(0,0,0,.18),0 .25em .5em -.1em rgba(0,0,0,.28);cursor:grab;user-select:none;will-change:transform;-webkit-user-drag:none}
.gv-cap::after{content:"";position:absolute;inset:12% 12% 22%;border-radius:18%;background:linear-gradient(180deg,rgba(255,255,255,.35),transparent 60%);pointer-events:none;opacity:.6}
.gv-cap.is-grab{cursor:grabbing;filter:brightness(1.05);z-index:5}
.gv-a{background:linear-gradient(180deg,color-mix(in srgb,var(--capA) 86%,#fff),var(--capA) 60%);color:var(--capAFg);box-shadow:inset 0 -.09em 0 color-mix(in srgb,var(--capA) 55%,#000),0 .25em .5em -.1em rgba(0,0,0,.28)}
.gv-a small{font-family:var(--f-mono);font-size:.22em;font-weight:500;letter-spacing:.02em;max-width:80%;text-align:center;line-height:1.1}
.gv-b{background:linear-gradient(180deg,color-mix(in srgb,var(--capB) 86%,#fff),var(--capB) 60%);box-shadow:inset 0 -.09em 0 color-mix(in srgb,var(--capB) 55%,#000),0 .25em .5em -.1em rgba(0,0,0,.28)}
.gv-b img{width:52%;height:52%;object-fit:contain;pointer-events:none}
.pf[data-v="2"] .gv-b img{filter:brightness(0)}
.gv-ct{background:linear-gradient(180deg,color-mix(in srgb,var(--capB) 86%,#fff),var(--capB) 60%);color:var(--capBFg);box-shadow:inset 0 -.09em 0 color-mix(in srgb,var(--capB) 55%,#000),0 .25em .5em -.1em rgba(0,0,0,.28)}
.gv-ct svg{width:44%;height:44%}
.gv-txt>*{opacity:0;transform:translateY(.8em);transition:opacity .7s,transform .9s var(--out)}
.gv-txt>:nth-child(2){transition-delay:.06s}.gv-txt>:nth-child(3){transition-delay:.12s}.gv-txt>:nth-child(4){transition-delay:.18s}.gv-txt>:nth-child(5){transition-delay:.24s}.gv-txt>:nth-child(6){transition-delay:1.6s}
.pf-sec-home.is-on .gv-txt>*,.pf[data-static] .gv-txt>*{opacity:1;transform:none}
/* sections: keycap cards */
.pf[data-t=gravity] .pf-head-n{display:none}
.pf[data-t=gravity] .pf-head-t{font-weight:700;letter-spacing:-.04em;font-size:clamp(2em,5.6vmin,4.2em)}
.pf[data-t=gravity] .pf-card,.pf[data-t=gravity] .pf-port-item,.pf[data-t=gravity] .pf-xp,.pf[data-t=gravity] .pf-edu,.pf[data-t=gravity] .pf-skill{background:var(--surface);border:0;border-radius:var(--radius);box-shadow:0 6px 0 color-mix(in srgb,var(--surface) 70%,#000),0 12px 24px -10px rgba(0,0,0,.3);transition:transform .15s,box-shadow .15s}
.pf[data-t=gravity] .pf-card:hover,.pf[data-t=gravity] .pf-port-item:hover{transform:translateY(3px);box-shadow:0 3px 0 color-mix(in srgb,var(--surface) 70%,#000),0 6px 14px -8px rgba(0,0,0,.3)}
.pf[data-t=gravity] .pf-card:active{transform:translateY(6px);box-shadow:0 0 0 color-mix(in srgb,var(--surface) 70%,#000)}
.pf[data-t=gravity] .pf-card-media{margin:.45em .45em 0;border-radius:calc(var(--radius) - .45em)}
.pf[data-t=gravity] .pf-chip,.pf[data-t=gravity] .pf-tab{border:0;border-radius:.6em;background:var(--cap);color:var(--capFg);box-shadow:0 3px 0 var(--capSide);transition:transform .1s,box-shadow .1s}
.pf[data-t=gravity] .pf-chip[aria-pressed=true],.pf[data-t=gravity] .pf-tab[aria-selected=true]{background:var(--capA);color:var(--capAFg);transform:translateY(3px);box-shadow:0 0 0 var(--capSide)}
.pf[data-t=gravity] .pf-btn{border-radius:.7em;background:var(--capA);color:var(--capAFg);box-shadow:0 4px 0 color-mix(in srgb,var(--capA) 55%,#000)}
.pf[data-t=gravity] .pf-btn-ghost{background:var(--cap);color:var(--capFg);box-shadow:0 4px 0 var(--capSide);border:0}
.pf[data-t=gravity] .pf-pg{border:0;border-radius:.6em;background:var(--cap);color:var(--capFg);box-shadow:0 3px 0 var(--capSide)}
.pf[data-t=gravity] .pf-stats dd{letter-spacing:-.04em}
.pf[data-t=gravity] .pf-port-t{letter-spacing:-.03em}
.pf[data-t=gravity] .pf-ph{background:var(--capA);color:var(--capAFg)}
/* responsive */
.pf[data-w=sm] .gv-nav,.pf[data-w=xs] .gv-nav,.pf[data-w=xs] .gv-help,.pf[data-w=sm] .gv-help{display:none}
.pf[data-w=sm] .pf-burger,.pf[data-w=xs] .pf-burger{display:block}
.pf[data-w=xs]{--pad-r:1.1em;--pad-l:1.1em;--pad-b:1.1em;--pad-t:4.6em}
.pf[data-w=xs] .gv-top{padding:.9em 1.1em}
.pf[data-w=xs] .gv-brand span{display:none}
.pf[data-o=p] .gv-hero{grid-template-columns:1fr;grid-template-rows:auto minmax(0,1fr);gap:.5em}
.pf[data-o=p] .gv-txt{padding-bottom:0}
.pf[data-o=p] .gv-pitch,.pf[data-o=p] .gv-hi{display:none}
.pf[data-o=p] .gv-world{margin:0 calc(var(--pad-r) * -1) calc(var(--pad-b) * -1) calc(var(--pad-l) * -1)}
.pf[data-o=p] .gv-tip{display:none}
.pf[data-h=tiny] .gv-pitch,.pf[data-h=tiny] .gv-hi,.pf[data-h=tiny] .gv-tip,.pf[data-h=tiny] .gv-help{display:none}
.pf[data-h=tiny] .gv-top{padding:.5em 1.4em}
.pf[data-h=tiny]{--pad-t:3.6em}
`,
};
