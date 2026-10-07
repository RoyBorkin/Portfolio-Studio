/*! Portfolio Studio. Copyright (c) 2026 Roy Borkin. All rights reserved. Unauthorized copying, modification or distribution is prohibited without written permission. */
// 09 — Forge (free design) : the logo becomes a machined 3D object. It is extruded from stacked
// layers in real CSS 3D, turns on its own, follows the pointer and can be spun by dragging.
// On inner sections the object parks in the corner and keeps turning.
const LAYERS = 26;
export default {
  id: 'forge',
  name: 'Forge',
  blurb: 'Your logo as a live 3D object: drag to spin, follows the mouse.',
  transition: 'depth',
  variants: [
    { name: 'Brass', swatch: ['#1e232b', '#cc9932', '#e9e4da'],
      vars: { bg: '#1c2129', surface: 'rgba(255,255,255,.04)', fg: '#ece6da', muted: '#8d93a0', accent: '#cc9932', accent2: '#333a46', line: 'rgba(236,230,218,.1)' },
      fonts: { display: 'Red Hat Display:300;500;800', body: 'Red Hat Text:400;500', mono: 'Red Hat Mono:400' }, opts: { mat: 'brass' } },
    { name: 'Chrome', swatch: ['#e5e6e9', '#16171a', '#8a8f99'],
      vars: { bg: '#e4e5e8', surface: 'rgba(255,255,255,.6)', fg: '#16171a', muted: '#6c707a', accent: '#16171a', accent2: '#c7c9cf', line: 'rgba(22,23,26,.12)' },
      fonts: { display: 'Urbanist:300;600;800', body: 'Urbanist:400;500;600', mono: 'Red Hat Mono:400' }, opts: { mat: 'chrome' } },
    { name: 'Hologram', swatch: ['#05080c', '#38f3ff', '#9b7bff'],
      vars: { bg: '#05080c', surface: 'rgba(56,243,255,.05)', fg: '#d8fbff', muted: '#5f8c93', accent: '#38f3ff', accent2: '#9b7bff', line: 'rgba(56,243,255,.16)' },
      fonts: { display: 'Share Tech Mono:400', body: 'IBM Plex Sans:400;500', mono: 'Share Tech Mono:400' }, opts: { mat: 'holo' } },
  ],
  layout: { works: [15, 15] },
  shell(c) {
    const logo = c.img(c.P.logo);
    const layers = Array.from({ length: LAYERS }, (_, i) => `<img src="${c.esc(logo)}" alt="" draggable="false" style="--z:${i}">`).join('');
    return {
      bg: `<div class="fg-floor"></div>`,
      nav: `<div class="fg-obj" aria-hidden="true"><div class="fg-turn"><div class="fg-rings"><i></i><i></i></div><div class="fg-solid">${layers}</div></div><div class="fg-shadow"></div></div>
        <header class="fg-top"><button class="fg-brand" data-go="0" data-hover>${c.esc(c.name)}</button><nav class="fg-nav" aria-label="Sections">${c.nav({ num: true })}</nav>${c.menuBtn()}</header>
        <footer class="fg-foot"><div class="fg-cts">${c.contactLinks({ limit: 6 })}</div><p class="fg-hint">Drag to rotate</p></footer>
        ${c.drawer()}`,
    };
  },
  home(c) {
    const st = c.data.about?.stats || [];
    const ticker = c.roles.concat(c.roles).map((r) => `<span>${c.esc(r)}</span>`).join('');
    return `<div class="fg-hero">
      <dl class="fg-spec">${st.slice(0, 3).map((s) => `<div><dt>${c.esc(s.label)}</dt><dd>${c.esc(s.value)}</dd></div>`).join('')}${c.P.location ? `<div><dt>Based in</dt><dd>${c.esc(c.P.location)}</dd></div>` : ''}</dl>
      <div class="fg-title"><h1>${c.esc(c.first)} <b>${c.esc(c.last)}</b></h1><p>${c.esc(c.P.tagline || '')}</p></div>
      <div class="fg-ticker" aria-label="${c.esc(c.roles.join(', '))}"><div>${ticker}${ticker}</div></div>
    </div>`;
  },
  mount(c, root) {
    const obj = root.querySelector('.fg-obj'), turn = root.querySelector('.fg-turn');
    let ry = -20, rx = 0, vy = 0, dragging = false, lx = 0, ly = 0, dx = 0;
    const down = (e) => { if (!obj.contains(e.target) && !e.target.closest('.fg-hero')) return; if (e.target.closest('button,a')) return; dragging = true; lx = e.clientX; ly = e.clientY; vy = 0; root.classList.add('fg-drag'); };
    const move = (e) => { if (!dragging) return; dx = e.clientX - lx; vy = dx * 0.35; ry += vy; rx = Math.max(-35, Math.min(35, rx - (e.clientY - ly) * 0.2)); lx = e.clientX; ly = e.clientY; };
    const up = () => { dragging = false; root.classList.remove('fg-drag'); };
    root.addEventListener('pointerdown', down); window.addEventListener('pointermove', move); window.addEventListener('pointerup', up);
    const stop = c.loop((t) => {
      const p = c.pointer();
      if (!dragging) { vy *= 0.94; ry += vy + 0.18; rx += ((-p.y * 18) - rx) * 0.04; }
      turn.style.transform = `rotateX(${(rx + 8).toFixed(2)}deg) rotateY(${(ry + p.x * 22).toFixed(2)}deg)`;
    });
    return () => { stop(); root.removeEventListener('pointerdown', down); window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); };
  },
  css: () => `
.pf[data-t=forge]{--pad-t:6em;--pad-r:3.4em;--pad-l:3.4em;--pad-b:5em;--radius:12px;--grain-o:.06;background:radial-gradient(ellipse at 50% 40%,color-mix(in srgb,var(--bg) 80%,#fff 10%),var(--bg) 65%)}
.pf[data-t=forge][data-v="2"]{background:radial-gradient(ellipse at 50% 45%,#0b1a22,var(--bg) 60%)}
.fg-floor{position:absolute;left:-20%;right:-20%;bottom:-30%;height:70%;background-image:linear-gradient(var(--line) 1px,transparent 1px),linear-gradient(90deg,var(--line) 1px,transparent 1px);background-size:60px 60px;transform:perspective(700px) rotateX(68deg);transform-origin:top;mask-image:linear-gradient(transparent,#000 40%,transparent);opacity:.7}
.pf[data-v="1"] .fg-floor{opacity:.5}
/* the object */
.fg-obj{position:absolute;z-index:4;left:50%;top:44%;width:min(46vmin,520px);aspect-ratio:752/708;translate:-50% -50%;perspective:1400px;transition:left 1.2s var(--ease),top 1.2s var(--ease),width 1.2s var(--ease),opacity .6s;cursor:grab;pointer-events:auto}
.fg-drag .fg-obj{cursor:grabbing}
.pf:not([data-cur=home]) .fg-obj{left:calc(100% - 7vmin - 1em);top:calc(100% - 8vmin - 1em);width:14vmin;pointer-events:none;z-index:0;opacity:.85}
.fg-turn{position:absolute;inset:0;transform-style:preserve-3d;will-change:transform}
.fg-solid{position:absolute;inset:0;transform-style:preserve-3d}
.fg-solid img{position:absolute;inset:0;width:100%;height:100%;object-fit:contain;transform:translateZ(calc((var(--z) - ${LAYERS / 2}) * 1.6px));backface-visibility:visible;-webkit-user-drag:none}
.pf[data-v="0"] .fg-solid img{filter:sepia(.4) brightness(calc(.42 + var(--z) * .012)) saturate(1.3)}
.pf[data-v="0"] .fg-solid img:last-child{filter:brightness(1.12) saturate(1.15) drop-shadow(0 0 1px rgba(255,230,170,.6))}
.pf[data-v="0"] .fg-solid img:first-child{filter:brightness(.7)}
.pf[data-v="1"] .fg-solid img{filter:grayscale(1) brightness(calc(.18 + var(--z) * .012)) contrast(1.4)}
.pf[data-v="1"] .fg-solid img:last-child{filter:grayscale(1) brightness(.35) contrast(1.6)}
.pf[data-v="2"] .fg-solid img{filter:grayscale(1) brightness(3) sepia(1) hue-rotate(140deg) saturate(4);opacity:calc(.05 + var(--z) * .004)}
.pf[data-v="2"] .fg-solid img:last-child,.pf[data-v="2"] .fg-solid img:first-child{opacity:.9;filter:grayscale(1) brightness(3) sepia(1) hue-rotate(140deg) saturate(5) drop-shadow(0 0 8px #38f3ff)}
.fg-rings{position:absolute;inset:-22%;transform-style:preserve-3d}
.fg-rings i{position:absolute;inset:0;border-radius:50%;border:1px solid var(--line);transform:rotateX(78deg)}
.fg-rings i+i{inset:8%;border-color:color-mix(in srgb,var(--accent) 40%,transparent);transform:rotateX(78deg) rotateY(12deg);border-style:dashed}
.pf:not([data-cur=home]) .fg-rings{display:none}
.fg-shadow{position:absolute;left:10%;right:10%;bottom:-24%;height:12%;border-radius:50%;background:radial-gradient(closest-side,rgba(0,0,0,.45),transparent);filter:blur(4px)}
.pf[data-v="2"] .fg-shadow{background:radial-gradient(closest-side,rgba(56,243,255,.35),transparent)}
.pf[data-v="2"] .fg-obj::after{content:"";position:absolute;inset:-10%;background:repeating-linear-gradient(0deg,rgba(56,243,255,.06) 0 1px,transparent 1px 4px);pointer-events:none;animation:fgScan 3s linear infinite}
@keyframes fgScan{to{background-position:0 40px}}
.fg-top{position:absolute;z-index:20;inset:0 0 auto;display:flex;align-items:center;justify-content:space-between;padding:1.4em 2.2em}
.fg-brand{font-family:var(--f-display);font-weight:800;font-size:1.05em;letter-spacing:-.01em}
.pf[data-v="2"] .fg-brand{font-weight:400;letter-spacing:.1em;text-transform:uppercase}
.fg-nav{display:flex;gap:.3em;font-size:.82em}
.fg-nav .pf-nav-a{padding:.55em 1em;border-radius:999px;border:1px solid transparent;color:var(--muted);transition:all .3s}
.fg-nav .pf-nav-a .pf-nav-n{color:var(--accent);opacity:1}
.fg-nav .pf-nav-a.is-cur{border-color:var(--line);color:var(--fg);background:var(--surface)}
.fg-nav .pf-nav-a:hover{color:var(--fg)}
.fg-foot{position:absolute;z-index:20;left:2.2em;right:2.2em;bottom:1.4em;display:flex;justify-content:space-between;align-items:center}
.fg-cts{display:flex;gap:.3em}
.fg-cts .pf-ct{width:2.4em;height:2.4em;border-radius:50%;border:1px solid var(--line);color:var(--muted)}
.fg-cts .pf-ct:hover{color:var(--bg);background:var(--accent);border-color:var(--accent)}
.fg-hint{font-family:var(--f-mono);font-size:.72em;color:var(--muted);transition:opacity .4s}
.pf:not([data-cur=home]) .fg-hint{opacity:0}
/* hero */
.fg-hero{position:absolute;inset:0;display:grid;grid-template-rows:1fr auto auto;pointer-events:auto}
.fg-spec{position:absolute;left:0;top:8%;display:grid;gap:1.1em;font-size:.8em}
.fg-spec div{display:flex;flex-direction:column;gap:.15em;border-left:1px solid var(--accent);padding-left:.8em;opacity:0;transform:translateX(-1em);transition:all .8s var(--out)}
.fg-spec div:nth-child(2){transition-delay:.1s}.fg-spec div:nth-child(3){transition-delay:.2s}.fg-spec div:nth-child(4){transition-delay:.3s}
.fg-spec dt{color:var(--muted);font-size:.86em}
.fg-spec dd{font-family:var(--f-display);font-size:1.5em;font-weight:500}
.fg-title{grid-row:2;text-align:center;display:flex;flex-direction:column;align-items:center;gap:.6em;opacity:0;transform:translateY(1em);transition:all 1s var(--out) .5s}
.fg-title h1{font-family:var(--f-display);font-weight:300;font-size:clamp(2em,6vmin,4.6em);letter-spacing:-.02em;line-height:1}
.fg-title h1 b{font-weight:800}
.pf[data-v="2"] .fg-title h1,.pf[data-v="2"] .fg-title h1 b{font-weight:400;letter-spacing:.06em;text-transform:uppercase}
.fg-title p{max-width:52ch;color:var(--muted);font-size:.9em}
.fg-ticker{grid-row:3;overflow:hidden;margin:1.4em calc(var(--pad-r) * -1) 0;border-top:1px solid var(--line);border-bottom:1px solid var(--line);padding:.6em 0;mask-image:linear-gradient(90deg,transparent,#000 12%,#000 88%,transparent)}
.fg-ticker div{display:flex;gap:3em;width:max-content;animation:fgTick 26s linear infinite;font-family:var(--f-display);font-size:.95em;color:var(--muted)}
.fg-ticker span::before{content:"";display:inline-block;width:.45em;height:.45em;margin-right:1em;background:var(--accent);transform:rotate(45deg);vertical-align:middle}
@keyframes fgTick{to{transform:translateX(-50%)}}
.pf-sec-home.is-on .fg-spec div,.pf[data-static] .fg-spec div,.pf-sec-home.is-on .fg-title,.pf[data-static] .fg-title{opacity:1;transform:none}
/* sections */
.pf[data-t=forge] .pf-head-n{color:var(--accent)}
.pf[data-t=forge] .pf-head-t{font-weight:800;letter-spacing:-.03em}
.pf[data-t=forge][data-v="2"] .pf-head-t{font-weight:400;text-transform:uppercase;letter-spacing:.06em}
.pf[data-t=forge] .pf-card,.pf[data-t=forge] .pf-xp,.pf[data-t=forge] .pf-edu,.pf[data-t=forge] .pf-skill,.pf[data-t=forge] .pf-port-item{background:var(--surface);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px)}
.pf[data-t=forge] .pf-card{transform-style:preserve-3d}
.pf[data-t=forge] .pf-card:hover{transform:perspective(800px) rotateX(4deg) translateY(-4px)}
.pf[data-t=forge] .pf-chip[aria-pressed=true],.pf[data-t=forge] .pf-tab[aria-selected=true]{background:var(--accent);border-color:var(--accent);color:var(--bg)}
.pf[data-t=forge][data-v="1"] .pf-chip[aria-pressed=true],.pf[data-t=forge][data-v="1"] .pf-tab[aria-selected=true]{color:#fff}
.pf[data-t=forge] .pf-btn{background:var(--accent);color:var(--bg)}
.pf[data-t=forge][data-v="1"] .pf-btn{color:#fff}
.pf[data-t=forge] .pf-btn-ghost{background:transparent;color:var(--fg)}
.pf[data-t=forge][data-v="2"] .pf-card-media img{filter:grayscale(1) sepia(.3) hue-rotate(140deg)}
.pf[data-t=forge] .pf-port-t{font-weight:800}
/* responsive */
.pf[data-w=sm] .fg-nav,.pf[data-w=xs] .fg-nav{display:none}
.pf[data-w=sm] .pf-burger,.pf[data-w=xs] .pf-burger{display:block}
.pf[data-w=xs]{--pad-r:1.2em;--pad-l:1.2em}
.pf[data-w=xs] .fg-top{padding:1em 1.1em}
.pf[data-w=xs] .fg-foot{left:1.1em;right:1.1em;bottom:1em}
.pf[data-w=xs] .fg-hint{display:none}
.pf[data-w=xs]:not([data-cur=home]) .fg-obj,.pf[data-h=tiny]:not([data-cur=home]) .fg-obj{opacity:0}
.pf[data-o=p] .fg-obj{width:min(70vw,44vh);top:38%}
.pf[data-o=p] .fg-spec{top:0;grid-template-columns:repeat(2,auto);gap:.6em 1.4em}
.pf[data-o=p] .fg-spec div:nth-child(n+3){display:none}
.pf[data-h=tiny] .fg-spec,.pf[data-h=tiny] .fg-title p,.pf[data-h=tiny] .fg-ticker{display:none}
.pf[data-h=tiny] .fg-obj{width:42vh;top:42%}
.pf[data-h=tiny] .fg-top{padding:.5em 1.4em}
.pf[data-h=tiny] .fg-foot{bottom:.5em}
`,
};
