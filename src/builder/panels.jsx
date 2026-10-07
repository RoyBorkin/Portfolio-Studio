/*! Portfolio Studio. Copyright (c) 2026 Roy Borkin. All rights reserved. Unauthorized copying, modification or distribution is prohibited without written permission. */
import { useEffect, useRef, useState } from 'react';
import { Field, Text, Area, Select, Toggle, Segmented, Range, Color, Tags, ImagePick, List, Group, Icon } from './fields.jsx';
import { uid, today, driveStatus, socialStatus } from './util.js';
import { CONTACT_TYPES } from '../shared/icons.js';
import { FONT_LIST } from '../shared/fonts.js';
import { elementsFor } from '../shared/elements.js';
import { CURSOR_STYLES } from '../shared/cursor.js';
import { SLOTS, CONTACT_SEL, parseLook } from '../shared/mix.js';
import JSZip from 'jszip';
import { parseCsv, sharesToPosts, parseFeed, postToItem, liKey } from '../shared/linkedin.js';
import { TEMPLATES, SOURCE } from '../site/templates/index.js';

const KIND_OPTS = [{ value: 'project', label: 'Project' }, { value: 'post', label: 'Site post' }, { value: 'instagram', label: 'Instagram post' }, { value: 'linkedin', label: 'LinkedIn post' }];
const KIND_ICON = { project: 'briefcase', post: 'post', instagram: 'instagram', linkedin: 'linkedin' };

/* ───────── Templates ───────── */
export function TemplatesPanel({ api, thumbSrcdoc }) {
  const p = api.p;
  return (
    <div className="pn">
      <p className="pn-lead">Twenty-three designs, three variants each. Every one is a single screen that adapts to phones, tablets and desktops in both orientations. Your content carries over when you switch. To combine designs, say one template’s header with another’s background, open <b>Layout → Mix & match</b>.</p>
      <div className="gal">
        {TEMPLATES.map((t, k) => <TemplateCard key={t.id} t={t} k={k} api={api} active={p.template === t.id} thumbSrcdoc={thumbSrcdoc} />)}
      </div>
    </div>
  );
}
function MixNote({ p }) {
  const parts = SLOTS.filter((x) => p.mix?.[x.id] && p.mix[x.id] !== ((x.id === 'menu' || x.id === 'contacts') ? (p.mix.nav || p.template) : p.template)).map((x) => `${x.label} from ${TNAME(p.mix[x.id])}`);
  return parts.length ? <small className="tc-mix">Mixed: {parts.join(' · ')}</small> : null;
}
function TemplateCard({ t, k, api, active, thumbSrcdoc }) {
  const p = api.p;
  const [hv, setHv] = useState(null);
  const ref = useRef(); const frame = useRef();
  const [vis, setVis] = useState(false);
  const v = hv ?? (active ? p.variant : 0);
  useEffect(() => { const io = new IntersectionObserver(([e]) => e.isIntersecting && setVis(true), { rootMargin: '200px' }); io.observe(ref.current); return () => io.disconnect(); }, []);
  const box = useRef();
  useEffect(() => { const ro = new ResizeObserver(([e]) => box.current && box.current.style.setProperty('--s', e.contentRect.width / 1440)); ro.observe(box.current); return () => ro.disconnect(); }, []);
  const [doc, setDoc] = useState(null);
  useEffect(() => { if (vis && !doc) setDoc(thumbSrcdoc(t.id, v)); }, [vis]); // eslint-disable-line
  useEffect(() => { if (doc && frame.current?.contentWindow) frame.current.contentWindow.postMessage({ type: 'pf:update', data: api.thumbData(t.id, v), assets: api.blobAssets(), opts: { static: true } }, '*'); }, [v]); // eslint-disable-line
  return (
    <article className={'tc' + (active ? ' on' : '')} ref={ref}>
      <button type="button" className="tc-prev" onClick={() => api.setTemplate(t.id, v)} aria-label={`Use ${t.name}, ${t.variants[v].name}`}>
        <span className="tc-frame" ref={box}>{doc && <iframe ref={frame} title={t.name + ' preview'} srcDoc={doc} tabIndex={-1} loading="lazy" />}</span>
        {active && <span className="tc-badge"><Icon n="check" />In use</span>}
      </button>
      <div className="tc-meta">
        <div><b><em>{String(k + 1).padStart(2, '0')}</em>{t.name}</b><p>{t.blurb}</p><small>{SOURCE[t.id]}</small>{active && <MixNote p={p} />}</div>
        <div className="tc-vars" onMouseLeave={() => setHv(null)}>
          {t.variants.map((vv, i) => (
            <button key={i} type="button" className={'vs' + (active && p.variant === i ? ' on' : '')} onMouseEnter={() => setHv(i)} onFocus={() => setHv(i)} onClick={() => api.setTemplate(t.id, i)} title={vv.name} aria-label={`${t.name} — ${vv.name}`}>
              {vv.swatch.map((c, j) => <i key={j} style={{ background: c }} />)}
            </button>
          ))}
        </div>
      </div>
    </article>
  );
}

/* ───────── Profile ───────── */
export function ProfilePanel({ api }) {
  const P = api.p.profile; const s = (k) => (v) => api.set(['profile', k], v);
  return (
    <div className="pn">
      <Group title="Name and roles">
        <div className="row2"><Field label="First name"><Text value={P.firstName} onChange={s('firstName')} /></Field><Field label="Last name"><Text value={P.lastName} onChange={s('lastName')} /></Field></div>
        <Field label="Greeting" hint="Shown above your name in some templates."><Text value={P.intro} onChange={s('intro')} placeholder="Hi, my name is" /></Field>
        <Field label="Main role"><Text value={P.role} onChange={s('role')} /></Field>
        <Field label="All roles" hint="Press Enter after each one. Templates cycle, list or label with them."><Tags value={P.roles} onChange={s('roles')} placeholder="Add a role" /></Field>
        <Field label="One-line pitch"><Area rows={3} value={P.tagline} onChange={s('tagline')} /></Field>
        <div className="row2"><Field label="Location"><Text value={P.location} onChange={s('location')} /></Field><Field label="Right now"><Text value={P.status} onChange={s('status')} placeholder="Open to work" /></Field></div>
        <div className="row2"><Field label="Name in another script" hint="Night City sets it as a vertical sign."><Text value={P.altName} onChange={s('altName')} placeholder="ロイ・ボルキン" /></Field><Field label="Time zone" hint="For the live clock in Liquid Glass."><Text value={P.timezone} onChange={s('timezone')} placeholder="Asia/Jerusalem" /></Field></div>
      </Group>
      <Group title="Images" desc="Uploads are resized in your browser and saved inside the project file.">
        <ImagePick label="Portrait photo" value={P.photo} src={api.img(P.photo)} onChange={s('photo')} onUpload={(f) => api.upload(f).then(s('photo'))} tall />
        <ImagePick label="Cut-out portrait (transparent)" value={P.cutout} src={api.img(P.cutout)} onChange={s('cutout')} onUpload={(f) => api.upload(f, { max: 2000 }).then(s('cutout'))} tall
          extra={<button type="button" className="btn sm ghost" onClick={() => api.removeBg('cutout', P.photo)} title="Cut the background out of your portrait photo, in your browser">Remove background</button>} />
        <p className="note">Most templates stand the cut-out in front of their type and shapes. Use a PNG or WebP with a transparent background, or let “Remove background” make one from the portrait photo.</p>
        <ImagePick label="Illustration / sketch" value={P.sketch} src={api.img(P.sketch)} onChange={s('sketch')} onUpload={(f) => api.upload(f).then(s('sketch'))} />
        <ImagePick label="Logo" value={P.logo} src={api.img(P.logo)} onChange={s('logo')} onUpload={(f) => api.upload(f, { max: 1200 }).then(s('logo'))} />
        <p className="note">A transparent logo works best. Forge extrudes it into a 3D object.</p>
      </Group>
    </div>
  );
}

/* ───────── Sections ───────── */
export function SectionsPanel({ api }) {
  const secs = api.p.sections;
  return (
    <div className="pn">
      <p className="pn-lead">The five screens of your site. Visitors move between them with the menu, the mouse wheel, swiping or the arrow keys. Rename them, reorder them, or switch one off.</p>
      <List items={secs} onChange={(v) => api.set(['sections'], v)} summary={(s) => <><i className={'dot' + (s.enabled !== false ? ' on' : '')} /><b>{s.label}</b><small>{s.enabled !== false ? s.id : 'hidden'}</small></>}
        render={(s, u) => (<>
          <Toggle value={s.enabled !== false} onChange={(v) => u({ enabled: v })} label="Show this section" />
          <div className="row2"><Field label="Menu label"><Text value={s.label} onChange={(v) => u({ label: v })} /></Field><Field label="Heading"><Text value={s.title} onChange={(v) => u({ title: v })} /></Field></div>
          {s.id !== 'home' && <Field label="Subheading"><Area rows={2} value={s.subtitle} onChange={(v) => u({ subtitle: v })} /></Field>}
          <button type="button" className="btn sm ghost" onClick={() => api.goto(s.id)}><Icon n="arrow" />Show in preview</button>
        </>)} addMenu={[]} />
    </div>
  );
}

/* ───────── Works ───────── */
export function WorksPanel({ api }) {
  const W = api.p.works;
  const [bulk, setBulk] = useState('');
  const items = W.items;
  const set = (v) => api.set(['works', 'items'], v);
  const addBulk = () => {
    const links = bulk.split(/\s+/).filter((l) => /^https?:/.test(l));
    if (!links.length) return;
    const made = links.map((u) => ({ id: uid(), kind: /linkedin\.com/.test(u) ? 'linkedin' : 'instagram', title: /linkedin\.com/.test(u) ? 'LinkedIn post' : 'Instagram post', date: today(), image: '', url: u, text: '', tags: [] }));
    set([...items, ...made]); setBulk(''); api.toast(`Added ${made.length} post${made.length > 1 ? 's' : ''}. Set their dates and cover images below.`);
  };
  return (
    <div className="pn">
      <p className="pn-lead">Everything here appears in one feed, newest first. Projects and site posts open in a detail view; Instagram and LinkedIn posts open with the official embed.</p>
      <Group title="Feed items" right={<span className="cnt">{items.length}</span>}>
        <List items={items} onChange={set}
          summary={(it) => <><Icon n={KIND_ICON[it.kind] || 'post'} /><b>{it.title || 'Untitled'}</b><small>{it.date}</small></>}
          render={(it, u) => (<>
            <div className="row2"><Field label="Type"><Select value={it.kind} onChange={(v) => u({ kind: v })} options={KIND_OPTS} /></Field><Field label="Date"><Text type="date" value={it.date} onChange={(v) => u({ date: v })} /></Field></div>
            <Field label="Title"><Text value={it.title} onChange={(v) => u({ title: v })} /></Field>
            <Field label={it.kind === 'linkedin' ? 'Post link or embed code' : it.kind === 'instagram' ? 'Post link' : 'Link (optional)'} status={socialStatus(it.kind, it.url)}
              hint={it.kind === 'project' || it.kind === 'post' ? 'A YouTube link plays inside the detail view.' : ''}>
              {it.kind === 'linkedin' ? <Area rows={2} mono value={it.url} onChange={(v) => u({ url: v })} placeholder="https://www.linkedin.com/posts/… or <iframe …>" /> : <Text value={it.url} onChange={(v) => u({ url: v })} placeholder="https://" />}
            </Field>
            <ImagePick label="Cover image" value={it.image} src={api.img(it.image)} onChange={(v) => u({ image: v })} onUpload={(f) => api.upload(f).then((r) => u({ image: r }))} />
            {(it.kind === 'instagram' || it.kind === 'linkedin') && !it.image && <p className="note">Without a cover image the card shows a colored tile with the caption. Instagram and LinkedIn don’t allow other sites to pull post images, so upload a screenshot for a picture card.</p>}
            <Field label={it.kind === 'project' || it.kind === 'post' ? 'Description' : 'Caption (for the card)'}><Area rows={4} value={it.text} onChange={(v) => u({ text: v })} /></Field>
            {(it.kind === 'project' || it.kind === 'post') && <Field label="Tags"><Tags value={it.tags} onChange={(v) => u({ tags: v })} placeholder="Add a tag" /></Field>}
          </>)}
          addMenu={[
            { label: 'Project', make: () => ({ id: uid(), kind: 'project', title: 'New project', date: today(), image: '', url: '', text: '', tags: [] }) },
            { label: 'Site post', make: () => ({ id: uid(), kind: 'post', title: 'New post', date: today(), image: '', url: '', text: '', tags: [] }) },
            { label: 'Instagram', make: () => ({ id: uid(), kind: 'instagram', title: 'Instagram post', date: today(), image: '', url: '', text: '', tags: [] }) },
            { label: 'LinkedIn', make: () => ({ id: uid(), kind: 'linkedin', title: 'LinkedIn post', date: today(), image: '', url: '', text: '', tags: [] }) },
          ]} />
      </Group>
      <Group title="Add several posts at once" collapsible defaultOpen={false}>
        <Field label="Paste Instagram or LinkedIn post links" hint="One per line or separated by spaces."><Area rows={4} mono value={bulk} onChange={setBulk} placeholder={'https://www.instagram.com/p/…\nhttps://www.linkedin.com/posts/…'} /></Field>
        <button type="button" className="btn sm" onClick={addBulk} disabled={!bulk.trim()}>Add posts</button>
      </Group>
      <InstagramGroup api={api} />
      <LinkedInGroup api={api} />
      <Group title="Display">
        <Toggle value={W.showFilters !== false} onChange={(v) => api.set(['works', 'showFilters'], v)} label="Show filter buttons (All, Project, Instagram…)" />
      </Group>
    </div>
  );
}

/* ───────── Instagram ───────── */
function InstagramGroup({ api }) {
  const IG = api.p.works.instagram || {};
  const set = (k) => (v) => api.set(['works', 'instagram', k], v);
  const [tok, setTok] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);
  const snap = IG.snapshot;
  const fetchNow = async () => {
    setBusy(true); setMsg(null);
    try {
      let feed;
      if (IG.mode === 'feed') {
        if (!IG.feedUrl) throw new Error('Paste the feed URL first.');
        const r = await fetch(IG.feedUrl); if (!r.ok) throw new Error(`The feed answered ${r.status}.`); const j = await r.json();
        const arr = Array.isArray(j) ? j : j.posts || j.data || [];
        feed = { profile: j.username ? { username: j.username, avatar: j.profilePictureUrl, followers: j.followersCount } : null, posts: arr.map((p) => ({ id: p.id, url: p.permalink, image: p.sizes?.medium?.mediaUrl || (p.mediaType === 'VIDEO' ? p.thumbnailUrl : p.mediaUrl) || p.media_url || p.thumbnail_url, text: p.caption || p.prunedCaption || '', date: p.timestamp, type: p.mediaType || p.media_type })) };
      } else {
        const t = (IG.mode === 'token' ? IG.token : tok).trim();
        if (!t) throw new Error('Paste your access token first.');
        const base = 'https://graph.instagram.com', k = encodeURIComponent(t);
        const me = await fetch(`${base}/me?fields=username,name,profile_picture_url,followers_count,media_count&access_token=${k}`).then((r) => r.json());
        if (me.error) throw new Error(me.error.message);
        const md = await fetch(`${base}/me/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp&limit=${IG.limit || 24}&access_token=${k}`).then((r) => r.json());
        if (md.error) throw new Error(md.error.message);
        feed = { profile: { username: me.username, name: me.name, avatar: me.profile_picture_url, followers: me.followers_count, posts: me.media_count }, posts: (md.data || []).map((p) => ({ id: p.id, url: p.permalink, image: p.media_type === 'VIDEO' ? p.thumbnail_url : p.media_url, text: p.caption || '', date: p.timestamp, type: p.media_type })) };
      }
      feed.updated = new Date().toISOString();
      api.set(['works', 'instagram', 'snapshot'], feed);
      if (feed.profile?.username && !IG.username) api.set(['works', 'instagram', 'username'], feed.profile.username);
      setMsg({ ok: true, msg: `Found ${feed.posts.length} posts${feed.profile?.username ? ' from @' + feed.profile.username : ''}. They now show in the preview.` });
    } catch (e) {
      setMsg({ ok: false, msg: /fetch|Failed|NetworkError|CSP|blocked/i.test(e.message) ? 'This page can’t reach Instagram from here. Open the builder file on your computer (Portfolio Studio.html) to test, or just export — your site will fetch on its own.' : e.message });
    } finally { setBusy(false); }
  };
  return (
    <Group title="Instagram profile and automatic posts" desc="Show your Instagram account in My Works and pull in every post automatically. New posts appear on the site by themselves.">
      <Field label="Instagram username" hint="Shows a profile card with a Follow button above your works."><Text value={IG.username} onChange={set('username')} placeholder="royborkin" /></Field>
      <Field label="How posts arrive">
        <Segmented value={IG.mode || 'manual'} onChange={set('mode')} options={[{ value: 'manual', label: 'Manual only' }, { value: 'github', label: 'Automatic' }, { value: 'feed', label: 'Feed service' }, { value: 'token', label: 'Token' }]} />
      </Field>
      {IG.mode === 'github' && (<>
        <div className="steps">
          <p><b>Recommended.</b> Your exported site includes a GitHub workflow that checks Instagram every hour, saves new posts with their images, and republishes the site. Nothing to do after the one-time setup.</p>
          <ol>
            <li>Switch your Instagram to a free professional account (Creator or Business).</li>
            <li>Create a Meta developer app with the Instagram API (Instagram login) and generate a long-lived token.</li>
            <li>In your GitHub repository add the token as the secret <code>IG_TOKEN</code>, and set Pages to deploy from GitHub Actions.</li>
          </ol>
          <p className="note">The exported README walks through every click. The token never goes into your website’s files.</p>
        </div>
        <Field label="Test with your token (optional)" hint="Used only here to fill the preview. It isn’t saved in the project or the site."><Text type="password" value={tok} onChange={setTok} placeholder="IGAA…" /></Field>
      </>)}
      {IG.mode === 'feed' && <Field label="Feed URL" hint="No code needed: connect your Instagram at a feed service such as Behold (free plan), copy the JSON feed URL and paste it here. Works with personal accounts too."><Text value={IG.feedUrl} onChange={set('feedUrl')} placeholder="https://feeds.behold.so/…" /></Field>}
      {IG.mode === 'token' && <Field label="Access token" hint="Simplest, but anyone can read the token in your site’s source, and it expires after 60 days unless renewed. Prefer Automatic."><Text value={IG.token} onChange={set('token')} placeholder="IGAA…" /></Field>}
      {IG.mode && IG.mode !== 'manual' && (<>
        <Field label="Posts to show"><Range value={IG.limit || 24} min={3} max={60} step={1} onChange={set('limit')} /></Field>
        <div className="btns">
          <button type="button" className="btn sm" onClick={fetchNow} disabled={busy}>{busy ? 'Fetching…' : 'Fetch posts now'}</button>
          {snap && <button type="button" className="btn sm ghost" onClick={() => api.set(['works', 'instagram', 'snapshot'], null)}>Clear fetched posts</button>}
        </div>
        {msg && <p className={'f-st ' + (msg.ok ? 'ok' : 'bad')}>{msg.msg}</p>}
        {snap && !msg && <p className="note"><Icon n="check" /> {snap.posts?.length || 0} posts fetched {snap.updated ? new Date(snap.updated).toLocaleString() : ''}. Your live site keeps them up to date on its own.</p>}
      </>)}
    </Group>
  );
}

/* ───────── LinkedIn ───────── */
function LinkedInGroup({ api }) {
  const LI = api.p.works.linkedin || {};
  const set = (k) => (v) => api.set(['works', 'linkedin', k], v);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);
  const [newest, setNewest] = useState(20);
  const fileIn = useRef(null);
  const items = api.p.works.items || [];
  const imported = items.filter((x) => x.kind === 'linkedin' && x.li).length;
  const importFile = async (f) => {
    setBusy(true); setMsg(null);
    try {
      let csv = '';
      if (/\.zip$/i.test(f.name)) {
        const z = await JSZip.loadAsync(f);
        const e = Object.values(z.files).find((x) => /(^|\/)Shares\.csv$/i.test(x.name));
        if (!e) throw new Error('This archive has no Shares.csv. Request the “larger data archive” (it includes posts), or upload Shares.csv directly.');
        csv = await e.async('string');
      } else csv = await f.text();
      const { posts, hidden } = sharesToPosts(parseCsv(csv));
      if (!posts.length) throw new Error(hidden ? `All ${hidden} posts are visible to connections only, and LinkedIn only embeds public posts.` : 'No posts found in this file.');
      const have = new Set(items.filter((x) => x.kind === 'linkedin').map((x) => liKey(x.url)));
      const fresh = posts.filter((p) => !have.has(p.key)).slice(0, newest);
      const add = fresh.map((p) => ({ ...postToItem(p, uid), li: 1 }));
      api.set(['works', 'items'], [...add, ...items.filter((x) => !(x.kind === 'linkedin' && /linkedin\.com\/in\//.test(x.url || '')))]);
      setMsg({ ok: true, msg: `Added ${add.length} LinkedIn post${add.length === 1 ? '' : 's'}${posts.length - fresh.length > 0 ? `, ${Math.min(posts.length - fresh.length, have.size)} already in My Works` : ''}${hidden ? `, skipped ${hidden} connections-only` : ''}. Edit or delete them in the list above.` });
    } catch (e) { setMsg({ ok: false, msg: e.message }); } finally { setBusy(false); }
  };
  const testFeed = async () => {
    setBusy(true); setMsg(null);
    try {
      if (!LI.feedUrl) throw new Error('Paste the feed URL first.');
      const r = await fetch(LI.feedUrl); if (!r.ok) throw new Error(`The feed answered ${r.status}.`);
      const posts = parseFeed(await r.text());
      if (!posts.length) throw new Error('The feed has no posts yet. Check the address, or wait for the service to collect them.');
      api.set(['works', 'linkedin', 'snapshot'], { updated: new Date().toISOString(), posts });
      setMsg({ ok: true, msg: `Found ${posts.length} posts. They now show in the preview.` });
    } catch (e) { setMsg({ ok: false, msg: /fetch|Failed|NetworkError|CSP|blocked/i.test(e.message) ? 'This page can’t reach the feed from here (the service blocks browsers). Your live site doesn’t need this: GitHub reads the feed directly.' : e.message }); } finally { setBusy(false); }
  };
  return (
    <Group title="LinkedIn posts" desc="LinkedIn doesn’t let anyone read their own posts through its API, so there are two ways in: import them from LinkedIn’s data export, or keep them updated through a feed.">
      <p className="sub">Import from LinkedIn (free, official)</p>
      <ol className="steps-l">
        <li>On LinkedIn: <b>Me → Settings &amp; Privacy → Data privacy → Get a copy of your data</b>.</li>
        <li>Pick <b>Download larger data archive</b> → <b>Request archive</b>. LinkedIn emails a link, usually within a day.</li>
        <li>Upload the ZIP (or the <code>Shares.csv</code> inside it) here.</li>
      </ol>
      <Field label="Import the newest"><Range value={newest} min={1} max={100} step={1} onChange={setNewest} suffix=" posts" /></Field>
      <div className="btns">
        <button type="button" className="btn sm" onClick={() => fileIn.current?.click()} disabled={busy}><Icon n="linkedin" />{busy ? 'Reading…' : 'Upload LinkedIn export'}</button>
        {imported > 0 && <button type="button" className="btn sm ghost" onClick={() => api.set(['works', 'items'], items.filter((x) => !(x.kind === 'linkedin' && x.li)))}>Remove {imported} imported</button>}
      </div>
      <input ref={fileIn} type="file" accept=".zip,.csv,application/zip,text/csv" hidden onChange={(e) => { const f = e.target.files?.[0]; if (f) importFile(f); e.target.value = ''; }} />
      <p className="sub">Automatic updates</p>
      <Field label="New posts"><Segmented value={LI.mode || 'manual'} onChange={set('mode')} options={[{ value: 'manual', label: 'Import and links only' }, { value: 'github', label: 'Automatic (feed)' }]} /></Field>
      {LI.mode === 'github' && (<>
        <div className="steps">
          <p>Your exported site checks a feed of your LinkedIn activity every hour and adds new posts by itself, using the same GitHub workflow as Instagram.</p>
          <ol>
            <li>Make a feed of your profile at a feed service such as <b>rss.app</b> (free plan) from <code>linkedin.com/in/you/recent-activity/all/</code>.</li>
            <li>Paste the RSS or JSON feed URL below, export, and upload the site to GitHub.</li>
            <li>Set Pages to deploy from GitHub Actions and run <b>Publish site</b> once.</li>
          </ol>
        </div>
        <Field label="Feed URL" hint="RSS, Atom or JSON. Stored in the site’s workflow, not shown on the page."><Text value={LI.feedUrl} onChange={set('feedUrl')} placeholder="https://rss.app/feeds/….xml" /></Field>
        <Field label="Posts to keep"><Range value={LI.limit || 24} min={3} max={100} step={1} onChange={set('limit')} /></Field>
        <div className="btns">
          <button type="button" className="btn sm" onClick={testFeed} disabled={busy}>{busy ? 'Checking…' : 'Test the feed'}</button>
          {LI.snapshot && <button type="button" className="btn sm ghost" onClick={() => api.set(['works', 'linkedin', 'snapshot'], null)}>Clear fetched posts</button>}
        </div>
      </>)}
      {msg && <p className={'f-st ' + (msg.ok ? 'ok' : 'bad')}>{msg.msg}</p>}
    </Group>
  );
}

/* ───────── SandBox ───────── */
export function SandboxPanel({ api }) {
  const G = api.p.sandbox.github, A = api.p.sandbox.apps;
  const g = (k) => (v) => api.set(['sandbox', 'github', k], v);
  return (
    <div className="pn">
      <Group title="GitHub projects" desc="Your public repositories load live from GitHub every time someone visits, so new projects show up on their own.">
        <Field label="GitHub username" hint="Leave empty to hide the GitHub tab."><Text value={G.user} onChange={g('user')} placeholder="octocat" /></Field>
        <Field label="Pin to the front" hint="Repository names, in order."><Tags value={G.pinned} onChange={g('pinned')} placeholder="repo-name" /></Field>
        <Field label="Hide"><Tags value={G.hide} onChange={g('hide')} placeholder="repo-name" /></Field>
        <div className="row2"><Field label="Show at most"><Range value={G.limit || 24} min={4} max={60} step={1} onChange={g('limit')} /></Field><Field label=" "><Toggle value={G.includeForks} onChange={g('includeForks')} label="Include forks" /></Field></div>
      </Group>
      <Group title="Web apps library" right={<span className="cnt">{A.length}</span>} desc="Small apps visitors can open and use inside your site. Link one that’s hosted somewhere, or upload a single self-contained HTML file and it ships with your export.">
        <List items={A} onChange={(v) => api.set(['sandbox', 'apps'], v)}
          summary={(a) => <><Icon n="app" /><b>{a.title}</b><small>{a.url || a.html ? 'live' : 'soon'}</small></>}
          render={(a, u) => (<>
            <Field label="Name"><Text value={a.title} onChange={(v) => u({ title: v })} /></Field>
            <Field label="What it does"><Area rows={2} value={a.text} onChange={(v) => u({ text: v })} /></Field>
            <div className="row2"><Field label="Date"><Text type="date" value={a.date} onChange={(v) => u({ date: v })} /></Field><Field label="Source"><Segmented value={a.html ? 'file' : 'url'} onChange={(v) => u(v === 'url' ? { html: '' } : {})} options={[{ value: 'url', label: 'Link' }, { value: 'file', label: 'HTML file' }]} /></Field></div>
            {!a.html ? <Field label="App URL" hint="Leave empty to show it as “coming soon”."><Text value={a.url} onChange={(v) => u({ url: v })} placeholder="https://…" /></Field>
              : <p className="note"><Icon n="check" /> {api.p.assets[a.html.slice(2)]?.name || 'HTML file'} is bundled with the site.</p>}
            <label className="btn sm ghost file"><Icon n="download" />{a.html ? 'Replace HTML file' : 'Upload an HTML file'}<input type="file" accept=".html,.htm,text/html" hidden onChange={(e) => { const f = e.target.files?.[0]; if (f) api.uploadHtml(f).then((r) => u({ html: r, url: '' })); e.target.value = ''; }} /></label>
            <ImagePick label="Thumbnail" value={a.image} src={api.img(a.image)} onChange={(v) => u({ image: v })} onUpload={(f) => api.upload(f).then((r) => u({ image: r }))} />
          </>)} newItem={() => ({ id: uid(), title: 'New web app', text: '', url: '', html: '', image: '', date: today() })} addLabel="Add web app" />
      </Group>
    </div>
  );
}

/* ───────── About ───────── */
export function AboutPanel({ api }) {
  const A = api.p.about;
  const s = (k) => (v) => api.set(['about', k], v);
  return (
    <div className="pn">
      <Group title="Profile">
        <ImagePick label="About photo" value={A.photo} src={api.img(A.photo)} onChange={s('photo')} onUpload={(f) => api.upload(f).then(s('photo'))} />
        <Field label="Bio" hint="Long bios get a “Read more” button so the screen never scrolls."><Area rows={7} value={A.bio} onChange={s('bio')} /></Field>
        <Field label="Resume (Google Drive link)" status={driveStatus(A.resume?.url)} hint="Share the PDF as “Anyone with the link can view”."><Text value={A.resume?.url} onChange={(v) => api.set(['about', 'resume', 'url'], v)} placeholder="https://drive.google.com/file/d/…/view" /></Field>
        <Field label="Resume button label"><Text value={A.resume?.label} onChange={(v) => api.set(['about', 'resume', 'label'], v)} /></Field>
      </Group>
      <Group title="Numbers" collapsible>
        <List items={A.stats} onChange={s('stats')} summary={(x) => <><b>{x.value}</b><small>{x.label}</small></>}
          render={(x, u) => <div className="row2"><Field label="Number"><Text value={x.value} onChange={(v) => u({ value: v })} /></Field><Field label="Label"><Text value={x.label} onChange={(v) => u({ label: v })} /></Field></div>}
          newItem={() => ({ value: '1', label: 'New stat' })} addLabel="Add number" />
      </Group>
      <Group title="Experience" collapsible right={<span className="cnt">{A.experience.length}</span>}>
        <List items={A.experience} onChange={s('experience')} summary={(x) => <><b>{x.title}</b><small>{x.years}</small></>}
          render={(x, u) => (<>
            <Field label="Role"><Text value={x.title} onChange={(v) => u({ title: v })} /></Field>
            <div className="row2"><Field label="Organization"><Text value={x.org} onChange={(v) => u({ org: v })} /></Field><Field label="Place"><Text value={x.place} onChange={(v) => u({ place: v })} /></Field></div>
            <Field label="Years"><Text value={x.years} onChange={(v) => u({ years: v })} placeholder="2022 – 2024" /></Field>
            <Field label="Description"><Area rows={3} value={x.text} onChange={(v) => u({ text: v })} /></Field>
          </>)} newItem={() => ({ id: uid(), title: 'New role', org: '', place: '', years: '', text: '' })} addLabel="Add role" />
      </Group>
      <Group title="Education" collapsible defaultOpen={false} right={<span className="cnt">{A.education.length}</span>}>
        <List items={A.education} onChange={s('education')} summary={(x) => <><b>{x.title}</b><small>{x.years}</small></>}
          render={(x, u) => (<>
            <Field label="Degree or course"><Text value={x.title} onChange={(v) => u({ title: v })} /></Field>
            <div className="row2"><Field label="School, place"><Text value={x.place} onChange={(v) => u({ place: v })} /></Field><Field label="Years"><Text value={x.years} onChange={(v) => u({ years: v })} /></Field></div>
          </>)} newItem={() => ({ id: uid(), title: 'New course', place: '', years: '' })} addLabel="Add education" />
      </Group>
      <Group title="Skills" collapsible defaultOpen={false}>
        <List items={A.skills} onChange={s('skills')} summary={(x) => <><b>{x.group}</b></>}
          render={(x, u) => (<>
            <Field label="Group"><Text value={x.group} onChange={(v) => u({ group: v })} /></Field>
            <Field label="Skills" hint="Separate with commas."><Area rows={3} value={x.items} onChange={(v) => u({ items: v })} /></Field>
          </>)} newItem={() => ({ id: uid(), group: 'New group', items: '' })} addLabel="Add skill group" />
      </Group>
    </div>
  );
}

/* ───────── Portfolio ───────── */
export function PortfolioPanel({ api }) {
  const items = api.p.portfolio.items;
  return (
    <div className="pn">
      <p className="pn-lead">Each portfolio opens in a Google Drive viewer on your site. Upload the PDF to Drive, choose Share → “Anyone with the link” → Viewer, and paste the link.</p>
      <List items={items} onChange={(v) => api.set(['portfolio', 'items'], v)} summary={(x) => <><Icon n="file" /><b>{x.title}</b><small>{x.url ? 'linked' : 'no link yet'}</small></>}
        render={(x, u) => (<>
          <Field label="Title"><Text value={x.title} onChange={(v) => u({ title: v })} /></Field>
          <Field label="Short description"><Area rows={2} value={x.text} onChange={(v) => u({ text: v })} /></Field>
          <Field label="Google Drive link" status={driveStatus(x.url)}><Text value={x.url} onChange={(v) => u({ url: v })} placeholder="https://drive.google.com/file/d/…/view" /></Field>
          <ImagePick label="Cover image" value={x.image} src={api.img(x.image)} onChange={(v) => u({ image: v })} onUpload={(f) => api.upload(f).then((r) => u({ image: r }))} />
        </>)} newItem={() => ({ id: uid(), title: 'New portfolio', text: '', url: '', image: '' })} addLabel="Add portfolio" />
    </div>
  );
}

/* ───────── Contacts ───────── */
export function ContactsPanel({ api }) {
  const C = api.p.contacts;
  const types = Object.entries(CONTACT_TYPES).map(([value, t]) => ({ value, label: t.label }));
  return (
    <div className="pn">
      <p className="pn-lead">Contact links appear on every screen of every template, plus in a contact sheet with copy buttons. Turn off any you don’t want shown.</p>
      <List items={C} onChange={(v) => api.set(['contacts'], v)}
        summary={(c) => <><Icon n={(CONTACT_TYPES[c.type] || CONTACT_TYPES.custom).icon} /><b>{c.label || c.type}</b><small className={c.show === false ? 'off' : ''}>{c.show === false ? 'hidden' : c.value}</small></>}
        render={(c, u) => (<>
          <div className="row2"><Field label="Service"><Select value={c.type} onChange={(v) => u({ type: v, label: c.label === (CONTACT_TYPES[c.type] || {}).label || !c.label ? CONTACT_TYPES[v].label : c.label })} options={types} /></Field><Field label="Label"><Text value={c.label} onChange={(v) => u({ label: v })} /></Field></div>
          <Field label={c.type === 'email' ? 'Email address' : c.type === 'phone' ? 'Phone number (with country code)' : c.type === 'whatsapp' ? 'Number or wa.me link' : c.type === 'location' ? 'City or address' : 'Link'}><Text value={c.value} onChange={(v) => u({ value: v })} /></Field>
          <Toggle value={c.show !== false} onChange={(v) => u({ show: v })} label="Show on the site" />
        </>)} newItem={() => ({ id: uid(), type: 'website', label: 'Website', value: '', show: true })} addLabel="Add contact" />
    </div>
  );
}

/* ───────── Design ───────── */
const VARS = [['bg', 'Background'], ['surface', 'Cards & panels'], ['fg', 'Text'], ['muted', 'Secondary text'], ['accent', 'Accent'], ['accent2', 'Second accent'], ['line', 'Lines & borders']];
export function DesignPanel({ api }) {
  const p = api.p, T = p.theme, def = TEMPLATES.find((t) => t.id === p.template), V = def.variants[p.variant] || def.variants[0];
  const th = (k) => (v) => api.set(['theme', k], v);
  const fontOpts = (role) => [{ value: '', label: `Template default (${(V.fonts?.[role] || '').split(':')[0] || 'system'})` }, ...FONT_LIST[role].map((f) => ({ value: f + ':300;400;500;600;700;800', label: f }))];
  const curFont = (k) => { const v = T[k]; if (!v) return ''; const n = v.split(':')[0]; return FONT_LIST[{ fontDisplay: 'display', fontBody: 'body', fontMono: 'mono' }[k]].includes(n) ? n + ':300;400;500;600;700;800' : v; };
  const overridden = Object.values(T.overrides || {}).some(Boolean);
  return (
    <div className="pn">
      <Group title={`${def.name} — variant`}>
        <div className="vrow">{def.variants.map((vv, i) => (
          <button key={i} type="button" className={'vcard' + (p.variant === i ? ' on' : '')} onClick={() => api.setTemplate(def.id, i)}>
            <span>{vv.swatch.map((c, j) => <i key={j} style={{ background: c }} />)}</span><b>{vv.name}</b>
          </button>))}
        </div>
      </Group>
      <Group title="Colors" right={overridden && <button type="button" className="btn sm ghost" onClick={() => api.set(['theme', 'overrides'], {})}>Reset all</button>}>
        {VARS.map(([k, label]) => (
          <Field key={k} label={label}><Color value={T.overrides?.[k]} fallback={V.vars?.[k]} onChange={(v) => api.set(['theme', 'overrides', k], v)} onReset={() => api.set(['theme', 'overrides', k], '')} /></Field>
        ))}
      </Group>
      <Group title="Type">
        <Field label="Headings"><Select value={curFont('fontDisplay')} onChange={th('fontDisplay')} options={fontOpts('display')} /></Field>
        <Field label="Body text"><Select value={curFont('fontBody')} onChange={th('fontBody')} options={fontOpts('body')} /></Field>
        <Field label="Labels & code"><Select value={curFont('fontMono')} onChange={th('fontMono')} options={fontOpts('mono')} /></Field>
        <Field label="Any Google Font" hint="Type an exact family name to use it for headings, e.g. “Rubik Mono One”."><Text value={T.fontDisplay && !FONT_LIST.display.includes(T.fontDisplay.split(':')[0]) ? T.fontDisplay.split(':')[0] : ''} onChange={(v) => api.set(['theme', 'fontDisplay'], v ? v + ':400;700' : '')} placeholder="Family name" /></Field>
        <Field label="Text size"><Range value={T.scale || 1} min={0.8} max={1.3} step={0.02} onChange={th('scale')} suffix="×" /></Field>
        <Field label="Corner radius" hint="Leave at the far left for the template’s own radius."><Range value={T.radius ?? -1} min={-1} max={40} step={1} onChange={(v) => api.set(['theme', 'radius'], v < 0 ? null : v)} suffix={T.radius == null ? ' (auto)' : 'px'} /></Field>
      </Group>
      <Group title="Motion & effects">
        <Field label="Motion"><Segmented value={T.motion || 'full'} onChange={th('motion')} options={[{ value: 'full', label: 'Full' }, { value: 'calm', label: 'Calm' }, { value: 'off', label: 'Off' }]} /></Field>
        <Toggle value={T.grain !== false} onChange={th('grain')} label="Film grain texture" />
        <Toggle value={T.effects3d !== false} onChange={th('effects3d')} label="3D and pointer effects" />
        <p className="note">Visitors who ask their device for reduced motion always get a calm version.</p>
      </Group>
      <TextFxGroup api={api} />
      <CursorGroup api={api} def={def} />
      <Group title="Custom CSS" collapsible defaultOpen={false} desc="Added after the template’s styles. The root element is .pf; sections are .pf-sec-home, .pf-sec-works and so on.">
        <Area rows={8} mono value={T.customCss} onChange={th('customCss')} placeholder={'.pf-head-t { letter-spacing: .02em; }'} />
      </Group>
    </div>
  );
}

/* ───────── Cursor ───────── */
const CUR_ART = {
  template: <><circle cx="20" cy="20" r="9" fill="none" stroke="currentColor" strokeDasharray="2 3" /><text x="20" y="24" textAnchor="middle" fontSize="11" fill="currentColor">T</text></>,
  system: <path d="M14 9l0 20 5-5 4 9 3-1.4-4-8.6 7 0z" fill="currentColor" />,
  dot: <circle cx="20" cy="20" r="4" fill="var(--acc)" />,
  ring: <circle cx="20" cy="20" r="10" fill="none" stroke="var(--acc)" strokeWidth="1.5" />,
  dotring: <><circle cx="16" cy="16" r="3" fill="var(--acc)" /><circle cx="22" cy="22" r="10" fill="none" stroke="var(--acc)" strokeWidth="1.5" /></>,
  blend: <><rect x="0" y="0" width="20" height="40" fill="currentColor" opacity=".9" /><circle cx="20" cy="20" r="10" fill="#fff" style={{ mixBlendMode: 'difference' }} /></>,
  bubble: <><circle cx="21" cy="21" r="13" fill="var(--acc)" /><text x="21" y="24.5" textAnchor="middle" fontSize="8" fontWeight="700" fill="#111">View</text></>,
  pill: <><path d="M8 6l0 13 3.5-3.4 2.6 5.8 2-1-2.6-5.6 4.6 0z" fill="currentColor" /><rect x="15" y="22" width="22" height="11" rx="5.5" fill="var(--acc)" /><text x="26" y="30" textAnchor="middle" fontSize="7" fontWeight="700" fill="#111">Email</text></>,
  brackets: <><path d="M9 14V9h5M31 14V9h-5M9 26v5h5M31 26v5h-5" fill="none" stroke="var(--acc)" strokeWidth="1.6" /><rect x="17" y="18" width="6" height="4" rx="1" fill="currentColor" opacity=".5" /></>,
  crosshair: <><path d="M20 2v36M2 20h36" stroke="var(--acc)" strokeWidth="1" opacity=".7" /><circle cx="20" cy="20" r="2.4" fill="var(--acc)" /></>,
  glow: <><defs><radialGradient id="cg"><stop offset="0" stopColor="var(--acc)" stopOpacity=".9" /><stop offset="1" stopColor="var(--acc)" stopOpacity="0" /></radialGradient></defs><circle cx="20" cy="20" r="17" fill="url(#cg)" /><circle cx="20" cy="20" r="2.5" fill="currentColor" /></>,
  trail: <><path d="M4 33C10 30 14 22 20 20s10-8 14-12" fill="none" stroke="var(--acc)" strokeWidth="4" strokeLinecap="round" opacity=".35" /><path d="M14 25C17 22 20 21 24 18s7-6 10-10" fill="none" stroke="var(--acc)" strokeWidth="3" strokeLinecap="round" /><circle cx="34" cy="8" r="3" fill="var(--acc)" /></>,
  image: <><rect x="9" y="9" width="22" height="22" rx="5" fill="none" stroke="currentColor" strokeWidth="1.5" /><circle cx="16" cy="16" r="2.5" fill="var(--acc)" /><path d="M11 29l7-8 5 5 3-3 4 6" fill="none" stroke="var(--acc)" strokeWidth="1.5" /></>,
};
const TFX = [
  ['template', 'Template default', 'Whatever this design does.'],
  ['none', 'No animation', 'Text is simply there.'],
  ['fade', 'Fade', 'Fades in.'],
  ['rise', 'Rise', 'Slides up while fading in.'],
  ['blur', 'Blur in', 'Comes into focus.'],
  ['zoom', 'Zoom', 'Grows in from slightly smaller.'],
  ['words', 'Words', 'Each word rises out of a mask.'],
  ['letters', 'Letters', 'Letter by letter, with a little tilt.'],
  ['wave', 'Wave', 'Letters bounce up one after another.'],
  ['scramble', 'Decode', 'Random characters settle into the text.'],
  ['typewriter', 'Typewriter', 'Typed out with a blinking caret.'],
];
function TextFxGroup({ api }) {
  const T = { on: true, name: 'template', heads: 'template', body: 'template', speed: 1, stagger: 1, replay: 'always', ...(api.p.textfx || {}) };
  const set = (k) => (v) => api.set(['textfx', k], v);
  const opts = TFX.map(([value, label]) => ({ value, label }));
  const note = (k) => TFX.find((x) => x[0] === T[k])?.[2];
  const uses = ['name', 'heads', 'body'].some((k) => !['template', 'none'].includes(T[k]));
  const reset = () => api.set(['textfx'], { on: true, name: 'template', heads: 'template', body: 'template', speed: 1, stagger: 1, replay: 'always' });
  const play = () => setTimeout(api.replayText, 60);
  return (
    <Group title="Text animation" desc="How text appears when a section opens. Visitors who ask their device for reduced motion, and Motion: Off above, always get still text.">
      <Toggle value={T.on !== false} onChange={(v) => { set('on')(v); play(); }} label="Animate text" />
      {T.on !== false && (<>
        {[['name', 'Your name (main screen)'], ['heads', 'Section titles'], ['body', 'Smaller text (pitch, subtitles)']].map(([k, label]) => (
          <Field key={k} label={label} hint={note(k)}><Select value={T[k]} onChange={(v) => { set(k)(v); play(); }} options={opts} /></Field>
        ))}
        {uses && (<>
          <Field label="Speed" hint="Right is faster."><Range value={T.speed} min={0.4} max={2.5} step={0.05} onChange={set('speed')} suffix="×" /></Field>
          <Field label="Delay between letters / words" hint="For Words, Letters, Wave, Decode and Typewriter."><Range value={T.stagger} min={0.2} max={3} step={0.05} onChange={set('stagger')} suffix="×" /></Field>
          <Field label="Play"><Segmented value={T.replay} onChange={set('replay')} options={[{ value: 'always', label: 'Every time a section opens' }, { value: 'once', label: 'First time only' }]} /></Field>
        </>)}
      </>)}
      <div className="btns">
        <button type="button" className="btn sm" onClick={api.replayText}><Icon n="play" />Play in the preview</button>
        {(T.on === false || ['name', 'heads', 'body'].some((k) => T[k] !== 'template') || T.speed !== 1 || T.stagger !== 1 || T.replay !== 'always') && <button type="button" className="btn sm ghost" onClick={reset}>Reset</button>}
      </div>
    </Group>
  );
}
function CursorGroup({ api, def }) {
  const C = { ...(api.p.cursor || {}) };
  const set = (k) => (v) => api.set(['cursor', k], v);
  const tdef = typeof def.cursor === 'string' ? def.cursor : def.cursor === false ? 'system' : 'dotring';
  let style = C.style || 'template';
  if (api.p.theme?.cursor === false && style === 'template') style = 'system';
  const eff = style === 'template' ? tdef : style;
  const st = CURSOR_STYLES.find((x) => x.id === style) || CURSOR_STYLES[0];
  const tLabel = CURSOR_STYLES.find((x) => x.id === tdef)?.label;
  const pick = (id) => { api.set(['cursor', 'style'], id); if (api.p.theme?.cursor === false && id !== 'system') api.set(['theme', 'cursor'], true); };
  const mag = C.magnetic == null || C.magnetic < 0 ? (def.magnetic ?? 0) : C.magnetic;
  return (
    <Group title="Cursor" desc="Mouse and trackpad only. Touch screens always use taps. Move over the preview to try it.">
      <div className="curgrid" role="radiogroup" aria-label="Cursor style">
        {CURSOR_STYLES.map((x) => (
          <button key={x.id} type="button" role="radio" aria-checked={style === x.id} className={'curc' + (style === x.id ? ' on' : '')} onClick={() => pick(x.id)} title={x.note}>
            <svg viewBox="0 0 40 40" aria-hidden="true">{CUR_ART[x.id]}</svg><span>{x.id === 'template' ? `Template (${tLabel})` : x.label}</span>
          </button>
        ))}
      </div>
      <p className="note">{st.id === 'template' ? `${def.name} uses “${tLabel}”.` : st.note}</p>
      {eff === 'image' && <ImagePick label="Cursor image" value={C.image} src={api.img(C.image)} onChange={set('image')} onUpload={(f) => api.upload(f).then(set('image'))} />}
      {eff !== 'system' && (<>
        <div className="row2">
          <Field label="Size"><Range value={C.size ?? 1} min={0.5} max={2.5} step={0.05} onChange={set('size')} suffix="×" /></Field>
          <Field label="Color" hint="Empty uses the template accent."><Color value={C.color} fallback="" onChange={set('color')} onReset={() => set('color')('')} /></Field>
        </div>
        <Field label="Follow" hint="Left is glued to the pointer, right floats behind it."><Range value={C.follow ?? 0.45} min={0} max={1} step={0.05} onChange={set('follow')} /></Field>
        <Toggle value={C.grow !== false} onChange={set('grow')} label="Grow over links and buttons" />
        <Toggle value={C.labels !== false} onChange={set('labels')} label="Show a label over cards" />
        {C.labels !== false && <Field label="Card label"><Text value={C.label ?? 'View'} onChange={set('label')} placeholder="View" /></Field>}
        <Toggle value={C.click !== false} onChange={set('click')} label="Ripple on click" />
        {eff !== 'image' && <Toggle value={!!C.hideNative} onChange={set('hideNative')} label="Hide the normal pointer" />}
        <Field label="Cursor snaps to buttons" hint="The cursor is pulled toward the nearest button, link or icon, then lets go as you move away. Left is off."><Range value={C.snap || 0} min={0} max={1} step={0.05} onChange={set('snap')} suffix={C.snap ? '' : ' (off)'} /></Field>
        {C.snap > 0 && (<>
          <Field label="Snap reach" hint="How close the pointer has to be before the pull starts. 0 = only while it is over the element."><Range value={C.snapReach ?? 40} min={0} max={150} step={5} onChange={set('snapReach')} suffix=" px" /></Field>
          {!C.hideNative && eff !== 'image' && <p className="note">The normal pointer can’t be moved by a website, only the drawn cursor. For the full effect, turn on <b>Hide the normal pointer</b>. <button type="button" className="btn sm ghost" onClick={() => set('hideNative')(true)}>Hide it</button></p>}
        </>)}
      </>)}
      <Field label="Magnetic buttons" hint="The other way round: buttons, menu items and icons lean toward the pointer, then spring back. Both can be on together."><Range value={mag} min={0} max={1} step={0.05} onChange={set('magnetic')} suffix={mag ? '' : ' (off)'} /></Field>
      {(C.style !== 'template' || C.size !== 1 || C.color || (C.magnetic ?? -1) >= 0 || C.snap > 0 || C.follow !== 0.45) && <button type="button" className="btn sm ghost" onClick={() => api.set(['cursor'], { style: 'template', size: 1, color: '', follow: 0.45, grow: true, labels: true, label: 'View', click: true, magnetic: -1, snap: 0, snapReach: 40, hideNative: false, image: '' })}>Reset cursor</button>}
    </Group>
  );
}

/* ───────── Project ───────── */
export function ProjectPanel({ api }) {
  const S = api.p.site;
  const s = (k) => (v) => api.set(['site', k], v);
  return (
    <div className="pn">
      <Group title="Project">
        <Field label="Project name"><Text value={api.p.name} onChange={(v) => api.set(['name'], v)} /></Field>
        <div className="btns">
          <button type="button" className="btn" onClick={api.save}><Icon n="download" />Save project file</button>
          <button type="button" className="btn ghost" onClick={api.open}><Icon n="folder" />Open project…</button>
        </div>
        <p className="note">The project file holds everything, images included. Open it on any computer to continue where you left off. Your work is also kept in this browser automatically.</p>
      </Group>
      <Group title="Website details">
        <Field label="Browser tab title"><Text value={S.title} onChange={s('title')} /></Field>
        <Field label="Description for search and link previews"><Area rows={3} value={S.description} onChange={s('description')} /></Field>
        <Field label="Address where it will live" hint="Used for link previews, e.g. https://royborkin.github.io/"><Text value={S.url} onChange={s('url')} placeholder="https://" /></Field>
        <div className="row2"><Field label="Language code"><Text value={S.lang} onChange={s('lang')} placeholder="en" /></Field><Field label="Text direction"><Segmented value={S.dir || 'ltr'} onChange={s('dir')} options={[{ value: 'ltr', label: 'Left → right' }, { value: 'rtl', label: 'Right → left' }]} /></Field></div>
        <Toggle value={S.showCopyright !== false} onChange={s('showCopyright')} label="Show a copyright line (end of About, and the phone menu)" />
        {S.showCopyright !== false && <Field label="Copyright text" hint="Leave empty for “© {year} {name}. All rights reserved.” You can use {year} and {name}. The site’s code also carries your name as its owner."><Text value={S.copyright} onChange={s('copyright')} placeholder={`© {year} ${[api.p.profile.firstName, api.p.profile.lastName].filter(Boolean).join(' ')}. All rights reserved.`} /></Field>}
      </Group>
      <Group title="Export">
        <button type="button" className="btn primary" onClick={api.exportZip}><Icon n="download" />Export website (.zip)</button>
        <p className="note">The ZIP is a finished website: index.html, styles, scripts, images, your web apps, your content as JSON, a README with publishing steps for GitHub Pages, and a copy of this project.</p>
      </Group>
      <Group title="Start over" collapsible defaultOpen={false}>
        <div className="btns">
          <Confirm label="Reset to sample content" ask="Click again to replace everything" onConfirm={api.resetSample} />
          <Confirm label="Start from a blank project" ask="Click again to clear everything" onConfirm={api.resetBlank} />
        </div>
        <p className="note">Save your project file first if you want to keep it. Undo also brings it back.</p>
      </Group>
      <p className="copy">Portfolio Studio · version {__BUILD__} · © 2026 Roy Borkin. All rights reserved.</p>
    </div>
  );
}

function Confirm({ label, ask, onConfirm }) {
  const [armed, setArmed] = useState(false);
  useEffect(() => { if (!armed) return; const t = setTimeout(() => setArmed(false), 4000); return () => clearTimeout(t); }, [armed]);
  return <button type="button" className={'btn ' + (armed ? 'danger' : 'ghost')} onClick={() => { if (armed) { setArmed(false); onConfirm(); } else setArmed(true); }}>{armed ? ask : label}</button>;
}

/* ───────── Layout ───────── */
const TRANS = [['default', 'Template default'], ['fade', 'Fade'], ['slideY', 'Slide up'], ['slideX', 'Slide sideways'], ['push', 'Push'], ['depth', 'Depth'], ['zoom', 'Zoom'], ['curtain', 'Curtain'], ['circle', 'Circle reveal'], ['split', 'Split open'], ['wipe', 'Color wipe'], ['shutter', 'Shutters'], ['glitch', 'Glitch'], ['flip', 'Flip'], ['blur', 'Blur'], ['none', 'Cut (no animation)']];
const TNAME = (id) => TEMPLATES.find((t) => t.id === id)?.name || id;
const EMPTY_MIX = { bg: '', nav: '', menu: '', contacts: '', hero: '', sections: '' };
function MixGroup({ api }) {
  const p = api.p, M = p.mix || {};
  const base = TEMPLATES.find((t) => t.id === p.template) || TEMPLATES[0];
  const curOf = (k) => (M[k] && M[k] !== p.template && TEMPLATES.some((t) => t.id === M[k]) ? M[k] : '');
  const any = SLOTS.some((x) => curOf(x.id));
  const [open, setOpen] = useState(null);
  const lookOf = (k) => { const lk = parseLook(M.look?.[k], M[k] || null); return lk ? `${lk.id}:${lk.v}` : ''; };
  const borrowed = SLOTS.filter((x) => (x.id === 'menu' || x.id === 'contacts') ? M[x.id] && M[x.id] !== (curOf('nav') || p.template) : curOf(x.id));
  const setAllLooks = (own) => api.set(['mix', 'look'], Object.fromEntries(borrowed.map((x) => {
    const T = TEMPLATES.find((t) => t.id === M[x.id]);
    const keep = lookOf(x.id);
    return [x.id, own ? (keep !== '' ? keep : `${T.id}:${matchVariant(T, base, p.variant)}`) : ''];
  })));
  const surprise = () => {
    const pool = TEMPLATES.filter((t) => t.id !== p.template);
    const r = () => pool[Math.floor(Math.random() * pool.length)].id;
    const m = Object.fromEntries(SLOTS.map((x) => [x.id, Math.random() < 0.7 ? r() : '']));
    if (m.contacts && !CONTACT_SEL[m.contacts]) m.contacts = '';
    if (!Object.values(m).some(Boolean)) m.bg = r();
    api.set(['mix'], m);
  };
  return (
    <Group title="Mix & match" desc={`Build the page from parts of different designs. A borrowed part follows your Design settings (${base.name}’s colors and fonts, or your own changes) unless you give it its own look below.`}>
      {SLOTS.map((x) => {
        const sub = x.id === 'menu' || x.id === 'contacts';
        const def = sub ? (curOf('nav') || p.template) : p.template;
        const cur = sub ? (M[x.id] && M[x.id] !== def && TEMPLATES.some((t) => t.id === M[x.id]) ? M[x.id] : '') : curOf(x.id), shown = cur || def;
        const tag = sub ? 'with header' : 'base';
        const opts = x.id === 'contacts' ? TEMPLATES.filter((t) => CONTACT_SEL[t.id] || t.id === def) : TEMPLATES;
        return (
          <div key={x.id} className={'mix' + (open === x.id ? ' open' : '')}>
            <button type="button" className="mix-h" onClick={() => setOpen(open === x.id ? null : x.id)} aria-expanded={open === x.id}>
              <span className="mix-l"><b>{x.label}</b><small>{x.note}</small></span>
              <span className={'mix-v' + (cur ? ' on' : '')}><i style={{ background: swatchBg(TEMPLATES.find((t) => t.id === shown)) }} />{TNAME(shown)}{!cur && <em>{tag}</em>}{lookOf(x.id) !== '' && <em>{TNAME(lookOf(x.id).split(':')[0])} look</em>}</span>
            </button>
            <LookPick own={shown} part={x.id} pageBg={p.theme?.overrides?.bg || base.variants?.[p.variant]?.vars?.bg} value={lookOf(x.id)} onChange={(v) => api.set(['mix', 'look', x.id], v)} />
            {open === x.id && (
              <div className="mix-c" role="radiogroup" aria-label={x.label}>
                {opts.map((t) => (
                  <button key={t.id} type="button" role="radio" aria-checked={shown === t.id} className={'mix-t' + (shown === t.id ? ' on' : '')} title={t.blurb}
                    onClick={() => api.set(['mix', x.id], t.id === def ? '' : t.id)}>
                    <i style={{ background: swatchBg(t) }} /><span>{t.name}</span>{t.id === def && <em>{tag}</em>}
                  </button>
                ))}
              </div>
            )}
          </div>
        );
      })}
      <div className="btns">
        <button type="button" className="btn sm" onClick={surprise}><Icon n="spark" />Surprise me</button>
        {any && <button type="button" className="btn sm ghost" onClick={() => api.set(['mix'], EMPTY_MIX)}>Use {base.name} for everything</button>}
      </div>
      {borrowed.length > 1 && (
        <div className="btns">
          <span className="mix-all">All borrowed parts:</span>
          <button type="button" className="btn sm ghost" onClick={() => setAllLooks(false)}>Follow Design</button>
          <button type="button" className="btn sm ghost" onClick={() => setAllLooks(true)}>Their own look</button>
        </div>
      )}
    </Group>
  );
}
/** Same light/dark as the page, same version number when possible. */
function matchVariant(T, base, hostV) {
  const bgOf = (v) => v?.vars?.bg || '#888';
  const lum = (h) => { const m = String(h).replace('#', ''); const n = parseInt(m.length === 3 ? [...m].map((x) => x + x).join('') : m.slice(0, 6), 16) || 0; return ((n >> 16 & 255) * 0.3 + (n >> 8 & 255) * 0.59 + (n & 255) * 0.11) / 255; };
  const dark = lum(bgOf(base.variants?.[hostV])) < 0.45;
  const vs = T?.variants || [];
  if (vs[hostV] && (lum(bgOf(vs[hostV])) < 0.45) === dark) return hostV;
  const k = vs.findIndex((v) => (lum(bgOf(v)) < 0.45) === dark);
  return k >= 0 ? k : 0;
}
function LookPick({ own, value, onChange, pageBg, part }) {
  const lumOf = (h) => { const m = String(h || '#888').replace('#', ''); const n = parseInt(m.length === 3 ? [...m].map((x) => x + x).join('') : m.slice(0, 6), 16) || 0; return ((n >> 16 & 255) * 0.3 + (n >> 8 & 255) * 0.59 + (n & 255) * 0.11) / 255; };
  const [id, vi] = value ? value.split(':') : [];
  const T = id && TEMPLATES.find((t) => t.id === id), v = T?.variants?.[+vi];
  const clash = v && (lumOf(v.vars?.bg) < 0.45) !== (lumOf(pageBg) < 0.45);
  const order = [...TEMPLATES].sort((a, b) => (b.id === own) - (a.id === own)); // this part's own template first
  return (<>
    <label className="mix-look">
      <span>Colors &amp; fonts</span>
      {v && <i style={{ background: `linear-gradient(135deg, ${v.swatch[0]} 0 50%, ${v.swatch[1]} 50% 75%, ${v.swatch[2] || v.swatch[0]} 75%)` }} />}
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">Design (your colors and fonts)</option>
        {order.map((t) => (
          <optgroup key={t.id} label={t.id === own ? `${t.name} (this part's own)` : t.name}>
            {t.variants.map((vv, k) => <option key={k} value={`${t.id}:${k}`}>{t.name}: {vv.name}{lumOf(vv.vars?.bg) < 0.45 ? ' (dark)' : ' (light)'}</option>)}
          </optgroup>
        ))}
      </select>
    </label>
    {clash && <p className="mix-warn">{v.name} is {lumOf(v.vars?.bg) < 0.45 ? 'dark' : 'light'} and your page is {lumOf(pageBg) < 0.45 ? 'dark' : 'light'}. {part === 'hero' || part === 'sections' ? 'This part brings its own background so it stays readable. The header and menu keep your page’s colors, so give them a look in the same tone if they become hard to read.' : 'Some text in this part may be hard to read; a version in the same tone fits better.'}</p>}
  </>);
}
const swatchBg = (t) => { const s = t?.variants?.[0]?.swatch || ['#888', '#444', '#ccc']; return `linear-gradient(135deg, ${s[0]} 0 45%, ${s[1]} 45% 70%, ${s[2] || s[0]} 70%)`; };
const SCREENS = [['desktop', 'Desktop', 'Wide screens, 1240 px and up', 8], ['laptop', 'Laptop / tablet landscape', 'Landscape, under 1240 px', 6], ['tabletP', 'Tablet portrait', 'Portrait, 560 px and up', 5], ['phoneP', 'Phone portrait', 'Portrait, under 560 px', 3], ['phoneL', 'Phone landscape', 'Landscape, under 500 px tall', 5]];
function PerRow({ api, group, title }) {
  const C = api.p.layout?.cols?.[group] || {};
  const any = SCREENS.some(([k]) => C[k]);
  return (
    <div className="perrow">
      <p className="sub">{title}</p>
      {SCREENS.map(([k, label, hint, max]) => (
        <div key={k} className="perrow-r" title={hint}>
          <span>{label}</span>
          <Segmented value={String(C[k] || 0)} onChange={(v) => api.set(['layout', 'cols', group, k], +v)} options={[{ value: '0', label: 'Auto' }, ...Array.from({ length: max }, (_, i) => ({ value: String(i + 1), label: String(i + 1) }))]} />
        </div>
      ))}
      {any && <button type="button" className="btn sm ghost" onClick={() => api.set(['layout', 'cols', group], {})}>All automatic</button>}
    </div>
  );
}
export function LayoutPanel({ api }) {
  const p = api.p, L = p.layout || {}, ui = api.ui;
  const set = (k) => (v) => api.set(['layout', k], v);
  const list = elementsFor(p.template, p.mix);
  const els = L.els || {};
  const scope = ui.scope;
  const valOf = (key) => { const v = els[key] || {}; return scope === 'p' ? { x: 0, y: 0, s: 1, ...v, ...(v.p || {}) } : { x: 0, y: 0, s: 1, ...v }; };
  const patch = (key, v) => api.setEl(key, v, scope);
  const reset = (key) => {
    if (scope === 'p') { const o = { ...(els[key] || {}) }; delete o.p; api.set(['layout', 'els', key], o); }
    else { const o = { ...(els[key] || {}) }; ['hide', 'x', 'y', 's', 'r', 'o'].forEach((k) => delete o[k]); api.set(['layout', 'els', key], Object.keys(o).length ? o : undefined); }
  };
  const changed = (key) => { const v = valOf(key); return v.hide || v.x || v.y || (v.s ?? 1) !== 1 || v.r || (v.o ?? 1) !== 1; };
  const row = (e) => {
    const v = valOf(e.key), on = ui.selKey === e.key;
    return (
      <div key={e.key} className={'el' + (on ? ' on' : '') + (v.hide ? ' hid' : '')}>
        <div className="el-h">
          <button type="button" className="ibtn" onClick={() => patch(e.key, { hide: !v.hide })} title={v.hide ? 'Show' : 'Hide'} aria-pressed={!v.hide}><Icon n={v.hide ? 'eyeOff' : 'eye'} /></button>
          <button type="button" className="el-t" onClick={() => api.selectEl(on ? null : e.key, e.group)}>{e.label}{e.from && e.from !== p.template && <em className="el-from">{TNAME(e.from)}</em>}{changed(e.key) && <i className="el-dot" title="Changed" />}</button>
          {changed(e.key) && <button type="button" className="ibtn" onClick={() => reset(e.key)} title="Reset"><Icon n="close" /></button>}
        </div>
        {on && (
          <div className="el-b">
            <Field label="Left / right"><Range value={v.x || 0} min={-50} max={50} step={0.5} onChange={(x) => patch(e.key, { x })} suffix=" vw" /></Field>
            <Field label="Up / down"><Range value={v.y || 0} min={-50} max={50} step={0.5} onChange={(y) => patch(e.key, { y })} suffix=" vh" /></Field>
            <Field label="Size"><Range value={v.s ?? 1} min={0.3} max={2.5} step={0.05} onChange={(s2) => patch(e.key, { s: s2 })} suffix="×" /></Field>
            <Field label="Rotate"><Range value={v.r || 0} min={-180} max={180} step={1} onChange={(r) => patch(e.key, { r })} suffix="°" /></Field>
            <Field label="Opacity"><Range value={v.o ?? 1} min={0} max={1} step={0.05} onChange={(o) => patch(e.key, { o })} /></Field>
          </div>
        )}
      </div>
    );
  };
  const secs = p.sections.filter((s) => s.enabled !== false);
  return (
    <div className="pn">
      <MixGroup api={api} />
      <Group title="Elements" desc="Hide, move and resize anything. Turn on canvas editing to click an element in the preview, drag it, and pull a corner to resize. Arrow keys nudge, Delete hides.">
        <div className="btns">
          <button type="button" className={'btn sm' + (ui.edit ? ' primary' : '')} onClick={() => api.setUi({ edit: !ui.edit })}><Icon n="move" />{ui.edit ? 'Editing on canvas' : 'Edit on canvas'}</button>
        </div>
        <Field label="Changes apply to"><Segmented value={scope} onChange={(v) => api.setUi({ scope: v })} options={[{ value: 'all', label: 'All screens' }, { value: 'p', label: 'Phones and tall screens only' }]} /></Field>
        {scope === 'p' && <p className="note">Preview a phone or rotate the tablet to see these edits. Everything you don’t change here follows the all-screens layout.</p>}
        {[['nav', 'Header'], ['menu', 'Menu'], ['contacts', 'Contact info'], ['home', 'Main screen'], ['bg', 'Background'], ['sections', 'Inside sections']].map(([g, label]) => {
          const items = list.filter((e) => e.group === g);
          return items.length ? <div key={g}><p className="sub">{label}</p><div className="els">{items.map(row)}</div></div> : null;
        })}
        {Object.keys(els).length > 0 && <button type="button" className="btn sm ghost" onClick={() => api.set(['layout', 'els'], {})}>Reset all elements</button>}
      </Group>
      <Group title="Section transition">
        <Field label="Animation"><Select value={L.transition || 'default'} onChange={set('transition')} options={TRANS.map(([value, label]) => ({ value, label }))} /></Field>
        <Field label="Speed"><Range value={L.speed || 1} min={0.4} max={2.5} step={0.1} onChange={set('speed')} suffix="×" /></Field>
        <button type="button" className="btn sm ghost" onClick={api.playTransition}><Icon n="play" />Play it in the preview</button>
      </Group>
      <Group title="Navigation">
        <Toggle value={L.wheel !== false} onChange={set('wheel')} label="Mouse wheel and trackpad change section" />
        <Toggle value={L.swipe !== false} onChange={set('swipe')} label="Swipe changes section on touch screens" />
        <Toggle value={L.keys !== false} onChange={set('keys')} label="Arrow keys and number keys" />
        <Toggle value={!!L.loop} onChange={set('loop')} label="Loop from the last section back to the first" />
      </Group>
      <Group title="Cards" desc="Auto fits as many cards as the card size allows. Pick a number to fix how many sit in a row on each kind of screen; rows still adjust to the height. Switch the preview device to see each one.">
        <Field label="Card size" hint="Bigger cards show fewer per page."><Range value={L.density || 1} min={0.7} max={1.6} step={0.05} onChange={set('density')} suffix="×" /></Field>
        <PerRow api={api} group="works" title="My Works: items per row" />
        <PerRow api={api} group="code" title="SandBox (GitHub projects and web apps): items per row" />
      </Group>
      <Group title="Section backgrounds" collapsible defaultOpen={false} desc="Give any section its own color or photo.">
        {secs.map((s) => {
          const b = (L.secBg || {})[s.id] || {};
          const sb = (k) => (v) => api.set(['layout', 'secBg', s.id, k], v);
          return (
            <div key={s.id} className="secbg">
              <p className="sub">{s.label}</p>
              <div className="row2"><Field label="Color"><Color value={b.color} fallback="" onChange={sb('color')} onReset={() => sb('color')('')} /></Field><Field label="Text color"><Color value={b.fg} fallback="" onChange={sb('fg')} onReset={() => sb('fg')('')} /></Field></div>
              <ImagePick label="Background image" value={b.image} src={api.img(b.image)} onChange={sb('image')} onUpload={(f) => api.upload(f).then(sb('image'))} />
              {b.image && <Field label="Darken image"><Range value={b.dim || 0} min={0} max={0.85} step={0.05} onChange={sb('dim')} /></Field>}
            </div>
          );
        })}
      </Group>
    </div>
  );
}
