/*! Portfolio Studio. Copyright (c) 2026 Roy Borkin. All rights reserved. Unauthorized copying, modification or distribution is prohibited without written permission. */
import { useRef, useState, useEffect } from 'react';
import { ICONS } from '../shared/icons.js';

export const Icon = ({ n, className = '' }) => <span className={'ic ' + className} aria-hidden="true" dangerouslySetInnerHTML={{ __html: ICONS[n] || ICONS.link }} />;

export function Field({ label, hint, children, status, wide }) {
  return (
    <label className={'f' + (wide ? ' f-wide' : '')}>
      {label && <span className="f-l">{label}</span>}
      {children}
      {status && <span className={'f-st ' + (status.ok ? (status.warn ? 'warn' : 'ok') : 'bad')}>{status.msg}</span>}
      {hint && !status && <span className="f-h">{hint}</span>}
    </label>
  );
}
export function Text({ value, onChange, placeholder, type = 'text', ...p }) {
  return <input className="in" type={type} value={value ?? ''} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} {...p} />;
}
export function Area({ value, onChange, rows = 4, placeholder, mono }) {
  return <textarea className={'in' + (mono ? ' mono' : '')} rows={rows} value={value ?? ''} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} spellCheck={!mono} />;
}
export function Select({ value, onChange, options }) {
  return (
    <span className="sel"><select className="in" value={value ?? ''} onChange={(e) => onChange(e.target.value)}>
      {options.map((o) => (typeof o === 'string' ? <option key={o} value={o}>{o}</option> : <option key={o.value} value={o.value}>{o.label}</option>))}
    </select><Icon n="arrowDown" /></span>
  );
}
export function Toggle({ value, onChange, label }) {
  return (
    <button type="button" role="switch" aria-checked={!!value} className={'tg' + (value ? ' on' : '')} onClick={() => onChange(!value)}>
      <i /><span>{label}</span>
    </button>
  );
}
export function Segmented({ value, onChange, options }) {
  return <div className="seg" role="radiogroup">{options.map((o) => <button key={o.value} type="button" role="radio" aria-checked={value === o.value} className={value === o.value ? 'on' : ''} onClick={() => onChange(o.value)}>{o.label}</button>)}</div>;
}
export function Range({ value, onChange, min, max, step, suffix = '' }) {
  return <div className="rg"><input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(+e.target.value)} /><output>{value}{suffix}</output></div>;
}
const isHex = (v) => /^#[0-9a-f]{6}$/i.test(v || '');
export function Color({ value, fallback, onChange, onReset }) {
  const shown = value || fallback || '';
  return (
    <div className={'col' + (value ? ' set' : '')}>
      <span className="col-sw" style={{ background: shown }}><input type="color" value={isHex(shown) ? shown : '#888888'} onChange={(e) => onChange(e.target.value)} aria-label="Pick color" /></span>
      <input className="in mono" value={value || ''} placeholder={fallback} onChange={(e) => onChange(e.target.value)} />
      {value && <button type="button" className="ibtn" onClick={onReset} title="Reset to template color"><Icon n="close" /></button>}
    </div>
  );
}
export function Tags({ value = [], onChange, placeholder }) {
  const [t, setT] = useState('');
  const add = () => { const v = t.trim(); if (v && !value.includes(v)) onChange([...value, v]); setT(''); };
  return (
    <div className="tags">
      {value.map((v, i) => (
        <span key={v + i} className="tag">{v}
          <button type="button" onClick={() => onChange(value.filter((_, k) => k !== i))} aria-label={'Remove ' + v}><Icon n="close" /></button>
        </span>
      ))}
      <input className="tag-in" value={t} placeholder={placeholder} onChange={(e) => setT(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); add(); } else if (e.key === 'Backspace' && !t && value.length) onChange(value.slice(0, -1)); }} onBlur={add} />
    </div>
  );
}

/** Image picker: upload (resized), paste URL, clear. `src` is a resolved URL for the thumbnail. */
export function ImagePick({ value, src, onUpload, onChange, label = 'Image', accept = 'image/*', extra, tall }) {
  const ref = useRef();
  const [url, setUrl] = useState(false);
  const [drag, setDrag] = useState(false);
  const isRef = typeof value === 'string' && value.startsWith('a:');
  return (
    <div className={'img' + (drag ? ' drag' : '') + (tall ? ' tall' : '')}
      onDragOver={(e) => { e.preventDefault(); setDrag(true); }} onDragLeave={() => setDrag(false)}
      onDrop={(e) => { e.preventDefault(); setDrag(false); const f = e.dataTransfer.files?.[0]; if (f) onUpload(f); }}>
      <button type="button" className="img-th" onClick={() => ref.current.click()} title={'Upload ' + label.toLowerCase()}>
        {src ? <img src={src} alt="" /> : <span><Icon n="download" />Drop or click</span>}
      </button>
      <div className="img-r">
        <span className="f-l">{label}</span>
        <div className="img-acts">
          <button type="button" className="btn sm" onClick={() => ref.current.click()}>Upload</button>
          <button type="button" className="btn sm ghost" onClick={() => setUrl((v) => !v)}>Link</button>
          {value && <button type="button" className="btn sm ghost" onClick={() => onChange('')}>Remove</button>}
          {extra}
        </div>
        {url && <input className="in" placeholder="https://…/image.jpg" defaultValue={isRef ? '' : value || ''} onKeyDown={(e) => { if (e.key === 'Enter') { onChange(e.target.value.trim()); setUrl(false); } }} onBlur={(e) => { if (e.target.value.trim()) onChange(e.target.value.trim()); setUrl(false); }} autoFocus />}
      </div>
      <input ref={ref} type="file" accept={accept} hidden onChange={(e) => { const f = e.target.files?.[0]; if (f) onUpload(f); e.target.value = ''; }} />
    </div>
  );
}

/** Editable list with collapse, reorder, duplicate and delete. */
export function List({ items = [], onChange, render, title, newItem, addLabel = 'Add', summary, empty, addMenu }) {
  const [open, setOpen] = useState(null);
  const move = (i, d) => { const j = i + d; if (j < 0 || j >= items.length) return; const a = items.slice(); [a[i], a[j]] = [a[j], a[i]]; onChange(a); if (open === i) setOpen(j); };
  const del = (i) => { onChange(items.filter((_, k) => k !== i)); setOpen(null); };
  const dup = (i) => { const a = items.slice(); a.splice(i + 1, 0, { ...items[i], id: Math.random().toString(36).slice(2, 9) }); onChange(a); };
  const add = (it) => { onChange([...items, it]); setOpen(items.length); };
  return (
    <div className="ls">
      {!items.length && empty && <p className="ls-empty">{empty}</p>}
      {items.map((it, i) => (
        <div key={it.id || i} className={'ls-i' + (open === i ? ' open' : '')}>
          <div className="ls-h">
            <button type="button" className="ls-t" onClick={() => setOpen(open === i ? null : i)} aria-expanded={open === i}>
              {summary ? summary(it, i) : <b>{it.title || it.label || 'Untitled'}</b>}
            </button>
            <span className="ls-acts">
              <button type="button" className="ibtn" onClick={() => move(i, -1)} disabled={i === 0} title="Move up"><Icon n="arrowUp" /></button>
              <button type="button" className="ibtn" onClick={() => move(i, 1)} disabled={i === items.length - 1} title="Move down"><Icon n="arrowDown" /></button>
              <button type="button" className="ibtn" onClick={() => dup(i)} title="Duplicate"><Icon n="copy" /></button>
              <button type="button" className="ibtn danger" onClick={() => del(i)} title="Delete"><Icon n="close" /></button>
            </span>
          </div>
          {open === i && <div className="ls-b">{render(it, (patch) => onChange(items.map((x, k) => (k === i ? { ...x, ...(typeof patch === 'function' ? patch(x) : patch) } : x))), i)}</div>}
        </div>
      ))}
      <div className="ls-add">
        {addMenu ? addMenu.map((m) => <button key={m.label} type="button" className="btn sm ghost" onClick={() => add(m.make())}><Icon n="plus" />{m.label}</button>)
          : <button type="button" className="btn sm ghost" onClick={() => add(newItem())}><Icon n="plus" />{addLabel}</button>}
      </div>
    </div>
  );
}

export function Group({ title, children, desc, right, collapsible, defaultOpen = true }) {
  const [o, setO] = useState(defaultOpen);
  return (
    <section className={'grp' + (o ? '' : ' closed')}>
      <header className="grp-h">
        {collapsible ? <button type="button" onClick={() => setO(!o)} className="grp-t" aria-expanded={o}><Icon n="arrowDown" />{title}</button> : <h3 className="grp-t">{title}</h3>}
        {right}
      </header>
      {o && desc && <p className="grp-d">{desc}</p>}
      {o && <div className="grp-b">{children}</div>}
    </section>
  );
}

export function useDebounced(value, ms) {
  const [v, setV] = useState(value);
  useEffect(() => { const t = setTimeout(() => setV(value), ms); return () => clearTimeout(t); }, [value, ms]);
  return v;
}
