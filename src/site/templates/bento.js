/*! Portfolio Studio. Copyright (c) 2026 Roy Borkin. All rights reserved. Unauthorized copying, modification or distribution is prohibited without written permission. */
// 06 — Bento : the home screen is a grid of bold tiles (name, photo, sketch, stat, latest works,
// contact) that spring in and tilt toward the pointer. Product-card energy, strong color.
export default {
  id: 'bento',
  name: 'Bento',
  blurb: 'Bold tile grid: photo, sketch, live stats and contact, tilting with the mouse.',
  transition: 'shutter',
  variants: [
    { name: 'Pantone', swatch: ['#ffc400', '#141414', '#ffffff'],
      vars: { bg: '#ffc400', surface: '#141414', fg: '#141414', muted: '#5a4a10', accent: '#141414', accent2: '#ffffff', line: 'rgba(20,20,20,.16)', tile: '#ffffff', tileFg: '#141414', ink: '#141414', inkFg: '#ffc400' },
      fonts: { display: 'Archivo:800;900', body: 'Instrument Sans:400;500;600;700', mono: 'Martian Mono:400' } },
    { name: 'Sage', swatch: ['#c6d2bd', '#f06a35', '#26302a'],
      vars: { bg: '#c7d3be', surface: '#26302a', fg: '#26302a', muted: '#55624f', accent: '#f06a35', accent2: '#f4f1e8', line: 'rgba(38,48,42,.16)', tile: '#f4f1e8', tileFg: '#26302a', ink: '#26302a', inkFg: '#f4f1e8' },
      fonts: { display: 'Fraunces:600;800', body: 'Instrument Sans:400;500;600;700', mono: 'Martian Mono:400' } },
    { name: 'Impact', swatch: ['#e8e8e6', '#ff5a1f', '#2b2e33'],
      vars: { bg: '#e7e7e5', surface: '#2b2e33', fg: '#2b2e33', muted: '#6c6f74', accent: '#ff5a1f', accent2: '#ffffff', line: 'rgba(43,46,51,.14)', tile: '#ffffff', tileFg: '#2b2e33', ink: '#2b2e33', inkFg: '#ffffff' },
      fonts: { display: 'Space Grotesk:500;700', body: 'Instrument Sans:400;500;600;700', mono: 'Martian Mono:400' } },
  ],
  layout: { works: [15, 15] },
  shell(c) {
    return {
      nav: `<header class="bt-top"><button class="bt-brand" data-go="0" data-hover>${c.logo()}<span>${c.esc(c.name)}</span></button><nav class="bt-nav" aria-label="Sections">${c.nav()}</nav>${c.menuBtn()}</header>${c.drawer()}`,
    };
  },
  home(c) {
    const P = c.P, d = c.data;
    const photo = c.img(P.photo), sketch = c.img(P.sketch);
    const st = d.about?.stats || [];
    const works = [...(d.works?.items || [])].filter((w) => w.image).sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0)).slice(0, 5);
    const email = c.contacts.find((x) => x.type === 'email');
    const ws = c.sec('works');
    return `<div class="bt-grid">
      <div class="bt-t bt-name" data-tilt style="--i:0"><p class="bt-hi">${c.esc(P.intro || 'Hi, my name is')}</p><h1>${c.esc(c.first)}<br>${c.esc(c.last)}</h1><ul class="bt-roles">${c.roles.map((r) => `<li>${c.esc(r)}</li>`).join('')}</ul></div>
      <figure class="bt-t bt-photo" data-tilt style="--i:1"><img src="${c.esc(photo)}" alt="${c.esc(c.name)}" draggable="false"><figcaption>${c.esc(P.location || '')}</figcaption></figure>
      ${sketch ? `<figure class="bt-t bt-sketch" data-tilt style="--i:2"><img src="${c.esc(sketch)}" alt="" draggable="false"></figure>` : ''}
      <div class="bt-t bt-stat" data-tilt style="--i:3">${st.slice(0, 2).map((s) => `<div><strong data-count="${c.esc(s.value)}">${c.esc(s.value)}</strong><span>${c.esc(s.label)}</span></div>`).join('')}</div>
      ${ws && works.length ? `<button class="bt-t bt-works" data-tilt data-go="${ws.i}" style="--i:4" data-hover><span class="bt-reel">${works.map((w, i) => `<img src="${c.esc(c.img(w.image))}" alt="" style="--j:${i}" draggable="false">`).join('')}</span><span class="bt-works-l"><b>${c.esc(ws.label)}</b>${c.I('arrow')}</span></button>` : ''}
      <div class="bt-t bt-talk" data-tilt style="--i:5"><p>${c.esc(P.tagline || '')}</p><div class="bt-cts">${c.contactLinks({ limit: 5 })}</div>${email ? `<button class="bt-mail" data-copy="${c.esc(email.value)}" data-hover>${c.I('copy')}<span>${c.esc(email.value)}</span></button>` : ''}</div>
    </div>`;
  },
  mount(c, root) {
    const reduce = root.dataset.motion === 'off' || root.dataset.static;
    // tilt toward pointer
    const tiles = [...root.querySelectorAll('[data-tilt]')];
    const mv = (e) => { tiles.forEach((t) => { const r = t.getBoundingClientRect(); const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5; const near = Math.abs(x) < 0.7 && Math.abs(y) < 0.7; t.style.setProperty('--rx', near ? (-y * 7).toFixed(2) + 'deg' : '0deg'); t.style.setProperty('--ry', near ? (x * 7).toFixed(2) + 'deg' : '0deg'); }); };
    if (!reduce) window.addEventListener('pointermove', mv, { passive: true });
    // count up stats
    const counts = [...root.querySelectorAll('[data-count]')];
    const run = () => counts.forEach((el) => { const m = el.dataset.count.match(/^(\D*)(\d+)(.*)$/); if (!m || reduce) return; const end = +m[2]; const t0 = performance.now(); const f = (now) => { const p = Math.min(1, (now - t0) / 1400); el.textContent = m[1] + Math.round(end * (1 - Math.pow(1 - p, 3))) + m[3]; if (p < 1) requestAnimationFrame(f); }; requestAnimationFrame(f); });
    setTimeout(run, 500);
    // works reel
    const reel = root.querySelector('.bt-reel'); let k = 0;
    const imgs = reel ? [...reel.children] : [];
    const show = () => imgs.forEach((im, j) => im.classList.toggle('on', j === k % imgs.length));
    show();
    const iv = !reduce && imgs.length > 1 ? setInterval(() => { k++; show(); }, 2600) : 0;
    return () => { window.removeEventListener('pointermove', mv); clearInterval(iv); };
  },
  css: () => `
.pf[data-t=bento]{--pad-t:5.2em;--pad-r:1.6em;--pad-l:1.6em;--pad-b:1.6em;--radius:26px;--grain-o:.04;--cursor:var(--ink)}
.bt-top{position:absolute;z-index:20;inset:0 0 auto;display:flex;align-items:center;justify-content:space-between;padding:1.1em 1.6em;gap:1em}
.bt-brand{display:flex;align-items:center;gap:.7em;font-weight:700;font-size:.92em}
.bt-brand .pf-logo{height:1.9em;filter:brightness(0)}
.pf[data-v="1"] .bt-brand .pf-logo{filter:brightness(0) saturate(0) opacity(.85)}
.bt-nav{display:flex;gap:.3em;background:var(--ink);color:var(--inkFg);padding:.32em;border-radius:999px;font-size:.84em}
.bt-nav .pf-nav-a{padding:.5em 1em;border-radius:999px;transition:background-color .3s,color .3s}
.bt-nav .pf-nav-a.is-cur{background:var(--inkFg);color:var(--ink)}
.pf[data-v="1"] .bt-nav .pf-nav-a.is-cur,.pf[data-v="2"] .bt-nav .pf-nav-a.is-cur{background:var(--accent);color:#fff}
/* grid */
.bt-grid{flex:1;display:grid;gap:.9em;grid-template-columns:1.25fr .9fr .8fr 1fr;grid-template-rows:1fr 1fr;grid-template-areas:"name photo sketch stat" "name photo works talk";perspective:1400px}
.bt-t{position:relative;border-radius:var(--radius);overflow:hidden;background:var(--tile);color:var(--tileFg);padding:1.3em;display:flex;flex-direction:column;min-width:0;min-height:0;transform:rotateX(var(--rx,0)) rotateY(var(--ry,0));transition:transform .5s var(--out),opacity .6s,scale .8s var(--out);opacity:0;scale:.86;transition-delay:calc(var(--i) * 70ms),calc(var(--i) * 70ms),calc(var(--i) * 70ms)}
.pf-sec-home.is-on .bt-t,.pf[data-static] .bt-t{opacity:1;scale:1}
.pf-sec-home.is-on .bt-t:hover{transition-delay:0s}
.bt-name{grid-area:name;background:var(--ink);color:var(--inkFg);justify-content:space-between}
.pf[data-v="1"] .bt-name{background:var(--accent);color:#fff}
.bt-hi{font-size:.86em;opacity:.8}
.bt-name h1{font-family:var(--f-display);font-weight:900;font-size:clamp(2.4em,8.4vmin,6.6em);line-height:.86;letter-spacing:-.04em}
.pf[data-v="1"] .bt-name h1{font-weight:800;letter-spacing:-.02em}
.pf[data-v="2"] .bt-name h1{font-weight:700;letter-spacing:-.05em}
.bt-roles{display:flex;flex-wrap:wrap;gap:.4em}
.bt-roles li{font-size:.8em;padding:.35em .8em;border-radius:999px;border:1px solid currentColor}
.bt-photo{grid-area:photo;padding:0}
.bt-photo img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:50% 30%;transform:scale(1.08) translate(calc(var(--mx)*-2%),calc(var(--my)*-2%));transition:transform .9s var(--out)}
.bt-photo figcaption{position:absolute;left:1em;bottom:1em;padding:.4em .8em;border-radius:999px;background:var(--tile);color:var(--tileFg);font-size:.76em;font-weight:600}
.bt-sketch{grid-area:sketch;padding:0;background:var(--accent2)}
.pf[data-v="0"] .bt-sketch{background:#fff}
.bt-sketch img{position:absolute;inset:6%;width:88%;height:88%;object-fit:contain;transition:transform .8s var(--out)}
.bt-sketch:hover img{transform:rotate(-6deg) scale(1.06)}
.bt-stat{grid-area:stat;justify-content:space-between;background:var(--ink);color:var(--inkFg)}
.pf[data-v="2"] .bt-stat{background:var(--accent);color:#fff}
.bt-stat div{display:flex;flex-direction:column}
.bt-stat strong{font-family:var(--f-display);font-weight:900;font-size:clamp(2em,6vmin,4.4em);line-height:.95;letter-spacing:-.03em}
.bt-stat span{font-size:.78em;opacity:.8}
.bt-works{grid-area:works;padding:0;text-align:left}
.bt-reel{position:absolute;inset:0}
.bt-reel img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:0;transform:scale(1.1);transition:opacity .9s,transform 2.6s linear}
.bt-reel img.on{opacity:1;transform:scale(1)}
.bt-works-l{position:absolute;left:.8em;right:.8em;bottom:.8em;display:flex;justify-content:space-between;align-items:center;padding:.6em .6em .6em 1em;border-radius:999px;background:var(--tile);color:var(--tileFg);font-size:.86em}
.bt-works-l svg{width:2em;height:2em;padding:.45em;border-radius:50%;background:var(--ink);color:var(--inkFg);transition:transform .4s var(--out)}
.pf[data-v="1"] .bt-works-l svg,.pf[data-v="2"] .bt-works-l svg{background:var(--accent);color:#fff}
.bt-works:hover .bt-works-l svg{transform:rotate(-45deg)}
.bt-talk{grid-area:talk;justify-content:space-between;gap:.8em}
.bt-talk p{font-size:.92em;line-height:1.4;font-weight:500;display:-webkit-box;-webkit-line-clamp:4;-webkit-box-orient:vertical;overflow:hidden}
.bt-cts{display:flex;flex-wrap:wrap;gap:.3em}
.bt-cts .pf-ct{width:2.3em;height:2.3em;border-radius:50%;background:color-mix(in srgb,var(--tileFg) 8%,transparent)}
.bt-cts .pf-ct:hover{background:var(--ink);color:var(--inkFg)}
.bt-mail{display:flex;align-items:center;gap:.5em;font-size:.78em;font-weight:600;padding:.6em .9em;border-radius:999px;background:var(--ink);color:var(--inkFg);min-width:0}
.pf[data-v="1"] .bt-mail,.pf[data-v="2"] .bt-mail{background:var(--accent);color:#fff}
.bt-mail span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
/* sections */
.pf[data-t=bento]{--pad-t:5.2em;--pad-b:1.6em}
.pf[data-t=bento] .pf-sec:not(.pf-sec-home) .pf-sec-in{background:var(--tile);color:var(--tileFg);border-radius:var(--radius);padding:1.4em 1.5em}
.pf[data-t=bento] .pf-head-n{display:none}
.pf[data-t=bento] .pf-head-t{font-weight:900;letter-spacing:-.04em;font-size:clamp(1.8em,5vmin,3.8em)}
.pf[data-t=bento][data-v="1"] .pf-head-t{font-weight:800;letter-spacing:-.02em}
.pf[data-t=bento] .pf-sec-in{--fg:var(--tileFg);--line:color-mix(in srgb,var(--tileFg) 14%,transparent);--surface:color-mix(in srgb,var(--tileFg) 5%,var(--tile))}
.pf[data-t=bento] .pf-card,.pf[data-t=bento] .pf-xp,.pf[data-t=bento] .pf-edu,.pf[data-t=bento] .pf-skill,.pf[data-t=bento] .pf-port-item{border:0;border-radius:calc(var(--radius) - 8px);background:var(--surface)}
.pf[data-t=bento] .pf-card:hover{transform:translateY(-4px) rotate(-1deg)}
.pf[data-t=bento] .pf-chip[aria-pressed=true],.pf[data-t=bento] .pf-tab[aria-selected=true]{background:var(--ink);color:var(--inkFg);border-color:var(--ink)}
.pf[data-t=bento][data-v="1"] .pf-chip[aria-pressed=true],.pf[data-t=bento][data-v="1"] .pf-tab[aria-selected=true],.pf[data-t=bento][data-v="2"] .pf-chip[aria-pressed=true],.pf[data-t=bento][data-v="2"] .pf-tab[aria-selected=true]{background:var(--accent);border-color:var(--accent);color:#fff}
.pf[data-t=bento] .pf-btn{background:var(--ink);color:var(--inkFg)}
.pf[data-t=bento][data-v="1"] .pf-btn,.pf[data-t=bento][data-v="2"] .pf-btn{background:var(--accent);color:#fff}
.pf[data-t=bento] .pf-btn-ghost{background:transparent;color:var(--tileFg)}
.pf[data-t=bento] .pf-stats dd{font-weight:900}
.pf[data-t=bento] .pf-port-t{font-weight:900;letter-spacing:-.03em}
.pf[data-t=bento] .pf-shutter i{background:var(--ink)}
.pf[data-t=bento][data-v="1"] .pf-shutter i,.pf[data-t=bento][data-v="2"] .pf-shutter i{background:var(--accent)}
.pf[data-t=bento] .pf-modal-box{background:var(--tile);color:var(--tileFg);--fg:var(--tileFg)}
/* responsive */
.pf[data-w=md] .bt-grid{grid-template-columns:1.2fr 1fr 1fr;grid-template-rows:1fr 1fr 1fr;grid-template-areas:"name photo sketch" "name photo stat" "works talk talk"}
.pf[data-w=sm] .bt-grid{grid-template-columns:1fr 1fr;grid-template-rows:1.3fr 1fr 1fr;grid-template-areas:"name photo" "sketch stat" "works talk"}
.pf[data-w=sm] .bt-nav,.pf[data-w=xs] .bt-nav{display:none}
.pf[data-w=sm] .pf-burger,.pf[data-w=xs] .pf-burger{display:block}
.pf[data-w=xs]{--pad-r:.8em;--pad-l:.8em;--pad-b:.8em;--pad-t:4.2em;--radius:20px}
.pf[data-w=xs] .bt-top{padding:.9em 1em}
.pf[data-w=xs] .bt-brand span{display:none}
.pf[data-w=xs] .bt-grid{gap:.55em;grid-template-columns:1fr 1fr;grid-template-rows:1.25fr 1fr .8fr .9fr;grid-template-areas:"name name" "photo sketch" "stat works" "talk talk"}
.pf[data-w=xs] .bt-t{padding:1em}
.pf[data-w=xs] .bt-name{flex-direction:row;align-items:flex-end;flex-wrap:wrap}
.pf[data-w=xs] .bt-name h1{font-size:13vw;width:100%}
.pf[data-w=xs] .bt-roles{font-size:.85em}
.pf[data-w=xs] .bt-hi{display:none}
.pf[data-w=xs] .bt-talk p{display:none}
.pf[data-w=xs] .bt-stat div+div{display:none}
.pf[data-w=xs] .pf-sec:not(.pf-sec-home) .pf-sec-in{padding:1em}
.pf[data-h=tiny] .bt-grid{grid-template-columns:1.4fr 1fr 1fr 1fr;grid-template-rows:1fr;grid-template-areas:"name photo works talk"}
.pf[data-h=tiny] .bt-sketch,.pf[data-h=tiny] .bt-stat,.pf[data-h=tiny] .bt-roles,.pf[data-h=tiny] .bt-talk p{display:none}
.pf[data-h=tiny] .bt-top{padding:.5em 1.2em}
.pf[data-h=tiny]{--pad-t:3.4em;--pad-b:.8em}
`,
};
