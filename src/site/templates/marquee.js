/*! Portfolio Studio. Copyright (c) 2026 Roy Borkin. All rights reserved. Unauthorized copying, modification or distribution is prohibited without written permission. */
// 17 — Marquee : a studio-portrait landing. You, cut out on a flat field, with your name running
// past in one enormous line. Sections arrive under a bending curtain that carries the section name;
// buttons are magnetic and fill from below; the cursor stays native until it finds your work.
import { maskWords, clock, peek, listCss, still } from '../kit.js';

const GLOBE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><circle cx="12" cy="12" r="9"/><g class="mq-mer"><ellipse cx="12" cy="12" rx="4" ry="9"/><path d="M12 3v18"/></g><path d="M3.5 9h17M3.5 15h17"/></svg>';
const ARROW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M6 6l12 12M18 8v10H8"/></svg>';

export default {
  id: 'marquee',
  name: 'Marquee',
  blurb: 'Studio portrait, a name that never stops scrolling, a curtain that bends between sections.',
  cursor: 'bubble',
  magnetic: 0.6,
  transition(from, to, dir, ax, pt, root) {
    const cur = root.querySelector('.mq-curtain');
    const lab = cur.querySelector('b');
    lab.textContent = to.getAttribute('aria-label') || '';
    const E = 'cubic-bezier(.76,0,.24,1)';
    const R = '50% 50% 0 0 / 14vh 14vh 0 0', F = '0 0 0 0 / 0 0 0 0', B = '0 0 50% 50% / 0 0 14vh 14vh';
    const up = dir > 0;
    const a = cur.animate([
      { transform: `translateY(${up ? 110 : -110}%)`, borderRadius: up ? R : B },
      { transform: 'translateY(0)', borderRadius: F, offset: 0.42 },
      { transform: 'translateY(0)', borderRadius: F, offset: 0.58 },
      { transform: `translateY(${up ? -110 : 110}%)`, borderRadius: up ? B : R },
    ], { duration: 1500, easing: E });
    const l = cur.querySelector('.mq-cl').animate([{ opacity: 0, transform: 'translateY(30px)' }, { opacity: 1, transform: 'none', offset: 0.4 }, { opacity: 1, transform: 'none', offset: 0.6 }, { opacity: 0, transform: 'translateY(-30px)' }], { duration: 1500, easing: E });
    return [a, l,
      from.animate([{ transform: 'none' }, { transform: `translateY(${up ? -8 : 8}vh)`, offset: 0.45 }, { transform: `translateY(${up ? -8 : 8}vh)`, opacity: 0, offset: 0.46 }, { opacity: 0 }], { duration: 1500, easing: E, fill: 'forwards' }),
      to.animate([{ opacity: 0 }, { opacity: 0, offset: 0.55 }, { opacity: 1, transform: `translateY(${up ? 10 : -10}vh)`, offset: 0.56 }, { opacity: 1, transform: 'none' }], { duration: 1500, easing: E, fill: 'both' }),
    ];
  },
  variants: [
    { name: 'Studio grey', swatch: ['#999d9e', '#1c1d20', '#455ce9'],
      vars: { bg: '#999d9e', hero: '#ffffff', paper: '#ffffff', ink: '#1c1d20', fg: '#1c1d20', muted: '#6c6f76', surface: '#f2f2f0', accent: '#455ce9', accent2: '#1c1d20', line: 'rgba(28,29,32,.14)', curtain: '#1c1d20', ctext: '#ffffff' },
      fonts: { display: 'Host Grotesk:300;400;500;600', body: 'Host Grotesk:300;400;500;600', mono: 'JetBrains Mono:400' } },
    { name: 'Cobalt', swatch: ['#2a43f0', '#eceae4', '#17181b'],
      vars: { bg: '#2a43f0', hero: '#ffffff', paper: '#eceae4', ink: '#17181b', fg: '#17181b', muted: '#6f6e6a', surface: '#e2e0d9', accent: '#17181b', accent2: '#2a43f0', line: 'rgba(23,24,27,.15)', curtain: '#17181b', ctext: '#eceae4' },
      fonts: { display: 'Host Grotesk:300;400;500;600', body: 'Host Grotesk:300;400;500;600', mono: 'JetBrains Mono:400' } },
    { name: 'Oxide night', swatch: ['#1e1a1d', '#f4ede6', '#ff5a36'],
      vars: { bg: '#2b2528', hero: '#f4ede6', paper: '#1e1a1d', ink: '#f4ede6', fg: '#f4ede6', muted: '#a0948c', surface: '#2b2528', accent: '#ff5a36', accent2: '#f2c14e', line: 'rgba(244,237,230,.14)', curtain: '#ff5a36', ctext: '#1e1a1d' },
      fonts: { display: 'Host Grotesk:300;400;500;600', body: 'Host Grotesk:300;400;500;600', mono: 'JetBrains Mono:400' } },
  ],
  layout: { works: [56, 4.6] },
  shell(c) {
    const loc = c.P.location || '';
    const city = loc.split(',').pop().trim() || loc;
    return {
      nav: `<header class="mq-top">
          <button class="mq-brand" data-go="0" data-hover aria-label="${c.esc(c.name)}"><span class="mq-c">©</span><span class="mq-by"><span>Made by ${c.esc(c.first)}</span><span>${c.esc(c.name)}</span></span></button>
          <nav class="mq-nav" aria-label="Sections">${c.secs.map((s) => `<a class="pf-nav-a" href="#${s.id}" data-go="${s.i}"><span class="pf-nav-l">${c.esc(s.label)}</span></a>`).join('')}</nav>
          ${c.menuBtn('mq-burger')}
        </header>
        ${loc ? `<div class="mq-loc"><span>Located in<br>${c.esc(city)}</span><i>${GLOBE}</i></div>` : ''}
        <footer class="mq-foot"><div><small>Local time</small><b class="mq-time">--:--</b></div><div class="mq-soc">${c.contacts.filter((x) => /^https?:/.test(c.contactHref(x))).slice(0, 4).map((x) => `<a href="${c.esc(c.contactHref(x))}" target="_blank" rel="noopener" data-hover>${c.esc(x.label || x.type)}</a>`).join('')}</div></footer>
        <div class="mq-curtain" aria-hidden="true"><span class="mq-cl"><i></i><b></b></span></div>
        <div class="mq-intro" aria-hidden="true"><span class="mq-cl"><i></i><b></b></span></div>
        ${c.drawer('mq-drawer')}`,
    };
  },
  home(c) {
    const cut = c.img(c.P.cutout) || c.img(c.P.photo);
    const word = `${c.esc(c.name)} <i>—</i> `;
    return `<div class="mq-hero">
      <figure class="mq-fig"><img src="${c.esc(cut)}" alt="${c.esc(c.name)}" draggable="false"></figure>
      <div class="mq-role">${ARROW}<p>${c.roles.slice(0, 2).map((r) => `<span>${c.esc(r)}</span>`).join('')}</p></div>
      <button class="mq-cta" data-contact data-magnetic data-cursor="" data-hover><span>Get in touch</span></button>
      <div class="mq-run" aria-hidden="true"><div class="mq-track"><span>${word.repeat(3)}</span><span>${word.repeat(3)}</span></div></div>
      <h1 class="pf-sr">${c.esc(c.name)}, ${c.esc(c.roles.join(', '))}</h1>
    </div>`;
  },
  head(c, s) {
    return `<header class="pf-head"><span class="pf-head-n">${s.n}</span><h2 class="pf-head-t">${maskWords(c.esc, s.title || s.label)}</h2>${s.subtitle ? `<p class="pf-head-s">${c.esc(s.subtitle)}</p>` : ''}</header>`;
  },
  mount(c, root, st) {
    const off = [];
    off.push(clock(root.querySelector('.mq-time'), c.P.timezone));
    if (c.slot?.('sections') !== false) off.push(peek(root, c, 'mq-peek'));
    // the running name: time-based, reverses with travel direction, speeds up while a section changes
    const tr = root.querySelector('.mq-track');
    let x = 0, dir = -1, boost = 0;
    root._mqDir = (d) => { dir = d > 0 ? -1 : 1; boost = 1; };
    if (tr && !still(root)) off.push(c.loop((t) => { boost *= 0.96; x += dir * (0.045 + boost * 0.5); if (x <= -50) x += 50; if (x > 0) x -= 50; tr.style.transform = `translate3d(${x.toFixed(3)}%,0,0)`; }));
    // first visit: the roles flick past, then the curtain lifts
    const intro = root.querySelector('.mq-intro');
    if (!window.__mqIntro && !still(root) && !st?.opts?.edit && !st?.opts?.section) {
      window.__mqIntro = 1;
      const b = intro.querySelector('b'); const words = [c.name, ...c.roles];
      intro.classList.add('is-on'); let k = 0;
      const tick = () => { b.textContent = words[k]; k++; if (k < words.length) tm = setTimeout(tick, k === 1 ? 900 : 170); else tm = setTimeout(lift, 380); };
      const lift = () => { intro.animate([{ transform: 'none', borderRadius: '0 0 0 0 / 0 0 0 0' }, { transform: 'translateY(-110%)', borderRadius: '0 0 50% 50% / 0 0 18vh 18vh' }], { duration: 950, easing: 'cubic-bezier(.76,0,.24,1)', fill: 'forwards' }).finished.then(() => intro.classList.remove('is-on')).catch(() => {}); };
      let tm = setTimeout(tick, 120);
      off.push(() => clearTimeout(tm));
    }
    return () => off.forEach((f) => f());
  },
  onLeave(c, from, to, root) { root._mqDir?.(to - from); },
  css: () => `
.pf[data-t=marquee]{--pad-t:7.4em;--pad-r:4.4em;--pad-l:4.4em;--pad-b:5.2em;--radius:0px;--grain-o:0;--cursor:var(--accent);font-weight:400}
.pf[data-t=marquee] .pf-cursor{--cl:#fff}
.pf[data-t=marquee][data-v="2"] .pf-cursor{--cl:#1e1a1d}
.pf[data-t=marquee] .pf-sec:not(.pf-sec-home){background:var(--paper);color:var(--ink)}
.pf[data-t=marquee] .pf-sec-home{background:var(--bg);padding:0;color:var(--hero)}
.pf-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)}
/* header */
.mq-top{position:absolute;z-index:40;inset:0 0 auto;display:flex;align-items:center;justify-content:space-between;padding:2.2em 2.6em;color:var(--ink);transition:color .5s .5s}
.pf[data-cur=home] .mq-top{color:var(--hero)}
.mq-brand{display:flex;align-items:center;gap:.5em;font-weight:500;overflow:hidden}
.mq-c{display:inline-block;font-size:1.1em;transition:transform .7s cubic-bezier(.76,0,.24,1)}
.mq-by{position:relative;display:inline-flex;overflow:hidden;white-space:nowrap}
.mq-by span{display:inline-block;transition:transform .7s cubic-bezier(.76,0,.24,1)}
.mq-by span:last-child{position:absolute;left:0;transform:translateY(115%)}
@media (hover:hover){.mq-brand:hover .mq-c{transform:rotate(360deg)}.mq-brand:hover .mq-by span:first-child{transform:translateY(-115%)}.mq-brand:hover .mq-by span:last-child{transform:none}}
.mq-nav{display:flex;gap:2.2em}
.mq-nav .pf-nav-a{position:relative;padding:.4em 0;font-weight:400}
.mq-nav .pf-nav-a::after{content:"";position:absolute;left:50%;bottom:-.3em;width:5px;height:5px;margin-left:-2.5px;border-radius:50%;background:currentColor;scale:0;transition:scale .25s cubic-bezier(.23,1,.32,1)}
.mq-nav .pf-nav-a.is-cur::after{scale:1}
@media (hover:hover){.mq-nav .pf-nav-a:hover::after{scale:1}}
.mq-burger{display:none;width:3.6em;height:3.6em;border-radius:50%;background:var(--curtain);color:var(--ctext)}
.mq-burger i{left:1.2em;right:1.2em}.mq-burger i:first-child{top:1.55em}.mq-burger i:last-child{top:2em}
.pf-drawer-open .mq-burger i:first-child{transform:translateY(.22em) rotate(45deg)}
.mq-drawer{--drawer-bg:var(--curtain);color:var(--ctext);padding-left:2.4em}
.mq-drawer .pf-nav-a{font-weight:400;letter-spacing:-.02em}
.mq-drawer .pf-nav-n{color:inherit;opacity:.5}
.mq-drawer .pf-nav-a.is-cur{color:inherit}
.mq-drawer .pf-drawer-ct{color:inherit;opacity:.7}
/* location pill */
.mq-loc{position:absolute;z-index:12;left:0;top:44%;display:flex;align-items:center;gap:2.2em;padding:1.1em 1.1em 1.1em 2.4em;border-radius:0 999px 999px 0;background:var(--curtain);color:var(--ctext);font-size:.95em;line-height:1.25;transition:translate .8s cubic-bezier(.76,0,.24,1)}
.mq-loc i{display:grid;place-items:center;width:3.6em;height:3.6em;border-radius:50%;background:color-mix(in srgb,var(--ctext) 14%,transparent)}
.mq-loc svg{width:2.2em;height:2.2em}
.mq-mer{transform-origin:12px 12px;animation:mqSpin 4.5s linear infinite}
@keyframes mqSpin{0%{transform:scaleX(1)}50%{transform:scaleX(-1)}100%{transform:scaleX(1)}}
.pf:not([data-cur=home]) .mq-loc{translate:-110% 0}
/* hero */
.mq-hero{position:absolute;inset:0;overflow:hidden}
.mq-fig{position:absolute;left:50%;bottom:0;height:min(96%,64vw);aspect-ratio:1695/1500;translate:-50% 0;margin:0}
.mq-fig img{width:100%;height:100%;object-fit:contain;object-position:50% 100%;transform:translate(calc(var(--mx) * -10px),0);transition:transform .2s linear}
.mq-role{position:absolute;right:7%;top:31%;display:flex;flex-direction:column;gap:2.2em;font-size:clamp(1.2em,2.1vw,2.1em);line-height:1.25;font-weight:400}
.mq-role svg{width:1.1em;height:1.1em}
.mq-role p{display:flex;flex-direction:column}
.mq-cta{position:absolute;z-index:3;right:12%;top:58%;width:clamp(7.5em,11vw,11em);aspect-ratio:1;border-radius:50%;background:var(--accent);color:#fff;display:grid;place-items:center;font-weight:500;overflow:hidden;isolation:isolate}
.pf[data-v="2"] .mq-cta{color:#1e1a1d}
.mq-cta::before{content:"";position:absolute;z-index:-1;left:-25%;width:150%;height:150%;top:100%;border-radius:50%;background:var(--curtain);transition:top .45s cubic-bezier(.23,1,.32,1)}
.pf[data-v="0"] .mq-cta::before{background:#3348d4}
.pf[data-v="1"] .mq-cta::before{background:#2a43f0}
.pf[data-v="2"] .mq-cta::before{background:#f2c14e}
@media (hover:hover){.mq-cta:hover::before{top:-25%}}
.mq-run{position:absolute;z-index:2;left:0;right:0;bottom:6%;overflow:hidden;pointer-events:none}
.mq-track{display:flex;width:max-content;will-change:transform}
.mq-track span{white-space:nowrap;font-size:clamp(5em,14.5vw,15em);font-weight:500;letter-spacing:-.035em;line-height:1;padding-right:.25em}
.mq-track i{font-style:normal;font-weight:300;padding:0 .12em}
/* entrance */
.mq-fig,.mq-role,.mq-cta,.mq-run{opacity:0;transition:opacity .9s,translate 1.2s cubic-bezier(.23,1,.32,1)}
.mq-run{translate:0 30%}.mq-role{translate:0 1.2em}.mq-cta{scale:.7;transition:opacity .9s .35s,scale 1s cubic-bezier(.23,1,.32,1) .35s}
.mq-fig{translate:-50% 6%}
.pf-sec-home.is-on :is(.mq-fig,.mq-role,.mq-cta,.mq-run),.pf[data-static] :is(.mq-fig,.mq-role,.mq-cta,.mq-run){opacity:1;translate:none;scale:1}
.pf-sec-home.is-on .mq-fig,.pf[data-static] .mq-fig{translate:-50% 0}
/* curtain + intro */
.mq-curtain,.mq-intro{position:absolute;z-index:80;inset:-2vh 0;background:var(--curtain);color:var(--ctext);display:grid;place-items:center;transform:translateY(110%);pointer-events:none}
.mq-intro{transform:none;display:none;z-index:90}
.mq-intro.is-on{display:grid}
.mq-cl{display:flex;align-items:center;gap:.55em;font-size:clamp(1.8em,4.6vw,4.2em);font-weight:400;letter-spacing:-.025em}
.mq-cl i{width:.22em;height:.22em;border-radius:50%;background:currentColor}
/* footer */
.mq-foot{position:absolute;z-index:20;left:2.6em;right:2.6em;bottom:1.6em;display:flex;justify-content:space-between;align-items:flex-end;color:var(--ink);font-size:.82em;transition:opacity .4s}
.mq-foot small{display:block;color:var(--muted);font-size:.86em;margin-bottom:.25em}
.mq-foot b{font-weight:400;font-variant-numeric:tabular-nums}
.mq-soc{display:flex;gap:1.6em}
.mq-soc a{position:relative}
.mq-soc a::after{content:"";position:absolute;left:0;right:0;bottom:-.15em;height:1px;background:currentColor;scale:0 1;transform-origin:right;transition:scale .4s cubic-bezier(.23,1,.32,1)}
@media (hover:hover){.mq-soc a:hover::after{scale:1 1;transform-origin:left}}
.pf[data-cur=home] .mq-foot{opacity:0;pointer-events:none}
/* sections */
.pf[data-t=marquee] .pf-head{column-gap:1.2em;align-items:flex-end;padding-bottom:1.4em;border-bottom:1px solid var(--line)}
.pf[data-t=marquee] .pf-head-n{display:none}
.pf[data-t=marquee] .pf-head-t{font-weight:400;font-size:clamp(2.6em,7vmin,6em);letter-spacing:-.04em;line-height:.95}
.pf[data-t=marquee] .pf-head-s{flex-basis:auto;margin-left:auto;max-width:30ch;text-align:right;color:var(--muted)}
.pf[data-t=marquee] :is(.pf-btn,.pf-chip,.pf-tab,.pf-pg,.pf-igp){position:relative;overflow:hidden;isolation:isolate;border-radius:999px;border:1px solid var(--line);background:transparent;color:var(--ink);transition:color .35s,border-color .35s}
.pf[data-t=marquee] :is(.pf-btn,.pf-chip,.pf-tab,.pf-pg)::before{content:"";position:absolute;z-index:-1;left:-25%;width:150%;height:200%;top:100%;border-radius:50%;background:var(--accent);transition:top .45s cubic-bezier(.23,1,.32,1)}
.pf[data-t=marquee] :is(.pf-chip[aria-pressed=true],.pf-tab[aria-selected=true],.pf-btn:not(.pf-btn-ghost)){background:var(--ink);color:var(--paper);border-color:var(--ink)}
@media (hover:hover){.pf[data-t=marquee] :is(.pf-btn,.pf-chip,.pf-tab,.pf-pg):hover{color:#fff;border-color:var(--accent)}.pf[data-t=marquee] :is(.pf-btn,.pf-chip,.pf-tab,.pf-pg):hover::before{top:-50%}}
.pf[data-t=marquee][data-v="2"] :is(.pf-btn,.pf-chip,.pf-tab,.pf-pg):hover{color:#1e1a1d}
.pf[data-t=marquee] .pf-chip,.pf[data-t=marquee] .pf-tab{padding:.65em 1.3em}
.pf[data-t=marquee] .pf-card{background:var(--surface);border:0;border-radius:.6em}
.pf[data-t=marquee] .pf-card-title{font-weight:500}
.pf[data-t=marquee] .pf-sec-works .pf-card-title{font-weight:400}
.pf[data-t=marquee] .pf-profile-img{border-radius:.6em}
.pf[data-t=marquee] .pf-stats dd{font-weight:400;letter-spacing:-.04em}
.pf[data-t=marquee] .pf-port-item{border-radius:.6em;background:var(--surface);border:0}
.pf[data-t=marquee] .pf-port-t{font-weight:400;letter-spacing:-.03em}
.pf[data-t=marquee] .pf-modal-box{border-radius:1em;background:var(--paper);color:var(--ink)}
${listCss('marquee', { peek: 'mq-peek', thumbs: false, size: 'clamp(1.3em,3.2vmin,2.6em)' })}
.mq-peek{background:var(--surface)}
/* responsive */
.pf[data-t=marquee][data-w=sm] .mq-nav,.pf[data-t=marquee][data-w=xs] .mq-nav{display:none}
.pf[data-t=marquee][data-w=sm] .mq-burger,.pf[data-t=marquee][data-w=xs] .mq-burger{display:block}
.pf[data-t=marquee][data-w=xs]{--pad-t:6.2em;--pad-r:1.3em;--pad-l:1.3em;--pad-b:4.8em}
.pf[data-t=marquee][data-w=xs] .mq-top{padding:1.3em 1.3em}
.pf[data-t=marquee][data-w=xs] .mq-foot{left:1.3em;right:1.3em}
.pf[data-t=marquee][data-w=xs] .pf-head-s{display:none}
.pf[data-t=marquee][data-o=p] .mq-fig{height:auto;width:150vw;bottom:0}
.pf[data-t=marquee][data-o=p] .mq-role{left:1.4em;right:auto;top:6.4em;gap:1em;font-size:1.25em}
.pf[data-t=marquee][data-o=p] .mq-loc{top:auto;bottom:38%;font-size:.8em;padding-left:1.4em;gap:1.2em}
.pf[data-t=marquee][data-o=p] .mq-cta{right:6%;top:auto;bottom:34%;width:7em}
.pf[data-t=marquee][data-o=p] .mq-run{bottom:3%}
.pf[data-t=marquee][data-o=p] .mq-track span{font-size:30vw}
.pf[data-t=marquee][data-h=tiny] .mq-top{padding:.9em 1.6em}
.pf[data-t=marquee][data-h=tiny] .mq-loc{display:none}
.pf[data-t=marquee][data-h=tiny] .mq-role{top:22%;font-size:1.1em;gap:.8em}
.pf[data-t=marquee][data-h=tiny] .mq-cta{top:40%;width:6.4em}
.pf[data-t=marquee][data-h=tiny]{--pad-t:4.4em;--pad-b:2.2em}
.pf[data-t=marquee][data-h=tiny] .mq-foot{display:none}
`,
};
