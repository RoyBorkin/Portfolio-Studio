/*! Portfolio Studio. Copyright (c) 2026 Roy Borkin. All rights reserved. Unauthorized copying, modification or distribution is prohibited without written permission. */
// Builder utilities: ids, images, files, persistence.
export const uid = () => Math.random().toString(36).slice(2, 9);
export const clone = (o) => (typeof structuredClone === 'function' ? structuredClone(o) : JSON.parse(JSON.stringify(o)));

/** immutable set by path: set(obj, ['a', 0, 'b'], v) */
export function setIn(obj, path, val) {
  if (!path.length) return typeof val === 'function' ? val(obj) : val;
  const [k, ...rest] = path;
  const src = obj ?? (typeof k === 'number' ? [] : {});
  const copy = Array.isArray(src) ? src.slice() : { ...src };
  copy[k] = setIn(src[k], rest, val);
  return copy;
}
export const getIn = (obj, path) => path.reduce((o, k) => (o == null ? o : o[k]), obj);

export function readFile(file, as = 'dataURL') {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result); r.onerror = () => rej(r.error);
    if (as === 'text') r.readAsText(file); else r.readAsDataURL(file);
  });
}

/** Downscale an image file and return a data URL. Keeps transparency when the source has it. */
export async function processImage(file, max = 1800) {
  if (file.type === 'image/svg+xml' || file.type === 'image/gif') return { data: await readFile(file), type: file.type };
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = url; });
    const s = Math.min(1, max / Math.max(img.naturalWidth, img.naturalHeight));
    const w = Math.round(img.naturalWidth * s), h = Math.round(img.naturalHeight * s);
    const cv = document.createElement('canvas'); cv.width = w; cv.height = h;
    const g = cv.getContext('2d'); g.drawImage(img, 0, 0, w, h);
    let alpha = false;
    if (file.type !== 'image/jpeg') {
      const d = g.getImageData(0, 0, w, h).data;
      for (let i = 3; i < d.length; i += 4 * 7) if (d[i] < 250) { alpha = true; break; }
    }
    const type = alpha ? 'image/webp' : 'image/jpeg';
    let data = cv.toDataURL(type, alpha ? 0.88 : 0.84);
    if (alpha && !data.startsWith('data:image/webp')) data = cv.toDataURL('image/png');
    return { data, type: data.slice(5, data.indexOf(';')), w, h };
  } finally { URL.revokeObjectURL(url); }
}

export function dataUrlToBytes(d) {
  const [head, b64] = d.split(',');
  const isB64 = /;base64$/.test(head);
  if (!isB64) return new TextEncoder().encode(decodeURIComponent(b64));
  const bin = atob(b64); const u = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i);
  return u;
}
export function dataUrlToBlob(d) { return new Blob([dataUrlToBytes(d)], { type: d.slice(5).split(/[;,]/)[0] }); }
export const extOf = (type) => ({ 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/svg+xml': 'svg', 'image/gif': 'gif', 'text/html': 'html', 'application/pdf': 'pdf' }[type] || 'bin');

/** Save a file: through the claude.ai downloads capability when hosted there, else a normal browser download. */
export async function download(blob, name) {
  try {
    if (window.claude && typeof window.claude.use === 'function') {
      const d = await Promise.race([window.claude.use('downloads'), new Promise((r) => setTimeout(() => r(null), 2500))]);
      if (d) { await d.save({ filename: name, data: blob }); return 'saved'; }
    }
  } catch (e) { if (e && (e.code === 'declined' || e.code === 'rate_limited')) return e.code; }
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob); a.download = name;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 4000);
  return 'saved';
}
/** Can this page show images from blob: URLs? (Some hosts block them.) */
export function blobImagesWork() {
  return new Promise((res) => {
    try {
      const svg = new Blob(['<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"/>'], { type: 'image/svg+xml' });
      const u = URL.createObjectURL(svg); const i = new Image();
      const t = setTimeout(() => res(false), 1500);
      i.onload = () => { clearTimeout(t); res(true); }; i.onerror = () => { clearTimeout(t); res(false); };
      i.src = u;
    } catch { res(false); }
  });
}
/* IndexedDB autosave (best effort) */
const DB = 'portfolio-studio', STORE = 'kv';
function db() {
  return new Promise((res, rej) => {
    try {
      const r = indexedDB.open(DB, 1);
      r.onupgradeneeded = () => r.result.createObjectStore(STORE);
      r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error);
    } catch (e) { rej(e); }
  });
}
export async function idbSet(k, v) { try { const d = await db(); await new Promise((res, rej) => { const t = d.transaction(STORE, 'readwrite'); t.objectStore(STORE).put(v, k); t.oncomplete = res; t.onerror = () => rej(t.error); }); return true; } catch { return false; } }
export async function idbGet(k) { try { const d = await db(); return await new Promise((res) => { const t = d.transaction(STORE, 'readonly'); const q = t.objectStore(STORE).get(k); q.onsuccess = () => res(q.result); q.onerror = () => res(null); }); } catch { return null; } }

export const slug = (s) => String(s || '').toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'item';
export const today = () => new Date().toISOString().slice(0, 10);

export function driveStatus(u) {
  if (!u) return null;
  if (/drive\.google\.com\/file\/d\/[\w-]+/.test(u) || /drive\.google\.com\/(open|uc)\?.*id=/.test(u)) return { ok: true, msg: 'Google Drive file — it will open in a viewer on your site.' };
  if (/drive\.google\.com\/drive\/(u\/\d\/)?folders\//.test(u)) return { ok: true, msg: 'Google Drive folder — visitors will see the file list.' };
  if (/docs\.google\.com\/(document|presentation|spreadsheets)\/d\//.test(u)) return { ok: true, msg: 'Google Docs file — it will open in a viewer.' };
  if (/^https?:\/\//.test(u)) return { ok: true, warn: true, msg: 'Not a Google Drive link. It will still open, if the site allows embedding.' };
  return { ok: false, msg: 'Paste the full link, starting with https://' };
}
export function socialStatus(kind, u) {
  if (!u) return null;
  if (kind === 'instagram') return /instagram\.com\/(?:[\w.]+\/)?(p|reel|tv)\/[\w-]+/.test(u) ? { ok: true, msg: 'Post link found — it opens with Instagram’s official embed.' } : { ok: false, warn: true, msg: 'Use a single post link like instagram.com/p/ABC123/. Profile links can’t be embedded.' };
  if (kind === 'linkedin') return /urn:li:(share|activity|ugcPost):\d+|activity[-:]\d{10,}|ugcPost[-:]\d{10,}|linkedin\.com\/embed\//.test(u) ? { ok: true, msg: 'Post found — it opens with LinkedIn’s official embed.' } : { ok: false, warn: true, msg: 'Use a post link (linkedin.com/posts/…activity-123…) or the post’s “Embed this post” code.' };
  return null;
}
