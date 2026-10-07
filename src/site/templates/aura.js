/*! Portfolio Studio. Copyright (c) 2026 Roy Borkin. All rights reserved. Unauthorized copying, modification or distribution is prohibited without written permission. */
// 18 — Aura : one living gradient in a dark room. A shader-drawn glow drifts behind thin, oversized
// type, leans toward the pointer and stirs when you move fast. Every section gives it a new place,
// size and color balance, so changing section feels like the light walking across the room.
import { maskWords, clock, peek, listCss, still, glQuad, hexRgb, lerp } from '../kit.js';

const FRAG = `
uniform vec2 uRes; uniform float uT; uniform vec2 uC; uniform float uS; uniform vec2 uM; uniform float uStir;
uniform vec3 uA; uniform vec3 uB; uniform vec3 uBg; uniform float uMix; uniform float uLight;
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1.,0.)),f.x),mix(h(i+vec2(0.,1.)),h(i+1.),f.x),f.y);}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*n(p);p=p*2.03+vec2(1.7,9.2);a*=.5;}return v;}
void main(){
  vec2 uv=gl_FragCoord.xy/uRes; uv.y=1.-uv.y;
  float asp=uRes.x/uRes.y;
  vec2 p=(uv-uC)*vec2(asp,1.);
  p-=uM*vec2(.09,.07);
  float t=uT*.06;
  vec2 w=vec2(fbm(p*1.4+vec2(t,-t*.7)),fbm(p*1.4+vec2(-t*.8,t)+3.1));
  p+=(w-.5)*(.7+uStir*1.1);
  float d=length(p*vec2(1.,1.12))/uS;
  float m=smoothstep(.66,.0,d);
  float k=fbm(p*2.1+vec2(t*1.6,-t*1.1)+uMix*2.);
  vec3 c=mix(uA,uB,smoothstep(.25,.75,k+uMix*.35-.12));
  vec3 col=mix(uBg,c,m*.98);
  col+=pow(m,3.2)*.22*(1.-uLight);
  col=mix(col,col*mix(vec3(1.),c,.25),uLight*m);
  col+=(h(gl_FragCoord.xy+fract(uT*7.))-.5)*.055;
  gl_FragColor=vec4(col,1.);
}`;
// where the light sits for each section: [x, y, size, colour balance]
const SPOTS = [[0.7, 0.46, 1.0, 0], [0.96, 0.08, 0.62, 0.8], [0.08, 0.92, 0.7, 0.35], [0.88, 0.86, 0.78, 1], [0.5, 1.08, 0.95, 0.55]];

export default {
  id: 'aura',
  name: 'Aura',
  blurb: 'A living shader glow behind thin oversized type; it walks to a new spot for every section.',
  cursor: 'dot',
  transition(from, to, dir) {
    return [
      from.animate([{ opacity: 1, transform: 'none' }, { opacity: 0, transform: `translateY(${-dir * 3}vh)` }], { duration: 480, easing: 'cubic-bezier(.7,0,.84,0)', fill: 'forwards' }),
      to.animate([{ opacity: 0, transform: `translateY(${dir * 4}vh)` }, { opacity: 1, transform: 'none' }], { duration: 1000, delay: 380, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'both' }),
    ];
  },
  variants: [
    { name: 'Eclipse', swatch: ['#07080a', '#2f7fb8', '#e8704f'],
      vars: { bg: '#07080a', surface: 'rgba(255,255,255,.045)', fg: '#f2f0eb', muted: 'rgba(242,240,235,.56)', accent: '#e8704f', accent2: '#2f7fb8', line: 'rgba(242,240,235,.14)', ga: '#2f7fb8', gb: '#e8704f' },
      fonts: { display: 'Space Grotesk:300;400;500', body: 'Space Grotesk:400;500', mono: 'Space Mono:400' }, opts: { light: 0 } },
    { name: 'Moss & ember', swatch: ['#0e110d', '#3e7a5b', '#e8a33d'],
      vars: { bg: '#0d100c', surface: 'rgba(255,255,255,.045)', fg: '#edebe3', muted: 'rgba(237,235,227,.56)', accent: '#e8a33d', accent2: '#3e7a5b', line: 'rgba(237,235,227,.14)', ga: '#3e7a5b', gb: '#e8a33d' },
      fonts: { display: 'Space Grotesk:300;400;500', body: 'Space Grotesk:400;500', mono: 'Space Mono:400' }, opts: { light: 0 } },
    { name: 'Ultraviolet milk', swatch: ['#efece6', '#5b4bff', '#ff6fa5'],
      vars: { bg: '#efece6', surface: 'rgba(255,255,255,.45)', fg: '#141414', muted: 'rgba(20,20,20,.58)', accent: '#5b4bff', accent2: '#ff6fa5', line: 'rgba(20,20,20,.13)', ga: '#7a6cff', gb: '#ff8fb7' },
      fonts: { display: 'Space Grotesk:300;400;500', body: 'Space Grotesk:400;500', mono: 'Space Mono:400' }, opts: { light: 1 } },
  ],
  layout: { works: [56, 4.4] },
  shell(c) {
    return {
      bg: '<canvas class="au-gl"></canvas><div class="au-fall"><i></i><i></i></div>',
      nav: `<header class="au-top">
          <button class="au-brand" data-go="0" data-hover>${c.logo()}<span>${c.esc(c.name)}</span></button>
          <nav class="au-nav" aria-label="Sections"><span class="au-bar" aria-hidden="true"></span>${c.secs.map((s) => `<a class="pf-nav-a" href="#${s.id}" data-go="${s.i}"><span class="pf-nav-l">${c.esc(s.label)}</span></a>`).join('')}</nav>
          <button class="au-say" data-contact data-hover>Say hello</button>
          ${c.menuBtn('au-burger')}
        </header>
        <footer class="au-foot">
          <div class="au-clocks"><span><small>${c.esc((c.P.location || 'Studio').split(',')[0])}</small><b class="au-t1">--:--</b></span><span><small>Your time</small><b class="au-t2">--:--</b></span></div>
          <div class="au-cts">${c.contactLinks({ limit: 5 })}</div>
          <span class="au-idx"><b>01</b> / ${c.pad2(c.secs.length)}</span>
        </footer>
        ${c.drawer('au-drawer')}`,
    };
  },
  home(c) {
    const P = c.P;
    return `<div class="au-hero">
      <p class="au-c au-c1">${P.location ? `Based in ${c.esc(P.location)}` : ''}${P.status ? `<br>${c.esc(P.status)}` : ''}</p>
      <ul class="au-c au-c2">${c.roles.map((r) => `<li>${c.esc(r)}</li>`).join('')}</ul>
      <h1 class="au-name"><span class="au-l">${maskWords(c.esc, c.first)}</span><span class="au-l au-l2">${maskWords(c.esc, c.last, 1)}</span></h1>
      <p class="au-tag">${maskWords(c.esc, P.tagline || '', 2)}</p>
      ${c.sec('works') ? `<button class="au-go" data-go="${c.sec('works').i}" data-hover><span>${c.esc(c.sec('works').label)}</span>${c.I('arrowDown')}</button>` : ''}
    </div>`;
  },
  head(c, s) {
    return `<header class="pf-head"><span class="pf-head-n">${s.n}</span><h2 class="pf-head-t">${maskWords(c.esc, s.title || s.label)}</h2>${s.subtitle ? `<p class="pf-head-s">${c.esc(s.subtitle)}</p>` : ''}</header>`;
  },
  mount(c, root) {
    const off = [];
    off.push(clock(root.querySelector('.au-t1'), c.P.timezone));
    off.push(clock(root.querySelector('.au-t2'), undefined));
    if (c.slot?.('sections') !== false) off.push(peek(root, c, 'au-peek'));
    // sliding nav bar
    const nav = root.querySelector('.au-nav'), bar = root.querySelector('.au-bar');
    const place = () => { const a = nav.querySelector('.pf-nav-a.is-cur'); if (!a) return; const nr = nav.getBoundingClientRect(), r = a.getBoundingClientRect(); bar.style.transform = `translateX(${(r.left - nr.left).toFixed(1)}px)`; bar.style.width = r.width.toFixed(1) + 'px'; };
    root._auPlace = place; place();
    const ro = new ResizeObserver(place); ro.observe(nav); off.push(() => ro.disconnect());
    // the glow
    const cv = root.querySelector('.au-gl');
    const css = getComputedStyle(root);
    const A = hexRgb(css.getPropertyValue('--ga')), B = hexRgb(css.getPropertyValue('--gb')), BG = hexRgb(css.getPropertyValue('--bg'));
    const light = c.opt('light', 0);
    const idx0 = Math.max(0, c.secs.findIndex((s) => s.id === root.dataset.cur));
    const spotOf = (i) => SPOTS[Math.min(i, SPOTS.length - 1)] || SPOTS[0];
    let cur = [...spotOf(idx0)], tgt = [...cur];
    root._auSpot = (i) => { tgt = [...spotOf(i)]; };
    let lx = 0, ly = 0, stir = 0, pvx = 0, pvy = 0;
    const mv = (e) => { stir = Math.min(1, stir + (Math.abs(e.movementX || 0) + Math.abs(e.movementY || 0)) / 260); };
    window.addEventListener('pointermove', mv, { passive: true }); off.push(() => window.removeEventListener('pointermove', mv));
    const gl = cv && glQuad(cv, FRAG, 1);
    if (gl) {
      root.classList.add('au-has-gl');
      off.push(() => gl.destroy());
      off.push(c.loop((t) => {
        for (let k = 0; k < 4; k++) cur[k] = lerp(cur[k], tgt[k], 0.028);
        const p = c.pointer(); lx = lerp(lx, p.x, 0.06); ly = lerp(ly, p.y, 0.06); stir *= 0.965;
        gl.draw({ uT: t + 40, uC: [cur[0], cur[1]], uS: cur[2], uMix: cur[3], uM: [lx, ly], uStir: stir, uA: A, uB: B, uBg: BG, uLight: light });
      }));
    }
    return () => off.forEach((f) => f());
  },
  onLeave(c, from, to, root) { root._auSpot?.(to); requestAnimationFrame(() => root._auPlace?.()); const b = root.querySelector('.au-idx b'); if (b) b.textContent = c.pad2(to + 1); },
  onEnter(c, i, p, root) { root._auPlace?.(); const b = root.querySelector('.au-idx b'); if (b) b.textContent = c.pad2(i + 1); },
  css: () => `
.pf[data-t=aura]{--pad-t:7.6em;--pad-r:3.4em;--pad-l:3.4em;--pad-b:6.4em;--radius:14px;--grain-o:0;--cursor:var(--fg);font-weight:400;letter-spacing:-.005em}
.au-gl{position:absolute;inset:0;width:100%;height:100%}
.au-fall{position:absolute;inset:0;filter:blur(70px);display:none}
.pf[data-t=aura]:not(.au-has-gl) .au-fall{display:block}
.au-fall i{position:absolute;left:52%;top:18%;width:46vmax;height:46vmax;border-radius:50%;background:radial-gradient(closest-side,var(--ga),transparent);opacity:.9}
.au-fall i+i{left:62%;top:34%;width:34vmax;height:34vmax;background:radial-gradient(closest-side,var(--gb),transparent)}
/* chrome */
.au-top{position:absolute;z-index:30;inset:0 0 auto;display:flex;align-items:center;gap:2em;padding:1.9em 3.4em}
.au-brand{display:flex;align-items:center;gap:.7em;font-weight:500;letter-spacing:-.01em}
.au-brand .pf-logo{height:1.6em}
.pf[data-v="2"] .au-brand .pf-logo{filter:brightness(0)}
.pf[data-v="0"] .au-brand .pf-logo,.pf[data-v="1"] .au-brand .pf-logo{filter:brightness(0) invert(1)}
.au-nav{position:relative;margin-left:auto;display:flex;gap:2em}
.au-nav .pf-nav-a{padding:.35em 0;font-size:.82em;letter-spacing:.06em;text-transform:uppercase;color:var(--muted);transition:color .3s}
.au-nav .pf-nav-a.is-cur,.au-nav .pf-nav-a:hover{color:var(--fg)}
.au-bar{position:absolute;left:0;bottom:-.1em;height:1px;width:0;background:var(--fg);transition:transform .6s cubic-bezier(.16,1,.3,1),width .6s cubic-bezier(.16,1,.3,1)}
.au-say{padding:.6em 1.15em;border-radius:999px;border:1px solid var(--line);font-size:.82em;transition:background-color .3s,color .3s,border-color .3s}
@media (hover:hover){.au-say:hover{background:var(--fg);color:var(--bg);border-color:var(--fg)}}
.au-drawer{--drawer-bg:var(--bg)}
.au-drawer .pf-nav-a{font-weight:300;letter-spacing:-.03em}
.au-foot{position:absolute;z-index:20;left:3.4em;right:3.4em;bottom:1.9em;display:flex;align-items:flex-end;gap:2em;font-size:.82em}
.au-clocks{display:flex;gap:2.2em}
.au-clocks small{display:block;color:var(--muted);margin-bottom:.15em}
.au-clocks b{font-family:var(--f-mono);font-weight:400;font-size:.95em}
.au-cts{display:flex;gap:.2em;margin-left:auto}
.au-cts .pf-ct{width:2.4em;height:2.4em;display:grid;place-items:center;border-radius:50%;color:var(--muted);transition:color .3s,background-color .3s}
@media (hover:hover){.au-cts .pf-ct:hover{color:var(--fg);background:var(--surface)}}
.au-idx{font-family:var(--f-mono);color:var(--muted);font-size:.9em}
.au-idx b{color:var(--fg);font-weight:400}
/* hero */
.au-hero{position:absolute;inset:0;display:grid;grid-template-columns:1fr 1fr;grid-template-rows:auto 1fr auto auto;column-gap:3em}
.au-c{font-size:.86em;line-height:1.5;color:var(--muted);opacity:0;transition:opacity 1s .7s}
.au-c1{grid-column:1;grid-row:1}
.au-c2{grid-column:2;grid-row:1;justify-self:end;text-align:right}
.au-c2 li::before{content:"‣ ";color:var(--fg)}
.au-name{grid-column:1/-1;grid-row:3;display:flex;flex-direction:column;font-family:var(--f-display);font-weight:300;font-size:clamp(4em,20vmin,16em);line-height:.88;letter-spacing:-.06em;margin-left:-.05em}
.au-l2{padding-left:1.1em}
.au-tag{grid-column:2;grid-row:4;justify-self:end;max-width:34ch;margin-top:1.6em;font-size:1.02em;line-height:1.45}
.au-go{position:absolute;left:0;bottom:0;display:flex;align-items:center;gap:.7em;font-size:.86em;color:var(--muted);transition:color .3s}
.au-go svg{animation:auBob 2.2s ease-in-out infinite}
@keyframes auBob{50%{transform:translateY(4px)}}
@media (hover:hover){.au-go:hover{color:var(--fg)}}
.pf-sec-home.is-on .au-c,.pf[data-static] .au-c{opacity:1}
.au-go{opacity:0;transition:opacity 1s 1.1s,color .3s}
.pf-sec-home.is-on .au-go,.pf[data-static] .au-go{opacity:1}
/* sections */
.pf[data-t=aura] .pf-head{align-items:flex-end}
.pf[data-t=aura] .pf-head-n{order:2;margin-left:auto;font-family:var(--f-mono);color:var(--muted)}
.pf[data-t=aura] .pf-head-t{font-weight:300;font-size:clamp(2.8em,8vmin,6.4em);letter-spacing:-.05em;line-height:.92}
.pf[data-t=aura] .pf-head-s{order:3;color:var(--muted)}
.pf[data-t=aura] :is(.pf-card,.pf-port-item,.pf-xp,.pf-edu,.pf-skill,.pf-modal-box){background:var(--surface);border:1px solid var(--line);-webkit-backdrop-filter:blur(24px);backdrop-filter:blur(24px)}
.pf[data-t=aura] :is(.pf-chip,.pf-tab,.pf-pg,.pf-igp,.pf-btn-ghost){border-radius:999px;border:1px solid var(--line);background:transparent;color:var(--fg)}
.pf[data-t=aura] :is(.pf-chip[aria-pressed=true],.pf-tab[aria-selected=true],.pf-btn:not(.pf-btn-ghost)){background:var(--fg);color:var(--bg);border-color:var(--fg)}
.pf[data-t=aura] .pf-card-title,.pf[data-t=aura] .pf-port-t{font-weight:400;letter-spacing:-.02em}
.pf[data-t=aura] .pf-stats dd{font-weight:300;letter-spacing:-.05em}
.pf[data-t=aura] .pf-modal-box{background:color-mix(in srgb,var(--bg) 82%,transparent)}
${listCss('aura', { peek: 'au-peek', size: 'clamp(1.25em,3.1vmin,2.5em)', weight: 300, peekR: '14px', ratio: '1/1' })}
.pf[data-t=aura] .pf-sec-works .pf-card{-webkit-backdrop-filter:none;backdrop-filter:none;border-top:1px solid var(--line)}
.pf[data-t=aura] .pf-sec-works .pf-card-title::after{content:"  ‣";color:var(--muted);font-weight:300}
/* responsive */
.pf[data-t=aura][data-w=sm] .au-nav,.pf[data-t=aura][data-w=xs] .au-nav,.pf[data-t=aura][data-w=xs] .au-say{display:none}
.pf[data-t=aura][data-w=sm] .au-burger,.pf[data-t=aura][data-w=xs] .au-burger{display:block}
.pf[data-t=aura][data-w=sm] .au-say{margin-left:auto}
.pf[data-t=aura][data-w=xs] .au-burger{margin-left:auto}
.pf[data-t=aura][data-w=xs]{--pad-r:1.3em;--pad-l:1.3em;--pad-t:5.6em;--pad-b:5.6em}
.pf[data-t=aura][data-w=xs] .au-top{padding:1.2em 1.3em}
.pf[data-t=aura][data-w=xs] .au-foot{left:1.3em;right:1.3em;bottom:1.2em}
.pf[data-t=aura][data-w=xs] .au-cts,.pf[data-t=aura][data-w=xs] .au-clocks span+span{display:none}
.pf[data-t=aura][data-w=xs] .au-idx{margin-left:auto}
.pf[data-t=aura][data-o=p] .au-hero{grid-template-columns:1fr;grid-template-rows:auto auto 1fr auto auto}
.pf[data-t=aura][data-o=p] .au-c2{grid-column:1;grid-row:2;justify-self:start;text-align:left;margin-top:1em}
.pf[data-t=aura][data-o=p] .au-name{grid-row:4;font-size:clamp(3.6em,24vw,9em)}
.pf[data-t=aura][data-o=p] .au-l2{padding-left:.5em}
.pf[data-t=aura][data-o=p] .au-tag{grid-column:1;grid-row:5;justify-self:start;font-size:.95em;margin-bottom:2.6em}
.pf[data-t=aura][data-h=tiny]{--pad-t:4.2em;--pad-b:3.6em}
.pf[data-t=aura][data-h=tiny] .au-top{padding:.8em 1.6em}
.pf[data-t=aura][data-h=tiny] .au-foot{bottom:.8em}
.pf[data-t=aura][data-h=tiny] .au-c1,.pf[data-t=aura][data-h=tiny] .au-go{display:none}
.pf[data-t=aura][data-h=tiny] .au-tag{margin-top:.6em;font-size:.86em}
.pf[data-t=aura][data-h=tiny] .au-name{font-size:clamp(3em,17vmin,7em)}
`,
};
