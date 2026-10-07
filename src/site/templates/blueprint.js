/*! Portfolio Studio. Copyright (c) 2026 Roy Borkin. All rights reserved. Unauthorized copying, modification or distribution is prohibited without written permission. */
// 11 — Blueprint (free design) : the site is a technical drawing sheet, the native language of an
// industrial designer. Gridded field, sheet frame with zone letters, a title block that doubles as
// the contact card, dimension lines that draw themselves, and a crosshair cursor with coordinates.
// The Topo variant swaps the grid for live contour lines that bend around the pointer.
export default {
  id: 'blueprint',
  name: 'Blueprint',
  blurb: 'Technical drawing sheet: title block, self-drawing dimensions, crosshair. Topo variant has live contours.',
  cursor: false,
  transition(from, to, dir, ax, pt, root) {
    const line = root.querySelector('.bp-scan');
    const d = 1050, e = 'cubic-bezier(.7,0,.2,1)';
    const a = [dir > 0 ? 'inset(0 0 0 100%)' : 'inset(0 100% 0 0)', 'inset(0 0 0 0)'];
    return [
      to.animate([{ clipPath: a[0] }, { clipPath: a[1] }], { duration: d, easing: e, fill: 'both' }),
      from.animate([{ opacity: 1 }, { opacity: 0.25 }], { duration: d, easing: e, fill: 'forwards' }),
      line.animate([{ left: dir > 0 ? '100%' : '0%', opacity: 1 }, { left: dir > 0 ? '0%' : '100%', opacity: 1 }], { duration: d, easing: e }),
    ];
  },
  variants: [
    { name: 'Blueprint', swatch: ['#1d4596', '#ffffff', '#9cc3ff'],
      vars: { bg: '#1c4393', surface: 'rgba(255,255,255,.05)', fg: '#f3f7ff', muted: '#a9bde4', accent: '#ffffff', accent2: '#9cc3ff', line: 'rgba(255,255,255,.22)', grid: 'rgba(255,255,255,.07)', mark: '#ffd166' },
      fonts: { display: 'B612 Mono:400;700', body: 'B612:400;700', mono: 'B612 Mono:400' }, opts: { field: 'grid' } },
    { name: 'Drafting', swatch: ['#f2f1ec', '#2a2b2e', '#d6332a'],
      vars: { bg: '#f1f0ea', surface: 'rgba(42,43,46,.03)', fg: '#2a2b2e', muted: '#6d6e72', accent: '#2a2b2e', accent2: '#8e9094', line: 'rgba(42,43,46,.32)', grid: 'rgba(42,43,46,.06)', mark: '#d6332a' },
      fonts: { display: 'Architects Daughter:400', body: 'B612:400;700', mono: 'B612 Mono:400' }, opts: { field: 'grid' } },
    { name: 'Topo', swatch: ['#e6e5e1', '#151515', '#ff5b2e'],
      vars: { bg: '#e5e4e0', surface: 'rgba(255,255,255,.5)', fg: '#151515', muted: '#6a6a66', accent: '#151515', accent2: '#9a9a96', line: 'rgba(21,21,21,.22)', grid: 'rgba(21,21,21,.05)', mark: '#ff5b2e' },
      fonts: { display: 'Chivo:300;800', body: 'Chivo:400;500', mono: 'Chivo Mono:400' }, opts: { field: 'topo' } },
  ],
  layout: { works: [15, 15] },
  shell(c) {
    const zones = (n, ch) => Array.from({ length: n }, (_, i) => `<span>${ch ? String.fromCharCode(65 + i) : i + 1}</span>`).join('');
    const email = c.contacts.find((x) => x.type === 'email'), phone = c.contacts.find((x) => x.type === 'phone');
    const field = c.opt('field');
    return {
      bg: `${field === 'topo' ? '<canvas class="bp-topo"></canvas>' : '<div class="bp-grid"></div>'}`,
      nav: `<div class="bp-frame" aria-hidden="true"><div class="bp-zx">${zones(8, true)}</div><div class="bp-zy">${zones(5)}</div></div>
        <header class="bp-top"><button class="bp-brand" data-go="0" data-hover>${c.logo()}</button><nav class="bp-nav" aria-label="Sections">${c.nav({ num: true })}</nav>${c.menuBtn()}</header>
        <div class="bp-tb" role="contentinfo">
          <div class="bp-tb-name"><small>Drawn by</small><b>${c.esc(c.name)}</b></div>
          <div><small>Title</small><b class="bp-tb-sec">${c.esc(c.secs[0]?.label || '')}</b></div>
          <div><small>Sheet</small><b><span class="bp-tb-n">01</span> / ${c.pad2(c.secs.length)}</b></div>
          <div><small>Scale</small><b>1 : 1</b></div>
          ${email ? `<a href="${c.esc(c.contactHref(email))}" class="bp-tb-wide" data-hover><small>Email</small><b>${c.esc(email.value)}</b></a>` : ''}
          ${phone ? `<a href="${c.esc(c.contactHref(phone))}" data-hover><small>Phone</small><b>${c.esc(phone.value)}</b></a>` : ''}
          <div class="bp-tb-cts">${c.contactLinks({ limit: 6 })}</div>
        </div>
        <div class="bp-cross" aria-hidden="true"><i class="h"></i><i class="v"></i><span class="bp-xy">X 000.0  Y 000.0</span></div>
        <i class="bp-scan" aria-hidden="true"></i>
        ${c.drawer()}`,
    };
  },
  home(c) {
    const sketch = c.img(c.P.sketch) || c.img(c.P.cutout);
    const st = (c.data.about?.stats || []).slice(0, 2);
    return `<div class="bp-hero">
      <div class="bp-head">
        <p class="bp-note">${c.esc(c.P.intro || '')}</p>
        <h1 class="bp-name">${c.esc(c.first)}<br>${c.esc(c.last)}</h1>
        <ul class="bp-roles">${c.roles.map((r, i) => `<li><i>${String.fromCharCode(65 + i)}</i>${c.esc(r)}</li>`).join('')}</ul>
        <p class="bp-tag">${c.esc(c.P.tagline || '')}</p>
        ${c.sec('works') ? `<button class="bp-go" data-go="${c.sec('works').i}" data-hover><span>${c.esc(c.sec('works').label)}</span>${c.I('arrow')}</button>` : ''}
      </div>
      <figure class="bp-draw">
        <img src="${c.esc(sketch)}" alt="${c.esc(c.name)} — illustration" draggable="false">
        <svg class="bp-dims" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <path class="d1" d="M4 2 V-4 M96 2 V-4 M4 -2 H96"/><path class="d2" d="M102 6 H108 M102 94 H108 M106 6 V94"/>
          <circle class="d3" cx="50" cy="50" r="49"/><path class="d4" d="M50 -2 V102 M-2 50 H102"/>
        </svg>
        <span class="bp-dim bp-dim-w">${c.esc(st[0] ? st[0].value + ' ' + st[0].label.toLowerCase() : '')}</span>
        <span class="bp-dim bp-dim-h">${c.esc(st[1] ? st[1].value + ' ' + st[1].label.toLowerCase() : '')}</span>
        <span class="bp-callout">${c.esc(c.P.location || '')}</span>
      </figure>
    </div>`;
  },
  mount(c, root) {
    const cross = root.querySelector('.bp-cross'), xy = root.querySelector('.bp-xy');
    const fine = matchMedia('(pointer:fine)').matches;
    const mv = (e) => { if (!fine) return; const r = root.getBoundingClientRect(); const x = e.clientX - r.left, y = e.clientY - r.top; cross.style.setProperty('--x', x + 'px'); cross.style.setProperty('--y', y + 'px'); cross.classList.add('on'); xy.textContent = `X ${(x / r.width * 420).toFixed(1).padStart(5, '0')}  Y ${(y / r.height * 297).toFixed(1).padStart(5, '0')}`; };
    window.addEventListener('pointermove', mv, { passive: true });
    let stopTopo = null;
    const cv = root.querySelector('.bp-topo');
    if (cv) {
      const g = cv.getContext('2d');
      const P = new Uint8Array(512); const perm = [...Array(256).keys()].sort(() => Math.random() - 0.5); for (let i = 0; i < 512; i++) P[i] = perm[i & 255];
      const fade = (t) => t * t * t * (t * (t * 6 - 15) + 10), lerp = (a, b, t) => a + (b - a) * t;
      const grad = (h, x, y) => ((h & 1) ? -x : x) + ((h & 2) ? -y : y);
      const noise = (x, y) => { const X = Math.floor(x) & 255, Y = Math.floor(y) & 255; x -= Math.floor(x); y -= Math.floor(y); const u = fade(x), v = fade(y); const a = P[X] + Y, b = P[X + 1] + Y; return lerp(lerp(grad(P[a], x, y), grad(P[b], x - 1, y), u), lerp(grad(P[a + 1], x, y - 1), grad(P[b + 1], x - 1, y - 1), u), v); };
      let W, H, dpr; const size = () => { dpr = Math.min(2, devicePixelRatio || 1); W = cv.clientWidth; H = cv.clientHeight; cv.width = W * dpr; cv.height = H * dpr; };
      size(); const ro = new ResizeObserver(size); ro.observe(cv);
      const css = getComputedStyle(root); const ink = css.getPropertyValue('--fg').trim(), mark = css.getPropertyValue('--mark').trim();
      let last = 0;
      const stop = c.loop((t) => {
        if (t - last < 1 / 30 && t > 0.05) return; last = t;
        const cell = Math.max(14, Math.round(Math.min(W, H) / 48)), cols = Math.ceil(W / cell) + 1, rows = Math.ceil(H / cell) + 1;
        const p = c.pointer(); const px = (p.x * 0.5 + 0.5) * W, py = (p.y * 0.5 + 0.5) * H;
        const f = new Float32Array(cols * rows);
        for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) { const x = i * cell, y = j * cell; const dx = (x - px) / (W * 0.18), dy = (y - py) / (W * 0.18); f[j * cols + i] = noise(x / 340 + t * 0.03, y / 340) * 1.2 + noise(x / 140, y / 140 + t * 0.02) * 0.35 + Math.exp(-(dx * dx + dy * dy)) * 0.9; }
        g.setTransform(dpr, 0, 0, dpr, 0, 0); g.clearRect(0, 0, W, H);
        const levels = 14;
        for (let L = 0; L < levels; L++) {
          const iso = -0.9 + L * (2.2 / levels);
          g.beginPath(); g.lineWidth = L % 5 === 0 ? 1.4 : 0.7; g.strokeStyle = L === 11 ? mark : ink; g.globalAlpha = L % 5 === 0 ? 0.55 : 0.28;
          for (let j = 0; j < rows - 1; j++) for (let i = 0; i < cols - 1; i++) {
            const a = f[j * cols + i], b = f[j * cols + i + 1], cc = f[(j + 1) * cols + i + 1], d = f[(j + 1) * cols + i];
            const k = (a > iso) | ((b > iso) << 1) | ((cc > iso) << 2) | ((d > iso) << 3);
            if (k === 0 || k === 15) continue;
            const x = i * cell, y = j * cell;
            const T = [x + cell * (iso - a) / (b - a), y], R = [x + cell, y + cell * (iso - b) / (cc - b)], B = [x + cell * (iso - d) / (cc - d), y + cell], Lf = [x, y + cell * (iso - a) / (d - a)];
            const seg = (p1, p2) => { g.moveTo(p1[0], p1[1]); g.lineTo(p2[0], p2[1]); };
            switch (k) { case 1: case 14: seg(Lf, T); break; case 2: case 13: seg(T, R); break; case 3: case 12: seg(Lf, R); break; case 4: case 11: seg(R, B); break; case 5: seg(Lf, T); seg(R, B); break; case 6: case 9: seg(T, B); break; case 7: case 8: seg(Lf, B); break; case 10: seg(T, R); seg(Lf, B); break; }
          }
          g.stroke();
        }
        g.globalAlpha = 1;
      });
      stopTopo = () => { stop(); ro.disconnect(); };
    }
    return () => { window.removeEventListener('pointermove', mv); stopTopo && stopTopo(); };
  },
  onEnter(c, i, p, root) { const n = root.querySelector('.bp-tb-n'); if (n) n.textContent = c.pad2(i + 1); const s = root.querySelector('.bp-tb-sec'); if (s) s.textContent = c.secs[i].label; },
  css: () => `
.pf[data-t=blueprint]{--fr:2.4vmin;--pad-t:5.6em;--pad-r:3.8em;--pad-l:3.8em;--pad-b:7.4em;--radius:0px;--grain-o:.08}
.pf[data-t=blueprint][data-v="0"]{background:radial-gradient(ellipse at 50% 40%,#2453ad,var(--bg) 70%)}
.bp-grid{position:absolute;inset:0;background-image:linear-gradient(var(--line) 1px,transparent 1px),linear-gradient(90deg,var(--line) 1px,transparent 1px),linear-gradient(var(--grid) 1px,transparent 1px),linear-gradient(90deg,var(--grid) 1px,transparent 1px);background-size:100px 100px,100px 100px,20px 20px,20px 20px;background-position:calc(var(--mx) * -6px) calc(var(--my) * -6px);opacity:.55}
.bp-topo{position:absolute;inset:0;width:100%;height:100%}
.bp-frame{position:absolute;inset:var(--fr);border:1.5px solid var(--line);pointer-events:none;z-index:5}
.bp-frame::before{content:"";position:absolute;inset:1.4em;border:1px solid var(--line)}
.bp-zx{position:absolute;left:1.4em;right:1.4em;top:0;height:1.4em;display:flex;font-family:var(--f-mono);font-size:.6em;color:var(--muted)}
.bp-zx span{flex:1;display:grid;place-items:center;border-left:1px solid var(--line)}
.bp-zx span:first-child{border-left:0}
.bp-zy{position:absolute;top:1.4em;bottom:1.4em;left:0;width:1.4em;display:flex;flex-direction:column;font-family:var(--f-mono);font-size:.6em;color:var(--muted)}
.bp-zy span{flex:1;display:grid;place-items:center;border-top:1px solid var(--line)}
.bp-zy span:first-child{border-top:0}
.bp-top{position:absolute;z-index:20;left:calc(var(--fr) + 1.4em);right:calc(var(--fr) + 1.4em);top:calc(var(--fr) + 1.4em);display:flex;align-items:center;justify-content:space-between;padding:.9em 1em;border-bottom:1px solid var(--line)}
.bp-brand .pf-logo{height:1.8em}
.pf[data-v="0"] .bp-brand .pf-logo{filter:brightness(0) invert(1)}
.pf[data-v="1"] .bp-brand .pf-logo,.pf[data-v="2"] .bp-brand .pf-logo{filter:brightness(0)}
.bp-nav{display:flex;gap:0;font-family:var(--f-mono);font-size:.74em;text-transform:uppercase;letter-spacing:.04em}
.bp-nav .pf-nav-a{padding:.4em .9em;border-left:1px solid var(--line);color:var(--muted)}
.bp-nav .pf-nav-a:hover,.bp-nav .pf-nav-a.is-cur{color:var(--fg)}
.bp-nav .pf-nav-a.is-cur{background:var(--fg);color:var(--bg)}
.bp-nav .pf-nav-n{opacity:1}
.bp-tb{position:absolute;z-index:20;right:calc(var(--fr) + 1.4em);bottom:calc(var(--fr) + 1.4em);display:grid;grid-template-columns:repeat(4,auto);border-top:1.5px solid var(--line);border-left:1.5px solid var(--line);font-size:.72em;background:var(--bg)}
.pf[data-v="0"] .bp-tb{background:color-mix(in srgb,var(--bg) 90%,#000)}
.bp-tb>*{display:flex;flex-direction:column;gap:.15em;padding:.45em .8em;border-right:1px solid var(--line);border-bottom:1px solid var(--line);min-width:6em}
.bp-tb small{font-family:var(--f-mono);font-size:.78em;color:var(--muted);text-transform:uppercase;letter-spacing:.06em}
.bp-tb b{font-weight:700;white-space:nowrap}
.bp-tb-name{grid-column:span 2}
.bp-tb-wide{grid-column:span 2}
.bp-tb a:hover b{text-decoration:underline}
.bp-tb-cts{grid-column:1/-1;flex-direction:row!important;gap:.2em!important;padding:.25em .5em!important}
.bp-tb-cts .pf-ct{width:2.2em;height:2.2em}
.bp-tb-cts .pf-ct:hover{background:var(--fg);color:var(--bg)}
.bp-cross{position:absolute;inset:0;z-index:80;pointer-events:none;opacity:0;transition:opacity .3s}
.bp-cross.on{opacity:1}
.bp-cross i{position:absolute;background:var(--mark);opacity:.5}
.bp-cross .h{left:0;right:0;height:1px;top:var(--y)}
.bp-cross .v{top:0;bottom:0;width:1px;left:var(--x)}
.bp-xy{position:absolute;left:calc(var(--x) + 10px);top:calc(var(--y) + 10px);font-family:var(--f-mono);font-size:.66em;color:var(--mark);white-space:pre;background:var(--bg);padding:.1em .3em}
.pf-modal-open .bp-cross{display:none}
.bp-scan{position:absolute;z-index:60;top:0;bottom:0;left:-10px;width:2px;background:var(--mark);box-shadow:0 0 18px var(--mark);opacity:0;pointer-events:none}
/* hero */
.bp-hero{position:absolute;inset:0;display:grid;grid-template-columns:1fr 1fr;gap:2em;align-items:center}
.bp-head{display:flex;flex-direction:column;gap:1.1em;align-items:flex-start}
.bp-note{font-family:var(--f-mono);font-size:.78em;color:var(--muted)}
.bp-note::before{content:"";display:inline-block;width:2em;height:1px;background:var(--mark);vertical-align:middle;margin-right:.7em}
.bp-name{font-family:var(--f-display);font-weight:700;font-size:clamp(2.4em,8vmin,6em);line-height:.95;letter-spacing:-.03em;text-transform:uppercase}
.pf[data-v="1"] .bp-name{font-weight:400;text-transform:none;letter-spacing:0;line-height:1.05}
.pf[data-v="2"] .bp-name{font-weight:800;letter-spacing:-.045em}
.bp-roles{display:grid;grid-template-columns:repeat(2,auto);gap:.35em 1.6em;font-size:.86em}
.bp-roles i{font-style:normal;font-family:var(--f-mono);display:inline-grid;place-items:center;width:1.6em;height:1.6em;border:1px solid var(--line);border-radius:50%;margin-right:.6em;font-size:.8em;color:var(--mark)}
.bp-tag{max-width:40ch;font-size:.88em;color:var(--muted);line-height:1.55}
.bp-go{display:flex;align-items:center;gap:.8em;padding:.75em 1.2em;border:1.5px solid var(--fg);font-family:var(--f-mono);font-size:.78em;text-transform:uppercase;letter-spacing:.06em;transition:background-color .3s,color .3s}
.bp-go:hover{background:var(--fg);color:var(--bg)}
.bp-draw{position:relative;justify-self:center;width:min(100%,62vh);aspect-ratio:1}
.bp-draw img{position:absolute;inset:4%;width:92%;height:92%;object-fit:contain;transform:translate(calc(var(--mx) * -6px),calc(var(--my) * -6px));opacity:0;transition:opacity 1.4s .8s}
.pf[data-v="0"] .bp-draw{isolation:isolate}
.pf[data-v="0"] .bp-draw::before{content:"";position:absolute;inset:4%;background:var(--bg)}
.pf[data-v="0"] .bp-draw img{filter:grayscale(1) contrast(2.2) invert(1);mix-blend-mode:screen}
.pf[data-v="1"] .bp-draw img{filter:grayscale(1) contrast(1.4);mix-blend-mode:multiply}
.pf[data-v="2"] .bp-draw img{filter:grayscale(1) contrast(1.3);mix-blend-mode:multiply}
.bp-dims{position:absolute;inset:0;width:100%;height:100%;overflow:visible}
.bp-dims path,.bp-dims circle{fill:none;stroke:var(--fg);stroke-width:1;vector-effect:non-scaling-stroke;stroke-dasharray:400;stroke-dashoffset:400;transition:stroke-dashoffset 1.6s var(--ease)}
.bp-dims .d3{stroke:var(--line);stroke-dasharray:4 6;stroke-dashoffset:0;opacity:0;transition:opacity 1s .6s}
.bp-dims .d4{stroke:var(--mark);opacity:.6;stroke-dasharray:6 4 1 4;stroke-dashoffset:0;opacity:0;transition:opacity 1s .9s}
.bp-dims .d2{transition-delay:.3s}
.bp-dim{position:absolute;font-family:var(--f-mono);font-size:.7em;background:var(--bg);padding:0 .5em;white-space:nowrap;opacity:0;transition:opacity .6s 1.4s}
.pf[data-v="2"] .bp-dim,.pf[data-v="2"] .bp-xy{background:transparent}
.bp-dim-w{left:50%;top:-2%;transform:translate(-50%,-50%)}
.bp-dim-h{left:106%;top:50%;transform:translate(-50%,-50%) rotate(90deg)}
.bp-callout{position:absolute;left:-4%;bottom:8%;font-family:var(--f-mono);font-size:.7em;padding:.3em .6em;border:1px solid var(--mark);color:var(--mark);opacity:0;transition:opacity .6s 1.7s}
.bp-callout::after{content:"";position:absolute;left:100%;top:50%;width:4em;height:1px;background:var(--mark);transform-origin:left;transform:rotate(-24deg)}
.bp-head>*{opacity:0;transform:translateY(.8em);transition:opacity .8s,transform 1s var(--out)}
.bp-head>:nth-child(2){transition-delay:.1s}.bp-head>:nth-child(3){transition-delay:.2s}.bp-head>:nth-child(4){transition-delay:.3s}.bp-head>:nth-child(5){transition-delay:.4s}
.pf-sec-home.is-on .bp-head>*,.pf[data-static] .bp-head>*{opacity:1;transform:none}
.pf-sec-home.is-on .bp-dims path,.pf[data-static] .bp-dims path{stroke-dashoffset:0}
.pf-sec-home.is-on :is(.bp-draw img,.bp-dims .d3,.bp-dim,.bp-callout),.pf[data-static] :is(.bp-draw img,.bp-dims .d3,.bp-dim,.bp-callout){opacity:1}
.pf-sec-home.is-on .bp-dims .d4,.pf[data-static] .bp-dims .d4{opacity:.5}
/* sections */
.pf[data-t=blueprint] .pf-head{border-bottom:1px solid var(--line);padding-bottom:.6em}
.pf[data-t=blueprint] .pf-head-n{font-size:.8em;padding:.15em .5em;border:1px solid var(--fg);color:var(--fg)}
.pf[data-t=blueprint] .pf-head-t{text-transform:uppercase;letter-spacing:-.02em;font-size:clamp(1.6em,4.4vmin,3.2em)}
.pf[data-t=blueprint][data-v="1"] .pf-head-t{text-transform:none;font-weight:400;letter-spacing:0}
.pf[data-t=blueprint][data-v="2"] .pf-head-t{font-weight:800}
.pf[data-t=blueprint] .pf-card,.pf[data-t=blueprint] .pf-xp,.pf[data-t=blueprint] .pf-edu,.pf[data-t=blueprint] .pf-skill,.pf[data-t=blueprint] .pf-port-item{border:1px solid var(--line);background:var(--surface);border-radius:0}
.pf[data-t=blueprint] .pf-card:hover{border-color:var(--fg)}
.pf[data-t=blueprint] .pf-card::after{content:attr(data-kind);position:absolute;right:.5em;top:.5em;font-family:var(--f-mono);font-size:.6em;text-transform:uppercase;padding:.15em .4em;background:var(--bg);color:var(--fg);border:1px solid var(--line)}
.pf[data-t=blueprint][data-v="0"] .pf-card-media img{filter:grayscale(1) sepia(1) hue-rotate(180deg) saturate(2.5) brightness(.85) contrast(1.1)}
.pf[data-t=blueprint][data-v="0"] .pf-card:hover .pf-card-media img{filter:none}
.pf[data-t=blueprint] .pf-card-meta,.pf[data-t=blueprint] .pf-chip,.pf[data-t=blueprint] .pf-tab{font-family:var(--f-mono)}
.pf[data-t=blueprint] .pf-chip,.pf[data-t=blueprint] .pf-tab{border-radius:0}
.pf[data-t=blueprint] .pf-chip[aria-pressed=true],.pf[data-t=blueprint] .pf-tab[aria-selected=true]{background:var(--fg);color:var(--bg)}
.pf[data-t=blueprint] .pf-btn{border-radius:0;font-family:var(--f-mono);text-transform:uppercase;font-size:.76em}
.pf[data-t=blueprint] .pf-pg{border-radius:0}
.pf[data-t=blueprint] .pf-port-t{text-transform:uppercase}
.pf[data-t=blueprint][data-v="1"] .pf-port-t{text-transform:none;font-weight:400}
.pf[data-t=blueprint] .pf-profile-img{border-radius:0;border:1px solid var(--line)}
.pf[data-t=blueprint] .pf-modal-box{border-radius:0}
.pf[data-t=blueprint] .pf-ph{background:repeating-linear-gradient(45deg,var(--surface) 0 8px,transparent 8px 16px);color:var(--fg)}
/* responsive */
.pf[data-w=md] .bp-nav .pf-nav-n{display:none}
.pf[data-w=sm] .bp-nav,.pf[data-w=xs] .bp-nav{display:none}
.pf[data-w=sm] .pf-burger,.pf[data-w=xs] .pf-burger{display:block}
.pf[data-w=sm] .bp-tb>*:nth-child(3),.pf[data-w=sm] .bp-tb>*:nth-child(4),.pf[data-w=xs] .bp-tb>*:nth-child(-n+4),.pf[data-w=xs] .bp-tb>a{display:none}
.pf[data-w=xs]{--fr:0px;--pad-r:1.6em;--pad-l:1.6em;--pad-b:4.6em;--pad-t:5.6em}
.pf[data-w=xs] .bp-zx,.pf[data-w=xs] .bp-zy{display:none}
.pf[data-w=xs] .bp-frame::before{inset:.6em}
.pf[data-w=xs] .bp-top{left:.6em;right:.6em;top:.6em}
.pf[data-w=xs] .bp-tb{right:.6em;bottom:.6em;left:.6em;grid-template-columns:1fr}
.pf[data-o=p] .bp-hero{grid-template-columns:1fr;grid-template-rows:auto minmax(0,1fr);align-items:start}
.pf[data-o=p] .bp-tag,.pf[data-o=p] .bp-note{display:none}
.pf[data-o=p] .bp-draw{width:min(78%,40vh);align-self:center}
.pf[data-o=p] .bp-dim-h{display:none}
.pf[data-h=tiny] .bp-tag,.pf[data-h=tiny] .bp-roles,.pf[data-h=tiny] .bp-tb,.pf[data-h=tiny] .bp-zx,.pf[data-h=tiny] .bp-zy{display:none}
.pf[data-h=tiny]{--pad-b:2em;--pad-t:4.4em}
`,
};
