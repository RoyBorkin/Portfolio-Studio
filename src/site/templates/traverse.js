/*! Portfolio Studio. Copyright (c) 2026 Roy Borkin. All rights reserved. Unauthorized copying, modification or distribution is prohibited without written permission. */
// 07 — Traverse : dark, premium, quiet. A single framed stage with a right-hand rail of vertical
// social links, a ghosted section word behind everything, and a numbered slider at the bottom.
export default {
  id: 'traverse',
  name: 'Traverse',
  blurb: 'Dark premium stage: side rail, ghost words, slider progress.',
  transition: 'slide',
  variants: [
    { name: 'Graphite', swatch: ['#2a2c30', '#8fb3ff', '#f1f1f1'],
      vars: { bg: '#25272b', surface: '#2e3034', fg: '#f1f1f1', muted: '#9a9ca1', accent: '#8fb3ff', accent2: '#1d1f22', line: 'rgba(255,255,255,.1)' },
      fonts: { display: 'Jost:300;400;500', body: 'Jost:300;400;500', mono: 'IBM Plex Mono:400' }, opts: { hero: 'product' } },
    { name: 'Aer gold', swatch: ['#18191b', '#cc9932', '#ebe7df'],
      vars: { bg: '#18191b', surface: '#212225', fg: '#ebe7df', muted: '#8e8b85', accent: '#cc9932', accent2: '#101112', line: 'rgba(235,231,223,.1)' },
      fonts: { display: 'Outfit:300;500;700', body: 'Outfit:300;400;500', mono: 'IBM Plex Mono:400' }, opts: { hero: 'figure' } },
    { name: 'Brands', swatch: ['#26272b', '#ff4f1f', '#ffffff'],
      vars: { bg: '#232428', surface: '#2c2d32', fg: '#ffffff', muted: '#96979c', accent: '#ff4f1f', accent2: '#1b1c1f', line: 'rgba(255,255,255,.09)' },
      fonts: { display: 'Sora:200;400;800', body: 'Sora:300;400;500', mono: 'IBM Plex Mono:400' }, opts: { hero: 'brands' } },
  ],
  layout: { works: [15, 15] },
  shell(c) {
    return {
      bg: `<div class="tv-ghost" aria-hidden="true"><div class="tv-ghost-in">${c.secs.map((s) => `<span>${c.esc(s.id === 'home' ? c.last || s.label : s.label)}</span>`).join('')}</div></div><div class="tv-spot"></div>`,
      nav: `<header class="tv-top"><button class="tv-brand" data-go="0" data-hover>${c.esc(c.first)} ${c.esc(c.last)}<i>.</i></button><nav class="tv-nav" aria-label="Sections">${c.nav()}</nav></header>
        <aside class="tv-rail"><button class="tv-burger" data-drawer aria-label="Menu" data-hover><i></i><i></i><i></i></button><div class="tv-social">${c.contactLinks({ text: true, limit: 5 })}</div></aside>
        <footer class="tv-foot"><span class="tv-n"><b>${c.secs.map((s) => `<span>${s.n}</span>`).join('')}</b></span><span class="tv-total">${c.pad2(c.secs.length)}</span><span class="tv-bar"><i></i></span><div class="tv-arrows"><button data-prev aria-label="Previous section" data-hover>${c.I('arrowUp')}</button><button data-next aria-label="Next section" data-hover>${c.I('arrowDown')}</button></div></footer>
        ${c.drawer()}`,
    };
  },
  home(c) {
    const kind = c.opt('hero');
    const cut = c.img(c.P.cutout) || c.img(c.P.photo);
    const ws = c.sec('works');
    if (kind === 'brands') {
      return `<div class="tv-hero tv-b">
        <div class="tv-b-txt"><i class="tv-dash"></i><p class="tv-small">${c.esc(c.P.intro || '')}</p><p class="tv-mid"><b>${c.esc(c.first)}</b> ${c.esc(c.last)}.</p><h1 class="tv-outline" aria-label="${c.esc(c.roles[0] || '')}">${c.esc((c.roles[0] || '').split(' ').pop())}</h1><p class="tv-roles">${c.esc(c.roles.slice(1).join(' / '))}</p>${ws ? `<button class="tv-about" data-go="${ws.i}" data-hover><span>${c.esc(ws.label)}</span><i></i>${c.I('arrow')}</button>` : ''}</div>
        <div class="tv-b-img"><img src="${c.esc(cut)}" alt="${c.esc(c.name)}" draggable="false"><span class="tv-vert">${c.esc(c.last)}<em>.</em></span><button class="tv-sq" data-contact aria-label="Contact" data-hover>${c.I('arrow')}</button></div>
      </div>`;
    }
    return `<div class="tv-hero">
      <div class="tv-txt">
        <span class="tv-tab">${c.esc(c.P.role || c.roles[0] || '')}</span>
        <h1 class="tv-h">${c.esc(c.first)} ${c.esc(c.last)}.</h1>
        <p class="tv-p">${c.esc(c.P.tagline || '')}</p>
        <div class="tv-cta">${ws ? `<button class="tv-btn" data-go="${ws.i}" data-hover>${c.esc(ws.label)}</button>` : ''}${c.data.about?.resume?.url ? `<button class="tv-btn tv-btn-g" data-open="resume" data-hover>${c.esc(c.data.about.resume.label || 'Resume')}</button>` : ''}</div>
      </div>
      <figure class="tv-obj ${kind === 'figure' ? 'is-fig' : ''}"><img src="${c.esc(cut)}" alt="${c.esc(c.name)}" draggable="false"></figure>
    </div>`;
  },
  onEnter(c, i, p, root) { root.style.setProperty('--k', i); },
  onLeave(c, from, to, root) { root.style.setProperty('--k', to); },
  css: () => `
.pf[data-t=traverse]{--pad-t:6.2em;--pad-r:8.4em;--pad-l:4.6em;--pad-b:5.6em;--radius:6px;--grain-o:.05;background:radial-gradient(ellipse at 30% 20%,color-mix(in srgb,var(--bg) 85%,#fff 6%),var(--bg) 60%,var(--accent2))}
.tv-ghost{position:absolute;left:4%;top:16%;height:min(28vh,15vw);overflow:hidden;right:0}
.tv-ghost-in{transform:translateY(calc(var(--k,0) * -100%));transition:transform 1.1s var(--ease);height:100%}
.tv-ghost span{display:block;height:100%;font-family:var(--f-display);font-weight:500;font-size:min(28vh,15vw);line-height:1;color:var(--fg);opacity:.045;white-space:nowrap;text-align:right;padding-right:6vw;transform:translateX(calc(var(--mx) * -1.5vw))}
.tv-spot{position:absolute;width:60vmax;height:60vmax;left:calc(62% - 30vmax);top:calc(48% - 30vmax);background:radial-gradient(closest-side,color-mix(in srgb,var(--accent) 16%,transparent),transparent);transform:translate(calc(var(--mx)*3vmax),calc(var(--my)*3vmax))}
.tv-top{position:absolute;z-index:20;left:0;right:5.4em;top:0;display:flex;align-items:center;justify-content:space-between;padding:1.6em 3em 1.6em 4.6em}
.tv-brand{font-family:var(--f-display);font-weight:500;font-size:1.15em;letter-spacing:.01em}
.tv-brand i{color:var(--accent);font-style:normal}
.tv-nav{display:flex;gap:2.4em;font-size:.86em}
.tv-nav .pf-nav-a{color:var(--muted);position:relative;padding:.3em 0}
.tv-nav .pf-nav-a.is-cur,.tv-nav .pf-nav-a:hover{color:var(--fg)}
.tv-nav .pf-nav-a.is-cur::after{content:"";position:absolute;left:0;bottom:-.4em;width:1.4em;height:2px;background:var(--accent)}
.tv-rail{position:absolute;z-index:22;top:0;right:0;bottom:0;width:5.4em;border-left:1px solid var(--line);display:flex;flex-direction:column;align-items:center;background:color-mix(in srgb,var(--bg) 60%,transparent)}
.tv-burger{width:100%;height:5.4em;display:flex;flex-direction:column;justify-content:center;align-items:center;gap:5px;background:var(--surface);border-bottom:1px solid var(--line)}
.tv-burger i{width:1.4em;height:1.5px;background:var(--fg);transition:transform .4s var(--out),opacity .3s}
.pf-drawer-open .tv-burger i:nth-child(1){transform:translateY(6.5px) rotate(45deg)}.pf-drawer-open .tv-burger i:nth-child(2){opacity:0}.pf-drawer-open .tv-burger i:nth-child(3){transform:translateY(-6.5px) rotate(-45deg)}
.tv-social{flex:1;display:flex;flex-direction:column;justify-content:center;gap:2.6em}
.tv-social .pf-ct{writing-mode:vertical-rl;font-size:.78em;color:var(--muted);gap:.6em}
.tv-social .pf-ct svg{transform:rotate(90deg);width:1.1em}
.tv-social .pf-ct:hover{color:var(--accent)}
.tv-foot{position:absolute;z-index:20;left:4.6em;right:8.4em;bottom:2em;display:flex;align-items:center;gap:.5em;font-family:var(--f-display)}
.tv-n{font-size:1.4em;height:1.2em;overflow:hidden;line-height:1.2}
.tv-n b{display:block;font-weight:400}
.tv-n span{display:block;transform:translateY(calc(var(--k,0) * -100%));transition:transform .9s var(--ease)}
.tv-total{font-size:.75em;color:var(--muted);align-self:flex-end;margin-bottom:.25em}
.tv-bar{width:min(14em,22vw);height:2px;background:var(--line);margin-left:1.2em;position:relative}
.tv-bar i{position:absolute;left:0;top:0;bottom:0;width:calc((var(--prog) * .8 + .2) * 100%);background:var(--accent);transition:width .9s var(--ease)}
.tv-arrows{margin-left:auto;display:flex;gap:.6em}
.tv-arrows button{width:2.8em;height:2.8em;border:1px solid var(--line);border-radius:var(--radius);display:grid;place-items:center;transition:border-color .3s,background-color .3s,color .3s}
.tv-arrows button:hover{border-color:var(--accent);background:var(--accent);color:var(--bg)}
.pf[data-t=traverse] .pf-drawer{--drawer-bg:var(--surface);right:5.4em}
/* hero: product */
.tv-hero{position:absolute;inset:0;display:grid;grid-template-columns:1fr 1fr;align-items:center;gap:3em}
.tv-txt{display:flex;flex-direction:column;gap:1.5em;align-items:flex-start;position:relative}
.tv-txt::before{content:"";position:absolute;left:-1.6em;top:-1.2em;width:5.5em;bottom:-1.6em;border:1px solid var(--line);border-right:0;pointer-events:none}
.tv-tab{font-size:.82em;padding:.8em 1.4em;background:var(--surface);color:var(--fg);margin-left:-1.6em}
.tv-h{font-family:var(--f-display);font-weight:500;font-size:clamp(2.2em,6.4vmin,5em);line-height:1.08;letter-spacing:-.005em}
.pf[data-v="1"] .tv-h{font-weight:300}
.tv-p{color:var(--muted);max-width:40ch;line-height:1.85;font-size:.92em}
.tv-cta{display:flex;gap:.8em;flex-wrap:wrap}
.tv-btn{padding:.95em 1.6em;border:1px solid var(--fg);font-size:.82em;letter-spacing:.02em;transition:background-color .3s,color .3s,border-color .3s}
.tv-btn:hover{background:var(--fg);color:var(--bg)}
.tv-btn-g{border-color:var(--line);color:var(--muted)}
.tv-obj{position:relative;height:100%;display:flex;align-items:center;justify-content:center}
.tv-obj img{max-height:84%;max-width:100%;object-fit:contain;filter:grayscale(.85) contrast(1.08) drop-shadow(0 40px 50px rgba(0,0,0,.55));transform:translate(calc(var(--mx) * 12px),calc(var(--my) * 8px));animation:tvFloat 6s ease-in-out infinite}
.tv-obj.is-fig{align-self:end;height:calc(100% + var(--pad-b));margin-bottom:calc(var(--pad-b) * -1)}
.tv-obj.is-fig img{max-height:100%;filter:grayscale(.15) drop-shadow(0 0 60px rgba(204,153,50,.12));animation:none;align-self:flex-end}
@keyframes tvFloat{50%{translate:0 -10px}}
.tv-txt>*{opacity:0;transform:translateY(1em);transition:opacity .8s,transform 1s var(--out)}
.tv-txt>:nth-child(2){transition-delay:.1s}.tv-txt>:nth-child(3){transition-delay:.2s}.tv-txt>:nth-child(4){transition-delay:.3s}
.tv-obj{opacity:0;transform:scale(.94);transition:opacity 1s .2s,transform 1.4s var(--out) .2s}
.pf-sec-home.is-on .tv-txt>*,.pf[data-static] .tv-txt>*,.pf-sec-home.is-on .tv-obj,.pf[data-static] .tv-obj{opacity:1;transform:none}
/* hero: brands */
.tv-b{grid-template-columns:1fr 1.05fr;gap:0}
.tv-b-txt{display:flex;flex-direction:column;gap:.9em;align-items:flex-start;padding-left:2em}
.tv-dash{width:2.4em;height:2px;background:var(--accent)}
.tv-small{font-size:.86em;color:var(--muted)}
.tv-mid{font-family:var(--f-display);font-size:clamp(1.3em,3vmin,2em);font-weight:300}
.tv-mid b{font-weight:800}
.tv-outline{font-family:var(--f-display);font-weight:200;font-size:clamp(2.6em,8.6vmin,6.6em);line-height:1;color:transparent;-webkit-text-stroke:1.2px var(--accent);text-transform:uppercase;letter-spacing:.02em}
.tv-roles{font-size:.82em;color:var(--muted)}
.tv-about{display:flex;align-items:center;gap:.8em;font-size:.84em;margin-top:.8em}
.tv-about i{width:3em;border-top:2px dotted var(--accent)}
.tv-about svg{width:2em;height:2em;padding:.4em;border-radius:50%;border:1px solid var(--accent);color:var(--accent)}
.tv-b-img{position:relative;align-self:stretch;margin:calc(var(--pad-t) * -.4) 0 calc(var(--pad-b) * -1);background:radial-gradient(var(--line) 1px,transparent 1.2px) 0 0/14px 14px,var(--accent2);overflow:hidden}
.tv-b-img img{position:absolute;right:-8%;bottom:0;height:96%;object-fit:contain;object-position:bottom;filter:grayscale(1) contrast(1.15) brightness(.95);transform:translateX(calc(var(--mx) * -10px))}
.tv-vert{position:absolute;left:4%;bottom:6%;writing-mode:vertical-rl;transform:rotate(180deg);font-family:var(--f-display);font-weight:800;font-size:clamp(3em,11vmin,8em);line-height:.9;letter-spacing:-.02em;z-index:1}
.tv-vert em{color:var(--accent);font-style:normal}
.tv-sq{position:absolute;right:6%;bottom:12%;width:3.6em;height:3.6em;display:grid;place-items:center;background:var(--accent);color:#fff;z-index:2;transition:transform .3s var(--out)}
.tv-sq:hover{transform:translateX(4px)}
.tv-b-txt>*{opacity:0;transform:translateX(-1em);transition:opacity .8s,transform 1s var(--out)}
.tv-b-txt>:nth-child(n+3){transition-delay:.15s}.tv-b-txt>:nth-child(n+4){transition-delay:.3s}
.tv-b-img{clip-path:inset(0 0 0 100%);transition:clip-path 1.3s var(--ease) .1s}
.pf-sec-home.is-on .tv-b-txt>*,.pf[data-static] .tv-b-txt>*{opacity:1;transform:none}
.pf-sec-home.is-on .tv-b-img,.pf[data-static] .tv-b-img{clip-path:inset(0)}
/* sections */
.pf[data-t=traverse] .pf-head-n{color:var(--accent)}
.pf[data-t=traverse] .pf-head-t{font-weight:400;font-size:clamp(1.8em,4.6vmin,3.4em)}
.pf[data-t=traverse][data-v="2"] .pf-head-t{font-weight:800}
.pf[data-t=traverse] .pf-card,.pf[data-t=traverse] .pf-xp,.pf[data-t=traverse] .pf-edu,.pf[data-t=traverse] .pf-skill,.pf[data-t=traverse] .pf-port-item{background:var(--surface);border-color:var(--line);box-shadow:0 30px 60px -30px rgba(0,0,0,.6)}
.pf[data-t=traverse] .pf-card:hover{border-color:var(--accent)}
.pf[data-t=traverse] .pf-card-media img{filter:grayscale(.7) brightness(.9);transition:filter .6s,transform .9s var(--out)}
.pf[data-t=traverse] .pf-card:hover .pf-card-media img{filter:none}
.pf[data-t=traverse] .pf-chip,.pf[data-t=traverse] .pf-tab{border-radius:var(--radius)}
.pf[data-t=traverse] .pf-chip[aria-pressed=true],.pf[data-t=traverse] .pf-tab[aria-selected=true]{background:transparent;color:var(--accent);border-color:var(--accent)}
.pf[data-t=traverse] .pf-btn{border-radius:var(--radius);background:var(--accent);color:var(--bg)}
.pf[data-t=traverse] .pf-btn-ghost{background:transparent;color:var(--fg)}
.pf[data-t=traverse] .pf-pg{border-radius:var(--radius)}
.pf[data-t=traverse] .pf-stats dd{font-weight:300}
.pf[data-t=traverse] .pf-port-t{font-weight:400}
.pf[data-t=traverse] .pf-ph{background:linear-gradient(135deg,var(--surface),var(--accent2))}
/* responsive */
.pf[data-w=md] .tv-nav{gap:1.3em}
.pf[data-w=sm] .tv-nav,.pf[data-w=xs] .tv-nav{display:none}
.pf[data-w=xs]{--pad-r:1.2em;--pad-l:1.2em;--pad-t:5em;--pad-b:4.6em}
.pf[data-w=xs] .tv-rail{top:0;bottom:auto;height:4.2em;width:4.2em;border:0;background:none}
.pf[data-w=xs] .tv-burger{height:4.2em;background:none;border:0}
.pf[data-w=xs] .tv-social{display:none}
.pf[data-w=xs] .tv-top{right:4.2em;padding:1.3em 1.2em}
.pf[data-w=xs] .tv-foot{left:1.2em;right:1.2em;bottom:1.2em}
.pf[data-w=xs] .pf-drawer{right:0}
.pf[data-o=p] .tv-hero{grid-template-columns:1fr;grid-template-rows:auto 1fr;gap:1em;align-items:start}
.pf[data-o=p] .tv-txt::before{display:none}
.pf[data-o=p] .tv-tab{margin-left:0}
.pf[data-o=p] .tv-p{display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}
.pf[data-o=p] .tv-obj{min-height:0}
.pf[data-o=p] .tv-b-img{margin:0 calc(var(--pad-r) * -1) calc(var(--pad-b) * -1)}
.pf[data-o=p] .tv-b-txt{padding-left:0}
.pf[data-h=tiny] .tv-p,.pf[data-h=tiny] .tv-txt::before,.pf[data-h=tiny] .tv-roles{display:none}
.pf[data-h=tiny] .tv-top{padding:.6em 1.6em .6em 3em}
.pf[data-h=tiny] .tv-foot{bottom:.6em}
`,
};
