/*! Portfolio Studio. Copyright (c) 2026 Roy Borkin. All rights reserved. Unauthorized copying, modification or distribution is prohibited without written permission. */
// LinkedIn helpers shared by the builder (import + feed test) and the site runtime.
// LinkedIn's API does not let individual members read their own posts (r_member_social is partner-only),
// so posts come from (1) the official data export (Shares.csv) or (2) an RSS/JSON feed from a feed service.

/** Stable key for a post URL: the numeric id of urn:li:activity/share/ugcPost, else the URL itself. */
export function liKey(url) {
  let u = String(url || '');
  try { u = decodeURIComponent(u); } catch { /* keep raw */ }
  const m = u.match(/urn:li:(?:activity|share|ugcPost):(\d{10,})/) || u.match(/(?:activity|share|ugcPost)[-:](\d{10,})/);
  return m ? m[1] : u.replace(/[?#].*$/, '').replace(/\/$/, '');
}
/** Normalise a LinkedIn post link so it embeds (decodes urn%3Ali%3A…). */
export function liUrl(url) {
  let u = String(url || '').trim();
  try { if (/%3A/i.test(u)) u = decodeURIComponent(u); } catch { /* keep raw */ }
  return u;
}
const firstLine = (t) => String(t || '').replace(/\s+/g, ' ').trim().split(/(?<=[.!?])\s/)[0].slice(0, 90) || 'LinkedIn post';

/** RFC-4180 CSV parser (quoted fields, doubled quotes, newlines inside quotes). */
export function parseCsv(text) {
  const rows = []; let row = [], f = '', q = false;
  text = String(text || '').replace(/^﻿/, '');
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) { if (c === '"') { if (text[i + 1] === '"') { f += '"'; i++; } else q = false; } else f += c; continue; }
    if (c === '"') q = true;
    else if (c === ',') { row.push(f); f = ''; }
    else if (c === '\n' || c === '\r') { if (c === '\r' && text[i + 1] === '\n') i++; row.push(f); rows.push(row); row = []; f = ''; }
    else f += c;
  }
  if (f || row.length) { row.push(f); rows.push(row); }
  const head = (rows.shift() || []).map((h) => h.trim());
  return rows.filter((r) => r.some((x) => x.trim())).map((r) => Object.fromEntries(head.map((h, i) => [h, r[i] ?? ''])));
}

/** Shares.csv rows → posts. Skips connections-only posts (they can't be embedded publicly). */
export function sharesToPosts(rows) {
  const out = []; let hidden = 0;
  for (const r of rows) {
    const link = liUrl(r.ShareLink || r['Share Link'] || r.Link || '');
    if (!link) continue;
    const vis = String(r.Visibility || '').toUpperCase();
    if (/CONNECTIONS/.test(vis)) { hidden++; continue; }
    const text = String(r.ShareCommentary || r.Commentary || '').replace(/""/g, '"').trim();
    const date = String(r.Date || '').replace(' ', 'T');
    out.push({ key: liKey(link), url: link, text, date: /^\d{4}-\d\d-\d\d/.test(date) ? date.slice(0, 10) : '', shared: r.SharedUrl || '' });
  }
  out.sort((a, b) => String(b.date).localeCompare(String(a.date)));
  return { posts: out, hidden };
}

const unent = (s) => String(s || '').replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&#(\d+);/g, (m, n) => String.fromCodePoint(+n)).replace(/&amp;/g, '&');
const strip = (s) => unent(s).replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]+>/g, ' ').replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n').trim();
const tag = (x, n) => { const m = x.match(new RegExp(`<${n}(?:\\s[^>]*)?>([\\s\\S]*?)</${n}>`, 'i')); return m ? m[1] : ''; };
const attr = (x, n, a) => { const m = x.match(new RegExp(`<${n}\\s[^>]*${a}=["']([^"']+)["']`, 'i')); return m ? unent(m[1]) : ''; };

/** RSS 2.0, Atom or JSON Feed text → posts. */
export function parseFeed(text) {
  text = String(text || '').trim();
  let items = [];
  if (text.startsWith('{') || text.startsWith('[')) {
    const j = JSON.parse(text);
    const arr = Array.isArray(j) ? j : j.items || j.posts || j.data || [];
    items = arr.map((p) => ({ url: p.url || p.link || p.permalink || p.external_url, text: p.content_text || strip(p.content_html || p.description || p.text || p.title || ''), date: p.date_published || p.date || p.pubDate || p.published, image: p.image || p.banner_image || p.thumbnail || (p.attachments || []).find((a) => /^image/.test(a.mime_type || ''))?.url || '' }));
  } else {
    const blocks = text.match(/<item[\s>][\s\S]*?<\/item>/gi) || text.match(/<entry[\s>][\s\S]*?<\/entry>/gi) || [];
    items = blocks.map((b) => {
      const link = strip(tag(b, 'link')) || attr(b, 'link', 'href') || strip(tag(b, 'guid'));
      const desc = tag(b, 'content:encoded') || tag(b, 'description') || tag(b, 'content') || tag(b, 'summary') || tag(b, 'title');
      const img = attr(b, 'media:content', 'url') || attr(b, 'media:thumbnail', 'url') || attr(b, 'enclosure', 'url') || (unent(desc).match(/<img[^>]+src=["']([^"']+)/i) || [])[1] || '';
      return { url: link, text: strip(desc), date: strip(tag(b, 'pubDate') || tag(b, 'published') || tag(b, 'updated') || tag(b, 'dc:date')), image: img };
    });
  }
  return items.filter((p) => p.url).map((p) => ({ key: liKey(p.url), url: liUrl(p.url), text: p.text || '', date: p.date ? new Date(p.date).toISOString() : '', image: p.image || '' }));
}

/** Posts → My Works items. */
export const postToItem = (p, uid) => ({ id: uid ? uid() : 'li-' + p.key, kind: 'linkedin', title: firstLine(p.text), date: (p.date || '').slice(0, 10), image: p.image || '', url: p.url, text: p.text || '', tags: [] });
export { firstLine as liTitle };
