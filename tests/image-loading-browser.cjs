const assert = require('node:assert/strict');
const fs = require('node:fs');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const origin = process.argv[2];
if (!origin) throw new Error('Usage: node tests/image-loading-browser.cjs URL [private-headers-file]');
const imagePath = '/products/52b5480a-f8b5-4ee9-917e-e8a9697468d8/3051debddcfafb2ef30d.webp';
(async () => {
 const browser = await chromium.launch({ headless: true });
 try {
  for (const permanent of [false, true]) {
   const context = await browser.newContext({ viewport: { width: 390, height: 1000 }, reducedMotion: 'reduce' });
   if (process.argv[3]) {
    const line = fs.readFileSync(process.argv[3], 'utf8').split(/\r?\n/).find(s => /^set-cookie:/i.test(s));
    const pair = line.replace(/^set-cookie:\s*/i, '').split(';')[0], split = pair.indexOf('=');
    await context.addCookies([{ name: pair.slice(0, split), value: pair.slice(split + 1), url: origin, secure: true }]);
   }
   const page = await context.newPage();
   let attempts = 0;
   const errors = [];
   page.on('pageerror', e => errors.push(e.message));
   await page.route(url => url.pathname.endsWith(imagePath), route => {
    attempts++;
    return permanent || attempts < 3 ? route.abort('failed') : route.continue();
   });
   await page.goto(origin, { waitUntil: 'domcontentloaded' });
   const first = page.locator('.store-collection-carousel').first();
   await first.scrollIntoViewIfNeeded();
   if (permanent) await first.locator('.image-error-overlay').waitFor({ timeout: 15000 });
   else await first.locator(`img[src*="3051debddcfafb2ef30d.webp"].loading-image-ready`).waitFor({ timeout: 15000 });
   assert.equal(attempts, 3);
   await page.waitForTimeout(1200);
   assert.equal(attempts, 3, 'Retries must stop at two additional attempts');
   assert.deepEqual(errors, []);
   assert.equal(await page.locator('.store-collection-carousel').nth(1).locator('.store-collection-photo img[loading="lazy"]').count(), 4);
   assert.equal(await first.locator('.store-collection-photo img[loading="eager"]').count(), 4);
   console.log(JSON.stringify({ permanentFailure: permanent, requests: attempts, recovered: !permanent, browserErrors: 0 }));
   await context.close();
  }
 } finally { await browser.close(); }
})().catch(e => { console.error(e.message); process.exitCode = 1; });
