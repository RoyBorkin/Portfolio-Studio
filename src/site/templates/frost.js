/*! Portfolio Studio. Copyright (c) 2026 Roy Borkin. All rights reserved. Unauthorized copying, modification or distribution is prohibited without written permission. */
// 23 — Frost : an ice crystal suspended in fog. A faceted core turns slowly, follows the pointer,
// spins when dragged and shatters into floating shards on a click before pulling itself back
// together. Everything else is a quiet mono HUD: bracketed labels that decode from noise, an
// ASCII loading bar, and a frost-blur veil between sections. Inspired by igloo.inc.
import { maskWords, scramble, still, clock } from '../kit.js';

const GLYPHS = '-=+*/\\_#:';

// low-poly ice crystal: an icosphere subdivided once, with a seeded jitter so it reads as cut ice
function crystal() {
  const t = (1 + Math.sqrt(5)) / 2;
  let V = [[-1, t, 0], [1, t, 0], [-1, -t, 0], [1, -t, 0], [0, -1, t], [0, 1, t], [0, -1, -t], [0, 1, -t], [t, 0, -1], [t, 0, 1], [-t, 0, -1], [-t, 0, 1]];
  let F = [[0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11], [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8], [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9], [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1]];
  const norm = (v) => { const l = Math.hypot(...v); return v.map((x) => x / l); };
  V = V.map(norm);
  const cache = {};
  const mid = (a, b) => { const k = a < b ? a + '_' + b : b + '_' + a; if (cache[k] != null) return cache[k]; V.push(norm(V[a].map((x, i) => (x + V[b][i]) / 2))); return (cache[k] = V.length - 1); };
  const F2 = [];
  for (const [a, b, c] of F) { const ab = mid(a, b), bc = mid(b, c), ca = mid(c, a); F2.push([a, ab, ca], [b, bc, ab], [c, ca, bc], [ab, bc, ca]); }
  let seed = 7; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  V = V.map(([x, y, z]) => { const r = 0.86 + rnd() * 0.26; return [x * r, y * r * 1.22, z * r]; });
  return { V, F: F2.map((f) => ({ v: f, o: 0, ov: 0, sp: (rnd() - 0.5) * 0.6, k: rnd() })) };
}

const rgba = (hex, a) => {
  let h = String(hex || '#fff').trim();
  if (h.startsWith('rgb')) { const m = h.match(/[\d.]+/g) || [255, 255, 255]; return `rgba(${m[0]},${m[1]},${m[2]},${a})`; }
  h = h.replace('#', ''); if (h.length === 3) h = [...h].map((x) => x + x).join('');
  const n = parseInt(h.slice(0, 6), 16) || 0; return `rgba(${n >> 16 & 255},${n >> 8 & 255},${n & 255},${a})`;
};
const asciiLine = (n) => { let s = ''; for (let i = 0; i < n; i++) s += '-=+'[(Math.sin(i * 1.7) * 3 + 3 | 0) % 3]; return s; };

export default {
  id: 'frost',
  name: 'Frost',
  blurb: 'An ice crystal in fog you can spin and shatter, a mono HUD that decodes itself, a frost-blur veil.',
  cursor: 'brackets',
  magnetic: 0.25,
  transition(from, to, dir, ax, pt, root) {
    const v = root.querySelector('.fr-veil'), sc = root.querySelector('.fr-scan');
    const E = 'cubic-bezier(.65,0,.35,1)', D = 1150;
    return [
      v.animate([{ opacity: 0 }, { opacity: 1, offset: 0.42 }, { opacity: 1, offset: 0.56 }, { opacity: 0 }], { duration: D, easing: E }),
      sc.animate([{ transform: `translateY(${dir > 0 ? -8 : 108}vh)` }, { transform: `translateY(${dir > 0 ? 108 : -8}vh)` }], { duration: D, easing: E }),
      from.animate([{ opacity: 1, filter: 'none' }, { opacity: 0, filter: 'blur(14px)', offset: 0.45 }, { opacity: 0, filter: 'blur(14px)' }], { duration: D, easing: E, fill: 'forwards' }),
      to.animate([{ opacity: 0, filter: 'blur(14px)' }, { opacity: 0, filter: 'blur(14px)', offset: 0.5 }, { opacity: 1, filter: 'none' }], { duration: D + 150, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'both' }),
    ];
  },
  variants: [
    { name: 'Glacier', swatch: ['#a3a9b6', '#ffffff', '#0e121a'],
      vars: { bg: '#a3a9b6', surface: '#b9bfca', fg: '#0e121a', muted: '#353c4a', accent: '#1f2b45', accent2: '#ffffff', line: 'rgba(14,18,26,.18)', ice: '#ffffff', glow: '#ffffff', glow2: '#dfe8ff', fog: '#d9dee6' },
      fonts: { display: 'IBM Plex Mono:300;400;500', body: 'IBM Plex Sans:400;500', mono: 'IBM Plex Mono:400;500' } },
    { name: 'Polar night', swatch: ['#080c12', '#9fe8ff', '#e6eef8'],
      vars: { bg: '#080c12', surface: '#111823', fg: '#e6eef8', muted: '#8693a8', accent: '#9fe8ff', accent2: '#e6eef8', line: 'rgba(230,238,248,.13)', ice: '#cff4ff', glow: '#5fc8ff', glow2: '#2d6bff', fog: '#1a2636' },
      fonts: { display: 'Martian Mono:300;400;500', body: 'IBM Plex Sans:400;500', mono: 'Martian Mono:400;500' } },
    { name: 'Aurora', swatch: ['#05151a', '#7cffc4', '#b98cff'],
      vars: { bg: '#05151a', surface: '#0c2228', fg: '#e4fff5', muted: '#86ab9f', accent: '#7cffc4', accent2: '#b98cff', line: 'rgba(228,255,245,.13)', ice: '#d6fff0', glow: '#7cffc4', glow2: '#b98cff', fog: '#0e2b30' },
      fonts: { display: 'JetBrains Mono:300;400;500', body: 'IBM Plex Sans:400;500', mono: 'JetBrains Mono:400;500' } },
  ],
  layout: { works: [15, 15] },
  shell(c) {
    return {
      bg: `<div class="fr-fog" aria-hidden="true"><i></i><i></i></div><canvas class="fr-cv" aria-hidden="true"></canvas>`,
      nav: `<header class="fr-top">
          <button class="fr-brand" data-go="0" data-hover>${c.logo()}<span>[ ${c.esc(c.name)} ]</span></button>
          <nav class="fr-nav" aria-label="Sections">${c.secs.map((s) => `<a class="pf-nav-a" href="#${s.id}" data-go="${s.i}" aria-label="${c.esc(s.label)}"><span class="fr-nn">${s.n}</span><span class="pf-nav-l">${c.esc(s.label)}</span></a>`).join('')}</nav>
          <span class="fr-clock" aria-label="Local time"></span>
          <button class="fr-talk" data-contact data-hover>Contact<i>${c.I('external')}</i></button>
          ${c.menuBtn('fr-burger')}
        </header>
        <footer class="fr-foot">
          <span class="fr-loc">${c.esc(c.P.location || '')}</span>
          <span class="fr-rule" aria-hidden="true">${asciiLine(64)}</span>
          <span class="fr-cts">${c.contactLinks({ limit: 6 })}</span>
        </footer>
        <div class="fr-veil" aria-hidden="true"></div>
        <div class="fr-scan" aria-hidden="true">${asciiLine(240)}</div>
        <div class="fr-load" aria-hidden="true"><span class="fr-ascii">----------</span><span class="fr-pct">000</span></div>
        ${c.drawer('fr-drawer')}`,
    };
  },
  home(c) {
    const P = c.P, ws = c.sec('works');
    const n = (c.data.works?.items || []).length;
    return `<div class="fr-hero">
      <p class="fr-kick" data-txt="${c.esc(P.status || P.role || '')}">${c.esc(P.status || P.role || '')}</p>
      <h1 class="fr-name" aria-label="${c.esc(c.name)}">${[P.firstName, P.lastName].filter(Boolean).map((w, i) => `<span class="fr-l" style="--i:${i}" data-txt="${c.esc(w)}" aria-hidden="true">${c.esc(w)}</span>`).join('')}</h1>
      <p class="fr-roles">${c.roles.map((r) => `<span>${c.esc(r)}</span>`).join('<i>/</i>')}</p>
      <p class="fr-tag">${maskWords(c.esc, P.tagline || '')}</p>
      <div class="fr-cta">${ws ? `<button class="fr-btn fr-btn-p" data-go="${ws.i}" data-hover>[ ${c.esc(ws.label)} ]</button>` : ''}${c.data.about?.resume?.url ? `<button class="fr-btn" data-open="resume" data-hover>${c.esc(c.data.about.resume.label || 'Resume')}</button>` : ''}</div>
    </div>
    <dl class="fr-read">
      <div><dt>Base</dt><dd>${c.esc(P.location || '—')}</dd></div>
      <div><dt>Local time</dt><dd class="fr-t2">--:--</dd></div>
      <div><dt>Works</dt><dd>${String(n).padStart(3, '0')}</dd></div>
      <div><dt>Signal</dt><dd class="fr-sig"><i></i><i></i><i></i><i></i><i></i></dd></div>
    </dl>
    ${c.slot?.('bg') === false ? '' : '<p class="fr-hint">[ drag to spin · click to shatter ]</p>'}`;
  },
  head(c, s) {
    const t = s.title || s.label;
    return `<header class="pf-head"><span class="pf-head-n">[ ${s.n} ]</span><h2 class="pf-head-t" data-txt="${c.esc(t)}">${c.esc(t)}</h2>${s.subtitle ? `<p class="pf-head-s">${c.esc(s.subtitle)}</p>` : ''}</header>`;
  },
  mount(c, root, st) {
    const off = [];
    const reduce = still(root);
    const tz = c.P.timezone;
    off.push(clock(root.querySelector('.fr-clock'), tz, { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }));
    off.push(clock(root.querySelector('.fr-t2'), tz));
    // ── crystal + snow
    const cv = root.querySelector('.fr-cv'), g = cv.getContext('2d');
    const css = getComputedStyle(root);
    const col = (k, d) => css.getPropertyValue(k).trim() || d;
    const ICE = col('--ice', '#ffffff'), GLOW = col('--glow', '#ffffff'), GLOW2 = col('--glow2', GLOW);
    const { V, F } = crystal();
    let W = 0, H = 0, dpr = 1;
    let cx = 0, cy = 0, R = 100, tcx = 0, tcy = 0, tR = 100, alpha = 1, tAlpha = 1;
    const flakes = [];
    const portrait = () => H > W * 1.05;
    const target = (id) => {
      const m = Math.min(W, H);
      if (id === 'home') { if (portrait()) { tcx = W * 0.5; tcy = H * 0.7; tR = Math.min(W * 0.3, H * 0.17); } else { tcx = W * 0.66; tcy = H * 0.5; tR = m * 0.27; } tAlpha = 1; }
      else if (portrait()) { tcx = W * 0.97; tcy = H * 0.99; tR = m * 0.1; tAlpha = 0.55; } else { tcx = W - m * 0.1; tcy = H - m * 0.15; tR = m * 0.075; tAlpha = 0.7; }
    };
    const size = () => {
      dpr = Math.min(2, devicePixelRatio || 1); W = cv.clientWidth; H = cv.clientHeight; cv.width = Math.max(1, W * dpr); cv.height = Math.max(1, H * dpr);
      const n = W < 600 ? 70 : 140;
      while (flakes.length < n) flakes.push({ x: Math.random() * W, y: Math.random() * H, z: 0.15 + Math.random() * 0.85, ph: Math.random() * 6.28 });
      flakes.length = n;
      target(root.dataset.cur || 'home');
    };
    size(); cx = tcx; cy = tcy; R = tR; alpha = tAlpha;
    const ro = new ResizeObserver(() => { size(); if (reduce) { cx = tcx; cy = tcy; R = tR; draw(0); } }); ro.observe(cv); off.push(() => ro.disconnect());
    // pointer, drag and shatter
    let yaw = 0.6, yawV = 0.0025, pitch = -0.28, down = null, last = null;
    const onHome = () => (root.dataset.cur || 'home') === 'home';
    const shatter = (f = 1) => F.forEach((q) => { q.ov += (0.1 + q.k * 0.17) * f; });
    const pd = (e) => {
      if (!onHome() || e.button > 0 || e.target.closest('a,button,[data-hover],input,.pf-drawer,.pf-modal')) return;
      down = { x: e.clientX, y: e.clientY, moved: 0 }; last = { x: e.clientX, t: performance.now() };
    };
    const pm = (e) => {
      if (!down) return;
      const dx = e.clientX - last.x; down.moved += Math.abs(dx) + Math.abs(e.clientY - down.y) * 0.1;
      yawV = dx * 0.0016; yaw += dx * 0.006; last = { x: e.clientX, t: performance.now() };
    };
    const pu = () => { if (down && down.moved < 6) shatter(1); down = null; };
    root.addEventListener('pointerdown', pd); window.addEventListener('pointermove', pm, { passive: true }); window.addEventListener('pointerup', pu);
    off.push(() => { root.removeEventListener('pointerdown', pd); window.removeEventListener('pointermove', pm); window.removeEventListener('pointerup', pu); });
    root._frGo = (id) => { target(id); shatter(0.55); yawV += 0.05; };
    // render
    const L = (() => { const v = [-0.45, 0.62, 0.64], l = Math.hypot(...v); return v.map((x) => x / l); })();
    const P = new Array(V.length);
    function draw(time) {
      g.setTransform(dpr, 0, 0, dpr, 0, 0); g.clearRect(0, 0, W, H);
      const ptr = c.pointer();
      // snow (behind and in front share one pass; depth = size + alpha)
      for (const f of flakes) {
        const ox = ptr.x * f.z * 26, oy = ptr.y * f.z * 14;
        const x = ((f.x + ox) % W + W) % W, y = ((f.y + oy) % H + H) % H;
        g.fillStyle = rgba(ICE, (0.18 + f.z * 0.55) * (0.6 + alpha * 0.4));
        g.beginPath(); g.arc(x, y, 0.5 + f.z * 1.9, 0, 6.283); g.fill();
      }
      g.globalAlpha = alpha;
      // core glow
      const pulse = 0.85 + Math.sin(time * 1.3) * 0.15;
      let gr = g.createRadialGradient(cx, cy, 0, cx, cy, R * 2.1);
      gr.addColorStop(0, rgba(GLOW, 0.5 * pulse)); gr.addColorStop(0.35, rgba(GLOW2, 0.16)); gr.addColorStop(1, rgba(GLOW2, 0));
      g.fillStyle = gr; g.fillRect(cx - R * 2.2, cy - R * 2.2, R * 4.4, R * 4.4);
      // ring (back half, then crystal, then front half)
      const ring = (front) => {
        const rr = R * 1.62, tilt = -0.32 + ptr.y * 0.08, ry = rr * (0.22 + Math.abs(Math.sin(pitch)) * 0.25);
        g.save(); g.translate(cx, cy); g.rotate(tilt);
        g.strokeStyle = rgba(ICE, front ? 0.75 : 0.28); g.lineWidth = Math.max(1, R * 0.012);
        const spin = time * 0.35 + yaw * 0.4;
        for (let k = 0; k < 7; k++) {
          const a0 = spin + k * 0.9, a1 = a0 + 0.5 + (k % 3) * 0.12;
          // front = lower half of the ellipse (sin > 0)
          for (let a = a0; a < a1; a += 0.04) { const isF = Math.sin(a) > 0; if (isF !== front) continue; g.beginPath(); g.ellipse(0, 0, rr, ry, 0, a, Math.min(a + 0.045, a1)); g.stroke(); }
        }
        // ticks
        g.fillStyle = rgba(ICE, front ? 0.9 : 0.35);
        for (let k = 0; k < 24; k++) { const a = spin * -0.6 + k * 0.2618; if ((Math.sin(a) > 0) !== front) continue; g.fillRect(Math.cos(a) * rr * 1.08 - 1, Math.sin(a) * ry * 1.08 - 1, 2, 2); }
        g.restore();
      };
      ring(false);
      // rotate + project vertices
      const cyw = Math.cos(yaw), syw = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch), D = 3.6;
      for (let i = 0; i < V.length; i++) {
        const [x0, y0, z0] = V[i];
        const x1 = x0 * cyw + z0 * syw, z1 = -x0 * syw + z0 * cyw;
        const y2 = y0 * cp - z1 * sp, z2 = y0 * sp + z1 * cp;
        P[i] = [x1, y2, z2];
      }
      const faces = [];
      for (const q of F) {
        const [a, b, d] = q.v.map((i) => P[i]);
        const ux = b[0] - a[0], uy = b[1] - a[1], uz = b[2] - a[2], vx = d[0] - a[0], vy = d[1] - a[1], vz = d[2] - a[2];
        let nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx; const nl = Math.hypot(nx, ny, nz) || 1; nx /= nl; ny /= nl; nz /= nl;
        const mx = (a[0] + b[0] + d[0]) / 3, my = (a[1] + b[1] + d[1]) / 3, mz = (a[2] + b[2] + d[2]) / 3;
        if (nx * mx + ny * my + nz * mz < 0) { nx = -nx; ny = -ny; nz = -nz; } // outward
        const o = q.o, sh = 1 - Math.min(0.45, o * 0.5);
        const pts = [a, b, d].map((p) => {
          let X = mx + (p[0] - mx) * sh + nx * o, Y = my + (p[1] - my) * sh + ny * o, Z = mz + (p[2] - mz) * sh + nz * o;
          if (o > 0.01) { const r = q.sp * o; const c2 = Math.cos(r), s2 = Math.sin(r); const lx = X - mx - nx * o, ly = Y - my - ny * o; X = mx + nx * o + lx * c2 - ly * s2; Y = my + ny * o + lx * s2 + ly * c2; }
          const s = D / (D - Z); return [cx + X * s * R, cy - Y * s * R, Z];
        });
        faces.push({ pts, z: mz + nz * o, nx, ny, nz });
      }
      faces.sort((p, q) => p.z - q.z);
      g.lineJoin = 'round';
      for (const f of faces) {
        const lit = Math.max(0, f.nx * L[0] + f.ny * L[1] + f.nz * L[2]);
        const front = f.nz > 0;
        const spec = Math.pow(Math.max(0, f.nx * 0.25 + f.ny * 0.45 + f.nz * 0.86), 24);
        g.beginPath(); g.moveTo(f.pts[0][0], f.pts[0][1]); g.lineTo(f.pts[1][0], f.pts[1][1]); g.lineTo(f.pts[2][0], f.pts[2][1]); g.closePath();
        g.fillStyle = front ? rgba(ICE, 0.06 + lit * lit * 0.34 + spec * 0.55) : rgba(GLOW2, 0.07 + (1 - lit) * 0.05);
        g.fill();
        g.strokeStyle = rgba(ICE, front ? 0.22 + lit * 0.4 : 0.1);
        g.lineWidth = front ? Math.max(0.6, R * 0.006) : 0.6;
        g.stroke();
      }
      ring(true);
      g.globalAlpha = 1;
    }
    const step = (time) => {
      const ptr = c.pointer();
      cx += (tcx - cx) * 0.06; cy += (tcy - cy) * 0.06; R += (tR - R) * 0.06; alpha += (tAlpha - alpha) * 0.06;
      if (!down) { yawV += (0.0025 - yawV) * 0.02; yaw += yawV + ptr.x * 0.002; }
      pitch += ((-0.28 + ptr.y * 0.35) - pitch) * 0.04;
      for (const q of F) { q.ov += -q.o * 0.035; q.ov *= 0.9; q.o += q.ov; if (q.o < 0) { q.o = 0; q.ov = Math.abs(q.ov) * 0.3; } }
      for (const f of flakes) { f.y += 0.12 + f.z * 0.42; f.x += Math.sin(time * 0.5 + f.ph) * 0.15 * f.z - 0.05; if (f.y > H + 4) { f.y = -4; f.x = Math.random() * W; } if (f.x < -4) f.x = W + 4; }
      draw(time);
    };
    if (reduce) draw(0); else off.push(c.loop(step));
    // ── decode text when a section shows
    const decodeHome = () => {
      const home = root.querySelector('.pf-sec-home'); if (!home) return;
      home.querySelectorAll('.fr-l').forEach((el, i) => setTimeout(() => scramble(el, el.dataset.txt, 900 + i * 200, GLYPHS), i * 140));
      const k = home.querySelector('.fr-kick'); if (k) scramble(k, k.dataset.txt, 1100, GLYPHS);
    };
    root._frDecode = (i) => {
      const s = root.querySelectorAll('.pf-sec')[i]; if (!s) return;
      if (s.classList.contains('pf-sec-home')) return decodeHome();
      const h = s.querySelector('.pf-head-t[data-txt]'); if (h) scramble(h, h.dataset.txt, 750, GLYPHS);
    };
    // ── first visit: ASCII bar + counter, then the fog lifts
    const ld = root.querySelector('.fr-load');
    if (!window.__frIntro && !reduce && !st?.opts?.edit && !st?.opts?.section) {
      window.__frIntro = 1; ld.classList.add('is-on');
      const bar = ld.querySelector('.fr-ascii'), pct = ld.querySelector('.fr-pct'); const t0 = performance.now(); const N = 10;
      let r2 = 0;
      const tick = (now) => {
        const p = Math.min(1, (now - t0) / 1600), e = 1 - Math.pow(1 - p, 2.4), f = Math.floor(now / 70);
        let s = ''; for (let i = 0; i < N; i++) { const filled = i < e * N; const w = (i + f) % 7; s += filled ? (w < 2 ? '+' : '=') : (w === 0 ? '=' : '-'); }
        bar.textContent = s; pct.textContent = String(Math.round(e * 100)).padStart(3, '0');
        if (p < 1) r2 = requestAnimationFrame(tick);
        else ld.animate([{ opacity: 1, filter: 'none' }, { opacity: 0, filter: 'blur(16px)' }], { duration: 900, delay: 150, easing: 'cubic-bezier(.65,0,.35,1)', fill: 'forwards' }).finished.then(() => { ld.classList.remove('is-on'); decodeHome(); shatter(0.8); }).catch(() => {});
      };
      r2 = requestAnimationFrame(tick); off.push(() => cancelAnimationFrame(r2));
    } else if (!reduce) setTimeout(() => root._frDecode?.([...root.querySelectorAll('.pf-sec')].findIndex((s) => s.classList.contains('is-on'))), 60);
    return () => { off.forEach((f) => f()); delete root._frGo; delete root._frDecode; };
  },
  onLeave(c, from, to, root) { root._frGo?.(c.secs[to].id); },
  onEnter(c, i, prev, root) { setTimeout(() => root._frDecode?.(i), 420); },
  css: () => `
.pf[data-t=frost]{--pad-t:6.4em;--pad-r:2.6em;--pad-l:2.6em;--pad-b:4.4em;--radius:3px;--grain-o:.05;--cursor:var(--fg);font-family:var(--f-body)}
.pf[data-t=frost] .pf-bg{background:radial-gradient(120% 90% at 66% 45%,var(--fog),var(--bg) 70%)}
.fr-fog{position:absolute;inset:-10%;pointer-events:none}
.fr-fog i{position:absolute;width:70%;height:60%;border-radius:50%;background:radial-gradient(closest-side,color-mix(in srgb,var(--fog) 70%,transparent),transparent);filter:blur(30px);animation:frFog 26s ease-in-out infinite alternate}
.fr-fog i:first-child{left:-10%;top:40%}
.fr-fog i:last-child{right:-12%;top:-5%;animation-duration:34s;animation-direction:alternate-reverse}
@keyframes frFog{to{translate:18% -12%;scale:1.25}}
.pf[data-motion=off] .fr-fog i,.pf[data-static] .fr-fog i{animation:none}
.fr-cv{position:absolute;inset:0;width:100%;height:100%}
/* chrome — mono HUD */
.fr-top{position:absolute;z-index:30;inset:0 0 auto;display:flex;align-items:center;gap:2em;padding:1.5em 2.6em;font-family:var(--f-mono);font-size:.74em;text-transform:uppercase;letter-spacing:.06em}
.fr-brand{display:flex;align-items:center;gap:.8em;white-space:nowrap}
.fr-brand .pf-logo{height:2.4em}
.pf[data-v="0"] .fr-brand .pf-logo{filter:brightness(0)}
.pf[data-v="1"] .fr-brand .pf-logo,.pf[data-v="2"] .fr-brand .pf-logo{filter:brightness(0) invert(1)}
.fr-nav{display:flex;gap:1.6em;margin-left:auto}
.fr-nav .pf-nav-a{position:relative;display:flex;gap:.6em;padding:.35em 0;color:var(--muted);transition:color .3s}
.fr-nav .pf-nav-a::before,.fr-nav .pf-nav-a::after{position:absolute;top:.35em;color:var(--fg);opacity:0;transition:opacity .3s,translate .4s cubic-bezier(.22,1,.36,1)}
.fr-nav .pf-nav-a::before{content:"[";left:-.9em;translate:.4em 0}
.fr-nav .pf-nav-a::after{content:"]";right:-.9em;translate:-.4em 0}
.fr-nav .pf-nav-a.is-cur{color:var(--fg)}
.fr-nav .pf-nav-a.is-cur::before,.fr-nav .pf-nav-a.is-cur::after{opacity:1;translate:none}
@media (hover:hover){.fr-nav .pf-nav-a:hover{color:var(--fg)}}
.fr-nn{opacity:.55}
.fr-clock{font-variant-numeric:tabular-nums;color:var(--muted);min-width:6.5em;text-align:right}
.fr-talk{display:flex;align-items:center;gap:.6em;height:2.7em;padding:0 1.1em;border:1px solid var(--fg);border-radius:var(--radius);text-transform:uppercase;letter-spacing:.06em;transition:background-color .3s,color .3s}
.fr-talk i{display:grid;width:1em;height:1em}
@media (hover:hover){.fr-talk:hover{background:var(--fg);color:var(--bg)}}
.fr-burger{display:none}
.fr-foot{position:absolute;z-index:20;left:2.6em;right:2.6em;bottom:1.1em;display:flex;align-items:center;gap:1.4em;font-family:var(--f-mono);font-size:.72em;text-transform:uppercase;letter-spacing:.06em;color:var(--muted)}
.fr-loc{white-space:nowrap}
.fr-rule{flex:1;min-width:0;overflow:hidden;white-space:nowrap;opacity:.5;letter-spacing:.1em}
.fr-cts{display:flex;gap:.1em}
.fr-cts .pf-ct{width:2.5em;height:2.5em;display:grid;place-items:center;color:var(--fg);border-radius:var(--radius);transition:background-color .25s}
@media (hover:hover){.fr-cts .pf-ct:hover{background:var(--line)}}
.fr-veil{position:absolute;z-index:80;inset:0;pointer-events:none;opacity:0;background:color-mix(in srgb,var(--fog) 35%,transparent);-webkit-backdrop-filter:blur(22px) saturate(1.3);backdrop-filter:blur(22px) saturate(1.3)}
.fr-scan{position:absolute;z-index:81;left:0;right:0;top:0;overflow:hidden;white-space:nowrap;font-family:var(--f-mono);font-size:.8em;letter-spacing:.2em;color:var(--ice);text-shadow:0 0 8px var(--glow);transform:translateY(-10vh);pointer-events:none}
.fr-load{position:absolute;z-index:90;inset:0;display:none;flex-direction:column;align-items:center;justify-content:center;gap:1em;background:radial-gradient(80% 70% at 50% 50%,var(--fog),var(--bg));font-family:var(--f-mono);color:var(--ice);text-shadow:0 0 6px var(--glow)}
.fr-load.is-on{display:flex}
.fr-ascii{font-size:1.1em;font-weight:500;letter-spacing:.12em}
.fr-pct{font-size:.72em;letter-spacing:.2em;opacity:.7;font-variant-numeric:tabular-nums}
.pf[data-v="0"] .fr-load{color:#fff}
/* hero */
.fr-hero{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:center;gap:1.4em;max-width:min(54%,46em);pointer-events:none}
.fr-hero :is(button,a){pointer-events:auto}
.fr-kick{font-family:var(--f-mono);font-size:.74em;text-transform:uppercase;letter-spacing:.08em;color:var(--muted)}
.fr-kick::before{content:"[ "}.fr-kick::after{content:" ]"}
.fr-name{display:flex;flex-direction:column;font-family:var(--f-display);font-weight:300;font-size:clamp(3em,12.5vmin,9.5em);line-height:.92;letter-spacing:-.04em;text-transform:uppercase;white-space:nowrap}
.fr-l{display:block;filter:blur(16px);opacity:0;transition:filter 1.4s cubic-bezier(.22,1,.36,1) calc(var(--i) * .15s + .1s),opacity 1s calc(var(--i) * .15s + .1s)}
.pf-sec-home.is-on .fr-l,.pf[data-static] .fr-l{filter:none;opacity:1}
.fr-roles{display:flex;flex-wrap:wrap;gap:.5em;font-family:var(--f-mono);font-size:.78em;text-transform:uppercase;letter-spacing:.06em}
.fr-roles i{font-style:normal;color:var(--muted)}
.fr-tag{max-width:34ch;font-size:clamp(1em,2.3vmin,1.3em);line-height:1.45}
.fr-cta{display:flex;gap:.6em;flex-wrap:wrap}
.fr-btn{height:3.2em;padding:0 1.4em;border:1px solid var(--fg);border-radius:var(--radius);font-family:var(--f-mono);font-size:.8em;text-transform:uppercase;letter-spacing:.06em;background:color-mix(in srgb,var(--bg) 25%,transparent);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);transition:background-color .3s,color .3s}
.fr-btn-p{background:var(--fg);color:var(--bg)}
@media (hover:hover){.fr-btn:hover{background:var(--ice);color:#0e121a;border-color:var(--ice)}}
.fr-btn:active{scale:.97}
.fr-roles,.fr-tag,.fr-cta,.fr-read,.fr-hint{opacity:0;translate:0 .7em;transition:opacity .9s .55s,translate 1.1s cubic-bezier(.22,1,.36,1) .55s}
.pf-sec-home.is-on :is(.fr-roles,.fr-tag,.fr-cta,.fr-read,.fr-hint),.pf[data-static] :is(.fr-roles,.fr-tag,.fr-cta,.fr-read,.fr-hint){opacity:1;translate:none}
.fr-read{position:absolute;right:0;bottom:1em;display:grid;gap:.55em;min-width:13em;padding:1em 1.1em;border:1px solid color-mix(in srgb,var(--ice) 40%,transparent);border-radius:var(--radius);background:color-mix(in srgb,var(--surface) 30%,transparent);-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px);font-family:var(--f-mono);font-size:.7em;text-transform:uppercase;letter-spacing:.06em}
.fr-read div{display:flex;justify-content:space-between;gap:1.6em}
.fr-read dt{color:var(--muted)}
.fr-read dd{font-variant-numeric:tabular-nums}
.fr-sig{display:flex;gap:2px;align-items:flex-end}
.fr-sig i{width:4px;background:currentColor;animation:frSig 1.6s steps(1) infinite}
.fr-sig i:nth-child(1){height:4px}.fr-sig i:nth-child(2){height:6px;animation-delay:.2s}.fr-sig i:nth-child(3){height:8px;animation-delay:.4s}.fr-sig i:nth-child(4){height:10px;animation-delay:.6s}.fr-sig i:nth-child(5){height:12px;animation-delay:.8s;opacity:.3}
@keyframes frSig{50%{opacity:.3}}
.fr-hint{position:absolute;left:62%;bottom:1em;translate:-50% 0;font-family:var(--f-mono);font-size:.68em;text-transform:uppercase;letter-spacing:.08em;color:var(--muted);white-space:nowrap;pointer-events:none}
.pf-sec-home.is-on .fr-hint{translate:-50% 0}
/* sections — frosted panels */
.pf[data-t=frost] .pf-head-n{font-family:var(--f-mono);font-size:.78em;letter-spacing:.06em;color:var(--muted)}
.pf[data-t=frost] .pf-head-t{font-family:var(--f-display);font-weight:300;font-size:clamp(2.2em,7vmin,5.4em);letter-spacing:-.04em;line-height:.95;text-transform:uppercase}
.pf[data-t=frost] .pf-head-s{color:var(--muted);font-size:.92em}
.pf[data-t=frost] :is(.pf-chip,.pf-tab,.pf-pg,.pf-igp,.pf-btn){border-radius:var(--radius);border:1px solid var(--line);background:color-mix(in srgb,var(--surface) 35%,transparent);color:var(--fg);font-family:var(--f-mono);text-transform:uppercase;letter-spacing:.05em}
.pf[data-t=frost] :is(.pf-chip,.pf-tab){font-size:.7em;padding:.75em 1.1em}
.pf[data-t=frost] :is(.pf-chip[aria-pressed=true],.pf-tab[aria-selected=true],.pf-btn:not(.pf-btn-ghost)){background:var(--fg);color:var(--bg);border-color:var(--fg)}
.pf[data-t=frost] :is(.pf-card,.pf-port-item,.pf-xp,.pf-edu,.pf-skill,.pf-repo,.pf-app){border:1px solid color-mix(in srgb,var(--ice) 32%,transparent);background:color-mix(in srgb,var(--surface) 38%,transparent);-webkit-backdrop-filter:blur(16px) saturate(1.2);backdrop-filter:blur(16px) saturate(1.2);box-shadow:inset 0 1px 0 color-mix(in srgb,var(--ice) 40%,transparent)}
.pf[data-t=frost] .pf-card{transition:border-color .3s,translate .5s cubic-bezier(.22,1,.36,1)}
@media (hover:hover){.pf[data-t=frost] .pf-card:hover{border-color:var(--ice);translate:0 -3px}}
.pf[data-t=frost] .pf-card-media{margin:.4em .4em 0;border-radius:2px}
.pf[data-t=frost] .pf-card-meta{font-family:var(--f-mono);font-size:.62em;text-transform:uppercase;letter-spacing:.05em}
.pf[data-t=frost] .pf-card-title{font-weight:500}
.pf[data-t=frost] .pf-stats dd{font-family:var(--f-display);font-weight:300;letter-spacing:-.04em}
.pf[data-t=frost] .pf-port-t{font-family:var(--f-display);font-weight:300;text-transform:uppercase;letter-spacing:-.03em}
.pf[data-t=frost] .pf-modal-box{background:var(--surface)}
/* responsive */
.pf[data-t=frost][data-w=md] .fr-clock{display:none}
.pf[data-t=frost][data-w=sm] :is(.fr-nav,.fr-clock),.pf[data-t=frost][data-w=xs] :is(.fr-nav,.fr-clock){display:none}
.pf[data-t=frost][data-w=sm] .fr-talk{margin-left:auto}
.pf[data-t=frost][data-w=sm] .fr-burger,.pf[data-t=frost][data-w=xs] .fr-burger{display:block}
.pf[data-t=frost][data-w=xs] .fr-talk{display:none}
.pf[data-t=frost][data-w=xs] .fr-burger{margin-left:auto}
.pf[data-t=frost][data-w=xs] .fr-brand span{max-width:52vw;overflow:hidden;text-overflow:ellipsis}
.pf[data-t=frost][data-w=xs]{--pad-r:1.2em;--pad-l:1.2em;--pad-t:5.4em;--pad-b:4.2em}
.pf[data-t=frost][data-w=xs] .fr-top{padding:1.1em 1.2em}
.pf[data-t=frost][data-w=xs] .fr-foot{left:1.2em;right:1.2em}
.pf[data-t=frost][data-w=xs] :is(.fr-loc,.fr-rule){display:none}
.pf[data-t=frost][data-w=xs] .fr-cts{margin:0 auto}
.pf[data-t=frost][data-o=p] .fr-hero{max-width:none;justify-content:flex-start;padding-top:.6em;gap:1.1em}
.pf[data-t=frost][data-o=p] .fr-name{font-size:clamp(2.6em,15vw,6.5em)}
.pf[data-t=frost][data-o=p] :is(.fr-read,.fr-hint){display:none}
.pf[data-t=frost][data-h=tiny]{--pad-t:4.2em;--pad-b:3em}
.pf[data-t=frost][data-h=tiny] .fr-top{padding:.6em 1.6em}
.pf[data-t=frost][data-h=tiny] .fr-foot{bottom:.3em}
.pf[data-t=frost][data-h=tiny] :is(.fr-kick,.fr-hint,.fr-read,.fr-roles){display:none}
.pf[data-t=frost][data-h=tiny] .fr-hero{gap:.7em;max-width:52%}
.pf[data-t=frost][data-h=tiny] .fr-name{font-size:clamp(2.2em,15vh,5em)}
`,
};
