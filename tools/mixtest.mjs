/*! Portfolio Studio. Copyright (c) 2026 Roy Borkin. All rights reserved. Unauthorized copying, modification or distribution is prohibited without written permission. */
// Mix & match harness: node tools/mixtest.mjs  → shots/mix-<n>-<view>-<sec>.png
import { chromium } from '/home/claude/.npm-global/lib/node_modules/playwright/index.mjs';
import fs from 'node:fs';
import path from 'node:path';
import { defaultProject } from '../src/shared/defaults.js';
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const assets = {};
for (const f of fs.readdirSync(path.join(root, 'assets'))) { const id = f.replace(/\.[^.]+$/, ''); assets[id] = { id, name: f, path: '../../assets/' + f }; }
const COMBOS = JSON.parse(process.argv[2] || '[]');
const views = (process.argv[3] || 'desk,phone').split(','), secs = (process.argv[4] || 'home,works').split(',');
const VIEWS = { desk: [1440, 900], phone: [390, 844], phl: [844, 390] };
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
let n = 0;
for (const [tpl, v, mix] of COMBOS) {
  const data = defaultProject(assets); data.template = tpl; data.variant = v; data.mix = mix; data.sandbox.github.user = '';
  const ids = [...new Set([tpl, ...Object.values(mix).filter(Boolean)])];
  const html = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="../site/engine.css"></head><body><script>window.PF_DATA=${JSON.stringify(data)};window.PF_OPTS={section:new URLSearchParams(location.search).get('s')||0};</script><script src="../site/engine.js"></script>${ids.map((id) => `<script src="../site/t-${id}.js"></script>`).join('')}</body></html>`;
  const hp = path.join(root, `dist/harness/mix-${n}.html`); fs.writeFileSync(hp, html);
  for (const vw of views) {
    const [w, h] = VIEWS[vw];
    const page = await b.newPage({ viewport: { width: w, height: h }, hasTouch: vw !== 'desk' });
    page.on('pageerror', (e) => console.log('PAGEERROR', n, vw, e.message));
    page.on('console', (m) => { if (m.type() === 'error' && !/Failed to load|net::|fonts\.g|CORS|github/.test(m.text())) console.log('CONSOLE', n, m.text().slice(0, 200)); });
    for (const s of secs) { await page.goto('file://' + hp + '?s=' + s); await page.waitForTimeout(s === 'home' ? 3200 : 1600); await page.screenshot({ path: `shots/mix-${n}-${vw}-${s}.png` }); }
    await page.close();
  }
  n++;
}
await b.close();
console.log('done', n);
