/*! Portfolio Studio. Copyright (c) 2026 Roy Borkin. All rights reserved. Unauthorized copying, modification or distribution is prohibited without written permission. */
// 10 — Terminal (free design) : the site is a code editor. Sections are files in an explorer and
// tabs, the home screen types out a profile object, and ⌘K / Ctrl+K opens a command palette.
const FILES = { home: ['index.ts', 'ts'], works: ['works.md', 'md'], sandbox: ['sandbox/', 'dir'], about: ['about.json', 'json'], portfolio: ['portfolio.pdf', 'pdf'] };
const fileOf = (s) => (FILES[s.id] || [s.label.toLowerCase().replace(/\s+/g, '-') + '.md', 'md']);
export default {
  id: 'terminal',
  name: 'Terminal',
  blurb: 'Code-editor portfolio: file tree, tabs, typed profile and a ⌘K palette.',
  transition: 'fade',
  variants: [
    { name: 'Night', swatch: ['#1b1e24', '#7aa2ff', '#ffb86b'],
      vars: { bg: '#1a1d23', surface: '#20242b', fg: '#d7dbe3', muted: '#7b8494', accent: '#7aa2ff', accent2: '#15171c', line: 'rgba(255,255,255,.07)', k: '#c792ea', s: '#a5d68a', n: '#ffb86b', p: '#89ddff', c: '#5c6578' },
      fonts: { display: 'IBM Plex Sans:400;600', body: 'IBM Plex Sans:400;500;600', mono: 'JetBrains Mono:400;500;700' } },
    { name: 'Paper', swatch: ['#f4f5f7', '#2b59c3', '#c2410c'],
      vars: { bg: '#f3f4f6', surface: '#ffffff', fg: '#23262d', muted: '#737986', accent: '#2b59c3', accent2: '#e7e9ee', line: 'rgba(0,0,0,.08)', k: '#8a3ffc', s: '#1a7f37', n: '#c2410c', p: '#0b7285', c: '#9aa0ab' },
      fonts: { display: 'IBM Plex Sans:400;600', body: 'IBM Plex Sans:400;500;600', mono: 'JetBrains Mono:400;500;700' } },
    { name: 'Amber CRT', swatch: ['#0c0a06', '#ffb000', '#7a5300'],
      vars: { bg: '#0b0905', surface: '#120f08', fg: '#ffc23d', muted: '#9a7420', accent: '#ffb000', accent2: '#1a1409', line: 'rgba(255,176,0,.16)', k: '#ffd47a', s: '#ffb000', n: '#fff1c9', p: '#ffc23d', c: '#7a5a1a' },
      fonts: { display: 'VT323:400', body: 'IBM Plex Mono:400;500', mono: 'VT323:400' } },
  ],
  layout: { works: [15, 14], repos: [17, 9.5] },
  shell(c) {
    const tree = c.secs.map((s) => { const [f, kind] = fileOf(s); return `<a class="tm-file pf-nav-a" href="#${s.id}" data-go="${s.i}" data-kind="${kind}"><i></i><span>${c.esc(f)}</span></a>`; }).join('');
    const tabs = c.secs.map((s) => { const [f, kind] = fileOf(s); return `<a class="tm-tab pf-nav-a" href="#${s.id}" data-go="${s.i}" data-kind="${kind}"><i></i>${c.esc(f)}</a>`; }).join('');
    return {
      nav: `<div class="tm-win" aria-hidden="false">
          <header class="tm-title"><span class="tm-lights"><i></i><i></i><i></i></span><span class="tm-tt">${c.esc(c.first.toLowerCase())}-${c.esc(c.last.toLowerCase())} — portfolio</span><button class="tm-cmd" data-palette data-hover>${c.I('search')}<span>Search or jump to…</span><kbd>Ctrl K</kbd></button>${c.menuBtn()}</header>
          <aside class="tm-side"><div class="tm-act">${c.I('folder')}${c.I('search')}${c.I('github')}</div><nav class="tm-tree" aria-label="Sections"><p>Explorer</p>${tree}<p class="tm-sub">Contact</p><div class="tm-cts">${c.contactLinks({ text: true })}</div></nav></aside>
          <nav class="tm-tabs" aria-label="Open files">${tabs}</nav>
          <footer class="tm-status"><span class="tm-branch">${c.I('fork')} main</span><span class="tm-cts2">${c.contactLinks({ limit: 4 })}</span><span class="tm-pos">Ln <b class="tm-ln">1</b>, Col <b class="tm-col">1</b></span><span>UTF-8</span><span class="tm-mode">TypeScript</span></footer>
        </div>
        <div class="tm-pal" hidden><div class="tm-pal-box"><input class="tm-pal-in" placeholder="Type a section, project or contact…" aria-label="Command palette"><ul class="tm-pal-list"></ul></div></div>
        ${c.drawer()}`,
    };
  },
  home(c) {
    const P = c.P, cut = c.img(P.photo);
    const S = (v) => `<b class="s">"${c.esc(v)}"</b>`;
    const lines = [
      `<b class="k">const</b> <b class="v">${c.esc((c.first || 'me').toLowerCase())}</b> <b class="p">=</b> {`,
      `  name: ${S(c.name)},`,
      `  roles: [${c.roles.map(S).join(', ')}],`,
      P.location ? `  based: ${S(P.location)},` : '',
      P.status ? `  now: ${S(P.status)},` : '',
      ...(c.data.about?.stats || []).slice(0, 2).map((s) => `  ${c.esc(s.label.toLowerCase().replace(/[^a-z]+(.)/g, (m, ch) => ch.toUpperCase()).replace(/[^a-zA-Z]/g, ''))}: ${/^\d+$/.test(s.value) ? `<b class="n">${c.esc(s.value)}</b>` : S(s.value)},`),
      `  about: ${S(P.tagline || '')},`,
      `};`,
      ``,
      `<b class="c">// Press Ctrl K (⌘K on Mac) to jump anywhere</b>`,
      `<b class="v">${c.esc((c.first || 'me').toLowerCase())}</b>.<b class="f">sayHello</b>();<i class="tm-caret"></i>`,
    ].filter((l) => l !== '');
    return `<div class="tm-home">
      <div class="tm-code" role="img" aria-label="${c.esc(`${c.name}: ${c.roles.join(', ')}. ${P.tagline || ''}`)}"><ol>${lines.map((l, i) => `<li style="--i:${i}"><span>${l}</span></li>`).join('')}</ol></div>
      <aside class="tm-prev"><header>${c.I('file')}<span>preview — ${c.esc(c.first.toLowerCase())}.jpg</span></header><figure><img src="${c.esc(cut)}" alt="${c.esc(c.name)}" draggable="false"></figure>
      <div class="tm-run">${c.sec('works') ? `<button data-go="${c.sec('works').i}" data-hover>${c.I('play')}<span>Run works.md</span></button>` : ''}<button data-contact data-hover>${c.I('email')}<span>sayHello()</span></button></div></aside>
    </div>`;
  },
  mount(c, root) {
    const pal = root.querySelector('.tm-pal'), inp = root.querySelector('.tm-pal-in'), list = root.querySelector('.tm-pal-list');
    const items = [
      ...c.secs.map((s) => ({ label: fileOf(s)[0], hint: 'Go to ' + s.label, act: () => window.PF.go(s.i) })),
      ...(c.data.works?.items || []).map((w) => ({ label: w.title, hint: 'Open work', act: () => { window.PF.go('works'); setTimeout(() => root.querySelector(`[data-open="work:${w.id}"]`)?.click(), 700); } })),
      ...c.contacts.map((ct) => ({ label: ct.label || ct.type, hint: ct.value, act: () => window.open(c.contactHref(ct), /^https?:/.test(c.contactHref(ct)) ? '_blank' : '_self') })),
    ];
    let sel = 0, shown = [];
    const draw = () => {
      const q = inp.value.toLowerCase().trim();
      shown = items.filter((x) => !q || (x.label + ' ' + x.hint).toLowerCase().includes(q)).slice(0, 8);
      sel = Math.min(sel, Math.max(0, shown.length - 1));
      list.innerHTML = shown.length ? shown.map((x, i) => `<li class="${i === sel ? 'on' : ''}" data-k="${i}"><b>${c.esc(x.label)}</b><span>${c.esc(x.hint)}</span></li>`).join('') : '<li class="none">No matches</li>';
    };
    const open = () => { pal.hidden = false; inp.value = ''; sel = 0; draw(); setTimeout(() => inp.focus(), 10); };
    const close = () => { pal.hidden = true; };
    const run = (i) => { const x = shown[i]; if (!x) return; close(); x.act(); };
    root.addEventListener('click', (e) => { if (e.target.closest('[data-palette]')) open(); else if (e.target === pal) close(); const li = e.target.closest('.tm-pal-list li[data-k]'); if (li) run(+li.dataset.k); });
    inp.addEventListener('input', () => { sel = 0; draw(); });
    inp.addEventListener('keydown', (e) => { if (e.key === 'ArrowDown') { sel = Math.min(shown.length - 1, sel + 1); draw(); e.preventDefault(); } else if (e.key === 'ArrowUp') { sel = Math.max(0, sel - 1); draw(); e.preventDefault(); } else if (e.key === 'Enter') run(sel); else if (e.key === 'Escape') close(); e.stopPropagation(); });
    const key = (e) => { if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); pal.hidden ? open() : close(); } };
    window.addEventListener('keydown', key);
    const ln = root.querySelector('.tm-ln'), col = root.querySelector('.tm-col');
    const mv = (e) => { ln.textContent = 1 + Math.floor((e.clientY / innerHeight) * 42); col.textContent = 1 + Math.floor((e.clientX / innerWidth) * 120); };
    window.addEventListener('pointermove', mv, { passive: true });
    return () => { window.removeEventListener('keydown', key); window.removeEventListener('pointermove', mv); };
  },
  onEnter(c, i, p, root) { const m = root.querySelector('.tm-mode'); if (m) m.textContent = { ts: 'TypeScript', md: 'Markdown', dir: 'Folder', json: 'JSON', pdf: 'PDF' }[fileOf(c.secs[i])[1]] || 'Text'; },
  head(c, s) { const [f] = fileOf(s); return `<header class="pf-head tm-crumb"><span class="tm-path">src <i>›</i> ${c.esc(f)}</span><h2 class="pf-head-t"># ${c.esc(s.title || s.label)}</h2>${s.subtitle ? `<p class="pf-head-s"><b>// </b>${c.esc(s.subtitle)}</p>` : ''}</header>`; },
  css: () => `
.pf[data-t=terminal]{--side:15em;--pad-t:5.4em;--pad-r:1.8em;--pad-l:calc(var(--side) + 1.8em);--pad-b:3.4em;--radius:6px;--grain-o:.03;font-size:calc(clamp(13px,.72vmin + .48vmax,19px) * var(--scale,1))}
.pf[data-t=terminal][data-v="2"]{font-size:calc(clamp(16px,.95vmin + .6vmax,24px) * var(--scale,1));--grain-o:.1}
.pf[data-t=terminal][data-v="2"]::after{content:"";position:absolute;inset:0;pointer-events:none;z-index:70;background:repeating-linear-gradient(0deg,rgba(0,0,0,.28) 0 1px,transparent 1px 3px),radial-gradient(ellipse at center,transparent 60%,rgba(0,0,0,.55));}
.pf[data-t=terminal][data-v="2"] .pf-stage,.pf[data-t=terminal][data-v="2"] .tm-win{text-shadow:0 0 6px rgba(255,176,0,.55)}
.tm-win{position:absolute;inset:0;z-index:10;pointer-events:none}
.tm-win>*{pointer-events:auto}
.tm-title{position:absolute;left:0;right:0;top:0;height:2.6em;display:flex;align-items:center;gap:1.2em;padding:0 1em;background:var(--accent2);border-bottom:1px solid var(--line);font-size:.8em;color:var(--muted)}
.tm-lights{display:flex;gap:.5em}.tm-lights i{width:.8em;height:.8em;border-radius:50%;background:#ff5f57}.tm-lights i:nth-child(2){background:#febc2e}.tm-lights i:nth-child(3){background:#28c840}
.pf[data-v="2"] .tm-lights i{background:var(--accent);opacity:.5}
.tm-tt{position:absolute;left:50%;transform:translateX(-50%);font-family:var(--f-mono)}
.tm-cmd{margin-left:auto;display:flex;align-items:center;gap:.6em;padding:.35em .6em .35em .8em;border:1px solid var(--line);border-radius:var(--radius);background:var(--surface);min-width:16em;color:var(--muted)}
.tm-cmd kbd{margin-left:auto;font-family:var(--f-mono);font-size:.85em;padding:.05em .4em;border:1px solid var(--line);border-radius:4px}
.tm-side{position:absolute;left:0;top:2.6em;bottom:1.8em;width:var(--side);display:flex;background:var(--accent2);border-right:1px solid var(--line)}
.tm-act{width:2.8em;display:flex;flex-direction:column;align-items:center;gap:1.2em;padding-top:1em;border-right:1px solid var(--line);color:var(--muted)}
.tm-act svg:first-child{color:var(--fg)}
.tm-tree{flex:1;padding:.8em .4em;font-family:var(--f-mono);font-size:.8em;display:flex;flex-direction:column;gap:.1em;min-width:0}
.tm-tree p{font-size:.78em;text-transform:uppercase;letter-spacing:.08em;color:var(--muted);padding:.3em .6em .6em}
.tm-tree .tm-sub{margin-top:1.2em}
.tm-file{display:flex;align-items:center;gap:.55em;padding:.35em .6em;border-radius:4px;color:var(--muted)}
.tm-file:hover{background:var(--line);color:var(--fg)}
.tm-file.is-cur{background:color-mix(in srgb,var(--accent) 18%,transparent);color:var(--fg)}
.tm-file i,.tm-tab i{width:.75em;height:.75em;border-radius:2px;background:var(--p)}
[data-kind=md] i{background:var(--accent)}[data-kind=dir] i{background:var(--n);border-radius:1px 4px 1px 1px}[data-kind=json] i{background:var(--n)}[data-kind=pdf] i{background:#ff6b6b}[data-kind=ts] i{background:#3178c6}
.pf[data-v="2"] [data-kind] i{background:var(--accent)}
.tm-cts{display:flex;flex-direction:column;gap:.1em}
.tm-cts .pf-ct{justify-content:flex-start;padding:.3em .6em;color:var(--muted);font-size:.95em;border-radius:4px}
.tm-cts .pf-ct:hover{color:var(--fg);background:var(--line)}
.tm-cts .pf-ct svg{width:1em;height:1em}
.tm-tabs{position:absolute;left:var(--side);right:0;top:2.6em;height:2.5em;display:flex;background:var(--accent2);border-bottom:1px solid var(--line);font-family:var(--f-mono);font-size:.78em;overflow:hidden}
.tm-tab{display:flex;align-items:center;gap:.5em;padding:0 1.2em;border-right:1px solid var(--line);color:var(--muted);white-space:nowrap;position:relative}
.tm-tab.is-cur{background:var(--bg);color:var(--fg)}
.tm-tab.is-cur::before{content:"";position:absolute;left:0;right:0;top:0;height:2px;background:var(--accent)}
.tm-status{position:absolute;left:0;right:0;bottom:0;height:1.8em;display:flex;align-items:center;gap:1.4em;padding:0 1em;background:var(--accent);color:var(--bg);font-family:var(--f-mono);font-size:.72em}
.pf[data-v="2"] .tm-status{background:var(--accent2);color:var(--fg);border-top:1px solid var(--line)}
.tm-status>span{display:flex;align-items:center;gap:.4em}
.tm-status svg{width:1em;height:1em}
.tm-cts2{gap:.2em!important}
.tm-cts2 .pf-ct{width:1.6em;height:1.6em}
.tm-pos{margin-left:auto}
.tm-pos b{font-weight:400}
/* palette */
.tm-pal{position:absolute;inset:0;z-index:90;background:rgba(0,0,0,.35);display:flex;justify-content:center;align-items:flex-start;padding-top:12vh}
.tm-pal[hidden]{display:none}
.tm-pal-box{width:min(560px,92vw);background:var(--surface);border:1px solid var(--line);border-radius:10px;box-shadow:0 30px 80px rgba(0,0,0,.4);overflow:hidden;animation:pfPage .3s var(--out)}
.tm-pal-in{width:100%;padding:1em 1.1em;background:transparent;border:0;border-bottom:1px solid var(--line);color:var(--fg);font:inherit;font-family:var(--f-mono);outline:none;user-select:text}
.tm-pal-list li{display:flex;justify-content:space-between;gap:1em;padding:.65em 1.1em;font-size:.86em;cursor:pointer}
.tm-pal-list li span{color:var(--muted);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.tm-pal-list li.on{background:color-mix(in srgb,var(--accent) 20%,transparent)}
.tm-pal-list .none{color:var(--muted)}
/* home */
.tm-home{position:absolute;inset:0;display:grid;grid-template-columns:minmax(0,1.5fr) minmax(0,1fr);gap:1.6em}
.tm-code{font-family:var(--f-mono);font-size:clamp(.82em,1.9vmin,1.12em);line-height:1.85;overflow:hidden;align-self:center}
.pf[data-v="2"] .tm-code{font-size:clamp(1.05em,2.6vmin,1.5em);line-height:1.5}
.tm-code ol{counter-reset:ln;list-style:none}
.tm-code li{counter-increment:ln;display:flex;white-space:pre-wrap;word-break:break-word}
.tm-code li::before{content:counter(ln);width:2.8em;flex:none;color:var(--c);text-align:right;padding-right:1.4em;opacity:.8}
.tm-code li span{clip-path:inset(0 100% 0 0);transition:clip-path .55s steps(28);transition-delay:calc(.2s + var(--i) * .22s)}
.pf-sec-home.is-on .tm-code li span,.pf[data-static] .tm-code li span{clip-path:inset(0 0 0 0)}
.tm-code .k{color:var(--k);font-weight:400}.tm-code .s{color:var(--s);font-weight:400}.tm-code .n{color:var(--n);font-weight:400}.tm-code .p{color:var(--p);font-weight:400}.tm-code .c{color:var(--c);font-weight:400;font-style:italic}.tm-code .v{color:var(--fg);font-weight:700}.tm-code .f{color:var(--accent);font-weight:400}
.tm-caret{display:inline-block;width:.55em;height:1.1em;background:var(--accent);vertical-align:-.2em;margin-left:.1em;animation:clBlink 1s steps(1) infinite}
@keyframes clBlink{50%{opacity:0}}
.tm-prev{display:flex;flex-direction:column;border:1px solid var(--line);border-radius:var(--radius);overflow:hidden;background:var(--surface);min-height:0;opacity:0;transform:translateX(1.5em);transition:all .9s var(--out) .4s}
.pf-sec-home.is-on .tm-prev,.pf[data-static] .tm-prev{opacity:1;transform:none}
.tm-prev header{display:flex;align-items:center;gap:.5em;padding:.5em .8em;font-family:var(--f-mono);font-size:.74em;color:var(--muted);border-bottom:1px solid var(--line)}
.tm-prev figure{position:relative;flex:1;min-height:0}
.tm-prev img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:50% 30%}
.pf[data-v="2"] .tm-prev img{filter:grayscale(1) sepia(1) saturate(3) hue-rotate(-12deg) contrast(1.2) brightness(.85)}
.tm-run{display:flex;gap:.5em;padding:.6em;border-top:1px solid var(--line)}
.tm-run button{flex:1;display:flex;align-items:center;justify-content:center;gap:.5em;padding:.6em;border-radius:4px;font-family:var(--f-mono);font-size:.78em;background:var(--accent);color:var(--bg)}
.tm-run button+button{background:transparent;color:var(--fg);border:1px solid var(--line)}
/* sections */
.tm-crumb{flex-direction:column;align-items:flex-start;gap:.2em}
.tm-path{font-family:var(--f-mono);font-size:.74em;color:var(--muted)}
.tm-path i{font-style:normal;margin:0 .3em}
.pf[data-t=terminal] .pf-head-t{font-family:var(--f-mono);font-weight:700;font-size:clamp(1.4em,3.6vmin,2.4em);letter-spacing:-.01em;color:var(--accent)}
.pf[data-t=terminal][data-v="2"] .pf-head-t{font-weight:400}
.pf[data-t=terminal] .pf-head-s{font-family:var(--f-mono);font-size:.82em}
.pf[data-t=terminal] .pf-head-s b{color:var(--c);font-weight:400}
.pf[data-t=terminal] .pf-card-meta,.pf[data-t=terminal] .pf-chip,.pf[data-t=terminal] .pf-tab,.pf[data-t=terminal] .pf-xp header span,.pf[data-t=terminal] .pf-edu span{font-family:var(--f-mono)}
.pf[data-t=terminal] .pf-chip,.pf[data-t=terminal] .pf-tab{border-radius:4px}
.pf[data-t=terminal] .pf-chip[aria-pressed=true],.pf[data-t=terminal] .pf-tab[aria-selected=true]{background:var(--accent);border-color:var(--accent);color:var(--bg)}
.pf[data-t=terminal] .pf-btn{border-radius:4px;background:var(--accent);color:var(--bg);font-family:var(--f-mono)}
.pf[data-t=terminal] .pf-btn-ghost{background:transparent;color:var(--fg)}
.pf[data-t=terminal] .pf-pg{border-radius:4px}
.pf[data-t=terminal][data-v="2"] .pf-card-media img,.pf[data-t=terminal][data-v="2"] .pf-port-media img,.pf[data-t=terminal][data-v="2"] .pf-profile-img img{filter:grayscale(1) sepia(1) saturate(3) hue-rotate(-12deg) contrast(1.2) brightness(.8)}
.pf[data-t=terminal] .pf-stats dd{font-family:var(--f-mono)}
.pf[data-t=terminal] .pf-port-t{font-family:var(--f-mono)}
.pf[data-t=terminal] .pf-drawer .pf-nav-a{font-family:var(--f-mono)}
/* responsive */
.pf[data-t=terminal][data-w=sm]{--side:0px}
.pf[data-t=terminal][data-w=xs]{--side:0px;--pad-r:1em;--pad-l:1em}
.pf[data-w=sm] .tm-side,.pf[data-w=xs] .tm-side,.pf[data-w=xs] .tm-tt,.pf[data-w=xs] .tm-cmd span,.pf[data-w=xs] .tm-cmd kbd,.pf[data-w=xs] .tm-status>span:nth-child(n+4){display:none}
.pf[data-w=xs] .tm-cmd{min-width:0}
.pf[data-w=sm] .pf-burger,.pf[data-w=xs] .pf-burger{display:block;width:2.2em;height:2.2em;margin-right:-.5em}
.pf[data-t=terminal] .pf-drawer{top:2.6em}
.pf[data-w=sm] .tm-tt{display:none}
.pf[data-o=p] .tm-home{grid-template-columns:1fr;grid-template-rows:auto minmax(0,1fr)}
.pf[data-o=p] .tm-code{align-self:start;font-size:.78em}
.pf[data-h=tiny] .tm-prev{display:none}
.pf[data-h=tiny] .tm-home{grid-template-columns:1fr}
.pf[data-h=tiny] .tm-code{font-size:.74em;line-height:1.5}
`,
};
