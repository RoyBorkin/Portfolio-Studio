/*! Portfolio Studio. Copyright (c) 2026 Roy Borkin. All rights reserved. Unauthorized copying, modification or distribution is prohibited without written permission. */
// 16 — Folio (free design) : the whole site is one row of tall editorial strips, like book spines on
// a shelf. The open strip holds the page; the others stay visible as spines with their number and a
// vertical title, and slide open when chosen. On phones the spines stack as horizontal bands.
export default {
  id: 'folio',
  name: 'Folio',
  blurb: 'Every section is a spine on a shelf; the open one slides wide. Editorial and calm.',
  cursor: true,
  transition(from, to) {
    const inner = to.firstElementChild;
    return inner ? [inner.animate([{ opacity: 0, transform: 'translateX(2.5em)' }, { opacity: 1, transform: 'none' }], { duration: 900, delay: 380, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'both' })] : [];
  },
  variants: [
    { name: 'Gallery', swatch: ['#f3f4f2', '#141414', '#2340ff'],
      vars: { bg: '#f3f4f2', surface: '#ffffff', fg: '#141414', muted: '#6b6e6a', accent: '#2340ff', accent2: '#141414', line: 'rgba(20,20,20,.12)', t0: '#f3f4f2', t1: '#e8ebe7', t2: '#dde2dc', t3: '#d1d8d1', t4: '#c4ccc5', t5: '#b8c1ba' },
      fonts: { display: 'Newsreader:300;400;600', body: 'Hanken Grotesk:400;500;600', mono: 'IBM Plex Mono:400' } },
    { name: 'Ink', swatch: ['#0f0f10', '#ece7dc', '#c9a96e'],
      vars: { bg: '#0f0f10', surface: '#18181a', fg: '#ece7dc', muted: '#8d8a84', accent: '#c9a96e', accent2: '#ece7dc', line: 'rgba(236,231,220,.1)', t0: '#0f0f10', t1: '#151517', t2: '#1b1b1d', t3: '#212124', t4: '#28282b', t5: '#2f2f33' },
      fonts: { display: 'DM Serif Display:400', body: 'Hanken Grotesk:400;500;600', mono: 'IBM Plex Mono:400' } },
    { name: 'Brand', swatch: ['#2f3540', '#cc9932', '#f2efe9'],
      vars: { bg: '#f2efe9', surface: '#ffffff', fg: '#2f3540', muted: '#6c717b', accent: '#cc9932', accent2: '#2f3540', line: 'rgba(47,53,64,.14)', t0: '#f2efe9', t1: '#cc9932', t2: '#b88a2c', t3: '#3a414d', t4: '#333a46', t5: '#2b313b' },
      fonts: { display: 'Nunito Sans:300;800', body: 'Nunito Sans:400;600;700', mono: 'IBM Plex Mono:400' } },
  ],
  layout: { works: [14, 15] },
  shell(c) {
    return {
      nav: `<nav class="fo-spines" aria-label="Sections">${c.secs.map((s) => `<a class="fo-spine pf-nav-a" href="#${s.id}" data-go="${s.i}" style="--si:${s.i}" data-hover><b>${s.n}</b><span class="pf-nav-l">${c.esc(s.label)}</span><i>${c.I('arrow')}</i></a>`).join('')}</nav>
        <div class="fo-corner"><div class="fo-cts">${c.contactLinks({ limit: 5 })}</div></div>`,
    };
  },
  home(c) {
    const P = c.P, photo = c.img(P.photo);
    return `<div class="fo-home">
      <figure class="fo-photo"><img src="${c.esc(photo)}" alt="${c.esc(c.name)}" draggable="false"></figure>
      <div class="fo-copy">
        <p class="fo-kicker">${c.logo('fo-logo')}<span>${c.esc(P.location || '')}</span></p>
        <h1 class="fo-name"><span>${c.esc(c.first)}</span> <span>${c.esc(c.last)}</span></h1>
        <p class="fo-roles">${c.roles.map((r) => `<span>${c.esc(r)}</span>`).join('')}</p>
        <p class="fo-pitch">${c.esc(P.tagline || '')}</p>
        <ol class="fo-index">${c.secs.slice(1).map((s) => `<li><button data-go="${s.i}" data-hover><b>${s.n}</b><span>${c.esc(s.label)}</span><em>${c.esc(s.subtitle || '')}</em></button></li>`).join('')}</ol>
      </div>
    </div>`;
  },
  mount(c, root) {
    root.style.setProperty('--n', c.secs.length);
    const cur = c.secs.findIndex((s) => s.id === root.dataset.cur);
    root.style.setProperty('--k', Math.max(0, cur));
    root.querySelectorAll('.pf-sec').forEach((s, i) => s.style.setProperty('--tone', `var(--t${Math.min(5, i)})`));
  },
  onEnter(c, i, p, root) { root.style.setProperty('--k', i); },
  onLeave(c, from, to, root) { root.style.setProperty('--k', to); },
  css: () => `
.pf[data-t=folio]{--wc:4.8em;--grain-o:.05;--radius:4px;--aw:calc(100vw - (var(--n,5) - 1) * var(--wc))}
.pf[data-t=folio] :is(.pf-sec,.fo-spine){--on:calc(1 - clamp(0, var(--si) - var(--k,0), 1) - clamp(0, var(--k,0) - var(--si), 1));--after:clamp(0, var(--si) - var(--k,0), 1)}
/* strips */
.pf[data-t=folio] .pf-sec{visibility:visible!important;inset:0 auto 0 0;left:calc(var(--si) * var(--wc) + var(--after) * (100% - var(--n,5) * var(--wc)));width:calc(var(--wc) + var(--on) * (100% - var(--n,5) * var(--wc)));padding:0;overflow:hidden;background:var(--tone,var(--bg));box-shadow:-1px 0 0 var(--line);transition:left 1s var(--ease),width 1s var(--ease);will-change:left,width}
.pf[data-t=folio] .pf-sec>*{position:absolute;top:0;bottom:0;left:0;width:var(--aw);flex:none}
.pf[data-t=folio] .pf-sec-in{padding:3.2em 3.4em 2.6em}
.pf[data-t=folio] .pf-sec:not(.is-on)>*{opacity:.0;transition:opacity .35s}
.pf[data-t=folio][data-v="2"] .pf-sec:nth-child(n+2){color:var(--fg)}
.fo-spines{position:absolute;inset:0;z-index:15;pointer-events:none}
.fo-spine{--si:0;position:absolute;top:0;bottom:0;left:calc(var(--si) * var(--wc) + var(--after) * (100% - var(--n,5) * var(--wc)));width:var(--wc);display:flex;flex-direction:column;align-items:center;justify-content:space-between;padding:1.6em 0;pointer-events:auto;transition:left 1s var(--ease),opacity .4s,color .3s;color:var(--fg)}
.fo-spine.is-cur{opacity:0;pointer-events:none}
.fo-spine b{font-family:var(--f-mono);font-weight:400;font-size:.76em;opacity:.7}
.fo-spine .pf-nav-l{writing-mode:vertical-rl;transform:rotate(180deg);font-family:var(--f-display);font-size:clamp(1.3em,3.2vmin,2.2em);letter-spacing:-.01em;white-space:nowrap;transition:transform .5s var(--out)}
.fo-spine i{width:2.2em;height:2.2em;border-radius:50%;display:grid;place-items:center;border:1px solid var(--line);transition:background-color .3s,color .3s,transform .4s var(--out)}
.fo-spine:hover i{background:var(--fg);color:var(--bg);transform:rotate(-45deg)}
.fo-spine:hover .pf-nav-l{transform:rotate(180deg) translateY(-.3em)}
.pf[data-v="2"] .fo-spine:nth-child(n+2){color:#f2efe9}
.pf[data-v="2"] .fo-spine:nth-child(n+4) i{border-color:rgba(242,239,233,.2)}
.pf[data-v="2"] .fo-spine:nth-child(2),.pf[data-v="2"] .fo-spine:nth-child(3){color:#2f3540}
.fo-corner{position:absolute;z-index:16;top:1.4em;left:calc(var(--k,0) * var(--wc) + var(--aw) - 1.6em);translate:-100% 0;transition:left 1s var(--ease)}
.fo-cts{display:flex;gap:.2em;padding:.25em;border-radius:999px;background:color-mix(in srgb,var(--surface) 80%,transparent);backdrop-filter:blur(10px);box-shadow:0 0 0 1px var(--line)}
.fo-cts .pf-ct{width:2.3em;height:2.3em;border-radius:50%;color:var(--muted)}
.fo-cts .pf-ct:hover{background:var(--fg);color:var(--bg)}
/* home */
.fo-home{display:grid;grid-template-columns:minmax(0,1.05fr) minmax(0,1fr)}
.fo-photo{position:relative;overflow:hidden;margin:0}
.fo-photo img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:50% 32%;transform:scale(1.12) translate(calc(var(--mx) * -1%),calc(var(--my) * -1%));transition:transform 2.4s var(--out),filter 1s}
.pf[data-v="1"] .fo-photo img{filter:grayscale(1) contrast(1.05) brightness(.9)}
.pf-sec-home.is-on .fo-photo img{transform:scale(1.02) translate(calc(var(--mx) * -1%),calc(var(--my) * -1%))}
.fo-copy{display:flex;flex-direction:column;justify-content:center;gap:1.1em;padding:3em 3.4em;min-width:0}
.fo-kicker{display:flex;align-items:center;gap:.8em;font-family:var(--f-mono);font-size:.76em;color:var(--muted)}
.fo-logo{height:1.8em}
.pf[data-v="0"] .fo-logo{filter:brightness(0)}
.pf[data-v="1"] .fo-logo{filter:sepia(1) saturate(.6) brightness(1.2)}
.fo-name{font-family:var(--f-display);font-weight:300;font-size:clamp(2.8em,8.6vmin,7.4em);line-height:.92;letter-spacing:-.035em}
.fo-name span{display:inline-block}
.fo-name span:last-child{font-style:italic}
.pf[data-v="1"] .fo-name{font-weight:400;letter-spacing:-.02em}
.pf[data-v="2"] .fo-name{font-weight:800;letter-spacing:-.04em}
.pf[data-v="2"] .fo-name span:last-child{font-style:normal;color:var(--accent)}
.fo-roles{display:flex;flex-wrap:wrap;gap:.3em 1.1em;font-size:.86em;font-weight:600}
.fo-roles span{position:relative}
.fo-roles span+span::before{content:"";position:absolute;left:-.62em;top:.25em;bottom:.25em;width:1px;background:var(--line)}
.fo-pitch{max-width:40ch;font-size:1.02em;line-height:1.6;color:var(--muted)}
.fo-index{display:flex;flex-direction:column;border-top:1px solid var(--line);margin-top:.6em}
.fo-index button{width:100%;display:grid;grid-template-columns:2.6em auto 1fr;gap:.8em;align-items:baseline;padding:.65em 0;border-bottom:1px solid var(--line);text-align:left;transition:padding .4s var(--out),color .3s}
.fo-index button:hover{padding-left:.6em;color:var(--accent)}
.fo-index b{font-family:var(--f-mono);font-weight:400;font-size:.74em;color:var(--muted)}
.fo-index span{font-family:var(--f-display);font-size:1.25em;letter-spacing:-.01em}
.fo-index em{font-style:normal;font-size:.74em;color:var(--muted);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;text-align:right}
.fo-copy>*{opacity:0;transform:translateY(1em);transition:opacity .8s,transform 1s var(--out)}
.fo-copy>:nth-child(2){transition-delay:.1s}.fo-copy>:nth-child(3){transition-delay:.2s}.fo-copy>:nth-child(4){transition-delay:.3s}.fo-copy>:nth-child(5){transition-delay:.4s}
.pf-sec-home.is-on .fo-copy>*,.pf[data-static] .fo-copy>*{opacity:1;transform:none}
/* sections */
.pf[data-t=folio] .pf-head{align-items:baseline;border-bottom:1px solid var(--line);padding-bottom:.6em;padding-right:13em}
.pf[data-t=folio] .pf-head-n{font-size:.8em;color:var(--muted)}
.pf[data-t=folio] .pf-head-t{font-weight:300;letter-spacing:-.03em;font-size:clamp(2.2em,6vmin,4.6em)}
.pf[data-t=folio][data-v="1"] .pf-head-t{font-weight:400}
.pf[data-t=folio][data-v="2"] .pf-head-t{font-weight:800;letter-spacing:-.04em}
.pf[data-t=folio] .pf-head-s{flex-basis:auto;margin-left:auto}
.pf[data-t=folio] .pf-card{background:transparent;border:0;border-radius:0}
.pf[data-t=folio] .pf-card-media{border-radius:var(--radius)}
.pf[data-t=folio] .pf-card-body{padding:.6em 0 0}
.pf[data-t=folio] .pf-card-title{font-family:var(--f-display);font-weight:400;font-size:1.15em}
.pf[data-t=folio][data-v="2"] .pf-card-title{font-weight:800}
.pf[data-t=folio] .pf-repo,.pf[data-t=folio] .pf-xp,.pf[data-t=folio] .pf-edu,.pf[data-t=folio] .pf-skill{background:color-mix(in srgb,var(--surface) 55%,transparent);border:1px solid var(--line);border-radius:var(--radius)}
.pf[data-t=folio] .pf-chip,.pf[data-t=folio] .pf-tab{border-color:var(--line)}
.pf[data-t=folio] .pf-chip[aria-pressed=true],.pf[data-t=folio] .pf-tab[aria-selected=true]{background:var(--fg);color:var(--tone,var(--bg));border-color:var(--fg)}
.pf[data-t=folio] .pf-btn{background:var(--fg);color:var(--tone,var(--bg))}
.pf[data-t=folio] .pf-btn-ghost{background:transparent;color:var(--fg)}
.pf[data-t=folio] .pf-port-item{background:transparent;border:0}
.pf[data-t=folio] .pf-port-t{font-weight:300;letter-spacing:-.02em;font-size:clamp(1.6em,4vmin,3em)}
.pf[data-t=folio][data-v="2"] .pf-port-t{font-weight:800}
.pf[data-t=folio] .pf-stats dd{font-weight:300}
/* brand variant: dark strips need light text */
.pf[data-t=folio][data-v="2"] .pf-sec:nth-child(n+4){--fg:#f2efe9;--muted:#aab0ba;--line:rgba(242,239,233,.16);--surface:#3c4451;color:var(--fg)}
.pf[data-t=folio][data-v="2"] .pf-sec:nth-child(2),.pf[data-t=folio][data-v="2"] .pf-sec:nth-child(3){--surface:#e3b75c;--muted:#4a3c1c;--line:rgba(47,53,64,.2)}
/* phones: spines become bands */
.pf[data-t=folio][data-o=p]{--wc:3.4em;--ah:calc(100vh - (var(--n,5) - 1) * var(--wc));--aw:100vw}
@supports (height:100dvh){.pf[data-t=folio][data-o=p]{--ah:calc(100dvh - (var(--n,5) - 1) * var(--wc))}}
.pf[data-t=folio][data-o=p] .pf-sec{left:0;width:100%;top:calc(var(--si) * var(--wc) + var(--after) * (100% - var(--n,5) * var(--wc)));height:calc(var(--wc) + var(--on) * (100% - var(--n,5) * var(--wc)));bottom:auto;transition:top 1s var(--ease),height 1s var(--ease);box-shadow:0 -1px 0 var(--line)}
.pf[data-t=folio][data-o=p] .pf-sec>*{width:100%;height:var(--ah);bottom:auto}
.pf[data-t=folio][data-o=p] .fo-spine{left:0;right:0;width:auto;bottom:auto;top:calc(var(--si) * var(--wc) + var(--after) * (100% - var(--n,5) * var(--wc)));height:var(--wc);flex-direction:row;padding:0 1.2em;transition:top 1s var(--ease),opacity .4s}
.pf[data-t=folio][data-o=p] .fo-spine .pf-nav-l{writing-mode:horizontal-tb;transform:none;font-size:1.3em;margin-right:auto;margin-left:1em}
.pf[data-t=folio][data-o=p] .fo-spine i{width:1.9em;height:1.9em}
.pf[data-t=folio][data-o=p] .fo-corner{left:auto;right:1em;top:calc(var(--k,0) * var(--wc) + .8em);translate:0;transition:top 1s var(--ease)}
.pf[data-t=folio][data-o=p] .fo-home{grid-template-columns:1fr;grid-template-rows:minmax(0,.9fr) auto}
.pf[data-t=folio][data-o=p] .fo-copy{padding:1.2em 1.3em 1.4em;gap:.7em;justify-content:flex-start}
.pf[data-t=folio][data-o=p] .fo-pitch,.pf[data-t=folio][data-o=p] .fo-index,.pf[data-t=folio][data-o=p] .fo-kicker{display:none}
.pf[data-t=folio][data-o=p] .fo-name{font-size:clamp(2.4em,13vw,4em)}
.pf[data-t=folio][data-o=p] .pf-sec-in{padding:3.6em 1.2em 1.2em}
.pf[data-t=folio][data-o=p] .pf-head{padding-right:0}
.pf[data-t=folio][data-o=p] .pf-head-s{display:none}
.pf[data-t=folio][data-w=sm]:not([data-o=p]){--wc:3.6em}
.pf[data-t=folio][data-h=tiny]{--wc:3.2em}
.pf[data-h=tiny] .fo-pitch,.pf[data-h=tiny] .fo-index{display:none}
.pf[data-h=tiny] .fo-copy{padding:1.2em 1.6em}
.pf[data-t=folio][data-h=tiny] .pf-sec-in{padding:1.2em 1.6em}
.pf[data-t=folio][data-h=tiny] .pf-head{padding-right:12em}
.pf[data-h=tiny] .fo-spine .pf-nav-l{font-size:1.1em}
.pf[data-h=tiny] .fo-spine{padding:.6em 0}
`,
};
