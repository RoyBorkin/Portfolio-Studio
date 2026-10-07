/*! Portfolio Studio. Copyright (c) 2026 Roy Borkin. All rights reserved. Unauthorized copying, modification or distribution is prohibited without written permission. */
// Every template in every part, on two hosts (one light, one dark). Reports page errors only.
import { chromium } from '/home/claude/.npm-global/lib/node_modules/playwright/index.mjs';
import fs from 'node:fs';
import path from 'node:path';
import { defaultProject } from '../src/shared/defaults.js';
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const ids = fs.readdirSync(path.join(root, 'dist/site')).filter((f) => /^t-.*\.js$/.test(f)).map((f) => f.slice(2, -3));
const assets = {}; for (const f of fs.readdirSync(path.join(root, 'assets'))) { const id = f.replace(/\.[^.]+$/, ''); assets[id] = { id, name: f, path: '../../assets/' + f }; }
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const page = await b.newPage({ viewport: { width: 1280, height: 800 } });
let errs = 0, n = 0, cur = '';
page.on('pageerror', (e) => { errs++; console.log('PAGEERROR', cur, e.message.slice(0, 160)); });
const hp = path.join(root, 'dist/harness/sweep.html');
for (const [host, v] of [['classic', 1], ['atelier', 0]]) for (const slot of (process.argv[2] || 'bg,nav,menu,hero,sections').split(',')) for (const id of ids) {
  if (id === host) continue;
  const data = defaultProject(assets); data.template = host; data.variant = v; data.mix = { [slot]: id }; data.sandbox.github.user = '';
  fs.writeFileSync(hp, `<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="../site/engine.css"></head><body><script>window.PF_DATA=${JSON.stringify(data)};window.PF_OPTS={section:'home'};</script><script src="../site/engine.js"></script><script src="../site/t-${host}.js"></script><script src="../site/t-${id}.js"></script></body></html>`);
  cur = `${host}+${slot}:${id}`;
  await page.goto('file://' + hp); await page.waitForTimeout(350);
  await page.evaluate(() => window.PF?.go?.(1)); await page.waitForTimeout(250);
  n++;
}
await b.close();
console.log('renders', n, 'errors', errs);
