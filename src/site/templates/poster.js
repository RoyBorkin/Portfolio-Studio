/*! Portfolio Studio. Copyright (c) 2026 Roy Borkin. All rights reserved. Unauthorized copying, modification or distribution is prohibited without written permission. */
// 02 — Poster : Swiss collage. A printed-paper ground, one hard color field, a grayscale cut-out
// pasted across its edge, and the name set vertically like a poster spine.
export default {
  id: 'poster',
  name: 'Poster',
  blurb: 'Swiss poster collage: color block, grayscale cut-out, vertical type.',
  transition: 'wipe',
  variants: [
    { name: 'Print', swatch: ['#e7e2d8', '#e63b22', '#151515'],
      vars: { bg: '#e6e1d6', surface: '#dcd6ca', fg: '#151515', muted: '#5b5750', accent: '#e63b22', accent2: '#151515', line: 'rgba(21,21,21,.18)', ink: '#151515' },
      fonts: { display: 'League Gothic:400', body: 'Inter Tight:400;500;600;700', mono: 'Space Mono:400' }, opts: { shape: 'rect' } },
    { name: 'Yard', swatch: ['#1f1f1f', '#ff2a1a', '#e9e4da'],
      vars: { bg: '#1e1e1e', surface: '#282828', fg: '#ebe6dc', muted: '#9c968c', accent: '#ff2a1a', accent2: '#ebe6dc', line: 'rgba(235,230,220,.16)', ink: '#ebe6dc' },
      fonts: { display: 'Syncopate:400;700', body: 'Inter Tight:400;500;600;700', mono: 'Space Mono:400' }, opts: { shape: 'square' } },
    { name: 'Brand', swatch: ['#f1eee8', '#cc9932', '#333a46'],
      vars: { bg: '#f0ede7', surface: '#e6e2da', fg: '#333a46', muted: '#6b6f78', accent: '#cc9932', accent2: '#333a46', line: 'rgba(51,58,70,.18)', ink: '#333a46' },
      fonts: { display: 'Instrument Serif:400', body: 'Inter Tight:400;500;600;700', mono: 'Space Mono:400' }, opts: { shape: 'circle' } },
  ],
  layout: { works: [15, 16] },
  shell(c) {
    const year = new Date().getFullYear();
    return {
      nav: `<header class="po-top">
          <button class="po-id" data-go="0" data-hover><b>${c.esc(c.name)}</b><span>${c.esc(c.P.role || '')}</span></button>
          <nav class="po-nav" aria-label="Sections">${c.nav()}</nav>
          <span class="po-yr">Portfolio ${year}</span>
          ${c.menuBtn()}
        </header>
        <footer class="po-foot">${c.contactLinks({ text: true, limit: 5 })}</footer>
        ${c.drawer()}`,
    };
  },
  home(c) {
    const cut = c.img(c.P.cutout) || c.img(c.P.photo);
    const shape = c.opt('shape');
    return `<div class="po-hero" data-shape="${shape}">
      <h1 class="po-spine"><span>${c.esc(c.last || c.first)}</span></h1>
      <div class="po-field"></div>
      <div class="po-sun"></div>
      <figure class="po-cut"><img src="${c.esc(cut)}" alt="${c.esc(c.name)}" draggable="false"></figure>
      <p class="po-first">${c.esc(c.first)}</p>
      <div class="po-blurb"><p>${c.esc(c.P.tagline || '')}</p><p class="po-roles">${c.roles.map((r) => `<span>${c.esc(r)}</span>`).join('')}</p></div>
      <p class="po-place">${c.esc(c.P.location || '')}</p>
      ${c.sec('works') ? `<button class="po-go" data-go="${c.sec('works').i}" data-hover>${c.esc(c.sec('works').label)}${c.I('arrowDown')}</button>` : ''}
    </div>`;
  },
  css: () => `
.pf[data-t=poster]{--pad-t:5.4em;--pad-r:3.2em;--pad-l:3.2em;--pad-b:4.6em;--radius:0px;--grain-o:.16;--cursor:var(--accent)}
.pf[data-t=poster] .pf-grain{mix-blend-mode:multiply;opacity:.22}
.pf[data-t=poster][data-v="1"] .pf-grain{mix-blend-mode:overlay;opacity:.12}
.po-top{position:absolute;z-index:20;inset:0 0 auto;display:grid;grid-template-columns:1fr 2fr auto;align-items:start;gap:2em;padding:1.3em 2em;font-size:.8em;border-bottom:1px solid var(--line)}
.po-id{display:flex;flex-direction:column;line-height:1.25}
.po-id span{color:var(--muted)}
.po-nav{display:flex;gap:1.6em;flex-wrap:wrap}
.po-nav .pf-nav-a{position:relative;padding-left:1em}
.po-nav .pf-nav-a::before{content:"";position:absolute;left:0;top:.45em;width:.55em;height:.55em;background:var(--accent);transform:scale(0);transition:transform .35s var(--out)}
.pf[data-v="2"] .po-nav .pf-nav-a::before{border-radius:50%}
.po-nav .pf-nav-a.is-cur::before,.po-nav .pf-nav-a:hover::before{transform:scale(1)}
.po-yr{font-family:var(--f-mono);font-size:.9em;color:var(--muted)}
.po-foot{position:absolute;z-index:20;left:2em;right:2em;bottom:1.2em;display:flex;gap:1.8em;font-size:.78em;border-top:1px solid var(--line);padding-top:.8em}
.po-foot .pf-ct{gap:.45em}
.po-foot .pf-ct svg{width:1em;height:1em}
.po-foot .pf-ct:hover{color:var(--accent)}
/* hero */
.po-hero{position:absolute;inset:0;container-type:size}
.po-spine{position:absolute;left:0;top:0;bottom:0;display:flex;align-items:center;z-index:3;pointer-events:none}
.po-spine span{writing-mode:vertical-rl;transform:rotate(180deg);font-family:var(--f-display);font-weight:400;font-size:min(27cqh,22cqw);line-height:.78;text-transform:uppercase;letter-spacing:.005em;color:var(--ink);clip-path:inset(100% 0 0 0);transition:clip-path 1.3s var(--ease) .1s}
.pf[data-v="1"] .po-spine span{font-weight:700;font-size:min(13cqh,10cqw);letter-spacing:.32em}
.pf[data-v="2"] .po-spine span{text-transform:none;font-size:min(30cqh,24cqw);line-height:.8;font-style:italic}
.po-field{position:absolute;z-index:1;right:12%;top:2%;width:42%;height:88%;background:var(--accent);transform-origin:bottom;transform:translate(calc(var(--mx)*-10px),calc(var(--my)*-8px)) scaleY(0);transition:transform 1.2s var(--ease)}
.po-sun{position:absolute;z-index:1;width:min(34cqw,48cqh);aspect-ratio:1;border-radius:50%;right:34%;top:6%;background:var(--accent2);transform:translate(calc(var(--mx)*16px),calc(var(--my)*12px)) scale(0);transition:transform 1.1s var(--out) .5s;mix-blend-mode:multiply}
.pf[data-v="1"] .po-sun{mix-blend-mode:normal;background:var(--fg);opacity:.08}
[data-shape=square] .po-field{right:16%;top:14%;width:44%;height:66%}
[data-shape=circle] .po-field{border-radius:50%;width:min(52cqw,86cqh);height:auto;aspect-ratio:1;right:14%;top:4%}
[data-shape=circle] .po-sun{border-radius:0;width:min(10cqw,14cqh);right:10%;top:70%;background:var(--accent2);mix-blend-mode:normal}
.po-cut{position:absolute;z-index:2;right:20%;bottom:0;height:86%;aspect-ratio:1606/1500;transform:translate(calc(var(--mx)*6px),110%);transition:transform 1.3s var(--ease) .35s}
.po-cut img{width:100%;height:100%;object-fit:contain;object-position:bottom;filter:grayscale(1) contrast(1.18) brightness(1.02)}
.pf[data-v="2"] .po-cut img{filter:grayscale(1) contrast(1.1) sepia(.18)}
.po-first{position:absolute;z-index:3;right:4%;top:6%;font-family:var(--f-display);font-size:min(9cqh,7cqw);line-height:1;text-transform:uppercase;writing-mode:vertical-rl;opacity:0;transition:opacity 1s 1s}
.pf[data-v="1"] .po-first{font-weight:700;font-size:min(4cqh,3cqw);letter-spacing:.4em}
.pf[data-v="2"] .po-first{text-transform:none;font-style:italic}
.po-blurb{position:absolute;z-index:3;left:min(22cqh,20cqw);bottom:4%;max-width:28ch;display:flex;flex-direction:column;gap:.8em;font-size:.86em;opacity:0;transform:translateY(1em);transition:all 1s var(--out) 1.1s}
.po-roles{display:flex;flex-wrap:wrap;gap:.3em .9em;font-weight:600}
.po-roles span::before{content:"";display:inline-block;width:.5em;height:.5em;background:var(--accent);margin-right:.4em}
.po-place{position:absolute;z-index:3;left:min(22cqh,20cqw);top:3%;font-family:var(--f-mono);font-size:.75em;opacity:0;transition:opacity 1s 1.2s}
.po-go{position:absolute;z-index:4;right:0;bottom:3%;display:flex;align-items:center;gap:.6em;font-weight:600;font-size:.86em;padding:.7em 1em;background:var(--ink);color:var(--bg);opacity:0;transition:opacity 1s 1.4s,transform .3s var(--out)}
.po-go:hover{transform:translateY(-3px)}
.pf-sec-home.is-on .po-spine span,.pf[data-static] .po-spine span{clip-path:inset(0)}
.pf-sec-home.is-on .po-field,.pf[data-static] .po-field{transform:translate(calc(var(--mx)*-10px),calc(var(--my)*-8px)) scaleY(1)}
.pf-sec-home.is-on .po-sun,.pf[data-static] .po-sun{transform:translate(calc(var(--mx)*16px),calc(var(--my)*12px)) scale(1)}
.pf-sec-home.is-on .po-cut,.pf[data-static] .po-cut{transform:translate(calc(var(--mx)*6px),0)}
.pf-sec-home.is-on :is(.po-first,.po-blurb,.po-place,.po-go),.pf[data-static] :is(.po-first,.po-blurb,.po-place,.po-go){opacity:1;transform:none}
/* sections */
.pf[data-t=poster] .pf-head{display:grid;grid-template-columns:auto 1fr;align-items:end;column-gap:1.5em;border-bottom:2px solid var(--ink);padding-bottom:.4em}
.pf[data-t=poster] .pf-head-n{display:none}
.pf[data-t=poster] .pf-head-t{font-weight:400;text-transform:uppercase;font-size:clamp(2.6em,9vmin,6.4em);line-height:.82;letter-spacing:0}
.pf[data-t=poster][data-v="1"] .pf-head-t{font-weight:700;font-size:clamp(1.6em,4.4vmin,3.2em);letter-spacing:.2em}
.pf[data-t=poster][data-v="2"] .pf-head-t{text-transform:none;font-style:italic}
.pf[data-t=poster] .pf-head-s{flex-basis:auto;justify-self:end;text-align:right;max-width:30ch;font-size:.82em;padding-bottom:.4em}
.pf[data-t=poster] .pf-card{background:transparent;border:0;border-radius:0}
.pf[data-t=poster] .pf-card-media{background:var(--surface)}
.pf[data-t=poster] .pf-card-media img{filter:grayscale(1) contrast(1.1);transition:filter .5s,transform .9s var(--out)}
.pf[data-t=poster] .pf-card-media::after{content:"";position:absolute;inset:0;background:var(--accent);mix-blend-mode:multiply;opacity:0;transition:opacity .4s}
.pf[data-t=poster] .pf-card:hover .pf-card-media::after{opacity:.85}
.pf[data-t=poster][data-v="1"] .pf-card-media::after{mix-blend-mode:screen}
.pf[data-t=poster] .pf-card-body{padding:.55em 0 0;border-top:2px solid var(--ink);margin-top:.5em}
.pf[data-t=poster] .pf-card-title{font-weight:700;font-size:1.02em}
.pf[data-t=poster] .pf-ph{background:var(--accent);color:var(--bg)}
.pf[data-t=poster] .pf-repo{border:0;border-top:2px solid var(--ink);padding:.8em 0}
.pf[data-t=poster] .pf-chip,.pf[data-t=poster] .pf-tab{border-radius:0;border-color:var(--ink)}
.pf[data-t=poster] .pf-chip[aria-pressed=true],.pf[data-t=poster] .pf-tab[aria-selected=true]{background:var(--accent);color:#fff;border-color:var(--accent)}
.pf[data-t=poster] .pf-btn{border-radius:0;background:var(--ink);color:var(--bg)}
.pf[data-t=poster] .pf-btn-ghost{background:transparent;color:var(--fg);border:2px solid var(--ink)}
.pf[data-t=poster] .pf-pg{border-radius:0;border-color:var(--ink)}
.pf[data-t=poster] .pf-xp,.pf[data-t=poster] .pf-edu,.pf[data-t=poster] .pf-skill{border:0;border-top:2px solid var(--ink);border-radius:0;padding:.7em 0}
.pf[data-t=poster] .pf-xp header span,.pf[data-t=poster] .pf-edu span{color:var(--accent)}
.pf[data-t=poster] .pf-profile-img{border-radius:0}
.pf[data-t=poster] .pf-profile-img img{filter:grayscale(1) contrast(1.1)}
.pf[data-t=poster] .pf-profile-img::before{content:"";position:absolute;z-index:1;left:0;top:0;width:38%;height:100%;background:var(--accent);mix-blend-mode:multiply}
.pf[data-t=poster] .pf-stats dd{font-weight:400;font-size:clamp(2em,5vmin,3.4em)}
.pf[data-t=poster][data-v="1"] .pf-stats dd{font-weight:700;font-size:clamp(1.3em,3vmin,2em)}
.pf[data-t=poster] .pf-port-item{border:0;border-radius:0;background:var(--surface)}
.pf[data-t=poster] .pf-port-media img{filter:grayscale(1)}
.pf[data-t=poster] .pf-port-item:nth-child(odd) .pf-port-media::after{content:"";position:absolute;inset:0 50% 0 0;background:var(--accent);mix-blend-mode:multiply}
.pf[data-t=poster] .pf-port-t{font-weight:400;text-transform:uppercase;font-size:clamp(2em,5vmin,3.6em);line-height:.9}
.pf[data-t=poster][data-v="1"] .pf-port-t{font-weight:700;font-size:clamp(1.1em,2.6vmin,1.8em);letter-spacing:.14em}
.pf[data-t=poster][data-v="2"] .pf-port-t{text-transform:none;font-style:italic}
.pf[data-t=poster] .pf-modal-box{border-radius:0}
.pf[data-t=poster] .pf-wipe{background:var(--accent)}
/* responsive */
.pf[data-w=sm] .po-nav,.pf[data-w=xs] .po-nav,.pf[data-w=xs] .po-yr{display:none}
.pf[data-w=sm] .pf-burger,.pf[data-w=xs] .pf-burger{display:block}
.pf[data-w=sm] .po-top,.pf[data-w=xs] .po-top{grid-template-columns:1fr auto auto;align-items:center}
.pf[data-w=xs] .po-top{padding:1em 1.1em}
.pf[data-w=xs] .po-foot{left:1.1em;right:1.1em;gap:1.2em}
.pf[data-w=xs] .po-foot .pf-ct span{display:none}
.pf[data-o=p] .po-field{right:4%;width:62%;top:6%;height:70%}
.pf[data-o=p] [data-shape=circle] .po-field{width:86cqw;height:auto;right:-10%;top:14%}
.pf[data-o=p] .po-cut{right:-6%;height:64%}
.pf[data-o=p] .po-spine span{font-size:min(16cqh,30cqw)}
.pf[data-o=p] .po-blurb{left:auto;right:0;bottom:auto;top:0;max-width:22ch;text-align:right;align-items:flex-end;font-size:.78em}
.pf[data-o=p] .po-roles{justify-content:flex-end}
.pf[data-o=p] .po-place,.pf[data-o=p] .po-first{display:none}
.pf[data-o=p] .pf-head{grid-template-columns:1fr}
.pf[data-o=p] .pf-head-s{justify-self:start;text-align:left}
.pf[data-h=tiny] .po-top{padding:.5em 1.2em}
.pf[data-h=tiny] .po-foot{display:none}
.pf[data-h=tiny]{--pad-b:1.4em}
.pf[data-h=tiny] .po-blurb{display:none}
`,
};
