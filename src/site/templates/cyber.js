/*! Portfolio Studio. Copyright (c) 2026 Roy Borkin. All rights reserved. Unauthorized copying, modification or distribution is prohibited without written permission. */
// 13 — Night City : cyberpunk. Neon tube signage, a receding grid, cut-corner HUD panels, text that
// decodes itself from noise, and a portrait that glitches in RGB bursts. Your name in Japanese hangs
// as a vertical neon sign.
const GLYPHS = 'アイウエオカキクケコサシスセソタチツテトナニヌネノ0123456789#$%&*+<>/\\[]{}=_-';
function scramble(el, text, dur = 900) {
  if (el.closest?.('[data-ta-on]')) { if (!el.closest('[data-ta-split]')) el.textContent = text; return; }
  if (!el) return;
  if (el._scr) cancelAnimationFrame(el._scr);
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches || document.getElementById('pf')?.dataset.motion === 'off';
  if (reduce) { el.textContent = text; return; }
  const t0 = performance.now(), chars = [...text];
  const step = (now) => {
    const p = Math.min(1, (now - t0) / dur);
    el.textContent = chars.map((ch, i) => (ch === ' ' ? ' ' : i / chars.length < p * 1.15 - 0.15 ? ch : GLYPHS[(Math.random() * GLYPHS.length) | 0])).join('');
    if (p < 1) el._scr = requestAnimationFrame(step); else el.textContent = text;
  };
  el._scr = requestAnimationFrame(step);
}
export default {
  id: 'cyber',
  name: 'Night City',
  blurb: 'Cyberpunk: neon signage, decoding text, glitching portrait, 3D grid floor.',
  cursor: true,
  transition(from, to, dir, ax, pt, root) {
    const flash = root.querySelector('.cy-flash');
    const k = [];
    for (let i = 0; i <= 10; i++) { const y = Math.random() * 85; k.push({ offset: i / 10, clipPath: i === 10 ? 'inset(0 0 0 0)' : `inset(${y}% 0 ${Math.max(0, 92 - y - Math.random() * 40)}% 0)`, transform: i === 10 ? 'none' : `translateX(${(Math.random() - 0.5) * 8}%)` }); }
    return [
      from.animate([{ opacity: 1, filter: 'none', transform: 'none' }, { opacity: 0, filter: 'hue-rotate(90deg) saturate(3)', transform: `translateX(${-dir * 3}%) skewX(-6deg)` }], { duration: 380, easing: 'steps(5)', fill: 'forwards' }),
      to.animate(k, { duration: 560, delay: 140, easing: 'linear', fill: 'both' }),
      flash.animate([{ opacity: 0 }, { opacity: 0.55, offset: 0.25 }, { opacity: 0 }], { duration: 420, delay: 100 }),
    ];
  },
  variants: [
    { name: 'Arasaka', swatch: ['#0a0a0c', '#fcee0a', '#ff003c'],
      vars: { bg: '#0b0b0d', surface: 'rgba(252,238,10,.04)', fg: '#f4f1e6', muted: '#8f8b7a', accent: '#fcee0a', accent2: '#ff003c', line: 'rgba(252,238,10,.22)', neon: '#00f0ff' },
      fonts: { display: 'Teko:500;600', body: 'Barlow:400;500;600', mono: 'Share Tech Mono:400' }, opts: { fx: 'glyphs' } },
    { name: 'Neon Tokyo', swatch: ['#0b0620', '#ff2bd6', '#00f0ff'],
      vars: { bg: '#0a0520', surface: 'rgba(255,43,214,.05)', fg: '#f6eaff', muted: '#9c8bc4', accent: '#ff2bd6', accent2: '#00f0ff', line: 'rgba(255,43,214,.25)', neon: '#ffd319' },
      fonts: { display: 'Audiowide:400', body: 'Barlow:400;500;600', mono: 'Share Tech Mono:400' }, opts: { fx: 'sun' } },
    { name: 'Blade Rain', swatch: ['#061015', '#00e0c6', '#ff7a18'],
      vars: { bg: '#061116', surface: 'rgba(0,224,198,.05)', fg: '#e4f7f5', muted: '#6f9a98', accent: '#00e0c6', accent2: '#ff7a18', line: 'rgba(0,224,198,.22)', neon: '#ff7a18' },
      fonts: { display: 'Oxanium:600;800', body: 'Barlow:400;500;600', mono: 'Share Tech Mono:400' }, opts: { fx: 'rain' } },
  ],
  layout: { works: [15, 15] },
  shell(c) {
    const fx = c.opt('fx');
    return {
      bg: `${fx === 'sun' ? '<div class="cy-sun"></div>' : ''}<div class="cy-floor"><i></i></div><canvas class="cy-fx"></canvas><div class="cy-scan"></div>`,
      nav: `<header class="cy-top">
          <button class="cy-id" data-go="0" data-hover>${c.logo()}<span><b>${c.esc(c.name.toUpperCase())}</b><small>${c.esc((c.P.role || '').toUpperCase())}</small></span></button>
          <nav class="cy-nav" aria-label="Sections">${c.secs.map((s) => `<a class="pf-nav-a" href="#${s.id}" data-go="${s.i}"><span class="pf-nav-n">${s.n}</span><span class="pf-nav-l" data-text="${c.esc(s.label.toUpperCase())}">${c.esc(s.label.toUpperCase())}</span></a>`).join('')}</nav>
          <button class="cy-jack" data-contact data-hover><i></i><span>Contact</span></button>
          ${c.menuBtn()}
        </header>
        ${c.P.altName ? `<p class="cy-sign" aria-hidden="true">${c.esc(c.P.altName)}</p>` : ''}
        <footer class="cy-foot"><span class="cy-sector">SECTOR <b>01</b>/${c.pad2(c.secs.length)}</span><div class="cy-cts">${c.contactLinks({ limit: 6 })}</div><span class="cy-live"><i></i>${c.esc((c.P.location || 'Online').toUpperCase())}</span></footer>
        <div class="cy-flash" aria-hidden="true"></div>
        ${c.drawer()}`,
    };
  },
  home(c) {
    const cut = c.img(c.P.cutout) || c.img(c.P.photo);
    const st = (c.data.about?.stats || []).slice(0, 3);
    const ws = c.sec('works');
    return `<div class="cy-hero">
      <div class="cy-txt">
        <p class="cy-tagline-top"><i></i>${c.esc(c.P.intro || '')}</p>
        <h1 class="cy-name" aria-label="${c.esc(c.name)}"><span class="cy-l" data-final="${c.esc(c.first.toUpperCase())}">${c.esc(c.first.toUpperCase())}</span><span class="cy-l" data-final="${c.esc(c.last.toUpperCase())}">${c.esc(c.last.toUpperCase())}</span></h1>
        <ul class="cy-roles">${c.roles.map((r, i) => `<li style="--i:${i}">${c.esc(r)}</li>`).join('')}</ul>
        <p class="cy-pitch">${c.esc(c.P.tagline || '')}</p>
        <div class="cy-cta">${ws ? `<button class="cy-btn" data-go="${ws.i}" data-hover><span>${c.esc(ws.label)}</span>${c.I('arrow')}</button>` : ''}${c.data.about?.resume?.url ? `<button class="cy-btn ghost" data-open="resume" data-hover><span>${c.esc(c.data.about.resume.label || 'Resume')}</span></button>` : ''}</div>
      </div>
      <div class="cy-figbox">
        <div class="cy-frame"><i></i><i></i><i></i><i></i></div>
        <figure class="cy-fig"><img class="b" src="${c.esc(cut)}" alt="${c.esc(c.name)}" draggable="false"><img class="r" src="${c.esc(cut)}" alt="" draggable="false"><img class="g" src="${c.esc(cut)}" alt="" draggable="false"></figure>
        <div class="cy-hud">${st.map((s, i) => `<div style="--i:${i}"><small>${c.esc(s.label)}</small><b>${c.esc(s.value)}</b><span class="cy-meter" style="--v:${Math.min(1, (parseFloat(s.value) || 5) / (i === 0 ? 20 : i === 1 ? 40 : 10))}"><i></i></span></div>`).join('')}</div>
      </div>
    </div>`;
  },
  head(c, s) {
    return `<header class="pf-head cy-head"><span class="pf-head-n">// ${s.n}</span><h2 class="pf-head-t" data-final="${c.esc((s.title || s.label).toUpperCase())}">${c.esc((s.title || s.label).toUpperCase())}</h2>${s.subtitle ? `<p class="pf-head-s">${c.esc(s.subtitle)}</p>` : ''}</header>`;
  },
  mount(c, root) {
    const off = [];
    // decode the name and nav labels
    const decodeHome = () => root.querySelectorAll('.cy-name .cy-l').forEach((el, i) => setTimeout(() => scramble(el, el.dataset.final, 1100), 200 + i * 260));
    if (!root.dataset.static) decodeHome();
    root._cyDecode = decodeHome;
    const hov = (e) => { const a = e.target.closest?.('.cy-nav .pf-nav-a'); if (!a) return; const l = a.querySelector('.pf-nav-l'); scramble(l, l.dataset.text, 420); };
    root.addEventListener('pointerover', hov); off.push(() => root.removeEventListener('pointerover', hov));
    // glitch bursts on the portrait
    const fig = root.querySelector('.cy-fig');
    let gt = 0;
    const burst = () => { if (!fig || root.dataset.static || root.dataset.motion === 'off') return; fig.classList.add('glitch'); setTimeout(() => fig.classList.remove('glitch'), 380 + Math.random() * 260); gt = setTimeout(burst, 2600 + Math.random() * 3200); };
    gt = setTimeout(burst, 1800); off.push(() => clearTimeout(gt));
    // background canvas: glyph streams or rain
    const fx = c.opt('fx'), cv = root.querySelector('.cy-fx');
    if (cv && fx !== 'sun') {
      const g = cv.getContext('2d'); let W, H, dpr, drops = [];
      const size = () => { dpr = Math.min(2, devicePixelRatio || 1); W = cv.clientWidth; H = cv.clientHeight; cv.width = W * dpr; cv.height = H * dpr; drops = Array.from({ length: fx === 'rain' ? 140 : Math.ceil(W / 26) }, () => ({ x: Math.random() * W, y: Math.random() * H, v: fx === 'rain' ? 9 + Math.random() * 9 : 1 + Math.random() * 2.5, l: 10 + Math.random() * 30, ch: [] })); };
      size(); const ro = new ResizeObserver(size); ro.observe(cv); off.push(() => ro.disconnect());
      const css = getComputedStyle(root); const acc = css.getPropertyValue('--accent').trim(), acc2 = css.getPropertyValue('--accent2').trim();
      let last = 0;
      off.push(c.loop((t) => {
        if (t - last < 1 / 40 && t > 0.05) return; last = t;
        g.setTransform(dpr, 0, 0, dpr, 0, 0);
        const p = c.pointer();
        if (fx === 'rain') {
          g.clearRect(0, 0, W, H);
          g.lineWidth = 1;
          for (const d of drops) {
            d.y += d.v; d.x += 1.6 + p.x * 3; if (d.y > H) { d.y = -d.l; d.x = Math.random() * W; } if (d.x > W) d.x = 0; if (d.x < 0) d.x = W;
            g.strokeStyle = Math.random() < 0.04 ? acc2 : acc; g.globalAlpha = 0.18 + (d.v - 9) / 30;
            g.beginPath(); g.moveTo(d.x, d.y); g.lineTo(d.x - d.l * 0.18, d.y - d.l); g.stroke();
          }
        } else {
          g.fillStyle = getComputedStyle(root).getPropertyValue('--bg'); g.globalAlpha = 0.18; g.fillRect(0, 0, W, H);
          g.font = '14px "Share Tech Mono", monospace'; g.globalAlpha = 0.55;
          drops.forEach((d, i) => { if (Math.random() < 0.55) return; d.y += 16; if (d.y > H + 20 || Math.random() < 0.002) { d.y = -Math.random() * H * 0.5; } g.fillStyle = Math.random() < 0.03 ? acc2 : acc; g.fillText(GLYPHS[(Math.random() * GLYPHS.length) | 0], i * 26 + 6, d.y); });
        }
        g.globalAlpha = 1;
      }));
    }
    return () => off.forEach((f) => f());
  },
  onEnter(c, i, p, root) {
    const s = root.querySelector('.cy-sector b'); if (s) s.textContent = c.pad2(i + 1);
    const sec = root.querySelectorAll('.pf-sec')[i];
    if (c.secs[i].id === 'home') { if (p != null) root._cyDecode?.(); }
    else { const h = sec?.querySelector('.pf-head-t'); if (h && h.dataset.final && !root.dataset.static) scramble(h, h.dataset.final, 700); }
  },
  css: () => `
.pf[data-t=cyber]{--pad-t:6.2em;--pad-r:4.4em;--pad-l:4.4em;--pad-b:5em;--radius:0px;--grain-o:.09;--cut:14px;--cursor:var(--accent);font-family:var(--f-body)}
.pf[data-t=cyber] .pf-cursor:not([data-cs=blend]) .pf-cur-r{border-radius:0;border-style:dashed}
.pf[data-t=cyber] .pf-cur-d{border-radius:0}
/* background */
.cy-sun{position:absolute;left:50%;top:14%;width:min(40vw,56vh);aspect-ratio:1;translate:-50% 0;border-radius:50%;background:linear-gradient(#ffd319,#ff2bd6 58%,#8c1eff);box-shadow:0 0 80px rgba(255,43,214,.45);overflow:hidden;opacity:.9}
.cy-sun::after{content:"";position:absolute;inset:48% 0 0;background:repeating-linear-gradient(var(--bg) 0 5px,transparent 5px 20px)}
.cy-floor{position:absolute;left:-50%;right:-50%;bottom:0;height:46%;perspective:420px;overflow:hidden;mask-image:linear-gradient(transparent,#000 35%)}
.cy-floor i{position:absolute;inset:-100% 0 0;background-image:linear-gradient(var(--accent) 1.5px,transparent 1.5px),linear-gradient(90deg,var(--accent) 1.5px,transparent 1.5px);background-size:70px 70px;transform:rotateX(76deg);transform-origin:50% 100%;opacity:.38;animation:cyFloor 2.4s linear infinite;filter:drop-shadow(0 0 4px var(--accent))}
.pf[data-v="0"] .cy-floor i{opacity:.16}
.pf[data-v="2"] .cy-floor i{opacity:.14}
@keyframes cyFloor{to{background-position:0 70px}}
.cy-fx{position:absolute;inset:0;width:100%;height:100%;opacity:.5}
.pf[data-v="2"] .cy-fx{opacity:.8}
.cy-scan{position:absolute;inset:0;background:repeating-linear-gradient(0deg,rgba(0,0,0,.25) 0 1px,transparent 1px 3px);mix-blend-mode:multiply;pointer-events:none}
.cy-flash{position:absolute;inset:0;z-index:55;background:var(--accent);mix-blend-mode:screen;opacity:0;pointer-events:none}
/* chrome */
.cy-top{position:absolute;z-index:20;inset:0 0 auto;display:flex;align-items:center;gap:1.6em;padding:1em 1.6em;border-bottom:1px solid var(--line);background:linear-gradient(color-mix(in srgb,var(--bg) 85%,transparent),transparent)}
.cy-id{display:flex;align-items:center;gap:.8em;font-family:var(--f-mono);font-size:.74em;line-height:1.2;text-align:left}
.cy-id .pf-logo{height:2.4em;filter:brightness(0) invert(1) drop-shadow(0 0 6px var(--accent))}
.cy-id small{display:block;color:var(--accent);letter-spacing:.08em}
.cy-nav{display:flex;margin:0 auto;gap:.25em}
.cy-nav .pf-nav-a{position:relative;display:flex;gap:.5em;align-items:baseline;padding:.55em 1.2em;font-family:var(--f-mono);font-size:.76em;letter-spacing:.06em;color:var(--muted);transform:skewX(-18deg);border:1px solid transparent;transition:color .2s,background-color .2s,border-color .2s}
.cy-nav .pf-nav-a>*{transform:skewX(18deg);display:inline-block}
.cy-nav .pf-nav-a:hover{color:var(--fg);border-color:var(--line)}
.cy-nav .pf-nav-a.is-cur{background:var(--accent);color:var(--bg);box-shadow:0 0 18px color-mix(in srgb,var(--accent) 60%,transparent)}
.cy-nav .pf-nav-n{opacity:.6}
.cy-jack{display:flex;align-items:center;gap:.6em;padding:.6em 1.1em;font-family:var(--f-mono);font-size:.76em;letter-spacing:.08em;text-transform:uppercase;border:1px solid var(--accent2);color:var(--accent2);clip-path:polygon(0 0,calc(100% - 10px) 0,100% 10px,100% 100%,10px 100%,0 calc(100% - 10px));transition:background-color .2s,color .2s}
.cy-jack i{width:.55em;height:.55em;background:var(--accent2);box-shadow:0 0 8px var(--accent2);animation:cyBlink 1.4s steps(1) infinite}
.cy-jack:hover{background:var(--accent2);color:var(--bg)}
.cy-jack:hover i{background:var(--bg)}
@keyframes cyBlink{50%{opacity:.2}}
.cy-sign{position:absolute;z-index:6;right:1.4em;top:50%;translate:0 -50%;writing-mode:vertical-rl;font-family:"Noto Sans JP","Hiragino Sans","Yu Gothic","Meiryo",sans-serif;font-weight:800;font-size:clamp(1.4em,3.6vmin,2.6em);letter-spacing:.12em;color:#fff;text-shadow:0 0 4px #fff,0 0 12px var(--neon),0 0 28px var(--neon),0 0 60px var(--neon);padding:.5em .2em;border:2px solid var(--neon);border-radius:6px;box-shadow:0 0 14px var(--neon),inset 0 0 14px var(--neon);animation:cyFlicker 6s infinite;pointer-events:none}
@keyframes cyFlicker{0%,19%,21%,23%,80%,100%{opacity:1}20%,22%{opacity:.35}81%{opacity:.6}}
.pf:not([data-cur=home]) .cy-sign{opacity:.25!important;animation:none}
.cy-foot{position:absolute;z-index:20;left:0;right:0;bottom:0;display:flex;align-items:center;gap:1.6em;padding:.7em 1.6em;font-family:var(--f-mono);font-size:.72em;letter-spacing:.06em;border-top:1px solid var(--line);background:color-mix(in srgb,var(--bg) 80%,transparent)}
.cy-sector b{color:var(--accent);font-weight:400}
.cy-cts{display:flex;gap:.2em;margin:0 auto}
.cy-cts .pf-ct{width:2.2em;height:2.2em;color:var(--muted);border:1px solid transparent}
.cy-cts .pf-ct:hover{color:var(--accent);border-color:var(--accent);box-shadow:0 0 12px color-mix(in srgb,var(--accent) 50%,transparent)}
.cy-live{display:flex;align-items:center;gap:.6em;color:var(--muted)}
.cy-live i{width:.5em;height:.5em;border-radius:50%;background:var(--accent);box-shadow:0 0 8px var(--accent);animation:cyBlink 1s steps(1) infinite}
.pf[data-v="0"] .cy-foot::before{content:"";position:absolute;left:0;right:0;top:-6px;height:5px;background:repeating-linear-gradient(-45deg,var(--accent) 0 10px,#0b0b0d 10px 20px)}
/* hero */
.cy-hero{position:absolute;inset:0;display:grid;grid-template-columns:1.15fr 1fr;gap:2em;align-items:center}
.cy-txt{display:flex;flex-direction:column;gap:1.1em;align-items:flex-start;position:relative;z-index:3}
.cy-tagline-top{display:flex;align-items:center;gap:.8em;font-family:var(--f-mono);font-size:.8em;color:var(--accent);letter-spacing:.1em;text-transform:uppercase}
.cy-tagline-top i{width:2.6em;height:2px;background:var(--accent);box-shadow:0 0 8px var(--accent)}
.cy-name{display:flex;flex-direction:column;font-family:var(--f-display);font-weight:600;font-size:clamp(3em,13vmin,10em);line-height:.82;letter-spacing:.01em;color:var(--fg);text-shadow:-.035em 0 rgba(255,0,60,.75),.035em 0 rgba(0,240,255,.75),0 0 .3em color-mix(in srgb,var(--accent) 35%,transparent);animation:cyRgb 4s infinite;white-space:nowrap}
.pf[data-v="1"] .cy-name{font-weight:400;font-size:clamp(2.4em,9vmin,7em);line-height:.95;color:#fff}
.pf[data-v="2"] .cy-name{font-weight:800;font-size:clamp(2.6em,10vmin,8em);letter-spacing:-.01em}
.cy-l:last-child{color:var(--accent)}
.pf[data-v="1"] .cy-l:last-child{-webkit-text-stroke:1.5px var(--accent);color:transparent;text-shadow:0 0 16px var(--accent)}
@keyframes cyRgb{0%,92%,100%{text-shadow:-.035em 0 rgba(255,0,60,.75),.035em 0 rgba(0,240,255,.75),0 0 .3em color-mix(in srgb,var(--accent) 35%,transparent)}93%{text-shadow:-.1em 0 rgba(255,0,60,.9),.1em 0 rgba(0,240,255,.9)}95%{text-shadow:.06em 0 rgba(255,0,60,.9),-.06em 0 rgba(0,240,255,.9)}}
.cy-roles{display:flex;flex-wrap:wrap;gap:.4em}
.cy-roles li{font-family:var(--f-mono);font-size:.74em;letter-spacing:.06em;text-transform:uppercase;padding:.35em .8em;border:1px solid var(--line);color:var(--fg);background:var(--surface)}
.cy-roles li:first-child{border-color:var(--accent);color:var(--accent)}
.cy-pitch{max-width:42ch;color:var(--muted);line-height:1.55;font-size:.98em;padding-left:1em;border-left:2px solid var(--accent2)}
.cy-cta{display:flex;gap:.8em;flex-wrap:wrap;margin-top:.4em}
.cy-btn{display:inline-flex;align-items:center;gap:.8em;padding:.9em 1.5em;font-family:var(--f-mono);font-size:.8em;letter-spacing:.1em;text-transform:uppercase;background:var(--accent);color:var(--bg);clip-path:polygon(0 0,calc(100% - 14px) 0,100% 14px,100% 100%,14px 100%,0 calc(100% - 14px));transition:transform .2s,filter .2s;position:relative}
.cy-btn:hover{filter:drop-shadow(0 0 10px var(--accent));transform:translateX(3px)}
.cy-btn.ghost{background:transparent;color:var(--accent);box-shadow:inset 0 0 0 1px var(--accent)}
.cy-figbox{position:relative;align-self:stretch;margin:calc(var(--pad-t) * -.3) 0 calc(var(--pad-b) * -1)}
.cy-frame{position:absolute;left:8%;right:4%;top:6%;bottom:8%;border:1px solid var(--line);clip-path:polygon(0 0,calc(100% - 40px) 0,100% 40px,100% 100%,40px 100%,0 calc(100% - 40px));background:linear-gradient(135deg,color-mix(in srgb,var(--accent2) 14%,transparent),transparent 50%);transform:translate(calc(var(--mx) * 10px),calc(var(--my) * 6px))}
.cy-frame i{position:absolute;width:22px;height:22px;border:2px solid var(--accent);filter:drop-shadow(0 0 6px var(--accent))}
.cy-frame i:nth-child(1){left:-1px;top:-1px;border-right:0;border-bottom:0}.cy-frame i:nth-child(2){right:-1px;top:40px;border-left:0;border-bottom:0}.cy-frame i:nth-child(3){left:40px;bottom:-1px;border-right:0;border-top:0}.cy-frame i:nth-child(4){right:-1px;bottom:-1px;border-left:0;border-top:0}
.cy-fig{position:absolute;left:50%;bottom:0;height:96%;aspect-ratio:1606/1500;transform:translateX(calc(-50% + var(--mx) * -8px))}
.cy-fig img{position:absolute;inset:0;width:100%;height:100%;object-fit:contain;object-position:bottom}
.cy-fig .b{filter:contrast(1.15) saturate(.8) drop-shadow(0 0 30px color-mix(in srgb,var(--accent2) 30%,transparent))}
.pf[data-v="1"] .cy-fig .b{filter:contrast(1.1) saturate(.6) hue-rotate(-20deg) drop-shadow(0 0 30px rgba(255,43,214,.4))}
.pf[data-v="2"] .cy-fig .b{filter:grayscale(.6) contrast(1.2) brightness(.9) drop-shadow(0 0 24px rgba(0,224,198,.35))}
.cy-fig .r,.cy-fig .g{opacity:0;mix-blend-mode:screen}
.cy-fig .r{filter:grayscale(1) brightness(.8) sepia(1) saturate(8) hue-rotate(-50deg)}
.cy-fig .g{filter:grayscale(1) brightness(.8) sepia(1) saturate(8) hue-rotate(140deg)}
.cy-fig.glitch .r{opacity:.7;animation:cySliceA .4s steps(3) infinite}
.cy-fig.glitch .g{opacity:.7;animation:cySliceB .4s steps(3) infinite}
.cy-fig.glitch .b{animation:cyShake .25s steps(2) infinite}
@keyframes cySliceA{0%{clip-path:inset(10% 0 70% 0);transform:translateX(-14px)}50%{clip-path:inset(55% 0 25% 0);transform:translateX(10px)}100%{clip-path:inset(80% 0 4% 0);transform:translateX(-6px)}}
@keyframes cySliceB{0%{clip-path:inset(40% 0 40% 0);transform:translateX(12px)}50%{clip-path:inset(5% 0 80% 0);transform:translateX(-10px)}100%{clip-path:inset(65% 0 15% 0);transform:translateX(8px)}}
@keyframes cyShake{50%{transform:translateX(3px)}}
.cy-hud{position:absolute;left:0;bottom:12%;display:flex;flex-direction:column;gap:.7em;z-index:3}
.cy-hud div{display:grid;grid-template-columns:auto auto;align-items:baseline;column-gap:.8em;padding:.5em .8em;background:color-mix(in srgb,var(--bg) 70%,transparent);border-left:2px solid var(--accent);backdrop-filter:blur(4px);opacity:0;transform:translateX(-1em);transition:all .6s var(--out);transition-delay:calc(1.2s + var(--i) * .12s)}
.cy-hud small{grid-column:1/-1;font-family:var(--f-mono);font-size:.62em;letter-spacing:.08em;text-transform:uppercase;color:var(--muted)}
.cy-hud b{font-family:var(--f-display);font-size:1.6em;line-height:1;font-weight:600;color:var(--fg)}
.cy-meter{width:5em;height:.4em;background:repeating-linear-gradient(90deg,var(--line) 0 4px,transparent 4px 6px);position:relative}
.cy-meter i{position:absolute;inset:0;width:calc(var(--v) * 100%);background:repeating-linear-gradient(90deg,var(--accent) 0 4px,transparent 4px 6px);filter:drop-shadow(0 0 4px var(--accent))}
.cy-txt>*{opacity:0;transform:translateX(-1em);transition:opacity .5s,transform .7s var(--out)}
.cy-txt>:nth-child(2){transition-delay:.05s}.cy-txt>:nth-child(3){transition-delay:.6s}.cy-txt>:nth-child(4){transition-delay:.75s}.cy-txt>:nth-child(5){transition-delay:.9s}
.cy-figbox{opacity:0;transition:opacity .4s .3s}
.pf-sec-home.is-on :is(.cy-txt>*,.cy-hud div),.pf[data-static] :is(.cy-txt>*,.cy-hud div){opacity:1;transform:none}
.pf-sec-home.is-on .cy-figbox,.pf[data-static] .cy-figbox{opacity:1}
/* sections: cut-corner HUD panels */
.cy-head{border-bottom:1px solid var(--line);padding-bottom:.5em;position:relative}
.cy-head::after{content:"";position:absolute;left:0;bottom:-1px;width:7em;height:2px;background:var(--accent);box-shadow:0 0 10px var(--accent)}
.pf[data-t=cyber] .pf-head-n{font-family:var(--f-mono);color:var(--accent)}
.pf[data-t=cyber] .pf-head-t{font-weight:600;letter-spacing:.02em;font-size:clamp(2em,6vmin,4.4em);line-height:.9;text-shadow:-.03em 0 rgba(255,0,60,.6),.03em 0 rgba(0,240,255,.6)}
.pf[data-t=cyber][data-v="1"] .pf-head-t{font-weight:400;font-size:clamp(1.5em,4.4vmin,3.2em)}
.pf[data-t=cyber] .pf-card,.pf[data-t=cyber] .pf-xp,.pf[data-t=cyber] .pf-edu,.pf[data-t=cyber] .pf-skill,.pf[data-t=cyber] .pf-port-item{border-radius:0;border:1px solid var(--line);background:linear-gradient(135deg,color-mix(in srgb,var(--accent) 10%,transparent) 0 14px,transparent 14px),var(--surface);clip-path:polygon(0 0,calc(100% - var(--cut)) 0,100% var(--cut),100% 100%,var(--cut) 100%,0 calc(100% - var(--cut)));backdrop-filter:blur(6px)}
.pf[data-t=cyber] .pf-card:hover{border-color:var(--accent);background:linear-gradient(135deg,var(--accent) 0 14px,transparent 14px),color-mix(in srgb,var(--accent) 8%,transparent)}
.pf[data-t=cyber] .pf-card-media img{filter:saturate(.6) contrast(1.15)}
.pf[data-t=cyber] .pf-card:hover .pf-card-media img{filter:saturate(1.1) contrast(1.1);animation:cyShake .3s steps(2) 2}
.pf[data-t=cyber] .pf-card-meta,.pf[data-t=cyber] .pf-card-kind{font-family:var(--f-mono);text-transform:uppercase;letter-spacing:.05em}
.pf[data-t=cyber] .pf-card-title{font-family:var(--f-display);font-size:1.15em;letter-spacing:.02em;text-transform:uppercase;font-weight:600}
.pf[data-t=cyber][data-v="1"] .pf-card-title{font-weight:400;font-size:.95em}
.pf[data-t=cyber] .pf-chip,.pf[data-t=cyber] .pf-tab{border-radius:0;font-family:var(--f-mono);text-transform:uppercase;font-size:.74em;letter-spacing:.06em;transform:skewX(-14deg)}
.pf[data-t=cyber] .pf-chip>*,.pf[data-t=cyber] .pf-tab>*{transform:skewX(14deg)}
.pf[data-t=cyber] .pf-chip[aria-pressed=true],.pf[data-t=cyber] .pf-tab[aria-selected=true]{background:var(--accent);color:var(--bg);border-color:var(--accent);box-shadow:0 0 14px color-mix(in srgb,var(--accent) 50%,transparent)}
.pf[data-t=cyber] .pf-btn{border-radius:0;background:var(--accent);color:var(--bg);font-family:var(--f-mono);text-transform:uppercase;letter-spacing:.08em;clip-path:polygon(0 0,calc(100% - 10px) 0,100% 10px,100% 100%,10px 100%,0 calc(100% - 10px))}
.pf[data-t=cyber] .pf-btn-ghost{background:transparent;color:var(--accent);box-shadow:inset 0 0 0 1px var(--accent)}
.pf[data-t=cyber] .pf-pg{border-radius:0;border-color:var(--accent);color:var(--accent)}
.pf[data-t=cyber] .pf-stats dd{font-weight:600;color:var(--accent);text-shadow:0 0 12px color-mix(in srgb,var(--accent) 50%,transparent)}
.pf[data-t=cyber] .pf-xp header span,.pf[data-t=cyber] .pf-edu span{color:var(--accent2)}
.pf[data-t=cyber] .pf-profile-img{border-radius:0;clip-path:polygon(0 0,calc(100% - 30px) 0,100% 30px,100% 100%,30px 100%,0 calc(100% - 30px))}
.pf[data-t=cyber] .pf-profile-img img{filter:contrast(1.1) saturate(.7)}
.pf[data-t=cyber] .pf-port-t{font-weight:600;text-transform:uppercase;letter-spacing:.02em;font-size:clamp(1.6em,4vmin,2.8em)}
.pf[data-t=cyber][data-v="1"] .pf-port-t{font-weight:400;font-size:clamp(1.1em,2.6vmin,1.8em)}
.pf[data-t=cyber] .pf-modal-box{border-radius:0;border:1px solid var(--accent);box-shadow:0 0 40px color-mix(in srgb,var(--accent) 25%,transparent)}
.pf[data-t=cyber] .pf-ph{background:repeating-linear-gradient(-45deg,color-mix(in srgb,var(--accent) 16%,transparent) 0 8px,transparent 8px 16px),var(--bg);color:var(--accent)}
/* responsive */
.pf[data-w=md] .cy-nav .pf-nav-n,.pf[data-w=md] .cy-id span{display:none}
.pf[data-w=sm] .cy-nav,.pf[data-w=xs] .cy-nav,.pf[data-w=xs] .cy-jack span{display:none}
.pf[data-w=sm] .pf-burger,.pf[data-w=xs] .pf-burger{display:block}
.pf[data-w=sm] .cy-jack,.pf[data-w=xs] .cy-jack{margin-left:auto}
.pf[data-w=xs]{--pad-r:1.2em;--pad-l:1.2em;--pad-t:5em;--pad-b:4.2em}
.pf[data-w=xs] .cy-top{padding:.8em 1em}
.pf[data-w=xs] .cy-id span{display:none}
.pf[data-w=xs] .cy-foot{padding:.6em 1em;gap:.6em}
.pf[data-w=xs] .cy-sector,.pf[data-w=xs] .cy-live{display:none}
.pf[data-w=xs] .cy-sign{right:.5em;font-size:1.1em;top:auto;bottom:5em;translate:0}
.pf[data-o=p] .cy-hero{grid-template-columns:1fr;grid-template-rows:auto 1fr;gap:.6em;align-items:start}
.pf[data-o=p] .cy-figbox{margin:0 calc(var(--pad-r) * -1) calc(var(--pad-b) * -1)}
.pf[data-o=p] .cy-pitch,.pf[data-o=p] .cy-roles{display:none}
.pf[data-o=p] .cy-name{font-size:clamp(2.6em,17vw,6em)}
.pf[data-o=p] .cy-hud{bottom:auto;top:10%}
.pf[data-h=tiny] .cy-pitch,.pf[data-h=tiny] .cy-roles,.pf[data-h=tiny] .cy-hud,.pf[data-h=tiny] .cy-foot{display:none}
.pf[data-h=tiny]{--pad-b:1.2em}
.pf[data-h=tiny] .cy-top{padding:.4em 1.2em}
@media (prefers-reduced-motion:reduce){.cy-name,.cy-sign{animation:none}}
`,
};
