/*! Portfolio Studio. Copyright (c) 2026 Roy Borkin. All rights reserved. Unauthorized copying, modification or distribution is prohibited without written permission. */
// 19 — Atelier : quiet luxury, monochrome. A serif statement does the talking, navigation is a
// conversation ("What would you like to see?"), photos sit in greyscale until you look at them,
// and the band of words at the bottom melts into blur under the pointer. A label trails the cursor.
import { maskWords, clock, still } from '../kit.js';

const STAR = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2v20M2 12h20M4.9 4.9l14.2 14.2M19.1 4.9 4.9 19.1" stroke="currentColor" stroke-width="1.2" fill="none"/></svg>';

export default {
  id: 'atelier',
  name: 'Atelier',
  blurb: 'Monochrome editorial: a serif statement, conversational navigation, words that melt under the pointer.',
  cursor: 'pill',
  magnetic: 0.25,
  transition(from, to, dir) {
    return [
      from.animate([{ opacity: 1, filter: 'blur(0)', transform: 'none' }, { opacity: 0, filter: 'blur(14px)', transform: `translateY(${-dir * 2}vh)` }], { duration: 480, easing: 'cubic-bezier(.55,0,.75,.2)', fill: 'forwards' }),
      to.animate([{ opacity: 0, filter: 'blur(14px)', transform: `translateY(${dir * 2}vh)` }, { opacity: 1, filter: 'blur(0)', transform: 'none' }], { duration: 850, delay: 360, easing: 'cubic-bezier(.23,1,.32,1)', fill: 'both' }),
    ];
  },
  variants: [
    { name: 'Monochrome', swatch: ['#ffffff', '#0a0a0a', '#8a8a8a'],
      vars: { bg: '#ffffff', surface: '#f3f3f2', fg: '#0a0a0a', muted: '#7d7d7b', accent: '#0a0a0a', accent2: '#8a8a8a', line: 'rgba(10,10,10,.13)' },
      fonts: { displayFallback: 'Georgia, "Times New Roman", serif', display: 'Fraunces:300;400;i300', body: 'Bricolage Grotesque:400;500', mono: 'JetBrains Mono:400' } },
    { name: 'Obsidian', swatch: ['#0b0b0c', '#edebe6', '#9fb8c9'],
      vars: { bg: '#0b0b0c', surface: '#161618', fg: '#edebe6', muted: '#86847f', accent: '#9fb8c9', accent2: '#edebe6', line: 'rgba(237,235,230,.13)' },
      fonts: { displayFallback: 'Georgia, "Times New Roman", serif', display: 'Fraunces:300;400;i300', body: 'Bricolage Grotesque:400;500', mono: 'JetBrains Mono:400' } },
    { name: 'Oxblood', swatch: ['#efe6da', '#2a0f12', '#7a1e25'],
      vars: { bg: '#efe6da', surface: '#e6dacb', fg: '#2a0f12', muted: '#8c6f66', accent: '#7a1e25', accent2: '#2a0f12', line: 'rgba(42,15,18,.14)' },
      fonts: { displayFallback: 'Georgia, "Times New Roman", serif', display: 'Fraunces:300;400;i300', body: 'Bricolage Grotesque:400;500', mono: 'JetBrains Mono:400' } },
  ],
  layout: { works: [16, 16] },
  shell(c) {
    return {
      nav: `<header class="at-top">
          <button class="at-mark" data-go="0" data-hover data-cursor="Home">${c.esc(c.name)}</button>
          <nav class="at-nav" aria-label="Sections">${c.secs.map((s) => `<a class="pf-nav-a" href="#${s.id}" data-go="${s.i}"><span class="pf-nav-l">${c.esc(s.label)}</span></a>`).join('')}</nav>
          <button class="at-talk" data-contact data-hover data-cursor="Contact">Start a conversation</button>
          ${c.menuBtn('at-burger')}
        </header>
        <footer class="at-foot"><span>${c.esc((c.P.location || '').split(',')[0])}${c.P.location ? ', ' : ''}<b class="at-time">--:--</b></span><span class="at-cts">${c.contactLinks({ limit: 5 })}</span></footer>
        ${c.drawer('at-drawer')}`,
    };
  },
  home(c) {
    const P = c.P;
    const photo = c.img(P.photo);
    const choices = c.secs.filter((s) => s.id !== 'home');
    const band = [...c.roles, P.location ? P.location.split(',')[0] : ''].filter(Boolean);
    const run = band.map((w) => `<span class="at-w">${c.esc(w)}</span><i>${STAR}</i>`).join('');
    return `<div class="at-hero">
      <p class="at-kicker">${c.esc(P.intro || '')} ${c.esc(c.name)}</p>
      <h1 class="at-say">${maskWords(c.esc, P.tagline || c.roles.join(', '))}</h1>
      ${photo ? `<figure class="at-fig" data-cursor="${c.esc(c.first)}"><img src="${c.esc(photo)}" alt="${c.esc(c.name)}" draggable="false"></figure>` : ''}
      <div class="at-ask"><p>What would you like to see?</p><div class="at-opts">${choices.map((s) => `<button class="at-opt" data-go="${s.i}" data-hover data-cursor="Go to ${c.esc(s.label)}"><i></i><span>${c.esc(s.title || s.label)}</span></button>`).join('')}</div></div>
      <div class="at-band" aria-label="${c.esc(band.join(', '))}"><div class="at-run">${run}${run}${run}${run}</div></div>
    </div>`;
  },
  head(c, s) {
    return `<header class="pf-head"><span class="pf-head-n">${c.esc(s.label)}</span><h2 class="pf-head-t">${maskWords(c.esc, s.title || s.label)}</h2>${s.subtitle ? `<p class="pf-head-s">${c.esc(s.subtitle)}</p>` : ''}</header>`;
  },
  mount(c, root) {
    const off = [];
    off.push(clock(root.querySelector('.at-time'), c.P.timezone));
    const run = root.querySelector('.at-run');
    let x = 0, v = 0.03;
    if (run && !still(root)) {
      const band = run.parentElement;
      let hover = false;
      const en = () => { hover = true; }, lv = () => { hover = false; };
      band.addEventListener('pointerenter', en); band.addEventListener('pointerleave', lv);
      off.push(() => { band.removeEventListener('pointerenter', en); band.removeEventListener('pointerleave', lv); });
      off.push(c.loop(() => { v += ((hover ? 0.008 : 0.03) - v) * 0.05; x -= v; if (x <= -25) x += 25; run.style.transform = `translate3d(${x.toFixed(3)}%,0,0)`; }));
    }
    return () => off.forEach((f) => f());
  },
  css: () => `
.pf[data-t=atelier]{--pad-t:7.2em;--pad-r:3.2em;--pad-l:3.2em;--pad-b:5.4em;--radius:0px;--grain-o:0;--cursor:var(--fg);font-weight:400}
.pf[data-t=atelier] .pf-cursor{--cl:var(--bg)}
/* chrome */
.at-top{position:absolute;z-index:30;inset:0 0 auto;display:flex;align-items:center;gap:1.4em;padding:1.8em 3.2em}
.at-mark{font-family:var(--f-display);font-size:1.35em;font-weight:400;letter-spacing:-.01em}
.at-nav{margin-left:auto;display:flex;gap:.35em}
.at-nav .pf-nav-a,.at-talk{display:inline-flex;align-items:center;height:2.6em;padding:0 1.2em;border:1px solid var(--line);border-radius:2.4em;font-size:.84em;transition:color .3s ease-in-out,background-color .3s ease-in-out,border-color .3s ease-in-out}
.at-nav .pf-nav-a.is-cur{background:var(--fg);color:var(--bg);border-color:var(--fg)}
.at-talk{border-color:var(--fg)}
@media (hover:hover){.at-nav .pf-nav-a:not(.is-cur):hover,.at-talk:hover{background:var(--fg);color:var(--bg);border-color:var(--fg)}}
.at-drawer .pf-nav-a{font-family:var(--f-display);font-weight:300}
.at-drawer .pf-nav-n{display:none}
.at-foot{position:absolute;z-index:20;left:3.2em;right:3.2em;bottom:1.5em;display:flex;align-items:center;justify-content:space-between;font-size:.8em;color:var(--muted)}
.at-foot b{font-weight:400;color:var(--fg);font-variant-numeric:tabular-nums}
.at-cts{display:flex;gap:.1em}
.at-cts .pf-ct{width:2.5em;height:2.5em;display:grid;place-items:center;border-radius:50%;transition:color .3s ease-in-out,background-color .3s ease-in-out}
@media (hover:hover){.at-cts .pf-ct:hover{color:var(--fg);background:var(--surface)}}
/* hero */
.at-hero{position:absolute;inset:0;display:grid;grid-template-columns:minmax(0,1fr) minmax(0,.42fr);grid-template-rows:auto auto 1fr auto;column-gap:4vw}
.at-kicker{grid-column:1;font-size:.9em;color:var(--muted);margin-bottom:1.6em}
.at-say{grid-column:1;grid-row:2;font-family:var(--f-display);font-weight:300;font-size:clamp(2.2em,5.1vw,5.8em);line-height:1.04;letter-spacing:-.025em;max-width:17em;font-variation-settings:"opsz" 144}
.at-fig{grid-column:2;grid-row:1/4;align-self:start;margin:0;aspect-ratio:4/5;max-height:62vh;overflow:hidden;border-radius:999px 999px 0 0;background:var(--surface)}
.at-fig img{width:100%;height:100%;object-fit:cover;object-position:50% 30%;filter:grayscale(1) contrast(1.06);scale:1.08;transition:filter 1.2s ease,scale 1.6s cubic-bezier(.23,1,.32,1)}
@media (hover:hover){.at-fig:hover img{filter:grayscale(0);scale:1.02}}
.at-ask{grid-column:1;grid-row:3;align-self:end;display:flex;flex-direction:column;gap:.9em;padding-bottom:1.6em}
.at-ask p{font-size:.95em;color:var(--muted)}
.at-opts{display:flex;flex-wrap:wrap;gap:.45em}
.at-opt{display:inline-flex;align-items:center;gap:.65em;height:3em;padding:0 1.35em 0 1.05em;border:1px solid var(--fg);border-radius:2.4em;font-size:.95em;transition:color .3s ease-in-out,background-color .3s ease-in-out}
.at-opt i{width:.55em;height:.55em;border-radius:50%;border:1px solid currentColor;transition:background-color .3s ease-in-out}
@media (hover:hover){.at-opt:hover{background:var(--fg);color:var(--bg)}.at-opt:hover i{background:currentColor}}
.at-band{grid-column:1/-1;grid-row:4;overflow:hidden;border-top:1px solid var(--line);border-bottom:1px solid var(--line);padding:.7em 0;margin:0 calc(var(--pad-r) * -1) .6em calc(var(--pad-l) * -1)}
.at-run{display:flex;align-items:center;width:max-content;will-change:transform}
.at-w{font-family:var(--f-display);font-weight:300;font-size:clamp(1.6em,4.2vh,3.2em);letter-spacing:-.02em;line-height:1.1;padding:0 .2em;transition:filter .3s ease-in-out,opacity .3s ease-in-out}
.at-run i{display:grid;place-items:center;margin:0 1.6em;color:var(--muted)}
.at-run i svg{width:1.4em;height:1.4em;animation:atSpin 14s linear infinite}
@keyframes atSpin{to{transform:rotate(1turn)}}
@media (hover:hover){.at-w:hover{filter:blur(12px);opacity:.25}}
/* entrance */
.at-kicker,.at-ask,.at-band{opacity:0;transition:opacity 1s ease .5s}
.at-fig{clip-path:inset(100% 0 0 0);transition:clip-path 1.3s cubic-bezier(.77,0,.18,1) .2s}
.pf-sec-home.is-on :is(.at-kicker,.at-ask,.at-band),.pf[data-static] :is(.at-kicker,.at-ask,.at-band){opacity:1}
.pf-sec-home.is-on .at-fig,.pf[data-static] .at-fig{clip-path:inset(0 0 0 0)}
/* sections */
.pf[data-t=atelier] .pf-head{align-items:baseline;column-gap:1.6em}
.pf[data-t=atelier] .pf-head-n{font-family:var(--f-body);font-size:.84em;color:var(--muted);letter-spacing:0;min-width:7em}
.pf[data-t=atelier] .pf-head-t{font-weight:300;font-size:clamp(2.4em,6.4vmin,5em);letter-spacing:-.03em;line-height:1}
.pf[data-t=atelier] .pf-head-s{flex-basis:auto;margin-left:auto;max-width:34ch;color:var(--muted)}
.pf[data-t=atelier] :is(.pf-chip,.pf-tab,.pf-pg,.pf-igp,.pf-btn){border-radius:2.4em;border:1px solid var(--line);background:transparent;color:var(--fg);transition:color .3s ease-in-out,background-color .3s ease-in-out,border-color .3s ease-in-out}
.pf[data-t=atelier] :is(.pf-chip[aria-pressed=true],.pf-tab[aria-selected=true],.pf-btn:not(.pf-btn-ghost)){background:var(--fg);color:var(--bg);border-color:var(--fg)}
.pf[data-t=atelier] .pf-card{background:transparent;border:0;border-radius:0;transition:opacity .4s ease,filter .4s ease}
.pf[data-t=atelier] .pf-card-media{border-radius:0;background:var(--surface)}
.pf[data-t=atelier] .pf-card-media img{filter:grayscale(1);transition:filter .8s ease,transform .9s var(--out)}
.pf[data-t=atelier] .pf-card-body{padding:.7em 0 0}
.pf[data-t=atelier] .pf-card-title{font-family:var(--f-display);font-weight:300;font-size:1.15em;letter-spacing:-.01em}
@media (hover:hover){
.pf[data-t=atelier] .pf-grid:hover>.pf-card:not(:hover){opacity:.4;filter:blur(3px)}
.pf[data-t=atelier] .pf-card:hover .pf-card-media img{filter:grayscale(0)}}
.pf[data-t=atelier] .pf-repo{border:1px solid var(--line);padding:1.1em}
.pf[data-t=atelier] .pf-profile-img{border-radius:999px 999px 0 0}
.pf[data-t=atelier] .pf-profile-img img{filter:grayscale(1)}
.pf[data-t=atelier] .pf-bio{font-family:var(--f-display);font-weight:300;font-size:1.3em;line-height:1.35}
.pf[data-t=atelier] .pf-stats dd{font-family:var(--f-display);font-weight:300}
.pf[data-t=atelier] :is(.pf-xp,.pf-edu,.pf-skill){background:transparent;border:0;border-top:1px solid var(--line);border-radius:0}
.pf[data-t=atelier] .pf-xp h4,.pf[data-t=atelier] .pf-edu h4,.pf[data-t=atelier] .pf-skill h4{font-family:var(--f-display);font-weight:400}
.pf[data-t=atelier] .pf-port-item{background:transparent;border:0;border-radius:0}
.pf[data-t=atelier] .pf-port-media{border-radius:0}
.pf[data-t=atelier] .pf-port-media img{filter:grayscale(1);transition:filter .8s ease}
@media (hover:hover){.pf[data-t=atelier] .pf-port-item:hover .pf-port-media img{filter:none}}
.pf[data-t=atelier] .pf-port-t{font-family:var(--f-display);font-weight:300;letter-spacing:-.02em}
.pf[data-t=atelier] .pf-port-n{display:none}
.pf[data-t=atelier] .pf-modal-box{border-radius:0;background:var(--bg)}
/* responsive */
.pf[data-t=atelier][data-w=sm] .at-nav,.pf[data-t=atelier][data-w=xs] .at-nav{display:none}
.pf[data-t=atelier][data-w=sm] .at-burger,.pf[data-t=atelier][data-w=xs] .at-burger{display:block}
.pf[data-t=atelier][data-w=sm] .at-talk{margin-left:auto}
.pf[data-t=atelier][data-w=xs] .at-talk{display:none}
.pf[data-t=atelier][data-w=xs] .at-burger{margin-left:auto}
.pf[data-t=atelier][data-w=xs]{--pad-r:1.3em;--pad-l:1.3em;--pad-t:5.4em;--pad-b:4.6em}
.pf[data-t=atelier][data-w=xs] .at-top{padding:1.1em 1.3em}
.pf[data-t=atelier][data-w=xs] .at-foot{left:1.3em;right:1.3em;bottom:1em}
.pf[data-t=atelier][data-w=xs] .pf-head-n,.pf[data-t=atelier][data-w=xs] .pf-head-s{display:none}
.pf[data-t=atelier][data-o=p] .at-hero{grid-template-columns:minmax(0,1fr) 30%;grid-template-rows:auto auto 1fr auto}
.pf[data-t=atelier][data-o=p] .at-fig{grid-row:1/3;max-height:30vh}
.pf[data-t=atelier][data-o=p] .at-say{grid-column:1/-1;grid-row:3;align-self:center;font-size:clamp(1.9em,8.6vw,3.4em)}
.pf[data-t=atelier][data-o=p] .at-kicker{align-self:end}
.pf[data-t=atelier][data-o=p] .at-ask{grid-row:4;grid-column:1/-1;padding-bottom:1em}
.pf[data-t=atelier][data-o=p] .at-band{grid-row:5}
.pf[data-t=atelier][data-o=p] .at-opt{height:2.6em;font-size:.86em}
.pf[data-t=atelier][data-h=tiny]{--pad-t:4.2em;--pad-b:3.2em}
.pf[data-t=atelier][data-h=tiny] .at-top{padding:.7em 1.6em}
.pf[data-t=atelier][data-h=tiny] .at-foot{bottom:.5em}
.pf[data-t=atelier][data-h=tiny] .at-kicker,.pf[data-t=atelier][data-h=tiny] .at-band,.pf[data-t=atelier][data-h=tiny] .at-ask p{display:none}
.pf[data-t=atelier][data-h=tiny] .at-say{font-size:clamp(1.6em,4.4vw,3em)}
.pf[data-t=atelier][data-h=tiny] .at-opt{height:2.3em;font-size:.8em}
.pf[data-t=atelier][data-h=short] .at-band{display:none}
`,
};
