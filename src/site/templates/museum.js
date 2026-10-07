/*! Portfolio Studio. Copyright (c) 2026 Roy Borkin. All rights reserved. Unauthorized copying, modification or distribution is prohibited without written permission. */
// 08 — Museum : the portrait is treated like a sculpture on display, framed by geometry
// (a glowing ring, a sun disc, memphis shapes) that floats at different depths with the pointer.
export default {
  id: 'museum',
  name: 'Museum',
  blurb: 'Your figure as a sculpture, framed by floating geometry and glow.',
  transition: 'flip',
  variants: [
    { name: 'Renaissance', swatch: ['#e9ecf2', '#f06a6a', '#6a2cf5'],
      vars: { bg: '#c9d1de', surface: '#eef0f4', fg: '#1d1e22', muted: '#5d616b', accent: '#6a2cf5', accent2: '#f06a6a', line: 'rgba(29,30,34,.12)', stage: '#eef0f4' },
      fonts: { display: 'Josefin Sans:300;400;600', body: 'Mulish:400;500;700', mono: 'Space Mono:400' }, opts: { deco: 'memphis' } },
    { name: 'Bronze', swatch: ['#3a2418', '#ffd9b0', '#c9876b'],
      vars: { bg: '#1b120d', surface: 'rgba(255,230,210,.06)', fg: '#f6e9df', muted: '#b39a8a', accent: '#ffd9b0', accent2: '#c9876b', line: 'rgba(255,217,176,.16)', stage: 'transparent' },
      fonts: { display: 'Josefin Sans:300;400;600', body: 'Cormorant Garamond:400;500;600', mono: 'Space Mono:400' }, opts: { deco: 'ring' } },
    { name: 'Crimson', swatch: ['#1f1f21', '#e5312d', '#f2f2f2'],
      vars: { bg: '#1c1c1e', surface: '#262628', fg: '#f2f2f2', muted: '#98989c', accent: '#e5312d', accent2: '#3a3a3d', line: 'rgba(255,255,255,.1)', stage: 'transparent' },
      fonts: { display: 'Montserrat:400;700;800', body: 'Montserrat:400;500', mono: 'Space Mono:400' }, opts: { deco: 'sun' } },
  ],
  layout: { works: [15, 15] },
  shell(c) {
    return {
      bg: `<div class="mu-glow"></div>`,
      nav: `<header class="mu-top"><button class="mu-brand" data-go="0" data-hover>${c.logo()}</button><nav class="mu-nav" aria-label="Sections">${c.nav()}</nav><div class="mu-cts">${c.contactLinks({ limit: 4 })}</div>${c.menuBtn()}</header>
        <div class="mu-dots" aria-hidden="true">${c.secs.map((s) => `<i data-go="${s.i}"></i>`).join('')}</div>
        <footer class="mu-foot"><span class="mu-n">${c.secs.map((s) => `<b>${s.n}</b>`).join('')}</span><span class="mu-line"><i></i></span><span>${c.pad2(c.secs.length)}</span></footer>
        ${c.drawer()}`,
    };
  },
  home(c) {
    const cut = c.img(c.P.cutout) || c.img(c.P.photo);
    const deco = c.opt('deco');
    const ws = c.sec('works');
    const memphis = `<i class="mu-tri" style="--d:1"></i><i class="mu-x" style="--d:2.4"></i><i class="mu-ring" style="--d:1.6"></i><i class="mu-dot" style="--d:2"></i><i class="mu-vtri" style="--d:3"></i><i class="mu-grid" style="--d:.6"></i><i class="mu-bars" style="--d:.8"></i><i class="mu-arc" style="--d:1.2"></i>`;
    return `<div class="mu-hero" data-deco="${deco}">
      <div class="mu-txt">
        <p class="mu-eyebrow">${c.esc(c.P.intro || '')}</p>
        <h1 class="mu-h">${c.esc(c.first)}<br>${c.esc(c.last)}</h1>
        <p class="mu-p">${c.esc(c.P.tagline || '')}</p>
        ${ws ? `<button class="mu-btn" data-go="${ws.i}" data-hover>${deco === 'memphis' ? `<span>${c.esc(ws.label)}</span>` : `${c.I('arrow')}<span>${c.esc(ws.label)}</span>`}</button>` : ''}
      </div>
      <div class="mu-stage">
        ${deco === 'memphis' ? memphis : deco === 'ring' ? '<i class="mu-halo" style="--d:1.4"></i>' : '<i class="mu-sun" style="--d:1.2"></i><i class="mu-sun2" style="--d:2.2"></i>'}
        <figure class="mu-fig"><img src="${c.esc(cut)}" alt="${c.esc(c.name)}" draggable="false"><span class="mu-tint" style="-webkit-mask-image:url('${c.esc(cut)}');mask-image:url('${c.esc(cut)}')"></span></figure>
      </div>
      <p class="mu-label">${c.esc(c.roles[0] || '')}</p>
      ${deco === 'memphis' ? '<p class="mu-scroll" aria-hidden="true">Scroll down</p>' : ''}
    </div>`;
  },
  onEnter(c, i, p, root) { root.style.setProperty('--k', i); },
  css: () => `
.pf[data-t=museum]{--pad-t:6em;--pad-r:4.6em;--pad-l:5.4em;--pad-b:5em;--radius:14px;--grain-o:.06}
.pf[data-t=museum][data-v="0"]::before{content:"";position:absolute;inset:2.2vmin;background:var(--stage);box-shadow:0 30px 80px -30px rgba(40,50,80,.4);border-radius:4px}
.mu-glow{position:absolute;inset:0;background:radial-gradient(ellipse at 70% 45%,rgba(140,70,40,.55),transparent 55%),linear-gradient(110deg,#3a2418,#120b08 70%)}
.pf[data-v="0"] .mu-glow{display:none}
.pf[data-v="2"] .mu-glow{background:radial-gradient(ellipse at 72% 50%,rgba(229,49,45,.12),transparent 55%)}
.mu-top{position:absolute;z-index:20;inset:2.2vmin 2.2vmin auto;display:flex;align-items:center;gap:3em;padding:1.4em 2.4em}
.mu-brand .pf-logo{height:2em}
.pf[data-v="0"] .mu-brand .pf-logo{filter:brightness(0)}
.pf[data-v="1"] .mu-brand .pf-logo{filter:sepia(1) saturate(.6) brightness(1.4)}
.pf[data-v="2"] .mu-brand .pf-logo{filter:brightness(0) invert(1)}
.mu-nav{display:flex;gap:2.2em;font-family:var(--f-display);font-size:.8em;letter-spacing:.12em;text-transform:uppercase}
.mu-nav .pf-nav-a{color:var(--muted);padding:.3em 0;position:relative}
.mu-nav .pf-nav-a.is-cur,.mu-nav .pf-nav-a:hover{color:var(--fg)}
.mu-nav .pf-nav-a.is-cur::after{content:"";position:absolute;left:50%;bottom:-.6em;width:4px;height:4px;border-radius:50%;background:var(--accent2);transform:translateX(-50%)}
.pf[data-v="2"] .mu-nav .pf-nav-a.is-cur::after{background:var(--accent)}
.mu-cts{margin-left:auto;display:flex;gap:.2em}
.mu-cts .pf-ct{width:2.2em;height:2.2em;color:var(--muted)}
.mu-cts .pf-ct:hover{color:var(--fg)}
.mu-dots{position:absolute;z-index:20;left:calc(2.2vmin + 1.8em);top:50%;transform:translateY(-50%);display:flex;flex-direction:column;gap:.9em}
.mu-dots i{width:7px;height:7px;border-radius:50%;background:var(--fg);opacity:.35;cursor:pointer;transition:all .4s var(--out)}
.mu-dots i.is-cur{opacity:1;background:transparent;box-shadow:0 0 0 2px var(--accent2);transform:scale(1.3)}
.pf[data-v="2"] .mu-dots i.is-cur{box-shadow:0 0 0 2px var(--accent)}
.mu-foot{position:absolute;z-index:20;left:calc(2.2vmin + 4.6em);bottom:calc(2.2vmin + 1.6em);display:flex;align-items:center;gap:1em;font-family:var(--f-mono);font-size:.72em;color:var(--muted)}
.mu-n{height:1.3em;overflow:hidden;display:flex;flex-direction:column;color:var(--fg)}
.mu-n b{font-weight:400;line-height:1.3em;transform:translateY(calc(var(--k,0) * -100%));transition:transform .9s var(--ease)}
.mu-line{width:9em;height:1px;background:var(--line);position:relative}
.mu-line i{position:absolute;left:0;top:-.5px;height:2px;width:calc((var(--prog) * .75 + .25) * 100%);background:var(--fg);transition:width .9s var(--ease)}
/* hero */
.mu-hero{position:absolute;inset:0;display:grid;grid-template-columns:1fr 1.1fr;align-items:center}
.mu-txt{display:flex;flex-direction:column;gap:1.3em;align-items:flex-start;z-index:3}
.mu-eyebrow{font-size:.84em;letter-spacing:.06em;color:var(--muted)}
.mu-h{font-family:var(--f-display);font-weight:300;font-size:clamp(2.4em,7vmin,5.4em);line-height:1.02;letter-spacing:.03em;text-transform:uppercase}
.pf[data-v="2"] .mu-h{font-weight:800;letter-spacing:.01em}
.mu-p{max-width:34ch;line-height:1.6;color:var(--muted)}
.pf[data-v="1"] .mu-p{font-size:1.15em;line-height:1.5}
.mu-btn{display:inline-flex;align-items:center;gap:.9em;font-size:.86em;font-weight:700;transition:transform .3s var(--out)}
.pf[data-v="0"] .mu-btn{padding:.95em 2em;border-radius:999px;background:var(--accent);color:#fff;box-shadow:0 12px 30px -10px var(--accent)}
.mu-btn svg{width:3em;height:3em;padding:.85em;border-radius:50%;border:1px solid var(--line);transition:background-color .3s,color .3s}
.mu-btn:hover{transform:translateX(4px)}
.mu-btn:hover svg{background:var(--accent);color:var(--bg)}
.mu-stage{position:relative;align-self:stretch;margin:calc(var(--pad-t) * -.5) calc(var(--pad-r) * -1) calc(var(--pad-b) * -1) 0;container-type:size}
.mu-stage>i{position:absolute;display:block;transform:translate(calc(var(--mx) * var(--d) * -12px),calc(var(--my) * var(--d) * -10px));transition:transform .2s linear}
.mu-fig{position:absolute;left:50%;bottom:0;height:94%;aspect-ratio:1606/1500;transform:translateX(calc(-50% + var(--mx) * -6px));z-index:2}
.mu-fig img{width:100%;height:100%;object-fit:contain;object-position:bottom;filter:grayscale(1) contrast(1.25) brightness(1.08)}
.pf[data-v="1"] .mu-fig img{filter:grayscale(1) sepia(.65) hue-rotate(-18deg) saturate(1.4) contrast(1.1) brightness(.9)}
.mu-tint{position:absolute;inset:0;-webkit-mask-size:contain;mask-size:contain;-webkit-mask-repeat:no-repeat;mask-repeat:no-repeat;-webkit-mask-position:bottom;mask-position:bottom;background:var(--accent);mix-blend-mode:multiply;display:none}
.pf[data-v="2"] .mu-fig img{filter:grayscale(1) contrast(1.25) sepia(1) saturate(5) hue-rotate(-42deg) brightness(.92)}
.mu-tri{left:-2%;top:20%;width:0;height:0;border-left:min(22cqw,26cqh) solid transparent;border-right:min(22cqw,26cqh) solid transparent;border-bottom:min(38cqw,44cqh) solid var(--accent2)}
.mu-x{left:4%;top:4%;width:3.2em;height:3.2em;background:linear-gradient(45deg,transparent 42%,var(--fg) 42% 58%,transparent 58%),linear-gradient(-45deg,transparent 42%,var(--fg) 42% 58%,transparent 58%)}
.mu-ring{right:6%;bottom:22%;width:min(16cqw,18cqh);aspect-ratio:1;border-radius:50%;border:min(2.6cqw,3cqh) solid #3b3c40;z-index:3}
.mu-dot{left:8%;bottom:30%;width:1.4em;height:1.4em;border-radius:50%;background:#1fb7ff}
.mu-vtri{left:2%;top:58%;width:0;height:0;border-left:.9em solid transparent;border-right:.9em solid transparent;border-top:1.5em solid #b62dff}
.mu-vtri::after{content:"";position:absolute;left:-.55em;top:-1.25em;border-left:.55em solid transparent;border-right:.55em solid transparent;border-top:.9em solid var(--stage)}
.mu-grid{left:-10%;bottom:6%;width:11em;height:4.6em;background-image:radial-gradient(#9aa0ab 1.4px,transparent 1.6px);background-size:.95em .95em}
.mu-bars{right:5%;bottom:3%;width:5.5em;height:2.6em;background:repeating-linear-gradient(90deg,#1d1e22 0 3px,transparent 3px 9px);z-index:3}
.mu-bars::after{content:"";position:absolute;left:3.1em;top:0;width:3px;height:100%;background:var(--accent2)}
.mu-arc{right:-2%;top:16%;width:.5em;height:4.6em;background:#1fb7ff}
.mu-halo{left:50%;top:6%;width:min(70cqw,78cqh);aspect-ratio:1;margin-left:calc(min(70cqw,78cqh) / -2);border-radius:50%;border:3px solid var(--accent);box-shadow:0 0 22px rgba(255,217,176,.75),inset 0 0 22px rgba(255,217,176,.5),0 0 90px rgba(255,170,120,.35)}
.mu-sun{left:50%;top:14%;width:min(76cqw,74cqh);aspect-ratio:1;margin-left:calc(min(76cqw,74cqh) / -2.4);border-radius:50%;background:var(--accent)}
.mu-sun2{left:22%;bottom:-6%;width:min(18cqw,22cqh);aspect-ratio:1;border-radius:50%;background:var(--accent);opacity:.9}
.mu-label{position:absolute;right:0;bottom:0;font-family:var(--f-display);font-size:.72em;letter-spacing:.3em;text-transform:uppercase;color:var(--muted);z-index:3}
.mu-scroll{position:absolute;left:44%;bottom:0;writing-mode:vertical-rl;font-family:var(--f-display);font-weight:600;font-size:.72em;letter-spacing:.3em;text-transform:uppercase}
.mu-txt>*{opacity:0;transform:translateY(1.2em);transition:opacity .9s,transform 1.1s var(--out)}
.mu-txt>:nth-child(2){transition-delay:.12s}.mu-txt>:nth-child(3){transition-delay:.24s}.mu-txt>:nth-child(4){transition-delay:.36s}
.mu-stage{opacity:0;transition:opacity 1.2s .2s}
.mu-stage>i{scale:.4;opacity:0;transition:scale 1.2s var(--out),opacity .8s,transform .2s linear}
.mu-stage>i:nth-child(2n){transition-delay:.5s}.mu-stage>i:nth-child(3n){transition-delay:.7s}
.pf-sec-home.is-on .mu-txt>*,.pf[data-static] .mu-txt>*{opacity:1;transform:none}
.pf-sec-home.is-on .mu-stage,.pf[data-static] .mu-stage{opacity:1}
.pf-sec-home.is-on .mu-stage>i,.pf[data-static] .mu-stage>i{scale:1;opacity:1}
/* sections */
.pf[data-t=museum] .pf-head-n{display:none}
.pf[data-t=museum] .pf-head-t{font-weight:300;text-transform:uppercase;letter-spacing:.06em;font-size:clamp(1.7em,4.4vmin,3.2em)}
.pf[data-t=museum][data-v="2"] .pf-head-t{font-weight:800;letter-spacing:.02em}
.pf[data-t=museum] .pf-card,.pf[data-t=museum] .pf-xp,.pf[data-t=museum] .pf-edu,.pf[data-t=museum] .pf-skill,.pf[data-t=museum] .pf-port-item{background:var(--surface);border-color:var(--line)}
.pf[data-t=museum][data-v="0"] .pf-card,.pf[data-t=museum][data-v="0"] .pf-port-item{background:#fff;box-shadow:0 18px 40px -26px rgba(40,50,80,.5);border-color:transparent}
.pf[data-t=museum] .pf-card:hover{transform:translateY(-5px)}
.pf[data-t=museum] .pf-card-media img{filter:grayscale(1) contrast(1.1)}
.pf[data-t=museum][data-v="1"] .pf-card-media img{filter:sepia(.5) saturate(1.2)}
.pf[data-t=museum] .pf-card:hover .pf-card-media img{filter:none}
.pf[data-t=museum] .pf-chip[aria-pressed=true],.pf[data-t=museum] .pf-tab[aria-selected=true]{background:var(--accent);border-color:var(--accent);color:#fff}
.pf[data-t=museum][data-v="1"] .pf-chip[aria-pressed=true],.pf[data-t=museum][data-v="1"] .pf-tab[aria-selected=true]{color:#1b120d}
.pf[data-t=museum] .pf-btn{background:var(--accent);color:#fff}
.pf[data-t=museum][data-v="1"] .pf-btn{color:#1b120d}
.pf[data-t=museum] .pf-btn-ghost{background:transparent;color:var(--fg)}
.pf[data-t=museum] .pf-profile-img img{filter:grayscale(.6)}
.pf[data-t=museum] .pf-port-t{font-weight:300;text-transform:uppercase;letter-spacing:.04em}
.pf[data-t=museum] .pf-stats dd{font-weight:300}
/* responsive */
.pf[data-w=md] .mu-nav{gap:1.2em}
.pf[data-w=md] .mu-cts{display:none}
.pf[data-w=sm] .mu-nav,.pf[data-w=xs] .mu-nav,.pf[data-w=sm] .mu-cts,.pf[data-w=xs] .mu-cts{display:none}
.pf[data-w=sm] .pf-burger,.pf[data-w=xs] .pf-burger{display:block;margin-left:auto}
.pf[data-w=xs]{--pad-r:1.4em;--pad-l:1.4em;--pad-t:5em}
.pf[data-w=xs] .mu-top{padding:1em 1.2em}
.pf[data-w=xs] .mu-dots{display:none}
.pf[data-w=xs] .mu-foot{left:calc(2.2vmin + 1.4em)}
.pf[data-o=p] .mu-hero{grid-template-columns:1fr;grid-template-rows:auto 1fr}
.pf[data-o=p] .mu-stage{margin:0 calc(var(--pad-r) * -1) calc(var(--pad-b) * -1) calc(var(--pad-l) * -1)}
.pf[data-o=p] .mu-p{display:none}
.pf[data-o=p] .mu-scroll,.pf[data-o=p] .mu-label{display:none}
.pf[data-o=p] .mu-txt{gap:.8em}
.pf[data-h=tiny] .mu-p,.pf[data-h=tiny] .mu-eyebrow{display:none}
.pf[data-h=tiny] .mu-top{padding:.5em 1.6em}
.pf[data-h=tiny] .mu-foot{bottom:.8em}
`,
};
