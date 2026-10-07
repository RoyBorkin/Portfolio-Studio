/*! Portfolio Studio. Copyright (c) 2026 Roy Borkin. All rights reserved. Unauthorized copying, modification or distribution is prohibited without written permission. */
// 04 — Runway : fashion-slider energy. Every section owns a color, the page slides sideways like a
// lookbook, and the current section name runs up the left edge as a giant vertical word.
export default {
  id: 'runway',
  name: 'Runway',
  blurb: 'Lookbook slider: each section has its own color and a giant vertical title.',
  transition: 'slide',
  axis: 'x',
  variants: [
    { name: 'Chroma', swatch: ['#2343b5', '#e8622a', '#e7a9ae'],
      vars: { bg: '#2343b5', surface: 'rgba(255,255,255,.12)', fg: '#ffffff', muted: 'rgba(255,255,255,.7)', accent: '#ffffff', accent2: '#111111', line: 'rgba(255,255,255,.28)' },
      fonts: { display: 'Dela Gothic One:400', body: 'DM Sans:400;500;700', mono: 'DM Mono:400' },
      opts: { palette: ['#2343b5', '#e2622b', '#d98b93', '#7a62b8', '#1f8a70'] } },
    { name: 'Moto', swatch: ['#3a3a3c', '#ff6a13', '#f2f2f2'],
      vars: { bg: '#38383a', surface: 'rgba(255,255,255,.06)', fg: '#f2f2f2', muted: '#a3a3a6', accent: '#ff6a13', accent2: '#1d1d1f', line: 'rgba(255,255,255,.14)' },
      fonts: { display: 'Saira Condensed:600;800', body: 'DM Sans:400;500;700', mono: 'DM Mono:400' },
      opts: { palette: ['#3a3a3c', '#303032', '#2a2a2c', '#333336', '#3c3b3a'] } },
    { name: 'Lilac', swatch: ['#d9cde4', '#1d1b26', '#8a3ffc'],
      vars: { bg: '#d9cde4', surface: 'rgba(255,255,255,.5)', fg: '#1d1b26', muted: '#5b5866', accent: '#8a3ffc', accent2: '#1d1b26', line: 'rgba(29,27,38,.14)' },
      fonts: { display: 'Syne:700;800', body: 'DM Sans:400;500;700', mono: 'DM Mono:400' },
      opts: { palette: ['#d9cde4', '#ecd5cf', '#cbd8e8', '#e8e1c9', '#cfe3d4'] } },
  ],
  layout: { works: [15, 16] },
  shell(c) {
    return {
      bg: `<div class="rw-tint"></div><div class="rw-ghost" aria-hidden="true">${c.esc((c.first[0] || '') + (c.last[0] || ''))}</div>`,
      nav: `<header class="rw-top"><button class="rw-brand" data-go="0" data-hover>${c.logo()}</button><nav class="rw-nav" aria-label="Sections">${c.nav()}</nav><button class="rw-ct-btn" data-contact data-hover>${c.I('email')}<span>Contact</span></button>${c.menuBtn()}</header>
        <aside class="rw-side" aria-hidden="true"><div class="rw-dots">${c.secs.map((s) => `<a data-go="${s.i}" href="#${s.id}" tabindex="-1"></a>`).join('')}</div><div class="rw-word"><div class="rw-word-in">${c.secs.map((s) => `<span>${c.esc(s.label)}</span>`).join('')}</div></div></aside>
        <footer class="rw-foot"><div class="rw-cts">${c.contactLinks({ limit: 5 })}</div><div class="rw-arrows"><button data-prev aria-label="Previous section" data-hover>${c.I('arrowLeft')}</button><span class="rw-k"><b>01</b> / ${c.pad2(c.secs.length)}</span><button data-next aria-label="Next section" data-hover>${c.I('arrow')}</button></div></footer>
        ${c.drawer()}`,
    };
  },
  home(c) {
    const cut = c.img(c.P.cutout) || c.img(c.P.photo);
    const st = (c.data.about?.stats || [])[0];
    return `<div class="rw-hero">
      <figure class="rw-fig"><img src="${c.esc(cut)}" alt="${c.esc(c.name)}" draggable="false"></figure>
      <div class="rw-info">
        <h1 class="rw-name">${c.esc(c.first)}<br>${c.esc(c.last)}</h1>
        <dl class="rw-credits"><div><dt>Role</dt><dd>${c.esc(c.roles.join(', '))}</dd></div><div><dt>Based in</dt><dd>${c.esc(c.P.location || '')}</dd></div>${c.P.status ? `<div><dt>Now</dt><dd>${c.esc(c.P.status)}</dd></div>` : ''}</dl>
        ${st ? `<p class="rw-big"><b>${c.esc(st.value)}</b><span>${c.esc(st.label)}</span></p>` : ''}
        <div class="rw-split">${c.data.about?.resume?.url ? `<button data-open="resume" data-hover>${c.esc(c.data.about.resume.label || 'Resume')}</button>` : ''}${c.sec('works') ? `<button data-go="${c.sec('works').i}" data-hover>${c.esc(c.sec('works').label)}</button>` : ''}</div>
      </div>
      <p class="rw-tag">${c.esc(c.P.tagline || '')}</p>
    </div>`;
  },
  onEnter(c, i, prev, root) {
    const pal = c.opt('palette', []);
    const over = c.data.theme?.overrides?.bg;
    root.style.setProperty('--rw-bg', over && i === 0 ? over : pal[i % pal.length] || 'var(--bg)');
    root.querySelector('.rw-k b').textContent = c.pad2(i + 1);
    root.style.setProperty('--k', i);
  },
  onLeave(c, from, to, root) { const pal = c.opt('palette', []); root.style.setProperty('--rw-bg', pal[to % pal.length]); root.style.setProperty('--k', to); },
  css: () => `
.pf[data-t=runway]{--pad-t:5.6em;--pad-r:3.6em;--pad-l:8.6em;--pad-b:5.2em;--radius:18px;--grain-o:.06;background:var(--rw-bg,var(--bg));transition:background-color 1s var(--ease)}
.pf[data-t=runway] .pf-sec{background:transparent}
.rw-tint{position:absolute;inset:0;background:radial-gradient(ellipse at calc(50% + var(--mx)*10%) 40%,rgba(255,255,255,.18),transparent 60%)}
.pf[data-v="1"] .rw-tint{background:radial-gradient(ellipse at calc(50% + var(--mx)*10%) 45%,rgba(255,255,255,.12),transparent 55%)}
.rw-ghost{position:absolute;right:-4vw;bottom:-14vh;font-family:var(--f-display);font-size:62vh;line-height:.8;color:transparent;-webkit-text-stroke:2px var(--line);transform:translate(calc(var(--mx)*-2vw),calc(var(--k,0) * -3vh));transition:transform 1.2s var(--ease);letter-spacing:-.04em}
.pf[data-v="1"] .rw-ghost{-webkit-text-stroke:2px rgba(255,106,19,.18)}
.rw-top{position:absolute;z-index:20;inset:0 0 auto;display:flex;align-items:center;gap:2.4em;padding:1.3em 2em 1.3em 2.2em;font-size:.84em}
.rw-brand .pf-logo{height:2em;filter:brightness(0) invert(1)}
.pf[data-v="2"] .rw-brand .pf-logo{filter:brightness(0)}
.rw-nav{display:flex;gap:1.8em}
.rw-nav .pf-nav-a{opacity:.65;position:relative}
.rw-nav .pf-nav-a.is-cur{opacity:1}
.rw-nav .pf-nav-a.is-cur::after{content:"";position:absolute;left:0;bottom:-.5em;width:1.2em;height:2px;background:var(--accent)}
.rw-ct-btn{margin-left:auto;display:flex;align-items:center;gap:.5em;padding:.55em 1em;border-radius:999px;border:1px solid var(--line);transition:background-color .3s,color .3s}
.rw-ct-btn:hover{background:var(--fg);color:var(--rw-bg,var(--bg))}
.rw-side{position:absolute;z-index:15;left:1.8em;top:5.6em;bottom:4.8em;display:flex;gap:1.1em}
.rw-dots{display:flex;flex-direction:column;justify-content:space-between;padding:.4em 0}
.rw-dots a{width:1.1em;height:1.1em;border-radius:50%;border:2px solid var(--fg);opacity:.45;transition:opacity .3s,transform .4s var(--out),background-color .3s;pointer-events:auto}
.rw-dots a.is-cur{opacity:1;background:var(--fg);transform:scale(1.15)}
.rw-word{position:relative;width:min(8.5vh,4.6em);overflow:hidden}
.rw-word-in{position:absolute;inset:0;transform:translateY(calc(var(--k,0) * -100%));transition:transform 1s var(--ease)}
.rw-word span{display:flex;height:100%;align-items:center;justify-content:center;writing-mode:vertical-rl;transform:rotate(180deg);font-family:var(--f-display);font-size:min(8.5vh,4.6em);line-height:1;text-transform:uppercase;white-space:nowrap;letter-spacing:.01em}
.pf[data-v="1"] .rw-word span{font-weight:800;letter-spacing:.04em}
.rw-foot{position:absolute;z-index:20;left:8.6em;right:2em;bottom:1.3em;display:flex;align-items:center;justify-content:space-between}
.rw-cts{display:flex;gap:.25em}
.rw-cts .pf-ct{width:2.3em;height:2.3em;border-radius:50%;opacity:.8}
.rw-cts .pf-ct:hover{opacity:1;background:var(--fg);color:var(--rw-bg,var(--bg))}
.rw-arrows{display:flex;align-items:center;gap:.9em;font-family:var(--f-mono);font-size:.8em}
.rw-arrows button{width:2.8em;height:2.8em;border-radius:50%;border:1px solid var(--line);display:grid;place-items:center;transition:background-color .3s,color .3s}
.rw-arrows button:hover{background:var(--fg);color:var(--rw-bg,var(--bg))}
/* hero */
.rw-hero{position:absolute;inset:0;display:grid;grid-template-columns:1.25fr 1fr;align-items:end}
.rw-fig{position:absolute;left:0;bottom:calc(var(--pad-b) * -1);width:min(54%,calc((100% + var(--pad-b)) * 1.05));aspect-ratio:1606/1500;transform:translate(calc(var(--mx) * -14px),6%) scale(.96);opacity:0;transition:transform 1.4s var(--out),opacity 1s}
.rw-fig img{width:100%;height:100%;object-fit:contain;object-position:bottom;filter:drop-shadow(0 30px 40px rgba(0,0,0,.25))}
.pf[data-v="1"] .rw-fig img{filter:grayscale(.2) drop-shadow(0 30px 40px rgba(0,0,0,.4))}
.rw-info{grid-column:2;align-self:center;display:flex;flex-direction:column;gap:1.3em;z-index:2;padding-left:1em}
.rw-name{font-family:var(--f-display);font-weight:400;font-size:clamp(2em,6vmin,4.6em);line-height:.95;text-transform:uppercase;letter-spacing:-.01em}
.pf[data-v="1"] .rw-name{font-weight:800;font-size:clamp(2.6em,8vmin,6em);line-height:.86}
.pf[data-v="2"] .rw-name{font-weight:800;text-transform:none;letter-spacing:-.03em}
.rw-credits{display:grid;gap:.6em;font-size:.82em}
.rw-credits div{display:grid;grid-template-columns:6.5em 1fr;gap:1em}
.rw-credits dt{opacity:.65}
.rw-big{display:flex;align-items:baseline;gap:.6em}
.rw-big b{font-family:var(--f-display);font-weight:400;font-size:clamp(1.8em,4.6vmin,3.4em);line-height:1}
.rw-big span{font-size:.8em;opacity:.7}
.rw-split{display:flex;max-width:24em}
.rw-split button{flex:1;padding:.95em 1em;font-weight:700;font-size:.86em;text-align:center;background:rgba(255,255,255,.18);transition:background-color .3s,color .3s}
.rw-split button:last-child{background:var(--fg);color:var(--rw-bg,var(--bg))}
.pf[data-v="1"] .rw-split button:last-child{background:var(--accent);color:#fff}
.pf[data-v="2"] .rw-split button{background:rgba(255,255,255,.55)}
.pf[data-v="2"] .rw-split button:last-child{background:var(--fg);color:#fff}
.rw-split button:hover{filter:brightness(1.1)}
.rw-tag{position:absolute;right:0;top:0;max-width:30ch;text-align:right;font-size:.82em;opacity:.8}
.rw-info>*{opacity:0;transform:translateX(2em);transition:opacity .8s,transform 1s var(--out)}
.rw-info>:nth-child(2){transition-delay:.1s}.rw-info>:nth-child(3){transition-delay:.2s}.rw-info>:nth-child(4){transition-delay:.3s}
.pf-sec-home.is-on .rw-info>*,.pf[data-static] .rw-info>*{opacity:1;transform:none}
.pf-sec-home.is-on .rw-fig,.pf[data-static] .rw-fig{opacity:1;transform:translate(calc(var(--mx) * -14px),0)}
/* sections */
.pf[data-t=runway] .pf-head-n{display:none}
.pf[data-t=runway] .pf-head-t{font-weight:400;text-transform:uppercase;font-size:clamp(1.6em,4.2vmin,3.2em)}
.pf[data-t=runway][data-v="1"] .pf-head-t{font-weight:800}
.pf[data-t=runway][data-v="2"] .pf-head-t{text-transform:none;font-weight:800}
.pf[data-t=runway] .pf-card,.pf[data-t=runway] .pf-xp,.pf[data-t=runway] .pf-edu,.pf[data-t=runway] .pf-skill,.pf[data-t=runway] .pf-port-item{background:var(--surface);border-color:transparent;backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px)}
.pf[data-t=runway] .pf-card:hover{transform:translateY(-6px) rotate(-.6deg)}
.pf[data-t=runway] .pf-card-media{margin:.45em .45em 0;border-radius:calc(var(--radius) - 6px)}
.pf[data-t=runway] .pf-chip,.pf[data-t=runway] .pf-tab{border-color:var(--line)}
.pf[data-t=runway] .pf-chip[aria-pressed=true],.pf[data-t=runway] .pf-tab[aria-selected=true]{background:var(--fg);color:var(--rw-bg,var(--bg))}
.pf[data-t=runway][data-v="1"] .pf-chip[aria-pressed=true],.pf[data-t=runway][data-v="1"] .pf-tab[aria-selected=true]{background:var(--accent);border-color:var(--accent);color:#fff}
.pf[data-t=runway] .pf-btn{background:var(--fg);color:var(--rw-bg,var(--bg))}
.pf[data-t=runway] .pf-btn-ghost{background:transparent;color:var(--fg)}
.pf[data-t=runway] .pf-port-t{font-weight:400;text-transform:uppercase}
.pf[data-t=runway] .pf-stats dd{font-weight:400}
.pf[data-t=runway] .pf-ph{background:rgba(255,255,255,.14);color:var(--fg)}
.pf[data-t=runway][data-v="2"] .pf-ph{background:rgba(255,255,255,.5)}
.pf[data-t=runway] .pf-modal-box{background:var(--rw-bg,var(--bg))}
/* responsive */
.pf[data-w=md] .rw-nav{gap:1.1em}
.pf[data-w=sm] .rw-nav,.pf[data-w=xs] .rw-nav,.pf[data-w=xs] .rw-ct-btn span{display:none}
.pf[data-w=sm] .pf-burger,.pf[data-w=xs] .pf-burger{display:block}
.pf[data-w=sm] .rw-ct-btn,.pf[data-w=xs] .rw-ct-btn{margin-left:auto}
.pf[data-w=xs]{--pad-l:4.2em;--pad-r:1.2em}
.pf[data-w=xs] .rw-side{left:.9em}
.pf[data-w=xs] .rw-word{width:2.4em}
.pf[data-w=xs] .rw-word span{font-size:2.4em}
.pf[data-w=xs] .rw-dots{display:none}
.pf[data-w=xs] .rw-foot{left:1.1em;right:1.1em}
.pf[data-w=xs] .rw-top{padding:1em 1.1em}
.pf[data-o=p] .rw-hero{grid-template-columns:1fr;align-items:start}
.pf[data-o=p] .rw-info{grid-column:1;padding-left:0;gap:.9em;align-self:start}
.pf[data-o=p] .rw-credits,.pf[data-o=p] .rw-tag{display:none}
.pf[data-o=p] .rw-fig{left:auto;right:-34%;width:150%}
.pf[data-o=p] .rw-split{max-width:16em}
.pf[data-h=tiny] .rw-credits,.pf[data-h=tiny] .rw-big,.pf[data-h=tiny] .rw-tag{display:none}
.pf[data-h=tiny] .rw-top{padding:.5em 1.2em}
.pf[data-h=tiny] .rw-side{top:3.2em;bottom:3em}
.pf[data-h=tiny] .rw-foot{bottom:.5em}
`,
};
