/*! Portfolio Studio. Copyright (c) 2026 Roy Borkin. All rights reserved. Unauthorized copying, modification or distribution is prohibited without written permission. */
// Export a complete static website as a ZIP.
import JSZip from 'jszip';
import { dataUrlToBytes, extOf, slug } from './util.js';
import { googleFontsHref, fontSpecsFor } from '../shared/fonts.js';
import { CONTACT_TYPES } from '../shared/icons.js';
import { mixIds, ownLooks, ownLookFonts } from '../shared/mix.js';
import { TEMPLATES } from '../site/templates/index.js';
import IG_SCRIPT from './files/instagram-sync.mjs.txt';
import LI_SCRIPT from './files/linkedin-sync.mjs.txt';
import PUBLISH_YML from './files/publish.yml.txt';

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/** Return a copy of the project where asset data URLs are replaced by file paths, plus the file list. */
export function externalizeAssets(project) {
  const files = [];
  const used = new Set();
  const assets = {};
  const nameFor = (a, dir) => {
    let base = slug((a.name || a.id).replace(/\.[^.]+$/, '')), n = base, k = 2;
    while (used.has(dir + n)) n = `${base}-${k++}`;
    used.add(dir + n);
    return n;
  };
  for (const [id, a] of Object.entries(project.assets || {})) {
    if (!a?.data) continue;
    const type = a.type || a.data.slice(5).split(/[;,]/)[0];
    if (type === 'text/html') {
      const n = nameFor(a, 'apps/');
      const path = `apps/${n}/index.html`;
      files.push({ path, bytes: dataUrlToBytes(a.data) });
      assets[id] = { id, name: a.name, type, path };
    } else {
      const n = nameFor(a, 'img/');
      const path = `assets/img/${n}.${extOf(type)}`;
      files.push({ path, bytes: dataUrlToBytes(a.data) });
      assets[id] = { id, name: a.name, type, path };
    }
  }
  return { data: { ...project, assets }, files };
}

function contactHref(c) { const T = CONTACT_TYPES[c.type] || CONTACT_TYPES.custom; return T.href ? T.href(c.value) : c.value; }

export function buildIndexHtml(project, data, def) {
  const P = project.profile || {};
  const name = [P.firstName, P.lastName].filter(Boolean).join(' ');
  const site = project.site || {};
  const fonts = googleFontsHref([...new Set([...fontSpecsFor(def, project), ...ownLookFonts(ownLooks(project.template, project.mix, (id) => TEMPLATES.find((t) => t.id === id)))])]);
  const icon = data.assets?.[String(site.favicon || P.logo || '').replace(/^a:/, '')]?.path;
  const ogImg = data.assets?.[String(P.photo || '').replace(/^a:/, '')]?.path;
  const abs = (p) => (site.url ? site.url.replace(/\/?$/, '/') + p : p);
  const contacts = (project.contacts || []).filter((c) => c.show !== false && c.value);
  const secs = (project.sections || []).filter((s) => s.enabled !== false);
  const year = new Date().getFullYear();
  return `<!doctype html>
<!-- © ${year} ${esc(name || 'the site owner')}. All rights reserved. Built with Portfolio Studio © 2026 Roy Borkin. -->
<html lang="${esc(site.lang || 'en')}" dir="${esc(site.dir || 'ltr')}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
${name ? `<meta name="author" content="${esc(name)}">
<meta name="copyright" content="© ${year} ${esc(name)}. All rights reserved.">` : ''}
<title>${esc(site.title || name)}</title>
<meta name="description" content="${esc(site.description || P.tagline || '')}">
<meta name="theme-color" content="${esc(def?.variants?.[project.variant | 0]?.vars?.bg || '#111111')}">
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(site.title || name)}">
<meta property="og:description" content="${esc(site.description || P.tagline || '')}">
${ogImg ? `<meta property="og:image" content="${esc(abs(ogImg))}">` : ''}
${site.url ? `<link rel="canonical" href="${esc(site.url)}">` : ''}
${icon ? `<link rel="icon" href="${esc(icon)}">\n<link rel="apple-touch-icon" href="${esc(icon)}">` : ''}
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
${fonts ? `<link rel="stylesheet" href="${esc(fonts)}" id="pf-fonts">` : ''}
<link rel="stylesheet" href="assets/css/engine.css">
</head>
<body>
<div id="pf">
  <noscript>
    <main style="font-family:system-ui,sans-serif;max-width:640px;margin:10vh auto;padding:0 20px;line-height:1.6;color:#eee">
      <h1>${esc(name)}</h1>
      <p>${esc((P.roles || []).join(' · '))}</p>
      <p>${esc(project.about?.bio || P.tagline || '')}</p>
      <ul>${contacts.map((c) => `<li><a style="color:inherit" href="${esc(contactHref(c))}">${esc(c.label || c.type)}</a></li>`).join('')}</ul>
      <p>This site uses JavaScript for its interactive layout: ${secs.map((s) => esc(s.label)).join(', ')}.</p>
    </main>
  </noscript>
</div>
<script src="assets/js/content.js"></script>
<script src="assets/js/engine.js"></script>
<script src="assets/js/template.js"></script>
</body>
</html>
`;
}

function readme(project, def) {
  const P = project.profile || {};
  return `# ${[P.firstName, P.lastName].filter(Boolean).join(' ')} — portfolio website

© ${new Date().getFullYear()} ${[P.firstName, P.lastName].filter(Boolean).join(' ') || 'the site owner'}. All rights reserved — the content, text and images of this site.
The site code (engine, templates) is Portfolio Studio © 2026 Roy Borkin. All rights reserved.

Built with Portfolio Studio. Template: **${def?.name}** (${def?.variants?.[project.variant | 0]?.name} variant).

## What's inside

\`\`\`
index.html              the page (one screen, no scrolling)
assets/css/engine.css   shared layout, components and motion
assets/js/content.js    all your content (generated from data/content.json)
assets/js/engine.js     the site runtime: navigation, paging, embeds, modals
assets/js/template.js   the "${def?.name}" design
assets/img/             your images
apps/                   mini web apps you uploaded as HTML files
data/content.json       your content as plain JSON
project.portfolio.json  the full project — open it in Portfolio Studio to keep editing
\`\`\`

## Publish on GitHub Pages

1. Create a repository (for a personal site name it \`<your-user>.github.io\`).
2. Upload every file and folder from this ZIP to the repository root (keep \`.nojekyll\`).
3. In the repository: **Settings → Pages → Build and deployment → Deploy from a branch → main / root**.
4. The site appears at \`https://<your-user>.github.io/\` within a minute or two.

Netlify, Vercel or any static host also work: drag the unzipped folder onto Netlify Drop.

## Opening it locally

Double-click \`index.html\`. Everything works offline except: Google Fonts, GitHub projects,
Instagram / LinkedIn embeds and Google Drive viewers, which need an internet connection.
GitHub projects only load when the site is served over http(s), not from a file:// path.

## Embeds — checklist

- **Google Drive** (resume, portfolios): set each file to *Anyone with the link → Viewer*, or the viewer shows a sign-in page.
- **Instagram**: use single-post links (\`instagram.com/p/…\` or \`/reel/…\`). Private accounts can't be embedded.
- **LinkedIn**: on the post, choose *… → Embed this post* and paste the code (or the post link) into Portfolio Studio.
- **Instagram auto-feed with a token**: the token is visible in \`content.js\` to anyone who views the source. Use a token
  with read-only scope, or a feed service URL (for example a Behold.so JSON feed) instead.

## Editing

Open Portfolio Studio, choose **Open project**, select \`project.portfolio.json\`, make changes, and export again.
`;
}

const IG_README = `
## Instagram: automatic posts (set up once)

Your site reads \`data/instagram.json\`. The workflow in \`.github/workflows/publish.yml\` refreshes it every hour,
saves the images into \`assets/ig/\`, and republishes the site, so a new Instagram post appears on your website
within about an hour with nothing to do on your side.

1. **Make the account professional.** In the Instagram app: Settings → Account type and tools → Switch to professional
   account (Creator or Business; it stays free and can stay personal-looking).
2. **Create a Meta app.** Go to developers.facebook.com → My Apps → Create app and pick the Instagram use case
   (named something like "Manage messaging & content on Instagram"). Open **API setup with Instagram login**.
3. **Generate a token.** In "Generate access tokens", add your Instagram account and click **Generate token**.
   Copy it. This is a long-lived token (about 60 days); the workflow renews it automatically.
4. **Add it to GitHub.** Repository → Settings → Secrets and variables → Actions → New repository secret:
   name \`IG_TOKEN\`, value = the token.
5. **Optional, recommended:** create a fine-grained personal access token (github.com/settings/tokens) limited to this
   repository with **Secrets: Read and write**, and save it as the secret \`GH_PAT\`. Then renewed tokens are saved back
   on their own and you never have to touch the token again.
6. **Switch Pages to Actions.** Settings → Pages → Build and deployment → Source: **GitHub Actions**.
7. Push the site. Open Actions → **Publish site** → **Run workflow** to fetch your posts right away.

If the token ever expires (for example without GH_PAT and after 60 days), the workflow run fails and GitHub emails you.
Generate a new token (step 3) and update \`IG_TOKEN\`.
`;

const LI_README = `
## LinkedIn: automatic posts (set up once)

LinkedIn doesn't let individual members read their own posts through its API, so the site reads a **feed** of your
public activity instead. The workflow in \`.github/workflows/publish.yml\` checks it every hour, saves new posts (and
their images) into \`data/linkedin.json\` and \`assets/li/\`, and republishes the site. Posts are kept even after
they drop out of the feed.

1. Create a feed of your LinkedIn posts with a feed service (for example **rss.app** → *LinkedIn* → paste
   \`https://www.linkedin.com/in/<you>/recent-activity/all/\`). Copy the RSS or JSON feed URL.
2. Either paste that URL in Portfolio Studio (My Works → LinkedIn → Automatic) before exporting, or add it here as the
   repository secret \`LI_FEED_URL\` (Settings → Secrets and variables → Actions). The secret wins if both are set.
3. Settings → Pages → Source: **GitHub Actions**. Then Actions → **Publish site** → **Run workflow**.

Only public posts can be shown (LinkedIn's embed needs them to be public).
`;

export async function exportZip(project, def, runtime) {
  const zip = new JSZip();
  const { data, files } = externalizeAssets(project);
  const ig = { ...(data.works?.instagram || {}) };
  delete ig.testToken;
  if (ig.mode !== 'token') delete ig.token;
  const snapshot = ig.snapshot; delete ig.snapshot;
  const li = { ...(data.works?.linkedin || {}) };
  const liSnap = li.snapshot; delete li.snapshot;
  const liFeed = li.mode === 'github' ? String(li.feedUrl || '').replace(/'/g, '%27') : ''; delete li.feedUrl;
  const content = { ...data, works: { ...data.works, instagram: ig, linkedin: li } };
  if (ig.mode === 'github' || li.mode === 'github') {
    zip.file('.github/workflows/publish.yml', PUBLISH_YML.replace('__LIMIT__', String(ig.limit || 24)).replace('__LI_LIMIT__', String(li.limit || 24)).replace('__LI_FEED__', liFeed));
  }
  if (li.mode === 'github') {
    zip.file('scripts/linkedin-sync.mjs', LI_SCRIPT);
    zip.file('data/linkedin.json', JSON.stringify({ updated: liSnap?.updated || null, posts: liSnap?.posts || [] }, null, 2) + '\n');
  }
  if (ig.mode === 'github') {
    zip.file('scripts/instagram-sync.mjs', IG_SCRIPT);
    zip.file('data/instagram.json', JSON.stringify(snapshot ? { updated: snapshot.updated || null, profile: snapshot.profile || null, posts: snapshot.posts || [] } : { updated: null, profile: ig.username ? { username: ig.username.replace(/^@/, '') } : null, posts: [] }, null, 2) + '\n');
    zip.folder('assets/ig');
  }
  zip.file('index.html', buildIndexHtml(project, data, def));
  zip.file('assets/css/engine.css', runtime.engineCss);
  zip.file('assets/js/engine.js', runtime.engineJs);
  zip.file('assets/js/template.js', mixIds(project.template, project.mix).filter((id) => runtime.templates[id]).map((id) => runtime.templates[id]).join('\n'));
  zip.file('assets/js/content.js', `/* Generated by Portfolio Studio © 2026 Roy Borkin — edit data/content.json or re-export from the builder. */\nwindow.PF_DATA = ${JSON.stringify(content)};\n`);
  zip.file('data/content.json', JSON.stringify(content, null, 2));
  zip.file('project.portfolio.json', JSON.stringify({ ...project, _format: 'portfolio-studio', _saved: new Date().toISOString() }));
  zip.file('README.md', readme(project, def) + (ig.mode === 'github' ? IG_README : '') + (li.mode === 'github' ? LI_README : ''));
  zip.file('.nojekyll', '');
  for (const f of files) zip.file(f.path, f.bytes);
  return zip.generateAsync({ type: 'blob', compression: 'DEFLATE', compressionOptions: { level: 6 } });
}
