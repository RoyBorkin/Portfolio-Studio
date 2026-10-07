/*! Portfolio Studio. Copyright (c) 2026 Roy Borkin. All rights reserved. Unauthorized copying, modification or distribution is prohibited without written permission. */
// Build: site runtime (engine + one file per template) and the builder app (single HTML file).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// esbuild from this project's node_modules (npm install), or a global copy as a fallback
const { build } = await import('esbuild');
const root = path.dirname(fileURLToPath(import.meta.url));
const out = path.join(root, 'dist');
fs.mkdirSync(path.join(out, 'site'), { recursive: true });
const mode = process.argv[2] || 'all';
const BANNER = '/*! Portfolio Studio. Copyright (c) 2026 Roy Borkin. All rights reserved. */';

const tplDir = path.join(root, 'src/site/templates');
const templates = fs.readdirSync(tplDir).filter((f) => f.endsWith('.js') && f !== 'index.js').map((f) => f.replace(/\.js$/, ''));

async function siteBuild() {
  await build({ entryPoints: [path.join(root, 'src/site/engine.js')], bundle: true, minify: true, format: 'iife', target: 'es2020', outfile: path.join(out, 'site/engine.js'), legalComments: 'none', banner: { js: BANNER } });
  await build({ entryPoints: [path.join(root, 'src/site/engine.css')], bundle: true, minify: true, outfile: path.join(out, 'site/engine.css'), legalComments: 'none', banner: { css: BANNER } });
  for (const t of templates) {
    const entry = path.join(out, `.entry-${t}.js`);
    fs.writeFileSync(entry, `import def from ${JSON.stringify(path.join(tplDir, t + '.js'))};\n(window.PF=window.PF||{});(window.PF.templates=window.PF.templates||{});window.PF.templates[def.id]=def;\n`);
    await build({ entryPoints: [entry], bundle: true, minify: true, format: 'iife', target: 'es2020', outfile: path.join(out, `site/t-${t}.js`), legalComments: 'none', banner: { js: BANNER } });
    fs.unlinkSync(entry);
  }
  fs.writeFileSync(path.join(out, 'site/templates.json'), JSON.stringify(templates));
  console.log('site built:', templates.join(', '));
}

async function builderBuild() {
  // Inline the built runtime + default assets into the builder bundle.
  const runtime = { engineJs: fs.readFileSync(path.join(out, 'site/engine.js'), 'utf8'), engineCss: fs.readFileSync(path.join(out, 'site/engine.css'), 'utf8'), templates: {} };
  for (const t of templates) runtime.templates[t] = fs.readFileSync(path.join(out, `site/t-${t}.js`), 'utf8');
  fs.writeFileSync(path.join(out, 'runtime.json'), JSON.stringify(runtime));
  const assetDir = path.join(root, 'assets');
  const assets = {};
  for (const f of fs.readdirSync(assetDir)) {
    const ext = path.extname(f).slice(1);
    const type = { jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp', svg: 'image/svg+xml' }[ext];
    if (!type) continue;
    const id = f.replace(/\.[^.]+$/, '');
    assets[id] = { id, name: f, type, data: `data:${type};base64,` + fs.readFileSync(path.join(assetDir, f)).toString('base64') };
  }
  fs.writeFileSync(path.join(out, 'default-assets.json'), JSON.stringify(assets));
  const res = await build({
    entryPoints: [path.join(root, 'src/builder/main.jsx')], bundle: true, minify: true, format: 'iife', target: 'es2020', write: false,
    jsx: 'automatic', loader: { '.js': 'jsx', '.json': 'json', '.txt': 'text' }, define: { 'process.env.NODE_ENV': '"production"', __BUILD__: JSON.stringify(new Date().toISOString().slice(0, 16).replace('T', ' ') + ' UTC') },
    nodePaths: [path.join(root, 'node_modules')],
    alias: { '@runtime': path.join(out, 'runtime.json'), '@assets': path.join(out, 'default-assets.json') }, legalComments: 'none', banner: { js: BANNER },
  });
  const js = res.outputFiles[0].text;
  const css = fs.readFileSync(path.join(root, 'src/builder/builder.css'), 'utf8');
  const html = fs.readFileSync(path.join(root, 'src/builder/index.html'), 'utf8')
    .replace('/*__CSS__*/', () => css)
    .replace('/*__JS__*/', () => js.replace(/<\/script/gi, '<\\/script'));
  fs.writeFileSync(path.join(out, 'index.html'), html);
  // Artifact flavour: no document skeleton (the host adds it); title, fonts and styles first.
  const art = html.replace(/^[\s\S]*?<head>/, '').replace(/<\/head>\s*<body>/, '').replace(/<\/body>\s*<\/html>\s*$/, '').replace(/<meta charset="utf-8">\s*<meta name="viewport"[^>]*>/, '');
  fs.writeFileSync(path.join(out, 'portfolio-studio.html'), art.trim() + '\n');
  console.log('builder built:', (html.length / 1024 / 1024).toFixed(2) + ' MB');
}

await siteBuild();
if (mode !== 'site') await builderBuild();
