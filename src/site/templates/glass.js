/*! Portfolio Studio. Copyright (c) 2026 Roy Borkin. All rights reserved. Unauthorized copying, modification or distribution is prohibited without written permission. */
// 14 — Liquid Glass : a translucent, refractive material floating over a living wallpaper. Rim light
// follows the pointer, a glass lens can be thrown around the screen, and the tab bar's selection is a
// droplet that stretches as it travels between items.
const SVG = `<svg width="0" height="0" style="position:absolute" aria-hidden="true">
  <filter id="lg-ref" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.006 0.009" numOctaves="2" seed="4" result="n"/><feGaussianBlur in="n" stdDeviation="3" result="nb"/><feDisplacementMap in="SourceGraphic" in2="nb" scale="34" xChannelSelector="R" yChannelSelector="G"/></filter>
  <filter id="lg-lens" x="-10%" y="-10%" width="120%" height="120%"><feTurbulence type="turbulence" baseFrequency="0.012" numOctaves="1" seed="9" result="n"/><feGaussianBlur in="n" stdDeviation="6" result="nb"/><feDisplacementMap in="SourceGraphic" in2="nb" scale="70" xChannelSelector="R" yChannelSelector="B"/></filter>
</svg>`;
export default {
  id: 'glass',
  name: 'Liquid Glass',
  blurb: 'Refractive glass over a living wallpaper: rim light, a throwable lens, a liquid tab bar.',
  cursor: false,
  transition(from, to) {
    return [
      from.animate([{ opacity: 1, transform: 'none', filter: 'blur(0)' }, { opacity: 0, transform: 'scale(.94)', filter: 'blur(14px)' }], { duration: 420, easing: 'cubic-bezier(.4,0,.2,1)', fill: 'forwards' }),
      to.animate([{ opacity: 0, transform: 'scale(1.05)', filter: 'blur(16px)' }, { opacity: 1, transform: 'none', filter: 'blur(0)' }], { duration: 720, delay: 160, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'both' }),
    ];
  },
  variants: [
    { name: 'Daylight', swatch: ['#dfe6f3', '#ff9fbb', '#8db4ff'],
      vars: { bg: '#dfe6f2', surface: 'rgba(255,255,255,.3)', fg: '#0d1322', muted: 'rgba(13,19,34,.62)', accent: '#2f6bff', accent2: '#ff5d8f', line: 'rgba(255,255,255,.55)', glass: 'rgba(255,255,255,.26)', hi: 'rgba(255,255,255,.95)', shade: 'rgba(40,60,110,.28)', o1: '#ff9fbb', o2: '#8db4ff', o3: '#c3b0ff', o4: '#8ff0da' },
      fonts: { display: 'Onest:200;300;500;700', body: 'Onest:400;500;600', mono: 'JetBrains Mono:400' }, opts: { wall: 'orbs' } },
    { name: 'Aurora', swatch: ['#05070d', '#1fd1b2', '#7a5cff'],
      vars: { bg: '#05070d', surface: 'rgba(255,255,255,.07)', fg: '#f3f6ff', muted: 'rgba(243,246,255,.62)', accent: '#5cf2d4', accent2: '#ff6fb5', line: 'rgba(255,255,255,.16)', glass: 'rgba(255,255,255,.07)', hi: 'rgba(255,255,255,.55)', shade: 'rgba(0,0,0,.55)', o1: '#1fd1b2', o2: '#7a5cff', o3: '#ff4fa3', o4: '#2a6bff' },
      fonts: { display: 'Onest:200;300;500;700', body: 'Onest:400;500;600', mono: 'JetBrains Mono:400' }, opts: { wall: 'orbs' } },
    { name: 'Portrait', swatch: ['#6b625b', '#ffffff', '#f2c98a'],
      vars: { bg: '#3e3936', surface: 'rgba(255,255,255,.12)', fg: '#ffffff', muted: 'rgba(255,255,255,.72)', accent: '#ffd79a', accent2: '#ffffff', line: 'rgba(255,255,255,.22)', glass: 'rgba(255,255,255,.1)', hi: 'rgba(255,255,255,.7)', shade: 'rgba(0,0,0,.45)', o1: '#f2c98a', o2: '#8c7a6b', o3: '#c9b8a6', o4: '#5a5048' },
      fonts: { display: 'Instrument Serif:400', body: 'Onest:400;500;600', mono: 'JetBrains Mono:400' }, opts: { wall: 'photo' } },
  ],
  layout: { works: [15, 15] },
  shell(c) {
    const wall = c.opt('wall');
    const NAVI = { home: 'user', works: 'grid', sandbox: 'code', about: 'cap', portfolio: 'file' };
    return {
      bg: wall === 'photo'
        ? `<div class="lg-photo" style="background-image:url('${c.esc(c.img(c.P.photo))}')"></div><div class="lg-scrim"></div>`
        : `<div class="lg-wall"><i class="o1"></i><i class="o2"></i><i class="o3"></i><i class="o4"></i></div>`,
      nav: `${SVG}
        <header class="lg-top"><button class="lg-g lg-pill lg-brand" data-go="0" data-hover>${c.logo()}<span>${c.esc(c.name)}</span></button>
          <div class="lg-g lg-pill lg-time" aria-hidden="true"><b class="lg-clock">--:--</b><span>${c.esc((c.P.location || '').split(',')[0])}</span></div>
          <button class="lg-g lg-round" data-contact aria-label="Contact" data-hover>${c.I('email')}</button></header>
        <nav class="lg-g lg-tabs" aria-label="Sections"><span class="lg-drop" aria-hidden="true"></span>${c.secs.map((s) => `<a class="pf-nav-a" href="#${s.id}" data-go="${s.i}">${c.I(NAVI[s.id] || 'post')}<span class="pf-nav-l">${c.esc(s.label)}</span></a>`).join('')}</nav>`,
    };
  },
  home(c) {
    const P = c.P, st = c.data.about?.stats || [];
    const photo = c.img(P.cutout) || c.img(P.photo);
    const ws = c.sec('works');
    return `<div class="lg-hero">
      <div class="lg-left">
        <p class="lg-hi">${c.esc(P.intro || '')}</p>
        <h1 class="lg-name"><span>${c.esc(c.first)}</span><span>${c.esc(c.last)}</span></h1>
        <div class="lg-g lg-roles">${c.roles.map((r) => `<span>${c.esc(r)}</span>`).join('<i></i>')}</div>
        <p class="lg-pitch">${c.esc(P.tagline || '')}</p>
        <div class="lg-cta">${ws ? `<button class="lg-g lg-btn lg-btn-p" data-go="${ws.i}" data-hover><span>${c.esc(ws.label)}</span>${c.I('arrow')}</button>` : ''}${c.data.about?.resume?.url ? `<button class="lg-g lg-btn" data-open="resume" data-hover><span>${c.esc(c.data.about.resume.label || 'Resume')}</span></button>` : ''}</div>
      </div>
      <div class="lg-right">
        <figure class="lg-g lg-portrait"><img src="${c.esc(photo)}" alt="${c.esc(c.name)}" draggable="false"></figure>
        ${st[0] ? `<div class="lg-g lg-w lg-w-stat"><svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="16"/><circle class="v" cx="20" cy="20" r="16" style="--p:${Math.min(1, (parseFloat(st[0].value) || 10) / 20)}"/></svg><div><b>${c.esc(st[0].value)}</b><span>${c.esc(st[0].label)}</span></div></div>` : ''}
        ${P.status ? `<div class="lg-g lg-w lg-w-now"><small>Now</small><p>${c.esc(P.status)}</p></div>` : ''}
        <div class="lg-g lg-w lg-w-ct">${c.contactLinks({ limit: 4 })}</div>
      </div>
      <div class="lg-lens" data-drag aria-hidden="true"><i></i></div>
    </div>`;
  },
  mount(c, root) {
    const off = [];
    if (/Chrome|Chromium|Edg\//.test(navigator.userAgent) && !/Firefox/.test(navigator.userAgent)) root.classList.add('lg-refr');
    // live clock
    const clk = root.querySelector('.lg-clock');
    const tick = () => { try { clk.textContent = new Intl.DateTimeFormat([], { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: c.P.timezone || undefined }).format(new Date()); } catch { clk.textContent = new Date().toTimeString().slice(0, 5); } };
    tick(); const iv = setInterval(tick, 15000); off.push(() => clearInterval(iv));
    // rim light: local pointer position on each visible glass surface
    let raf = 0, ex = -999, ey = -999;
    const rim = () => { raf = 0; root.querySelectorAll('.pf-sec.is-on .lg-g, .lg-top .lg-g, .lg-tabs, .pf-sec.is-on .pf-card, .pf-sec.is-on .pf-port-item, .pf-sec.is-on .pf-xp, .pf-sec.is-on .pf-edu, .pf-sec.is-on .pf-skill').forEach((el) => { const r = el.getBoundingClientRect(); el.style.setProperty('--lx', (ex - r.left).toFixed(0) + 'px'); el.style.setProperty('--ly', (ey - r.top).toFixed(0) + 'px'); }); };
    const mv = (e) => { ex = e.clientX; ey = e.clientY; if (!raf) raf = requestAnimationFrame(rim); };
    window.addEventListener('pointermove', mv, { passive: true }); off.push(() => window.removeEventListener('pointermove', mv));
    // liquid droplet in the tab bar: spring with stretch
    const tabs = root.querySelector('.lg-tabs'), drop = root.querySelector('.lg-drop');
    let x = 0, w = 0, vx = 0, tx = 0, tw = 0, first = true;
    const target = () => { const a = tabs.querySelector('.pf-nav-a.is-cur'); if (!a) return; const tr = tabs.getBoundingClientRect(), r = a.getBoundingClientRect(); tx = r.left - tr.left; tw = r.width; if (first) { x = tx; w = tw; first = false; } };
    root._lgTarget = target;
    const ro = new ResizeObserver(target); ro.observe(tabs); off.push(() => ro.disconnect());
    target();
    off.push(c.loop(() => {
      const k = 0.16, d = 0.72; // spring
      const ax = (tx - x) * k; vx = (vx + ax) * d; x += vx; w += (tw - w) * 0.2;
      const stretch = Math.min(0.5, Math.abs(vx) / 40);
      drop.style.transform = `translateX(${x.toFixed(2)}px) scale(${1 + stretch}, ${1 - stretch * 0.45})`;
      drop.style.width = w.toFixed(1) + 'px';
    }));
    // throwable lens with momentum and soft walls
    const lens = root.querySelector('.lg-lens');
    if (lens) {
      const box = lens.parentElement;
      let lx = 0.62, ly = 0.18, lvx = 0, lvy = 0, drag = null, hist = [];
      const place = () => { const W = box.clientWidth, H = box.clientHeight, s = lens.offsetWidth; lens.style.transform = `translate(${(lx * (W - s)).toFixed(1)}px, ${(ly * (H - s)).toFixed(1)}px)`; };
      const down = (e) => { if (!lens.contains(e.target)) return; e.preventDefault(); lens.setPointerCapture(e.pointerId); const r = lens.getBoundingClientRect(); drag = { ox: e.clientX - r.left, oy: e.clientY - r.top }; hist = []; lens.classList.add('is-drag'); };
      const move = (e) => { if (!drag) return; const br = box.getBoundingClientRect(), s = lens.offsetWidth; lx = (e.clientX - br.left - drag.ox) / (br.width - s); ly = (e.clientY - br.top - drag.oy) / (br.height - s); hist.push([e.clientX, e.clientY, performance.now()]); if (hist.length > 6) hist.shift(); place(); };
      const up = () => { if (!drag) return; drag = null; lens.classList.remove('is-drag'); if (hist.length > 1) { const a = hist[0], b = hist[hist.length - 1], dt = Math.max(16, b[2] - a[2]); lvx = (b[0] - a[0]) / dt * 16 / (box.clientWidth - lens.offsetWidth); lvy = (b[1] - a[1]) / dt * 16 / (box.clientHeight - lens.offsetWidth); } };
      lens.addEventListener('pointerdown', down); window.addEventListener('pointermove', move); window.addEventListener('pointerup', up);
      off.push(() => { lens.removeEventListener('pointerdown', down); window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); });
      off.push(c.loop((t) => {
        if (!drag) {
          lx += lvx; ly += lvy; lvx *= 0.95; lvy *= 0.95;
          if (Math.abs(lvx) + Math.abs(lvy) < 0.0004) { lx += Math.sin(t * 0.6) * 0.0006; ly += Math.cos(t * 0.5) * 0.0005; }
          if (lx < 0) { lvx += -lx * 0.2; lvx *= 0.7; } if (lx > 1) { lvx -= (lx - 1) * 0.2; lvx *= 0.7; }
          if (ly < 0) { lvy += -ly * 0.2; lvy *= 0.7; } if (ly > 1) { lvy -= (ly - 1) * 0.2; lvy *= 0.7; }
        }
        place();
      }));
    }
    return () => off.forEach((f) => f());
  },
  onEnter(c, i, p, root) { root._lgTarget?.(); },
  onLeave(c, from, to, root) { requestAnimationFrame(() => root._lgTarget?.()); },
  css: () => `
.pf[data-t=glass]{--pad-t:5.8em;--pad-r:3.4em;--pad-l:3.4em;--pad-b:7em;--radius:26px;--grain-o:.035;--blur:16px}
/* wallpaper */
.lg-wall{position:absolute;inset:-10%;filter:blur(60px) saturate(1.2)}
.lg-wall i{position:absolute;width:52vmax;height:52vmax;border-radius:50%;opacity:.95;transform:translate(calc(var(--mx) * 3vmax),calc(var(--my) * 3vmax))}
.lg-wall .o1{left:-6%;top:-12%;background:radial-gradient(closest-side,var(--o1),transparent);animation:lgDrift 22s ease-in-out infinite alternate}
.lg-wall .o2{right:-10%;top:4%;background:radial-gradient(closest-side,var(--o2),transparent);animation:lgDrift 26s ease-in-out -6s infinite alternate-reverse}
.lg-wall .o3{left:22%;bottom:-24%;background:radial-gradient(closest-side,var(--o3),transparent);animation:lgDrift 30s ease-in-out -12s infinite alternate}
.lg-wall .o4{right:14%;bottom:-8%;width:34vmax;height:34vmax;background:radial-gradient(closest-side,var(--o4),transparent);animation:lgDrift 24s ease-in-out -3s infinite alternate-reverse}
@keyframes lgDrift{to{translate:8vmax -6vmax;scale:1.15}}
.pf[data-v="1"] .lg-wall i{opacity:.7}
.lg-photo{position:absolute;inset:-3%;background-size:cover;background-position:50% 30%;transform:scale(1.03) translate(calc(var(--mx) * -.8%),calc(var(--my) * -.8%))}
.lg-scrim{position:absolute;inset:0;background:linear-gradient(90deg,rgba(20,16,14,.62),rgba(20,16,14,.15) 60%,rgba(20,16,14,.35)),linear-gradient(transparent 60%,rgba(20,16,14,.5))}
/* the material */
:where(.pf[data-t=glass]) :where(.lg-g,.pf-card,.pf-port-item,.pf-xp,.pf-edu,.pf-skill,.pf-chip,.pf-tab,.pf-pg){position:relative}
.pf[data-t=glass] :is(.lg-g,.pf-card,.pf-port-item,.pf-xp,.pf-edu,.pf-skill,.pf-chip,.pf-tab,.pf-pg,.pf-modal-box){isolation:isolate;background:var(--glass);border:0;box-shadow:inset 0 1px 0 var(--hi),inset 0 -1px 1px rgba(255,255,255,.1),inset 0 0 0 1px color-mix(in srgb,var(--hi) 22%,transparent),0 18px 50px -18px var(--shade);color:var(--fg)}
.pf[data-t=glass] :is(.lg-g,.pf-card,.pf-port-item,.pf-xp,.pf-edu,.pf-skill,.pf-chip,.pf-tab,.pf-pg,.pf-modal-box)::before{content:"";position:absolute;inset:0;z-index:-1;border-radius:inherit;-webkit-backdrop-filter:blur(var(--blur)) saturate(1.9) brightness(1.04);backdrop-filter:blur(var(--blur)) saturate(1.9) brightness(1.04);pointer-events:none}
.pf[data-t=glass].lg-refr :is(.lg-g,.pf-card,.pf-port-item)::before{backdrop-filter:url(#lg-ref) blur(var(--blur)) saturate(1.9) brightness(1.04)}
.pf[data-t=glass] :is(.lg-g,.pf-card,.pf-port-item,.pf-xp,.pf-edu,.pf-skill,.pf-modal-box)::after{content:"";position:absolute;inset:0;border-radius:inherit;padding:1.4px;pointer-events:none;background:radial-gradient(260px circle at var(--lx,-200px) var(--ly,-200px),var(--hi),transparent 60%);-webkit-mask:linear-gradient(#000 0 0) content-box exclude,linear-gradient(#000 0 0);mask:linear-gradient(#000 0 0) content-box exclude,linear-gradient(#000 0 0);opacity:.95}
@media (prefers-reduced-transparency:reduce){.pf[data-t=glass]{--glass:color-mix(in srgb,var(--bg) 88%,#fff 6%)}}
/* chrome */
.lg-top{position:absolute;z-index:20;inset:1.2em 1.4em auto;display:flex;align-items:center;gap:.6em}
.lg-pill{display:flex;align-items:center;gap:.6em;height:2.9em;padding:0 1.1em 0 .5em;border-radius:999px;font-size:.88em;font-weight:500}
.lg-brand .pf-logo{height:1.9em;padding:.25em;border-radius:50%}
.pf[data-v="1"] .lg-brand .pf-logo,.pf[data-v="2"] .lg-brand .pf-logo{filter:brightness(0) invert(1)}
.pf[data-v="0"] .lg-brand .pf-logo{filter:brightness(0) opacity(.85)}
.lg-time{margin-left:auto;padding:0 1.1em;gap:.5em;font-variant-numeric:tabular-nums}
.lg-time b{font-weight:600}
.lg-time span{color:var(--muted)}
.lg-round{width:2.9em;height:2.9em;border-radius:50%;display:grid;place-items:center;transition:transform .2s var(--out)}
.lg-round:active,.lg-btn:active,.lg-tabs .pf-nav-a:active{transform:scale(.95)}
.lg-tabs{position:absolute;z-index:20;left:50%;bottom:1.4em;translate:-50% 0;display:flex;gap:.2em;padding:.35em;border-radius:999px}
.lg-tabs .pf-nav-a{position:relative;z-index:1;display:flex;flex-direction:column;align-items:center;gap:.15em;padding:.5em 1.1em;border-radius:999px;font-size:.72em;font-weight:500;color:var(--muted);transition:color .3s,transform .2s var(--out)}
.lg-tabs .pf-nav-a svg{width:1.7em;height:1.7em}
.lg-tabs .pf-nav-a.is-cur{color:var(--fg)}
.pf[data-v="0"] .lg-tabs .pf-nav-a.is-cur{color:var(--accent)}
.lg-drop{position:absolute;z-index:0;left:0;top:.35em;bottom:.35em;border-radius:999px;background:color-mix(in srgb,var(--hi) 55%,transparent);box-shadow:inset 0 1px 0 #fff,inset 0 -2px 6px rgba(255,255,255,.3),0 6px 16px -6px var(--shade);transform-origin:center}
.pf[data-v="1"] .lg-drop{background:rgba(255,255,255,.14)}
.pf[data-v="2"] .lg-drop{background:rgba(255,255,255,.22)}
/* hero */
.lg-hero{position:absolute;inset:0;display:grid;grid-template-columns:1.15fr 1fr;gap:2.4em;align-items:center}
.lg-left{display:flex;flex-direction:column;gap:1.1em;align-items:flex-start;z-index:2}
.lg-hi{font-size:.95em;color:var(--muted);font-weight:500}
.lg-name{display:flex;flex-direction:column;font-family:var(--f-display);font-weight:200;font-size:clamp(3.2em,13vmin,10.5em);line-height:.86;letter-spacing:-.055em;margin-left:-.04em}
.lg-name span:last-child{font-weight:700;letter-spacing:-.06em}
.pf[data-v="2"] .lg-name{font-weight:400;letter-spacing:-.02em;line-height:.9}
.pf[data-v="2"] .lg-name span:last-child{font-weight:400;font-style:italic;letter-spacing:-.02em}
.lg-roles{display:flex;flex-wrap:wrap;align-items:center;gap:.5em .7em;padding:.75em 1.3em;border-radius:999px;font-size:.88em;font-weight:500;margin-top:-2.2em;margin-left:12%;--blur:6px}
.lg-roles i{width:4px;height:4px;border-radius:50%;background:currentColor;opacity:.5}
.lg-pitch{max-width:36ch;font-size:1.02em;line-height:1.5;color:var(--muted)}
.lg-cta{display:flex;gap:.6em;flex-wrap:wrap}
.lg-btn{display:inline-flex;align-items:center;gap:.6em;height:3.1em;padding:0 1.4em;border-radius:999px;font-weight:600;font-size:.9em;transition:transform .2s var(--out)}
.lg-btn-p{background:color-mix(in srgb,var(--accent) 80%,transparent)!important;color:#fff!important}
.pf[data-v="1"] .lg-btn-p{color:#04110e!important}
.pf[data-v="2"] .lg-btn-p{color:#2a1d0a!important}
.lg-right{position:relative;align-self:stretch;display:grid;grid-template-columns:1fr auto;grid-template-rows:auto auto 1fr auto;gap:.8em;padding:1em 0}
.lg-portrait{grid-column:1;grid-row:1/-1;border-radius:2.4em;overflow:hidden;margin:0;--blur:30px}
.lg-portrait img{position:absolute;inset:0;width:100%;height:100%;object-fit:contain;object-position:50% 100%;transform:translate(calc(var(--mx) * -6px),calc(var(--my) * -4px)) scale(1.04)}
.lg-w{grid-column:2;border-radius:1.6em;padding:1em 1.1em;min-width:11em;font-size:.86em;display:flex;gap:.8em;align-items:center}
.lg-w-stat svg{width:3.2em;height:3.2em;transform:rotate(-90deg)}
.lg-w-stat circle{fill:none;stroke:color-mix(in srgb,var(--fg) 15%,transparent);stroke-width:4}
.lg-w-stat circle.v{stroke:var(--accent);stroke-linecap:round;stroke-dasharray:100.5;stroke-dashoffset:calc(100.5 * (1 - var(--p)));transition:stroke-dashoffset 1.6s var(--out) .6s}
.pf-sec-home:not(.is-on) .lg-w-stat circle.v{stroke-dashoffset:100.5}
.lg-w-stat b{display:block;font-family:var(--f-display);font-size:1.8em;font-weight:700;line-height:1;letter-spacing:-.03em}
.lg-w-stat span{color:var(--muted);font-size:.86em}
.lg-w-now{flex-direction:column;align-items:flex-start;gap:.2em;max-width:13em}
.lg-w-now small{color:var(--muted)}
.lg-w-now p{font-weight:600;line-height:1.3}
.lg-w-ct{grid-row:4;flex-wrap:wrap;justify-content:center;gap:.4em}
.lg-w-ct .pf-ct{width:2.6em;height:2.6em;border-radius:50%;background:color-mix(in srgb,var(--hi) 22%,transparent);box-shadow:inset 0 1px 0 color-mix(in srgb,var(--hi) 70%,transparent)}
.lg-w-ct .pf-ct:hover{transform:scale(1.08)}
.lg-lens{position:absolute;z-index:6;left:0;top:0;width:clamp(5em,13vmin,9em);aspect-ratio:1;border-radius:50%;cursor:grab;touch-action:none;box-shadow:inset 0 2px 1px rgba(255,255,255,.9),inset 0 -6px 14px rgba(255,255,255,.25),inset 0 0 0 1px rgba(255,255,255,.4),0 22px 40px -14px var(--shade);transition:scale .3s var(--out)}
.lg-lens::before{content:"";position:absolute;inset:0;border-radius:50%;-webkit-backdrop-filter:blur(1.5px) saturate(1.6) brightness(1.08);backdrop-filter:blur(1.5px) saturate(1.6) brightness(1.08)}
.pf[data-t=glass].lg-refr .lg-lens::before{backdrop-filter:url(#lg-lens) saturate(1.6) brightness(1.08)}
.lg-lens i{position:absolute;left:18%;top:12%;width:34%;height:20%;border-radius:50%;background:radial-gradient(closest-side,rgba(255,255,255,.85),transparent);transform:rotate(-24deg)}
.lg-lens.is-drag{cursor:grabbing;scale:1.08}
.lg-left>*{opacity:0;transform:translateY(1.2em);filter:blur(8px);transition:opacity .9s var(--out),transform 1.1s var(--out),filter .9s var(--out)}
.lg-left>:nth-child(2){transition-delay:.08s}.lg-left>:nth-child(3){transition-delay:.25s}.lg-left>:nth-child(4){transition-delay:.35s}.lg-left>:nth-child(5){transition-delay:.45s}
.lg-right>*{opacity:0;transform:scale(.92);filter:blur(10px);transition:opacity .8s var(--out),transform 1s var(--out),filter .8s var(--out)}
.lg-right>:nth-child(2){transition-delay:.3s}.lg-right>:nth-child(3){transition-delay:.4s}.lg-right>:nth-child(4){transition-delay:.5s}
.lg-lens{opacity:0;transition:opacity 1s 1s,scale .3s var(--out)}
.pf-sec-home.is-on :is(.lg-left>*,.lg-right>*),.pf[data-static] :is(.lg-left>*,.lg-right>*){opacity:1;transform:none;filter:none}
.pf-sec-home.is-on .lg-lens,.pf[data-static] .lg-lens{opacity:1}
/* sections */
.pf[data-t=glass] .pf-head-n{display:none}
.pf[data-t=glass] .pf-head-t{font-weight:300;letter-spacing:-.045em;font-size:clamp(2.2em,6.4vmin,4.8em)}
.pf[data-t=glass][data-v="2"] .pf-head-t{font-weight:400;letter-spacing:-.02em}
.pf[data-t=glass] .pf-head-s{color:var(--muted)}
.pf[data-t=glass] .pf-card{padding:.45em;border-radius:var(--radius)}
.pf[data-t=glass] .pf-card-media{border-radius:calc(var(--radius) - .45em);background:transparent}
.pf[data-t=glass] .pf-card:hover{transform:translateY(-4px) scale(1.01)}
.pf[data-t=glass] .pf-card-body{padding:.6em .5em .3em}
.pf[data-t=glass] .pf-card-meta{color:var(--muted)}
.pf[data-t=glass] .pf-repo{padding:1.1em 1.2em}
.pf[data-t=glass] .pf-chip,.pf[data-t=glass] .pf-tab{--blur:10px;padding:.55em 1.05em}
.pf[data-t=glass] .pf-chip[aria-pressed=true],.pf[data-t=glass] .pf-tab[aria-selected=true]{background:color-mix(in srgb,var(--hi) 55%,transparent);color:var(--fg)}
.pf[data-t=glass][data-v="1"] .pf-chip[aria-pressed=true],.pf[data-t=glass][data-v="1"] .pf-tab[aria-selected=true]{background:rgba(255,255,255,.18)}
.pf[data-t=glass] .pf-btn{background:color-mix(in srgb,var(--accent) 85%,transparent);color:#fff;box-shadow:inset 0 1px 0 rgba(255,255,255,.6),0 10px 30px -12px var(--accent)}
.pf[data-t=glass][data-v="1"] .pf-btn{color:#04110e}
.pf[data-t=glass][data-v="2"] .pf-btn{color:#2a1d0a}
.pf[data-t=glass] .pf-btn-ghost{background:color-mix(in srgb,var(--hi) 20%,transparent);color:var(--fg);border:0}
.pf[data-t=glass] .pf-profile-img{border-radius:2em}
.pf[data-t=glass] .pf-port-item{padding:.5em}
.pf[data-t=glass] .pf-port-media{border-radius:calc(var(--radius) - .5em)}
.pf[data-t=glass] .pf-port-t{font-weight:300;letter-spacing:-.03em}
.pf[data-t=glass] .pf-stats dd{font-weight:300;letter-spacing:-.04em}
.pf[data-t=glass] .pf-ph{border-radius:inherit}
.pf[data-t=glass] .pf-modal-box{--blur:40px;--glass:color-mix(in srgb,var(--bg) 55%,transparent)}
.pf[data-t=glass] .pf-modal-h{border-color:var(--line)}
.pf[data-t=glass] .pf-skill li{background:color-mix(in srgb,var(--hi) 22%,transparent)}
/* responsive */
.pf[data-w=sm] .lg-tabs .pf-nav-l,.pf[data-w=xs] .lg-tabs .pf-nav-l{display:none}
.pf[data-w=sm] .lg-tabs .pf-nav-a,.pf[data-w=xs] .lg-tabs .pf-nav-a{padding:.7em 1em}
.pf[data-w=xs]{--pad-r:1.1em;--pad-l:1.1em;--pad-t:5em;--pad-b:6em}
.pf[data-w=xs] .lg-top{inset:.9em .9em auto}
.pf[data-w=xs] .lg-brand span,.pf[data-w=xs] .lg-time span{display:none}
.pf[data-o=p] .lg-hero{grid-template-columns:1fr;grid-template-rows:auto minmax(0,1fr);gap:1em;align-items:start}
.pf[data-o=p] .lg-pitch,.pf[data-o=p] .lg-hi{display:none}
.pf[data-o=p] .lg-name{font-size:clamp(3em,19vw,7em)}
.pf[data-o=p] .lg-roles{margin:-1.6em 0 0 8%;font-size:.78em}
.pf[data-o=p] .lg-right{grid-template-columns:1fr;grid-template-rows:1fr auto;padding:0}
.pf[data-o=p] .lg-w-stat,.pf[data-o=p] .lg-w-now{display:none}
.pf[data-o=p] .lg-w-ct{grid-column:1;grid-row:2;justify-content:center}
.pf[data-o=p] .lg-portrait{grid-row:1}
.pf[data-h=tiny]{--pad-b:4.6em;--pad-t:4em}
.pf[data-h=tiny] .lg-pitch,.pf[data-h=tiny] .lg-hi,.pf[data-h=tiny] .lg-w-now,.pf[data-h=tiny] .lg-w-stat{display:none}
.pf[data-h=tiny] .lg-top{inset:.5em 1em auto}
.pf[data-h=tiny] .lg-pill,.pf[data-h=tiny] .lg-round{height:2.4em}
.pf[data-h=tiny] .lg-round{width:2.4em}
.pf[data-h=tiny] .lg-tabs{bottom:.5em}
.pf[data-h=tiny] .lg-tabs .pf-nav-l{display:none}
.pf[data-h=tiny] .lg-tabs .pf-nav-a{padding:.45em .9em}
`,
};
