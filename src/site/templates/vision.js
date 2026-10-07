/*! Portfolio Studio. Copyright (c) 2026 Roy Borkin. All rights reserved. Unauthorized copying, modification or distribution is prohibited without written permission. */
// 01 — Vision : editorial hero. The name is set huge, the cut-out portrait stands inside it, and an
// outlined copy of the letters sits in front, so the figure appears woven through the type.
export default {
  id: 'vision',
  name: 'Vision',
  blurb: 'Huge type woven around your cut-out portrait, editorial calm.',
  transition: 'curtain',
  variants: [
    { name: 'Stone', swatch: ['#b7b1a6', '#27231f', '#efebe4'],
      vars: { bg: '#b9b3a8', surface: '#c6c0b6', fg: '#24201c', muted: '#5c564e', accent: '#24201c', accent2: '#efebe4', line: 'rgba(36,32,28,.2)' },
      fonts: { display: 'Bodoni Moda:400;500', body: 'Archivo:400;500;600', mono: 'IBM Plex Mono:400' }, opts: { layout: 'wide' } },
    { name: 'Cobalt', swatch: ['#2246d1', '#ffffff', '#f3c623'],
      vars: { bg: '#2145cf', surface: '#2b51df', fg: '#ffffff', muted: 'rgba(255,255,255,.66)', accent: '#f3c623', accent2: '#0f1f66', line: 'rgba(255,255,255,.22)' },
      fonts: { display: 'Anton:400', body: 'Archivo:400;500;600', mono: 'IBM Plex Mono:400' }, opts: { layout: 'stack' } },
    { name: 'Noir', swatch: ['#111214', '#ecdfc8', '#8b8b8b'],
      vars: { bg: '#121315', surface: '#1b1c1f', fg: '#ecdfc8', muted: '#8f8a80', accent: '#ecdfc8', accent2: '#3a3a3a', line: 'rgba(236,223,200,.16)' },
      fonts: { display: 'Big Shoulders Display:700;900', body: 'Archivo:400;500;600', mono: 'IBM Plex Mono:400' }, opts: { layout: 'knock' } },
  ],
  layout: { works: [16, 17] },
  shell(c) {
    return {
      bg: `<div class="vi-glow"></div>`,
      nav: `<header class="vi-top">
          <button class="vi-mark" data-go="0" data-hover>${c.logo()}<span>${c.esc(c.name)}</span></button>
          <nav class="vi-nav" aria-label="Sections">${c.nav({ num: true })}</nav>
          ${c.menuBtn('vi-burger')}
        </header>
        <aside class="vi-rail" aria-label="Contact">${c.contactLinks({ limit: 6 })}</aside>
        <div class="vi-count" aria-hidden="true"><b>${c.secs.map((s) => `<span>${s.n}</span>`).join('')}</b><i></i><span>${c.pad2(c.secs.length)}</span></div>
        ${c.drawer()}`,
    };
  },
  home(c) {
    const L = c.opt('layout');
    const cut = c.img(c.P.cutout) || c.img(c.P.photo);
    const word = L === 'wide' ? c.last || c.first : '';
    const typeLayer = (cls) => L === 'wide'
      ? `<div class="vi-word ${cls}" style="--len:${Math.max(3, word.length)}" aria-hidden="${cls === 'front'}">${c.split(word.toUpperCase())}</div>`
      : `<div class="vi-word ${cls}" aria-hidden="${cls === 'front'}"><span class="vi-l1">${c.split(c.first.toUpperCase())}</span><span class="vi-l2">${c.split(c.last.toUpperCase())}</span></div>`;
    return `<div class="vi-hero" data-layout="${L}">
      <h1 class="pf-live">${c.esc(c.name)}</h1>
      ${typeLayer('back')}
      <figure class="vi-fig"><img src="${c.esc(cut)}" alt="${c.esc(c.name)}" draggable="false"></figure>
      ${typeLayer('front')}
      <ul class="vi-roles">${c.roles.map((r, i) => `<li style="--i:${i}">${c.esc(r)}</li>`).join('')}</ul>
      <p class="vi-tag">${c.esc(c.P.tagline || '')}</p>
      <p class="vi-loc">${c.esc(c.P.location || '')}</p>
      ${c.sec('works') ? `<button class="vi-more" data-go="${c.sec('works').i}" data-magnetic data-hover><span>${c.esc(c.sec('works').label)}</span>${c.I('arrow')}</button>` : ''}
    </div>`;
  },
  onEnter(c, i, prev, root) { root.querySelector('.vi-count b').style.setProperty('--k', i); },
  css: () => `
.pf[data-t=vision]{--pad-t:6em;--pad-r:5.4em;--pad-l:5.4em;--pad-b:4.4em;--radius:0px;--grain-o:.09}
.vi-glow{position:absolute;width:80vmax;height:80vmax;left:calc(50% - 40vmax + var(--mx)*4vmax);top:calc(55% - 40vmax + var(--my)*4vmax);background:radial-gradient(closest-side,color-mix(in srgb,var(--accent2) 45%,transparent),transparent);opacity:.55}
.pf[data-v="1"] .vi-glow{background:radial-gradient(closest-side,rgba(120,150,255,.55),transparent)}
.pf[data-v="2"] .vi-glow{opacity:.25}
.vi-top{position:absolute;z-index:20;inset:0 0 auto;display:flex;align-items:center;justify-content:space-between;padding:1.5em 2em;gap:2em}
.vi-mark{display:flex;align-items:center;gap:.8em;font-size:.85em;letter-spacing:.02em}
.vi-mark .pf-logo{height:1.9em}
.pf[data-v="0"] .vi-mark .pf-logo{filter:brightness(0) saturate(0)}
.pf[data-v="1"] .vi-mark .pf-logo,.pf[data-v="2"] .vi-mark .pf-logo{filter:brightness(0) invert(1)}
.vi-nav{display:flex;gap:1.9em;font-size:.82em}
.vi-nav .pf-nav-a{opacity:.62;position:relative}
.vi-nav .pf-nav-a:hover,.vi-nav .pf-nav-a.is-cur{opacity:1}
.vi-nav .pf-nav-a.is-cur .pf-nav-l{text-decoration:line-through;text-decoration-thickness:1px}
.vi-rail{position:absolute;z-index:20;left:1.6em;top:50%;transform:translateY(-50%);display:flex;flex-direction:column;gap:.35em}
.vi-rail .pf-ct{width:2.3em;height:2.3em;opacity:.7}
.vi-rail .pf-ct:hover{opacity:1;transform:scale(1.12)}
.vi-count{position:absolute;z-index:20;right:2em;bottom:1.5em;display:flex;align-items:center;gap:.7em;font-family:var(--f-mono);font-size:.75em}
.vi-count b{display:block;height:1.3em;overflow:hidden;font-weight:400}
.vi-count b span{display:block;line-height:1.3em;transform:translateY(calc(var(--k,0) * -100%));transition:transform .9s var(--ease)}
.vi-count i{width:2.5em;height:1px;background:currentColor;opacity:.5}
/* hero */
.vi-hero{position:absolute;inset:calc(var(--pad-t) * -1) calc(var(--pad-r) * -1) calc(var(--pad-b) * -1) calc(var(--pad-l) * -1);overflow:hidden}
.vi-fig{position:absolute;left:50%;bottom:0;height:88%;aspect-ratio:1606/1500;transform:translate(calc(-50% + var(--mx) * -10px),calc(var(--my) * -6px));z-index:2;opacity:0;transition:opacity 1.4s var(--out) .2s}
.vi-fig img{width:100%;height:100%;object-fit:contain;object-position:bottom}
.pf[data-v="1"] .vi-fig img{filter:grayscale(1) contrast(1.15) brightness(1.05);mix-blend-mode:luminosity}
.pf[data-v="2"] .vi-fig img{filter:grayscale(1) contrast(1.1)}
.vi-word{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-family:var(--f-display);line-height:.82;pointer-events:none;transform:translate(calc(var(--mx) * 14px),calc(var(--my) * 8px))}
.vi-word.back{z-index:1}
.vi-word.front{z-index:3;color:transparent;-webkit-text-stroke:1.2px var(--fg)}
.vi-word .ch{display:inline-block;transform:translateY(110%);transition:transform 1.3s var(--ease);transition-delay:calc(.1s + var(--c) * 60ms)}
.vi-word .pf-w{display:inline-flex;overflow:hidden;padding:0 .02em}
.pf-sec-home.is-on .vi-word .ch,.pf[data-static] .vi-word .ch{transform:none}
.pf-sec-home.is-on .vi-fig,.pf[data-static] .vi-fig{opacity:1}
[data-layout=wide] .vi-word{font-size:min(calc(132vw / var(--len,6)),62vh);letter-spacing:.06em;margin-right:-.06em;top:-6%;font-weight:400}
[data-layout=wide] .vi-word .ch:nth-child(odd){font-style:normal}
[data-layout=stack] .vi-word{flex-direction:column;align-items:flex-start;justify-content:center;padding-left:7vw;font-size:min(20vw,36vh);text-transform:uppercase;line-height:.86}
[data-layout=stack] .vi-l2{margin-left:12vw}
[data-layout=stack] .vi-fig{left:58%}
[data-layout=knock] .vi-word{flex-direction:column;font-size:min(23vw,40vh);font-weight:900;line-height:.8;letter-spacing:-.01em;top:-4%}
[data-layout=knock] .vi-word.front{-webkit-text-stroke:1.5px var(--fg)}
.vi-roles{position:absolute;z-index:4;left:calc(var(--pad-l) + .2em);top:calc(var(--pad-t) + 1.6em);font-size:.78em;line-height:1.7;opacity:.85}
.vi-roles li{opacity:0;transform:translateX(-.8em);transition:all .8s var(--out);transition-delay:calc(1.1s + var(--i) * 90ms)}
.vi-roles li::before{content:"";display:inline-block;width:.9em;height:1px;background:currentColor;vertical-align:middle;margin-right:.6em;opacity:.6}
.vi-tag{position:absolute;z-index:4;left:calc(var(--pad-l) + .2em);bottom:calc(var(--pad-b) + .5em);max-width:30ch;font-size:.86em;line-height:1.5;opacity:0;transition:opacity 1s 1.4s}
.vi-loc{position:absolute;z-index:4;right:calc(var(--pad-r) + .2em);top:calc(var(--pad-t) + 1.6em);font-size:.78em;opacity:0;transition:opacity 1s 1.4s;text-align:right}
.vi-more{position:absolute;z-index:4;right:calc(var(--pad-r) + .2em);bottom:calc(var(--pad-b) + .3em);display:flex;align-items:center;gap:.9em;font-size:.8em;opacity:0;transition:opacity 1s 1.6s,transform .4s var(--out)}
.vi-more svg{width:2.8em;height:2.8em;padding:.75em;border-radius:50%;background:var(--fg);color:var(--bg)}
.pf-sec-home.is-on :is(.vi-roles li,.vi-tag,.vi-loc,.vi-more),.pf[data-static] :is(.vi-roles li,.vi-tag,.vi-loc,.vi-more){opacity:1;transform:none}
.pf[data-v="1"] .vi-more svg{background:var(--accent);color:#0f1f66}
/* sections */
.pf[data-t=vision] .pf-head{border-bottom:1px solid var(--line);padding-bottom:.8em}
.pf[data-t=vision] .pf-head-t{font-weight:400;font-size:clamp(2.2em,6vmin,4.6em);letter-spacing:-.01em}
.pf[data-t=vision][data-v="1"] .pf-head-t{text-transform:uppercase;letter-spacing:.01em}
.pf[data-t=vision][data-v="2"] .pf-head-t{text-transform:uppercase;font-weight:900}
.pf[data-t=vision] .pf-head-n{font-size:.8em;color:var(--fg);opacity:.6;order:-1}
.pf[data-t=vision] .pf-head-s{flex-basis:auto;margin-left:auto;text-align:right;max-width:34ch}
.pf[data-t=vision] .pf-card{background:transparent;border:0;border-radius:0}
.pf[data-t=vision] .pf-card-body{padding:.6em 0 0}
.pf[data-t=vision] .pf-card-media{border-radius:0}
.pf[data-t=vision] .pf-card-title{font-family:var(--f-display);font-size:1.2em;font-weight:400}
.pf[data-t=vision][data-v="1"] .pf-card-title,.pf[data-t=vision][data-v="2"] .pf-card-title{text-transform:uppercase;font-size:1.25em;letter-spacing:.01em}
.pf[data-t=vision] .pf-card-media img{filter:grayscale(.25)}
.pf[data-t=vision] .pf-card:hover .pf-card-media img{filter:none}
.pf[data-t=vision] .pf-repo{border:1px solid var(--line);padding:1em}
.pf[data-t=vision] .pf-chip,.pf[data-t=vision] .pf-tab{border-radius:0;border:0;border-bottom:1px solid transparent;padding:.3em .1em;margin-right:1em}
.pf[data-t=vision] .pf-chip[aria-pressed=true],.pf[data-t=vision] .pf-tab[aria-selected=true]{background:none;color:var(--fg);border-bottom-color:var(--fg)}
.pf[data-t=vision] .pf-chip,.pf[data-t=vision] .pf-tab{color:var(--muted)}
.pf[data-t=vision] .pf-btn{border-radius:0}
.pf[data-t=vision] .pf-xp,.pf[data-t=vision] .pf-edu,.pf[data-t=vision] .pf-skill{border:0;border-top:1px solid var(--line);border-radius:0;padding:.8em 0}
.pf[data-t=vision] .pf-port-item{border:0;background:transparent}
.pf[data-t=vision] .pf-port-t{font-weight:400;font-size:clamp(1.6em,4vmin,3em)}
.pf[data-t=vision][data-v="1"] .pf-port-t,.pf[data-t=vision][data-v="2"] .pf-port-t{text-transform:uppercase}
.pf[data-t=vision] .pf-stats dd{font-weight:400}
.pf[data-t=vision] .pf-modal-box{border-radius:0}
.pf[data-t=vision] .pf-sec-in{transition:transform 1.1s var(--ease)}
/* responsive */
.pf[data-w=md] .vi-nav{gap:1.2em}
.pf[data-w=sm] .vi-nav,.pf[data-w=xs] .vi-nav{display:none}
.pf[data-w=sm] .pf-burger,.pf[data-w=xs] .pf-burger{display:block}
.pf[data-w=xs]{--pad-r:1.2em;--pad-l:1.2em}
.pf[data-w=xs] .vi-rail,.pf[data-h=tiny] .vi-rail{display:none}
.pf[data-w=xs] .vi-top{padding:1em 1.1em}
.pf[data-w=xs] .vi-mark span{display:none}
.pf[data-w=xs] .vi-count{right:1.1em;bottom:1em}
.pf[data-o=p] .vi-fig{height:62%}
.pf[data-o=p] [data-layout=wide] .vi-word{font-size:min(calc(140vw / var(--len,6)),40vh);top:-18%}
.pf[data-o=p] [data-layout=stack] .vi-word{font-size:min(26vw,26vh);justify-content:flex-start;padding-top:13vh}
.pf[data-o=p] [data-layout=stack] .vi-fig{left:50%}
.pf[data-o=p] [data-layout=knock] .vi-word{justify-content:flex-start;padding-top:13vh;font-size:min(27vw,30vh)}
.pf[data-o=p] .vi-roles,.pf[data-o=p] .vi-loc{display:none}
.pf[data-o=p] .vi-tag{max-width:none;right:calc(var(--pad-r));bottom:calc(var(--pad-b) + 3.2em);z-index:4;background:color-mix(in srgb,var(--bg) 80%,transparent);padding:.6em .8em;backdrop-filter:blur(6px)}
.pf[data-o=p] .pf-head-s{margin-left:0;text-align:left}
.pf[data-h=tiny] .vi-roles,.pf[data-h=tiny] .vi-tag{display:none}
.pf[data-h=tiny] .vi-fig{height:96%}
.pf[data-h=tiny] .vi-top{padding:.6em 1.2em}
`,
};
