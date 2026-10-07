/*! Portfolio Studio. Copyright (c) 2026 Roy Borkin. All rights reserved. Unauthorized copying, modification or distribution is prohibited without written permission. */
// Small helpers shared by the newer templates (bundled into each template file).
export const still = (root) => !!(root?.dataset.static || root?.dataset.motion === 'off' || matchMedia('(prefers-reduced-motion: reduce)').matches);

/** Decode text from random glyphs, left to right. */
export function scramble(el, text, dur = 800, glyphs = '!<>-_\\/[]{}=+*^?#01') {
  if (!el) return;
  if (el._scr) cancelAnimationFrame(el._scr);
  if (el.closest?.('[data-ta-on]')) { if (!el.closest('[data-ta-split]')) el.textContent = text; return; } // Design → Text animation took over
  if (still(document.getElementById('pf'))) { el.textContent = text; return; }
  const t0 = performance.now(), chars = [...text];
  const step = (now) => {
    const p = Math.min(1, (now - t0) / dur);
    el.textContent = chars.map((ch, i) => (ch === ' ' ? ' ' : i / chars.length < p * 1.2 - 0.2 ? ch : glyphs[(Math.random() * glyphs.length) | 0])).join('');
    if (p < 1) el._scr = requestAnimationFrame(step); else el.textContent = text;
  };
  el._scr = requestAnimationFrame(step);
}

/** Words wrapped in masks for a staggered rise. */
export function maskWords(esc, text, start = 0) {
  return String(text || '').split(/\s+/).filter(Boolean).map((w, i) => `<span class="k-m"><span style="--i:${start + i}">${esc(w)}</span></span>`).join(' ');
}

/** Live clock text for a time zone. Returns stop(). */
export function clock(el, tz, opts = { hour: '2-digit', minute: '2-digit', hour12: false }) {
  if (!el) return () => {};
  const tick = () => { try { el.textContent = new Intl.DateTimeFormat([], { ...opts, timeZone: tz || undefined }).format(new Date()); } catch { el.textContent = new Date().toTimeString().slice(0, 5); } };
  tick(); const iv = setInterval(tick, 10000); return () => clearInterval(iv);
}

/** Floating preview window that follows the pointer over works rows; images slide inside a strip. */
export function peek(root, c, cls = 'k-peek') {
  const box = document.createElement('div'); box.className = cls; box.setAttribute('aria-hidden', 'true');
  box.innerHTML = '<div class="k-peek-s"></div>';
  root.appendChild(box);
  const strip = box.firstChild;
  let x = innerWidth / 2, y = innerHeight / 2, tx = x, ty = y, on = false, raf = 0, sig = '';
  const fine = matchMedia('(pointer:fine)').matches;
  const rebuild = (grid) => {
    const cards = [...grid.querySelectorAll('.pf-work')];
    const s = cards.map((b) => b.dataset.open).join('|');
    if (s === sig) return cards;
    sig = s;
    strip.innerHTML = cards.map((b) => { const im = b.querySelector('.pf-card-media img'); return `<div class="k-peek-i" style="background:${im ? `url('${im.getAttribute('src').replace(/'/g, '%27')}') center/cover` : 'var(--surface)'}">${im ? '' : c.I(b.dataset.kind === 'linkedin' ? 'linkedin' : b.dataset.kind === 'instagram' ? 'instagram' : 'post')}</div>`; }).join('');
    return cards;
  };
  const loop = () => { x += (tx - x) * 0.14; y += (ty - y) * 0.14; box.style.transform = `translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0)`; raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.3 ? requestAnimationFrame(loop) : 0; };
  const over = (e) => {
    if (!fine) return;
    const card = e.target.closest?.('.pf-sec.is-on .pf-work');
    if (!card) { if (on) { on = false; box.classList.remove('is-on'); } return; }
    const cards = rebuild(card.parentElement);
    const i = cards.indexOf(card);
    strip.style.transform = `translateY(${-i * 100}%)`;
    if (!on) { on = true; box.classList.add('is-on'); const r = root.getBoundingClientRect(); x = tx = e.clientX - r.left; y = ty = e.clientY - r.top; }
  };
  const move = (e) => { const r = root.getBoundingClientRect(); tx = e.clientX - r.left; ty = e.clientY - r.top; if (on && !raf) raf = requestAnimationFrame(loop); };
  root.addEventListener('pointerover', over); root.addEventListener('pointermove', move, { passive: true });
  return () => { cancelAnimationFrame(raf); root.removeEventListener('pointerover', over); root.removeEventListener('pointermove', move); box.remove(); };
}

/** Works as a ruled list instead of a card grid (pair with layout.works ≈ [60, 4.4]). */
export const listCss = (t, o = {}) => `
.pf[data-t=${t}] .pf-sec-works .pf-grid{row-gap:0;column-gap:2.4em}
.pf[data-t=${t}] .pf-sec-works .pf-card{display:flex;flex-direction:row;align-items:center;text-align:left;gap:1.1em;padding:0 .2em;border:0;border-top:1px solid var(--line);border-radius:0;background:transparent;box-shadow:none;min-height:0;transform:none;transition:color .3s,opacity .3s}
.pf[data-t=${t}] .pf-sec-works .pf-card:hover{transform:none;background:transparent}
.pf[data-t=${t}] .pf-sec-works .pf-card-media{flex:none;width:3.4em;height:3.4em;aspect-ratio:auto;border-radius:${o.thumbR || '.4em'};${o.thumbs ? '' : 'display:none'}}
.pf[data-t=${t}] .pf-sec-works .pf-card-media .pf-ph-t{display:none}
.pf[data-t=${t}] .pf-sec-works .pf-card-body{flex:1;min-width:0;flex-direction:row-reverse;align-items:center;justify-content:space-between;gap:1em;padding:0}
.pf[data-t=${t}] .pf-sec-works .pf-card-title{font-family:var(--f-display);font-size:${o.size || 'clamp(1.15em,2.6vmin,2em)'};font-weight:${o.weight || 400};letter-spacing:-.02em;line-height:1.1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;transition:translate .5s var(--out)}
.pf[data-t=${t}] .pf-sec-works .pf-card-meta{flex:none;gap:1.4em;color:var(--muted);font-size:.8em}
@media (hover:hover) and (pointer:fine){
.pf[data-t=${t}] .pf-sec-works .pf-grid:hover .pf-card{opacity:.38}
.pf[data-t=${t}] .pf-sec-works .pf-grid .pf-card:hover{opacity:1}
.pf[data-t=${t}] .pf-sec-works .pf-card:hover .pf-card-title{translate:.6em 0}}
.pf[data-t=${t}][data-w=xs] .pf-sec-works .pf-card-media,.pf[data-t=${t}][data-w=sm] .pf-sec-works .pf-card-media{display:block;width:2.8em;height:2.8em}
.pf[data-t=${t}][data-w=xs] .pf-sec-works .pf-card-body{flex-direction:column-reverse;align-items:flex-start;gap:.15em}
.pf[data-t=${t}][data-w=xs] .pf-sec-works .pf-card-title{font-size:1.1em}
.pf[data-t=${t}][data-w=xs] .pf-sec-works .pf-card-meta{font-size:.72em}
.${o.peek || 'k-peek'}{position:absolute;z-index:150;left:0;top:0;width:clamp(200px,22vw,360px);aspect-ratio:${o.ratio || '4/3'};margin:calc(clamp(200px,22vw,360px) * -${o.ratio === '1/1' ? 0.5 : 0.375}) 0 0 calc(clamp(200px,22vw,360px) * -.5);overflow:hidden;pointer-events:none;border-radius:${o.peekR || '0'};scale:0;transition:scale .45s cubic-bezier(.23,1,.32,1)}
.${o.peek || 'k-peek'}.is-on{scale:1}
.k-peek-s{position:absolute;inset:0;transition:transform .55s cubic-bezier(.76,0,.24,1)}
.k-peek-i{width:100%;height:100%;display:grid;place-items:center;color:var(--muted)}
.k-peek-i svg{width:30%;height:30%}
`;

/** Tiny WebGL fullscreen-quad runner. Returns null when WebGL is unavailable. */
export function glQuad(canvas, frag, dprMax = 1.5) {
  const gl = canvas.getContext('webgl', { premultipliedAlpha: false, antialias: false, alpha: true });
  if (!gl) return null;
  const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { console.warn(gl.getShaderInfoLog(s)); return null; } return s; };
  const vs = sh(gl.VERTEX_SHADER, 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}');
  const fs = sh(gl.FRAGMENT_SHADER, 'precision highp float;\n' + frag);
  if (!vs || !fs) return null;
  const pr = gl.createProgram(); gl.attachShader(pr, vs); gl.attachShader(pr, fs); gl.linkProgram(pr);
  if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) return null;
  gl.useProgram(pr);
  const b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(pr, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const U = {};
  const u = (n) => (n in U ? U[n] : (U[n] = gl.getUniformLocation(pr, n)));
  let W = 0, H = 0;
  const size = () => { const d = Math.min(dprMax, devicePixelRatio || 1); W = Math.max(1, Math.round(canvas.clientWidth * d)); H = Math.max(1, Math.round(canvas.clientHeight * d)); if (canvas.width !== W || canvas.height !== H) { canvas.width = W; canvas.height = H; } gl.viewport(0, 0, W, H); };
  size();
  const ro = new ResizeObserver(size); ro.observe(canvas);
  return {
    draw(vals) {
      gl.uniform2f(u('uRes'), W, H);
      for (const [k, v] of Object.entries(vals)) { const l = u(k); if (l == null) continue; if (Array.isArray(v)) (v.length === 2 ? gl.uniform2f : v.length === 3 ? gl.uniform3f : gl.uniform4f).call(gl, l, ...v); else gl.uniform1f(l, v); }
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    },
    destroy() { ro.disconnect(); try { gl.getExtension('WEBGL_lose_context')?.loseContext(); } catch { /* ignore */ } },
  };
}
export const hexRgb = (h) => { h = String(h || '').trim(); if (h.startsWith('rgb')) { const m = h.match(/[\d.]+/g) || [0, 0, 0]; return [m[0] / 255, m[1] / 255, m[2] / 255]; } h = h.replace('#', ''); if (h.length === 3) h = [...h].map((x) => x + x).join(''); const n = parseInt(h.slice(0, 6), 16) || 0; return [(n >> 16 & 255) / 255, (n >> 8 & 255) / 255, (n & 255) / 255]; };
export const lerp = (a, b, t) => a + (b - a) * t;
