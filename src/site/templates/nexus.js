/*! Portfolio Studio. Copyright (c) 2026 Roy Borkin. All rights reserved. Unauthorized copying, modification or distribution is prohibited without written permission. */
// 03 — Nexus : futuristic HUD. A live wireframe globe turns behind the cut-out, callout lines label
// the roles, letters of the name stack vertically, and a readout tracks the pointer.
export default {
  id: 'nexus',
  name: 'Nexus',
  blurb: 'Futuristic HUD: rotating 3D point globe, callouts, glitch cuts.',
  transition: 'glitch',
  variants: [
    { name: 'Frontier', swatch: ['#dfe1e3', '#16181b', '#ff4e3a'],
      vars: { bg: '#dcdfe2', surface: 'rgba(255,255,255,.45)', fg: '#16181b', muted: '#62676e', accent: '#ff4e3a', accent2: '#16181b', line: 'rgba(22,24,27,.16)' },
      fonts: { display: 'Michroma:400', body: 'Space Grotesk:400;500;600', mono: 'JetBrains Mono:400;500' } },
    { name: 'Glitch', swatch: ['#0e1116', '#ff2e88', '#25e2ff'],
      vars: { bg: '#0d1015', surface: 'rgba(22,27,36,.7)', fg: '#e8f0ff', muted: '#7d8799', accent: '#ff2e88', accent2: '#25e2ff', line: 'rgba(37,226,255,.18)' },
      fonts: { display: 'Chakra Petch:500;700', body: 'Space Grotesk:400;500;600', mono: 'JetBrains Mono:400;500' } },
    { name: 'Nexa', swatch: ['#15231c', '#c8f560', '#e9f1e7'],
      vars: { bg: '#14221b', surface: 'rgba(233,241,231,.07)', fg: '#e9f1e7', muted: '#8fa497', accent: '#c8f560', accent2: '#5fd3a0', line: 'rgba(200,245,96,.18)' },
      fonts: { display: 'Unbounded:400;700', body: 'Space Grotesk:400;500;600', mono: 'JetBrains Mono:400;500' } },
  ],
  layout: { works: [15, 15] },
  shell(c) {
    const bars = Array.from({ length: 34 }, (_, i) => `<i style="width:${[1, 2, 1, 3, 1, 1, 2][i % 7]}px"></i>`).join('');
    return {
      bg: `<canvas class="nx-globe"></canvas><div class="nx-grid"></div>`,
      nav: `<header class="nx-top">
          <button class="nx-brand" data-go="0" data-hover>${c.logo()}</button>
          <div class="nx-code" aria-hidden="true"><span class="nx-bar">${bars}</span><span>${c.esc(c.first.toUpperCase())}.SYS</span></div>
          <span class="nx-xy" aria-hidden="true">X <b class="nx-x">0.000</b> Y <b class="nx-y">0.000</b></span>
          ${c.menuBtn()}
        </header>
        <nav class="nx-nav" aria-label="Sections">${c.nav({ num: true })}<span class="nx-prog"><i></i></span></nav>
        <footer class="nx-foot">${c.contactLinks({ limit: 6 })}</footer>
        ${c.drawer()}`,
    };
  },
  home(c) {
    const cut = c.img(c.P.cutout) || c.img(c.P.photo);
    const stats = (c.data.about?.stats || []).slice(0, 2);
    const stack = (w) => [...w.toUpperCase()].map((ch, i) => `<span style="--c:${i}">${c.esc(ch)}</span>`).join('');
    const callouts = c.roles.slice(0, 4);
    const pos = [[62, 26], [70, 50], [26, 44], [30, 70]];
    return `<div class="nx-hero">
      <h1 class="nx-name" aria-label="${c.esc(c.name)}"><span class="nx-col">${stack(c.first)}</span><span class="nx-col">${stack(c.last)}</span></h1>
      <p class="nx-wel" aria-hidden="true">welcome to the</p>
      <figure class="nx-fig"><img src="${c.esc(cut)}" alt="${c.esc(c.name)}" draggable="false"></figure>
      <svg class="nx-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">${callouts.map((r, i) => { const [x, y] = pos[i]; const ex = x > 50 ? x + 14 : x - 14; return `<polyline style="--i:${i}" points="${50 + (x - 50) * 0.25},${y + 6} ${x},${y} ${ex},${y}"/>`; }).join('')}</svg>
      ${callouts.map((r, i) => { const [x, y] = pos[i]; return `<span class="nx-call ${x > 50 ? 'r' : 'l'}" style="--x:${x > 50 ? x + 14 : x - 14}%;--y:${y}%;--i:${i}"><b>${c.pad2(i + 1)}</b>${c.esc(r)}</span>`; }).join('')}
      <div class="nx-stats">${stats.map((s) => `<div><small>${c.esc(s.label)}</small><strong>${c.esc(s.value)}</strong></div>`).join('')}<p>${c.esc(c.P.tagline || '')}</p></div>
      ${c.sec('works') ? `<button class="nx-start" data-go="${c.sec('works').i}" data-hover><span>Start exploring</span>${c.I('arrow')}</button>` : ''}
    </div>`;
  },
  mount(c, root) {
    const cv = root.querySelector('.nx-globe');
    const g = cv.getContext('2d');
    const N = 520, pts = [];
    for (let i = 0; i < N; i++) { const y = 1 - (i / (N - 1)) * 2, r = Math.sqrt(1 - y * y), th = Math.PI * (3 - Math.sqrt(5)) * i; pts.push([Math.cos(th) * r, y, Math.sin(th) * r]); }
    const rings = [0, 1, 2].map((k) => Array.from({ length: 90 }, (_, i) => { const a = (i / 90) * Math.PI * 2; return k === 0 ? [Math.cos(a) * 1.35, 0, Math.sin(a) * 1.35] : k === 1 ? [Math.cos(a) * 1.6, Math.sin(a) * 0.12, Math.sin(a) * 1.6] : [0, Math.cos(a) * 1.18, Math.sin(a) * 1.18]; }));
    let W = 0, H = 0, dpr = 1;
    const size = () => { dpr = Math.min(2, devicePixelRatio || 1); W = cv.clientWidth; H = cv.clientHeight; cv.width = W * dpr; cv.height = H * dpr; };
    size(); const ro = new ResizeObserver(size); ro.observe(cv);
    const css = getComputedStyle(root);
    const col = css.getPropertyValue('--fg').trim(), acc = css.getPropertyValue('--accent').trim(), acc2 = css.getPropertyValue('--accent2').trim();
    const xr = root.querySelector('.nx-x'), yr = root.querySelector('.nx-y');
    const stop = c.loop((t) => {
      const p = c.pointer();
      g.setTransform(dpr, 0, 0, dpr, 0, 0); g.clearRect(0, 0, W, H);
      const home = root.dataset.cur === 'home';
      const R = Math.min(W, H) * (home ? 0.36 : 0.28), cx = W * (home ? 0.5 : 0.78), cy = H * (home ? 0.48 : 0.6);
      const ay = t * 0.18 + p.x * 0.8, ax = -0.35 + p.y * 0.4;
      const sy = Math.sin(ay), cyy = Math.cos(ay), sx = Math.sin(ax), cxx = Math.cos(ax);
      const proj = ([x, y, z]) => { const X = x * cyy - z * sy, Z1 = x * sy + z * cyy; const Y = y * cxx - Z1 * sx, Z = y * sx + Z1 * cxx; const f = 3 / (3 + Z); return [cx + X * R * f, cy + Y * R * f, Z]; };
      for (const p3 of pts) { const [x, y, z] = proj(p3); const a = (0.15 + (1 - (z + 1) / 2) * 0.75) * (home ? 1 : 0.45); g.globalAlpha = a; g.fillStyle = z < -0.55 ? acc : col; const s = z < -0.55 ? 2.2 : 1.3; g.fillRect(x - s / 2, y - s / 2, s, s); }
      rings.forEach((ring, k) => { g.beginPath(); ring.forEach((p3, i) => { const [x, y] = proj(p3); i ? g.lineTo(x, y) : g.moveTo(x, y); }); g.closePath(); g.globalAlpha = home ? 0.45 : 0.2; g.strokeStyle = k === 1 ? acc2 : acc; g.lineWidth = 1; g.stroke(); });
      g.globalAlpha = 1;
      if (xr) { xr.textContent = (p.x * 0.5 + 0.5).toFixed(3); yr.textContent = (p.y * 0.5 + 0.5).toFixed(3); }
    });
    return () => { stop(); ro.disconnect(); };
  },
  css: () => `
.pf[data-t=nexus]{--pad-t:5.6em;--pad-r:9em;--pad-l:4.2em;--pad-b:4.4em;--radius:4px;--grain-o:.05}
.pf[data-t=nexus][data-v="2"]{--radius:22px}
.nx-globe{position:absolute;inset:0;width:100%;height:100%}
.nx-grid{position:absolute;inset:0;background-image:linear-gradient(var(--line) 1px,transparent 1px),linear-gradient(90deg,var(--line) 1px,transparent 1px);background-size:calc(100% / 12) calc(100% / 8);mask-image:radial-gradient(ellipse at 50% 50%,#000 30%,transparent 75%);opacity:.5}
.pf[data-v="1"] .nx-grid::after{content:"";position:absolute;inset:0;background:repeating-linear-gradient(0deg,rgba(255,255,255,.035) 0 1px,transparent 1px 3px)}
.nx-top{position:absolute;z-index:20;inset:0 0 auto;display:flex;align-items:center;gap:2em;padding:1.2em 2em;font-family:var(--f-mono);font-size:.72em}
.nx-brand .pf-logo{height:2.4em}
.pf[data-v="0"] .nx-brand .pf-logo{filter:brightness(0)}
.pf[data-v="1"] .nx-brand .pf-logo,.pf[data-v="2"] .nx-brand .pf-logo{filter:brightness(0) invert(1)}
.nx-code{display:flex;align-items:center;gap:1em;color:var(--muted)}
.nx-bar{display:flex;gap:2px;height:1.6em}
.nx-bar i{background:var(--fg);display:block}
.nx-xy{margin-left:auto;color:var(--muted);letter-spacing:.06em}
.nx-xy b{color:var(--fg);font-weight:500;display:inline-block;width:4.2em}
.nx-nav{position:absolute;z-index:20;right:2em;top:50%;transform:translateY(-50%);display:flex;flex-direction:column;align-items:flex-end;gap:.9em;font-family:var(--f-mono);font-size:.74em;letter-spacing:.06em}
.nx-nav .pf-nav-a{color:var(--muted);text-transform:uppercase}
.nx-nav .pf-nav-a.is-cur,.nx-nav .pf-nav-a:hover{color:var(--fg)}
.nx-nav .pf-nav-a.is-cur .pf-nav-n{color:var(--accent);opacity:1}
.nx-prog{width:1px;height:5em;background:var(--line);position:relative;margin-top:.6em}
.nx-prog i{position:absolute;left:-1px;width:3px;height:1em;background:var(--accent);top:calc(var(--prog) * 4em);transition:top .8s var(--ease)}
.nx-foot{position:absolute;z-index:20;left:2em;bottom:1.2em;display:flex;gap:.3em}
.nx-foot .pf-ct{width:2.3em;height:2.3em;border:1px solid var(--line);border-radius:var(--radius);color:var(--muted)}
.nx-foot .pf-ct:hover{color:var(--bg);background:var(--accent);border-color:var(--accent)}
/* hero */
.nx-hero{position:absolute;inset:0}
.nx-name{position:absolute;left:0;top:0;bottom:0;display:flex;gap:.55em;font-family:var(--f-display);font-weight:400;font-size:clamp(1.3em,4.4vmin,3.2em);line-height:1.04;z-index:3}
.pf[data-v="1"] .nx-name{font-weight:700}
.nx-col{display:flex;flex-direction:column}
.nx-col span{opacity:0;transform:translateX(-.4em);transition:opacity .4s,transform .7s var(--out);transition-delay:calc(.2s + var(--c) * 70ms)}
.nx-col:last-child span{transition-delay:calc(.5s + var(--c) * 70ms)}
.nx-wel{position:absolute;left:-1.8em;top:0;writing-mode:vertical-rl;transform:rotate(180deg);font-family:var(--f-mono);font-size:.62em;color:var(--muted);letter-spacing:.3em;text-transform:uppercase}
.nx-fig{position:absolute;left:50%;bottom:calc(var(--pad-b) * -1);height:calc(100% + var(--pad-b) + 1em);aspect-ratio:1606/1500;transform:translateX(calc(-50% + var(--mx) * -8px));z-index:2;opacity:0;transition:opacity 1.2s .3s}
.nx-fig img{width:100%;height:100%;object-fit:contain;object-position:bottom}
.pf[data-v="0"] .nx-fig img{filter:grayscale(.85) contrast(1.05)}
.pf[data-v="1"] .nx-fig img{filter:grayscale(1) contrast(1.25) brightness(.9) drop-shadow(-6px 0 0 rgba(255,46,136,.35)) drop-shadow(6px 0 0 rgba(37,226,255,.3))}
.pf[data-v="2"] .nx-fig img{filter:grayscale(.5) sepia(.25) hue-rotate(40deg) saturate(.9)}
.nx-lines{position:absolute;inset:0;width:100%;height:100%;z-index:3;overflow:visible;pointer-events:none}
.nx-lines polyline{fill:none;stroke:var(--accent);stroke-width:1;vector-effect:non-scaling-stroke;stroke-dasharray:200;stroke-dashoffset:200;transition:stroke-dashoffset 1.2s var(--ease);transition-delay:calc(1s + var(--i) * .15s)}
.nx-call{position:absolute;z-index:4;left:var(--x);top:var(--y);transform:translate(0,-130%);font-family:var(--f-mono);font-size:.7em;text-transform:uppercase;letter-spacing:.08em;display:flex;gap:.6em;white-space:nowrap;opacity:0;transition:opacity .6s;transition-delay:calc(1.6s + var(--i) * .15s)}
.nx-call.l{transform:translate(-100%,-130%)}
.nx-call b{color:var(--accent);font-weight:500}
.nx-stats{position:absolute;z-index:4;left:0;bottom:0;display:flex;align-items:flex-end;gap:2.4em;opacity:0;transform:translateY(1em);transition:all 1s var(--out) 1.2s}
.nx-stats div{display:flex;flex-direction:column;gap:.2em}
.nx-stats small{font-size:.66em;color:var(--muted);max-width:12ch;line-height:1.3}
.nx-stats strong{font-family:var(--f-display);font-weight:400;font-size:clamp(1.8em,4.6vmin,3.4em);line-height:1}
.nx-stats p{max-width:26ch;font-size:.76em;color:var(--muted)}
.nx-start{position:absolute;z-index:4;right:0;bottom:0;display:flex;align-items:center;gap:.8em;font-family:var(--f-mono);font-size:.74em;text-transform:uppercase;letter-spacing:.08em;padding:.9em 1.2em;border:1px solid var(--fg);border-radius:var(--radius);opacity:0;transition:opacity 1s 1.5s,background-color .3s,color .3s}
.nx-start:hover{background:var(--accent);border-color:var(--accent);color:var(--bg)}
.pf-sec-home.is-on :is(.nx-col span,.nx-call,.nx-stats,.nx-start),.pf[data-static] :is(.nx-col span,.nx-call,.nx-stats,.nx-start){opacity:1;transform:none}
.pf-sec-home.is-on .nx-fig,.pf[data-static] .nx-fig{opacity:1}
.pf-sec-home.is-on .nx-call.l,.pf[data-static] .nx-call.l{transform:translate(-100%,-130%)}
.pf-sec-home.is-on .nx-call.r,.pf[data-static] .nx-call.r{transform:translate(0,-130%)}
.pf-sec-home.is-on .nx-fig,.pf[data-static] .nx-fig{transform:translateX(calc(-50% + var(--mx) * -8px))}
.pf-sec-home.is-on .nx-lines polyline,.pf[data-static] .nx-lines polyline{stroke-dashoffset:0}
/* sections: framed HUD panels */
.pf[data-t=nexus] .pf-head-t{font-weight:400;text-transform:uppercase;font-size:clamp(1.5em,4vmin,3em);letter-spacing:.02em}
.pf[data-t=nexus][data-v="1"] .pf-head-t{font-weight:700}
.pf[data-t=nexus] .pf-head-n{order:-1;color:var(--accent)}
.pf[data-t=nexus] .pf-head-n::before{content:"// "}
.pf[data-t=nexus] .pf-card,.pf[data-t=nexus] .pf-xp,.pf[data-t=nexus] .pf-edu,.pf[data-t=nexus] .pf-skill,.pf[data-t=nexus] .pf-port-item{background:var(--surface);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);border:1px solid var(--line)}
.pf[data-t=nexus] .pf-card::after,.pf[data-t=nexus] .pf-port-item::after{content:"";position:absolute;inset:6px;pointer-events:none;background:linear-gradient(var(--accent),var(--accent)) 0 0/10px 1px no-repeat,linear-gradient(var(--accent),var(--accent)) 0 0/1px 10px no-repeat,linear-gradient(var(--accent),var(--accent)) 100% 100%/10px 1px no-repeat,linear-gradient(var(--accent),var(--accent)) 100% 100%/1px 10px no-repeat;opacity:.9}
.pf[data-t=nexus][data-v="2"] .pf-card::after,.pf[data-t=nexus][data-v="2"] .pf-port-item::after{display:none}
.pf[data-t=nexus] .pf-card::before{content:"";position:absolute;left:0;right:0;top:-30%;height:30%;z-index:2;background:linear-gradient(transparent,color-mix(in srgb,var(--accent) 22%,transparent),transparent);pointer-events:none;transition:top .9s var(--ease)}
.pf[data-t=nexus] .pf-card:hover::before{top:110%}
.pf[data-t=nexus] .pf-card-media img{filter:saturate(.7)}
.pf[data-t=nexus][data-v="1"] .pf-card-media img{filter:grayscale(.6) contrast(1.15)}
.pf[data-t=nexus] .pf-card-meta,.pf[data-t=nexus] .pf-card-kind{font-family:var(--f-mono);text-transform:uppercase;letter-spacing:.04em}
.pf[data-t=nexus] .pf-chip,.pf[data-t=nexus] .pf-tab{border-radius:var(--radius);font-family:var(--f-mono);font-size:.74em;text-transform:uppercase;letter-spacing:.05em}
.pf[data-t=nexus] .pf-chip[aria-pressed=true],.pf[data-t=nexus] .pf-tab[aria-selected=true]{background:var(--accent);border-color:var(--accent);color:var(--bg)}
.pf[data-t=nexus] .pf-btn{border-radius:var(--radius);background:var(--accent);color:var(--bg);font-family:var(--f-mono);text-transform:uppercase;font-size:.76em;letter-spacing:.06em}
.pf[data-t=nexus] .pf-btn-ghost{background:transparent;color:var(--fg);border:1px solid var(--line)}
.pf[data-t=nexus] .pf-pg{border-radius:var(--radius)}
.pf[data-t=nexus] .pf-stats dd{font-weight:400}
.pf[data-t=nexus] .pf-port-t{font-weight:400;text-transform:uppercase}
.pf[data-t=nexus] .pf-ph{background:linear-gradient(135deg,color-mix(in srgb,var(--accent) 50%,var(--bg)),var(--bg))}
/* responsive */
.pf[data-w=sm],.pf[data-w=xs]{--pad-r:1.4em}
.pf[data-w=sm] .nx-nav,.pf[data-w=xs] .nx-nav,.pf[data-w=xs] .nx-xy,.pf[data-w=xs] .nx-code span:last-child{display:none}
.pf[data-w=sm] .pf-burger,.pf[data-w=xs] .pf-burger{display:block}
.pf[data-w=sm] .nx-xy{margin-left:auto}
.pf[data-w=xs] .nx-top{padding:1em 1.1em;justify-content:space-between}
.pf[data-w=xs]{--pad-l:2.2em}
.pf[data-w=xs] .nx-foot{left:1.1em;bottom:1em}
.pf[data-o=p] .nx-fig{height:62%;bottom:calc(var(--pad-b) * -1)}
.pf[data-o=p] .nx-call,.pf[data-o=p] .nx-lines{display:none}
.pf[data-o=p] .nx-name{bottom:auto;flex-direction:row;font-size:clamp(1.2em,5.6vw,2.6em)}
.pf[data-o=p] .nx-stats{bottom:auto;top:calc(26vh);left:auto;right:0;flex-direction:column;align-items:flex-end;gap:.8em;text-align:right}
.pf[data-o=p] .nx-stats p{display:none}
.pf[data-o=p] .nx-start{bottom:0;right:0;z-index:5;background:var(--bg)}
.pf[data-h=tiny] .nx-stats,.pf[data-h=tiny] .nx-call,.pf[data-h=tiny] .nx-lines{display:none}
.pf[data-h=tiny] .nx-top{padding:.6em 1.2em}
`,
};
