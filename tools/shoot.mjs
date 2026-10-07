/*! Portfolio Studio. Copyright (c) 2026 Roy Borkin. All rights reserved. Unauthorized copying, modification or distribution is prohibited without written permission. */
// Screenshot harness: node tools/shoot.mjs <template> [variants=0,1,2] [sections=home,works,about] [views=desk,phone]
import { chromium } from '/home/claude/.npm-global/lib/node_modules/playwright/index.mjs';
import fs from 'node:fs';
import path from 'node:path';
import { defaultProject } from '../src/shared/defaults.js';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const [tpl = 'classic', vs = '0,1,2', secs = 'home,works,about', views = 'desk,phone'] = process.argv.slice(2);
const VIEWS = { desk: [1440, 900], laptop: [1280, 720], tabp: [820, 1180], tabl: [1180, 820], phone: [390, 844], phl: [844, 390], wide: [1920, 1080] };
const assets = {};
for (const f of fs.readdirSync(path.join(root, 'assets'))) { const id = f.replace(/\.[^.]+$/, ''); assets[id] = { id, name: f, path: '../../assets/' + f }; }
const outDir = path.join(root, 'shots'); fs.mkdirSync(outDir, { recursive: true });
fs.mkdirSync(path.join(root, 'dist/harness'), { recursive: true });

const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' }).catch(() => chromium.launch());
const files = [];
for (const v of vs.split(',')) {
  const data = defaultProject(assets); data.template = tpl; data.variant = +v;
  data.sandbox.github.user = 'royborkin';
  const html = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="../site/engine.css"></head><body><script>window.PF_DATA=${JSON.stringify(data)};window.PF_OPTS={section:new URLSearchParams(location.search).get('s')||0};</script><script src="../site/engine.js"></script><script src="../site/t-${tpl}.js"></script></body></html>`;
  const hp = path.join(root, `dist/harness/${tpl}-${v}.html`);
  fs.writeFileSync(hp, html);
  for (const vw of views.split(',')) {
    const [w, h] = VIEWS[vw];
    const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1, hasTouch: vw.startsWith('ph') || vw.startsWith('tab') });
    page.on('pageerror', (e) => console.log('PAGEERROR', tpl, v, vw, e.message));
    page.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource|net::|fonts\.g/.test(m.text())) console.log('CONSOLE', m.text()); });
    for (const s of secs.split(',')) {
      await page.goto('file://' + hp + '?s=' + s);
      await page.waitForTimeout(s === 'home' ? 3600 : 1800);
      const f = path.join(outDir, `${tpl}-${v}-${vw}-${s}.png`);
      await page.screenshot({ path: f });
      files.push(f);
    }
    await page.close();
  }
}
await browser.close();
console.log(files.length + ' shots');
