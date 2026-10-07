/*! Portfolio Studio. Copyright (c) 2026 Roy Borkin. All rights reserved. Unauthorized copying, modification or distribution is prohibited without written permission. */
import { createRoot } from 'react-dom/client';
import { mixIds } from '../shared/mix.js';
import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import runtime from '@runtime';
import defaultAssets from '@assets';
import { defaultProject } from '../shared/defaults.js';
import { TEMPLATES } from '../site/templates/index.js';
import { Icon, useDebounced } from './fields.jsx';
import { TemplatesPanel, ProfilePanel, SectionsPanel, WorksPanel, SandboxPanel, AboutPanel, PortfolioPanel, ContactsPanel, DesignPanel, ProjectPanel, LayoutPanel } from './panels.jsx';
import { setIn, getIn, processImage, readFile, dataUrlToBlob, download, idbGet, idbSet, uid, clone, blobImagesWork } from './util.js';
import { exportZip } from './exporter.js';

const PANELS = [
  { id: 'templates', label: 'Templates', icon: 'grid', C: TemplatesPanel, wide: true },
  { id: 'profile', label: 'Profile', icon: 'user', C: ProfilePanel, sec: 'home' },
  { id: 'sections', label: 'Sections', icon: 'menu', C: SectionsPanel },
  { id: 'works', label: 'My Works', icon: 'briefcase', C: WorksPanel, sec: 'works' },
  { id: 'sandbox', label: 'SandBox', icon: 'code', C: SandboxPanel, sec: 'sandbox' },
  { id: 'about', label: 'About', icon: 'cap', C: AboutPanel, sec: 'about' },
  { id: 'portfolio', label: 'Portfolio', icon: 'file', C: PortfolioPanel, sec: 'portfolio' },
  { id: 'contacts', label: 'Contacts', icon: 'email', C: ContactsPanel },
  { id: 'design', label: 'Design', icon: 'spark', C: DesignPanel },
  { id: 'layout', label: 'Layout', icon: 'move', C: LayoutPanel },
  { id: 'project', label: 'Project', icon: 'folder', C: ProjectPanel },
];
const DEVICES = [
  { id: 'desktop', label: 'Desktop', icon: 'website', w: 1440, h: 900 },
  { id: 'laptop', label: 'Laptop', icon: 'app', w: 1280, h: 760 },
  { id: 'tablet', label: 'Tablet', icon: 'app', w: 820, h: 1180 },
  { id: 'phone', label: 'Phone', icon: 'phone', w: 390, h: 844 },
];
const DEF = (id) => TEMPLATES.find((t) => t.id === id) || TEMPLATES[0];

function srcdocFor(templateId, data, opts) {
  const json = JSON.stringify(data).replace(/</g, '\\u003c');
  const tjs = mixIds(templateId, data.mix).map((id) => runtime.templates[id] || '').join('\n').replace(/<\/script/gi, '<\\/script');
  const ejs = runtime.engineJs.replace(/<\/script/gi, '<\\/script');
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>${runtime.engineCss}</style></head><body><script>window.PF_DATA=${json};window.PF_OPTS=${JSON.stringify(opts || {})};</script><script>${ejs}</script><script>${tjs}</script></body></html>`;
}

/** Remove assets nobody references (keeps project files lean). */
function prune(p) {
  const s = JSON.stringify({ ...p, assets: undefined });
  const assets = {};
  for (const [id, a] of Object.entries(p.assets || {})) if (s.includes('"a:' + id + '"')) assets[id] = a;
  return { ...p, assets };
}
function normalize(p) {
  // Merge a loaded project onto the current shape so older files keep working.
  const base = defaultProject({});
  const out = { ...base, ...p, theme: { ...base.theme, ...(p.theme || {}) }, site: { ...base.site, ...(p.site || {}) }, profile: { ...base.profile, ...(p.profile || {}) },
    works: { ...base.works, ...(p.works || {}), instagram: { ...base.works.instagram, ...(p.works?.instagram || {}) } },
    sandbox: { ...base.sandbox, ...(p.sandbox || {}), github: { ...base.sandbox.github, ...(p.sandbox?.github || {}) } },
    about: { ...base.about, ...(p.about || {}) }, layout: { ...base.layout, ...(p.layout || {}) }, cursor: { ...base.cursor, ...(p.cursor || {}) }, mix: { ...base.mix, ...(p.mix || {}) }, portfolio: { ...base.portfolio, ...(p.portfolio || {}) }, assets: p.assets || {} };
  delete out._format; delete out._saved;
  if (!TEMPLATES.find((t) => t.id === out.template)) out.template = TEMPLATES[0].id;
  return out;
}
function blankProject() {
  const p = defaultProject({});
  p.name = 'New portfolio';
  p.profile = { ...p.profile, firstName: 'Your', lastName: 'Name', role: 'Designer', roles: ['Designer'], tagline: 'One sentence about what you make and why.', location: '', status: '', photo: '', cutout: '', sketch: '', logo: '' };
  p.contacts = [{ id: uid(), type: 'email', label: 'Email', value: 'you@example.com', show: true }];
  p.works.items = []; p.sandbox.apps = []; p.sandbox.github.user = '';
  p.about = { ...p.about, photo: '', bio: '', stats: [], experience: [], education: [], skills: [], resume: { label: 'Resume', url: '' } };
  p.portfolio.items = p.portfolio.items.map((x) => ({ ...x, url: '', image: '' }));
  p.site = { ...p.site, title: 'Portfolio', description: '', url: '' };
  return p;
}


const GUIDE = [
  ['templates', 'Pick a design', 'Twenty-three templates, three color versions each. Your content carries over when you switch.'],
  ['profile', 'Add your content', 'Profile, Sections, My Works, SandBox, About, Portfolio and Contacts. Google Drive files need “Anyone with the link can view”.'],
  ['design', 'Make it yours', 'Colors, fonts, size, motion, and the cursor: 13 styles plus size, color, follow, labels and magnetic buttons.'],
  ['layout', 'Mix and arrange', 'Mix & match: take the background, header, menu, contact info, main screen or section style from any other design. Then move, resize, rotate or hide any element, right on the canvas.'],
  ['works', 'Connect Instagram', 'My Works → Instagram: choose Automatic and new posts appear on your site within the hour after a one-time setup.'],
  ['project', 'Save and publish', 'Your work saves in this browser automatically; Save writes a project file you can open anywhere. Export website gives a ZIP ready for GitHub Pages, with instructions inside.'],
];
const KEYS = [['Ctrl Z', 'Undo'], ['Ctrl Shift Z', 'Redo'], ['Ctrl S', 'Save project file'], ['Ctrl O', 'Open project file'], ['Ctrl E', 'Export website'], ['F', 'Big preview on / off'], ['?', 'This guide'], ['Esc', 'Close'], ['← →', 'Change section (click the preview first)']];
function Guide({ onClose, go }) {
  const box = useRef(null);
  useEffect(() => { box.current?.focus(); }, []);
  return (
    <div className="guide" role="dialog" aria-modal="true" aria-labelledby="guide-t" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="guide-b" ref={box} tabIndex={-1}>
        <header><h2 id="guide-t">How Portfolio Studio works</h2><button className="ibtn" onClick={onClose} aria-label="Close guide"><Icon n="close" /></button></header>
        <ol className="guide-s">{GUIDE.map(([id, t, d], i) => <li key={id}><button type="button" onClick={() => go(id)}><em>{i + 1}</em><span><b>{t}</b><small>{d}</small></span><Icon n="arrow" /></button></li>)}</ol>
        <h3>Shortcuts</h3>
        <dl className="guide-k">{KEYS.map(([k, d]) => <div key={k}><dt>{k.split(' ').map((x, i) => <kbd key={i}>{x}</kbd>)}</dt><dd>{d}</dd></div>)}</dl>
        <p className="guide-c">Portfolio Studio · version {__BUILD__} · © 2026 Roy Borkin. All rights reserved.</p>
      </div>
    </div>
  );
}

function App() {
  const [p, setP] = useState(() => defaultProject(clone(defaultAssets)));
  const [panel, setPanel] = useState('templates');
  const [device, setDevice] = useState('desktop');
  const [rot, setRot] = useState(false);
  const [cur, setCur] = useState('home');
  const [focus, setFocus] = useState(false);
  const [guide, setGuide] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [busy, setBusy] = useState('');
  const [ui, setUiState] = useState({ edit: false, scope: 'all', selKey: null });
  const setUi = useCallback((patch) => setUiState((u) => ({ ...u, ...patch })), []);
  const hist = useRef({ past: [], future: [], last: 0, key: '' });
  const frame = useRef(); const stage = useRef(); const fileIn = useRef();
  const [stageSize, setStageSize] = useState({ w: 1000, h: 700 });
  const loaded = useRef(false);

  const toast = useCallback((msg, kind = 'ok') => { const id = uid(); setToasts((t) => [...t, { id, msg, kind }]); setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), kind === 'err' ? 7000 : 3800); }, []);

  // history-aware update
  const commit = useCallback((next, key = '') => {
    setP((prev) => {
      const n = typeof next === 'function' ? next(prev) : next;
      if (n === prev) return prev;
      const h = hist.current, now = Date.now();
      if (!(key && key === h.key && now - h.last < 700)) { h.past.push(prev); if (h.past.length > 80) h.past.shift(); }
      h.future = []; h.last = now; h.key = key;
      return n;
    });
  }, []);
  const setEl = useCallback((key, v, scope) => commit((prev) => {
    const els = { ...(prev.layout?.els || {}) }; const old = els[key] || {};
    els[key] = scope === 'p' ? { ...old, p: { ...(old.p || {}), ...v } } : { ...old, ...v };
    return { ...prev, layout: { ...(prev.layout || {}), els } };
  }, 'el.' + key + '.' + Object.keys(v).join()), [commit]);
  const undo = useCallback(() => setP((cur) => { const h = hist.current; if (!h.past.length) return cur; h.future.push(cur); h.key = ''; return h.past.pop(); }), []);
  const redo = useCallback(() => setP((cur) => { const h = hist.current; if (!h.future.length) return cur; h.past.push(cur); h.key = ''; return h.future.pop(); }), []);

  // restore autosave
  useEffect(() => {
    idbGet('project').then((saved) => {
      if (saved && saved.profile) { setP(normalize(saved)); toast('Restored your last session from this browser.'); }
      loaded.current = true;
    });
  }, []); // eslint-disable-line
  const deb = useDebounced(p, 900);
  useEffect(() => { if (loaded.current) idbSet('project', deb); }, [deb]);

  // asset blob URLs for previews
  const blobCache = useRef(new Map());
  const [useBlobs, setUseBlobs] = useState(true);
  useEffect(() => { blobImagesWork().then((ok) => { if (!ok) setUseBlobs(false); }); }, []);
  const blobAssets = useCallback(() => {
    const out = {};
    for (const [id, a] of Object.entries(p.assets || {})) {
      if (!a?.data) continue;
      if (!useBlobs) { out[id] = { id, name: a.name, type: a.type, path: a.data }; continue; }
      let c = blobCache.current.get(id);
      if (!c || c.data !== a.data) { if (c) URL.revokeObjectURL(c.url); c = { data: a.data, url: URL.createObjectURL(dataUrlToBlob(a.data)) }; blobCache.current.set(id, c); }
      out[id] = { id, name: a.name, type: a.type, path: c.url };
    }
    return out;
  }, [p.assets, useBlobs]);
  const assetsForPreview = useMemo(() => blobAssets(), [blobAssets]);
  const img = useCallback((ref) => { if (!ref) return ''; if (ref.startsWith('a:')) return assetsForPreview[ref.slice(2)]?.path || ''; return ref; }, [assetsForPreview]);

  const dataNoAssets = useMemo(() => ({ ...p, assets: undefined }), [p]);
  const editOpts = { edit: ui.edit && panel === 'layout', scope: ui.scope, selKey: ui.selKey };
  const editRef = useRef(editOpts); editRef.current = editOpts;
  const mixKey = mixIds(p.template, p.mix).join('+');
  const previewDoc = useMemo(() => srcdocFor(p.template, { ...dataNoAssets, assets: assetsForPreview }, { section: cur, ...editRef.current }), [mixKey]); // eslint-disable-line
  const debData = useDebounced(dataNoAssets, 140);
  const sent = useRef({ data: null, assets: null });
  useEffect(() => {
    const w = frame.current?.contentWindow; if (!w) return;
    const prev = sent.current;
    const onlyLayout = prev.data && prev.assets === assetsForPreview && Object.keys(debData).every((k) => k === 'layout' || debData[k] === prev.data[k]) && Object.keys(prev.data).every((k) => k in debData);
    if (onlyLayout && prev.data.layout !== debData.layout && (prev.data.layout?.transition === debData.layout?.transition)) w.postMessage({ type: 'pf:layout', layout: debData.layout }, '*');
    else w.postMessage({ type: 'pf:update', data: debData, assets: assetsForPreview, opts: editRef.current }, '*');
    sent.current = { data: debData, assets: assetsForPreview };
  }, [debData, assetsForPreview]);
  useEffect(() => { frame.current?.contentWindow?.postMessage({ type: 'pf:update', data: sent.current.data || dataNoAssets, assets: assetsForPreview, opts: editRef.current }, '*'); }, [editOpts.edit, editOpts.scope]); // eslint-disable-line
  useEffect(() => {
    const on = (e) => {
      if (e.source !== frame.current?.contentWindow || !e.data) return;
      if (e.data.type === 'pf:section') setCur(e.data.id);
      else if (e.data.type === 'pf:select') setUi({ selKey: e.data.key || null });
      else if (e.data.type === 'pf:elset') setEl(e.data.key, e.data.v, e.data.scope);
    };
    window.addEventListener('message', on); return () => window.removeEventListener('message', on);
  }, []);
  const goto = useCallback((id) => frame.current?.contentWindow?.postMessage({ type: 'pf:goto', i: id }, '*'), []);

  // stage size
  useEffect(() => { const ro = new ResizeObserver(([e]) => setStageSize({ w: e.contentRect.width, h: e.contentRect.height })); ro.observe(stage.current); return () => ro.disconnect(); }, []);
  const dv = DEVICES.find((d) => d.id === device);
  const [dw, dh] = rot ? [dv.h, dv.w] : [dv.w, dv.h];
  const scale = Math.min((stageSize.w - 48) / dw, (stageSize.h - 48) / dh, 1);

  // jump preview to the section of the open panel
  useEffect(() => { const s = PANELS.find((x) => x.id === panel)?.sec; if (s) goto(s); }, [panel, goto]);

  // keyboard
  useEffect(() => {
    const k = (e) => {
      const mod = e.ctrlKey || e.metaKey;
      const inField = e.target.closest?.('input,textarea,select,[contenteditable]');
      if (e.key === 'Escape') { if (guide) setGuide(false); else if (focus) setFocus(false); return; }
      if (!mod) {
        if (inField || e.altKey) return;
        if (e.key === 'f' || e.key === 'F') { e.preventDefault(); setFocus((x) => !x); }
        else if (e.key === '?') { e.preventDefault(); setGuide((x) => !x); }
        return;
      }
      if (e.key.toLowerCase() === 'z' && !inField) { e.preventDefault(); e.shiftKey ? redo() : undo(); }
      else if (e.key.toLowerCase() === 'y' && !inField) { e.preventDefault(); redo(); }
      else if (e.key.toLowerCase() === 's') { e.preventDefault(); api.save(); }
      else if (e.key.toLowerCase() === 'o') { e.preventDefault(); api.open(); }
      else if (e.key.toLowerCase() === 'e') { e.preventDefault(); api.exportZip(); }
    };
    window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k);
  });

  const loadFile = async (f) => {
    try {
      const j = JSON.parse(await readFile(f, 'text'));
      if (!j.profile || !j.sections) throw new Error('This file is not a Portfolio Studio project.');
      commit(normalize(j)); toast(`Opened “${j.name || f.name}”.`);
    } catch (e) { toast(e.message.includes('Portfolio') ? e.message : 'Could not read that file. Choose a .portfolio.json file saved from Portfolio Studio.', 'err'); }
  };

  const api = {
    ui, setUi,
    setEl,
    selectEl(key, group) { setUi({ selKey: key }); frame.current?.contentWindow?.postMessage({ type: 'pf:select', key }, '*'); if (key && group === 'home') goto('home'); },
    replayText() { frame.current?.contentWindow?.postMessage({ type: 'pf:replayText' }, '*'); },
    playTransition() { const en = p.sections.filter((s) => s.enabled !== false); const i = en.findIndex((s) => s.id === cur); goto(en[(i + 1) % en.length].id); },
    p,
    set: (path, v) => commit((prev) => setIn(prev, path, v), path.join('.')),
    setTemplate: (t, v) => { commit((prev) => ({ ...prev, template: t, variant: v })); },
    img, goto, toast, blobAssets: () => assetsForPreview,
    thumbData: (t, v) => ({ ...dataNoAssets, template: t, variant: v, mix: {} }),
    async upload(file, o = {}) {
      if (!file.type.startsWith('image/')) { toast('That file isn’t an image. Use JPG, PNG, WebP, SVG or GIF.', 'err'); return Promise.reject(); }
      setBusy('Processing image…');
      try {
        const r = await processImage(file, o.max || 1800);
        const id = uid();
        commit((prev) => ({ ...prev, assets: { ...prev.assets, [id]: { id, name: file.name, type: r.type, data: r.data } } }));
        return 'a:' + id;
      } finally { setBusy(''); }
    },
    async uploadHtml(file) {
      const txt = await readFile(file, 'text');
      const data = 'data:text/html;base64,' + btoa(unescape(encodeURIComponent(txt)));
      const id = uid();
      commit((prev) => ({ ...prev, assets: { ...prev.assets, [id]: { id, name: file.name, type: 'text/html', data } } }));
      toast(`${file.name} added. It will open inside your site.`);
      return 'a:' + id;
    },
    async removeBg(target, srcRef) {
      const src = img(srcRef);
      if (!src) { toast('Add a portrait photo first.', 'err'); return; }
      setBusy('Removing background… the first run downloads a model (~40 MB)');
      try {
        const mod = await new Function('u', 'return import(u)')('https://cdn.jsdelivr.net/npm/@imgly/background-removal@1.5.5/+esm');
        const blob = await mod.removeBackground(src, { output: { format: 'image/png' } });
        const r = await processImage(new File([blob], 'cutout.png', { type: 'image/png' }), 2000);
        const id = uid();
        commit((prev) => setIn({ ...prev, assets: { ...prev.assets, [id]: { id, name: 'cutout.png', type: r.type, data: r.data } } }, ['profile', target], 'a:' + id));
        toast('Background removed.');
      } catch (e) {
        console.error(e);
        toast('Background removal couldn’t run here (it needs to download a model from the internet). Make a transparent PNG with remove.bg or Photoshop and upload it instead.', 'err');
      } finally { setBusy(''); }
    },
    save() {
      const clean = prune(p);
      const blob = new Blob([JSON.stringify({ ...clean, _format: 'portfolio-studio', _saved: new Date().toISOString() })], { type: 'application/json' });
      download(blob, (p.name || 'portfolio').replace(/[^\w\- ]+/g, '').trim().replace(/\s+/g, '-').toLowerCase() + '.portfolio.json').then((r) => r === 'saved' && toast('Project saved. Open this file on any computer to keep editing.'));
    },
    open() { fileIn.current.click(); },
    async exportZip() {
      setBusy('Building your website…');
      try {
        const clean = prune(p);
        const blob = await exportZip(clean, DEF(clean.template), runtime);
        const r = await download(blob, (p.profile.firstName + '-' + p.profile.lastName).toLowerCase().replace(/[^\w-]+/g, '') + '-website.zip');
        if (r === 'saved') toast('Website exported. Unzip it and open index.html, or follow README.md to publish.');
      } catch (e) { console.error(e); toast('Export failed: ' + e.message, 'err'); } finally { setBusy(''); }
    },
    resetSample() { commit(defaultProject(clone(defaultAssets))); toast('Sample content restored. Undo (Ctrl Z) brings your project back.'); },
    resetBlank() { commit(blankProject()); toast('Blank project started. Undo (Ctrl Z) brings your project back.'); },
  };

  const P = PANELS.find((x) => x.id === panel);
  const def = DEF(p.template);
  const thumbSrcdoc = useCallback((t, v) => srcdocFor(t, { ...dataNoAssets, template: t, variant: v, mix: {}, assets: assetsForPreview }, { static: true }), [dataNoAssets, assetsForPreview]);

  return (
    <div className={'app' + (focus ? ' focus' : '')} onDragOver={(e) => { if ([...e.dataTransfer.types].includes('Files')) e.preventDefault(); }} onDrop={(e) => { const f = e.dataTransfer.files?.[0]; if (f && /\.json$/i.test(f.name)) { e.preventDefault(); loadFile(f); } }}>
      <header className="top">
        <div className="brand" title={`Portfolio Studio · version ${__BUILD__} · © 2026 Roy Borkin. All rights reserved.`}><span className="brand-m" aria-hidden="true">PS</span><b>Portfolio Studio</b><small className="ver">{__BUILD__}</small></div>
        <input className="pname" value={p.name} onChange={(e) => api.set(['name'], e.target.value)} aria-label="Project name" />
        <div className="hist">
          <button className="ibtn" onClick={undo} disabled={!hist.current.past.length} title="Undo (Ctrl Z)"><Icon n="arrowLeft" /></button>
          <button className="ibtn" onClick={redo} disabled={!hist.current.future.length} title="Redo (Ctrl Shift Z)"><Icon n="arrow" /></button>
        </div>
        <div className="devs" role="radiogroup" aria-label="Preview device">
          {DEVICES.map((d) => <button key={d.id} role="radio" aria-checked={device === d.id} className={device === d.id ? 'on' : ''} onClick={() => setDevice(d.id)} title={`${d.label} ${d.w}×${d.h}`}>{d.label}</button>)}
          <button className="ibtn" onClick={() => setRot(!rot)} title="Rotate (portrait / landscape)" aria-pressed={rot}><Icon n="arrowDown" className={rot ? 'rot on' : 'rot'} /></button>
        </div>
        <div className="acts">
          <button className="btn ghost" onClick={api.open} title="Open a project file (Ctrl O)"><Icon n="folder" /><span>Open</span></button>
          <button className="btn ghost" onClick={api.save} title="Save project file (Ctrl S)"><Icon n="download" /><span>Save</span></button>
          <button className="ibtn" onClick={() => setFocus(!focus)} aria-pressed={focus} title={focus ? 'Back to the editor (F or Esc)' : 'Big preview (F)'}><Icon n={focus ? 'close' : 'expand'} /></button>
          <button className="ibtn" onClick={() => setGuide(true)} title="Guide and shortcuts (?)"><Icon n="help" /></button>
          <button className="btn primary" onClick={api.exportZip} title="Export website (Ctrl E)"><Icon n="external" /><span>Export website</span></button>
        </div>
      </header>
      <nav className="rail" aria-label="Editor panels">
        {PANELS.map((x) => <button key={x.id} className={panel === x.id ? 'on' : ''} onClick={() => setPanel(x.id)} aria-current={panel === x.id}><Icon n={x.icon} /><span>{x.label}</span></button>)}
      </nav>
      <aside className={'side' + (P.wide ? ' wide' : '')}>
        <header className="side-h"><h2>{P.label}</h2>{panel !== 'templates' && <span className="side-t">{def.name} · {def.variants[p.variant]?.name}</span>}</header>
        <div className="side-b"><P.C api={api} thumbSrcdoc={thumbSrcdoc} /></div>
      </aside>
      <main className="stage" ref={stage}>
        <div className="secbar">
          {p.sections.filter((s) => s.enabled !== false).map((s) => <button key={s.id} className={cur === s.id ? 'on' : ''} onClick={() => goto(s.id)}>{s.label}</button>)}
          <span className="dim">{dw} × {dh} · {Math.round(scale * 100)}%</span>
        </div>
        <div className={'device ' + device + (rot ? ' rot' : '')} style={{ width: dw * scale, height: dh * scale }}>
          <iframe ref={frame} key={mixKey} title="Live preview" srcDoc={previewDoc} style={{ width: dw, height: dh, transform: `scale(${scale})` }} />
        </div>
      </main>
      <input ref={fileIn} type="file" accept=".json,application/json" hidden onChange={(e) => { const f = e.target.files?.[0]; if (f) loadFile(f); e.target.value = ''; }} />
      {guide && <Guide onClose={() => setGuide(false)} go={(id) => { setPanel(id); setGuide(false); setFocus(false); }} />}
      {busy && <div className="busy" role="status"><span className="spin" />{busy}</div>}
      <div className="toasts" aria-live="polite">{toasts.map((t) => <div key={t.id} className={'toast ' + t.kind}><Icon n={t.kind === 'err' ? 'close' : 'check'} /><span>{t.msg}</span></div>)}</div>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
