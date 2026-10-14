const fs = require('node:fs');
const assert = require('node:assert/strict');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
// Run against a built preview or local production server. Optional headers file
// is written by authenticated vercel curl and must remain outside the repository.
const origin = process.argv[2];
if (!origin) throw new Error('Usage: node tests/catalog-cache-browser.cjs URL [private-headers-file]');
let cookie;
if (process.argv[3]) {
 const headers = fs.readFileSync(process.argv[3], 'utf8');
 const line = headers.split(/\r?\n/).find(s => /^set-cookie:/i.test(s));
 if (!line) throw new Error('Preview authentication cookie missing');
 const pair = line.replace(/^set-cookie:\s*/i, '').split(';')[0];
 const split = pair.indexOf('=');
 cookie = { name: pair.slice(0, split), value: pair.slice(split + 1), url: origin, secure: true };
}
(async () => {
 const browser = await chromium.launch({ headless: true });
 const failures = [];
 try {
  const context = await browser.newContext({ viewport: { width: 390, height: 1000 }, reducedMotion: 'reduce' });
  if (cookie) await context.addCookies([cookie]);
  let snapshot = await (await context.request.get(origin + '/catalog-data')).json();
  const original = structuredClone(snapshot);
  let timestamp = Date.now() + 120000;
  const stamp = () => { snapshot.updatedAt = new Date(timestamp += 1000).toISOString(); };
  stamp();
  let mode = 'success', requests = 0;
  const page = await context.newPage();
  await page.route('**/catalog-data', async route => {
   requests++;
   if (mode === 'hang') return;
   if (mode === 'malformed') return route.fulfill({ status: 200, contentType: 'application/json', body: '{"bad":true}' });
   return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(snapshot) });
  });
  await page.goto(origin, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(date => document.querySelector('.store-fineprint time')?.getAttribute('datetime') === date, snapshot.updatedAt);
  await page.getByRole('searchbox').fill('Emilia');
  await page.locator('.store-figure-image').click();
  const product = snapshot.products.find(p => p.title === 'Emilia');
  product.quantity = 7;
  product.price = 123;
  stamp();
  await page.evaluate(() => document.dispatchEvent(new Event('visibilitychange')));
  await page.waitForFunction(date => document.querySelector('.store-fineprint time')?.getAttribute('datetime') === date, snapshot.updatedAt);
  const modalUpdated = await page.getByRole('dialog').getByText('Unidades', { exact: true }).count() === 1;
  if (!modalUpdated) failures.push('Open product detail keeps old quantity after catalog refresh');
  else assert.equal(await page.getByRole('dialog').getByText('Unidades', { exact: true }).locator('..').locator('dd').innerText(), '7');
  assert.equal(await page.locator('.store-figure-bottom strong').innerText(), 'S/ 123');
  snapshot.products = snapshot.products.filter(p => p.id !== product.id);
  stamp();
  await page.evaluate(() => document.dispatchEvent(new Event('visibilitychange')));
  await page.waitForFunction(date => document.querySelector('.store-fineprint time')?.getAttribute('datetime') === date, snapshot.updatedAt);
  if (await page.getByRole('dialog').count()) {
   failures.push('Removed product still has an open detail dialog');
   await page.getByRole('button', { name: 'Cerrar detalle', exact: true }).click();
  }
  mode = 'malformed';
  await page.evaluate(() => document.dispatchEvent(new Event('visibilitychange')));
  await page.locator('.store-load-notice').waitFor();
  assert.equal(await page.locator('.store-results-grid .store-figure').count(), 0);
  await page.clock.install();
  mode = 'hang';
  await page.evaluate(() => document.dispatchEvent(new Event('visibilitychange')));
  await page.waitForTimeout(200);
  await page.clock.fastForward(15000);
  mode = 'success';
  stamp();
  const before = requests;
  await page.evaluate(() => document.dispatchEvent(new Event('visibilitychange')));
  await page.waitForTimeout(500);
  if (requests === before) failures.push('Hung request prevents all later refresh attempts');
  else await page.waitForFunction(date => document.querySelector('.store-fineprint time')?.getAttribute('datetime') === date, snapshot.updatedAt);
  snapshot = { ...snapshot, products: [] };
  stamp();
  await page.evaluate(() => document.dispatchEvent(new Event('visibilitychange')));
  await page.waitForFunction(date => document.querySelector('.store-fineprint time')?.getAttribute('datetime') === date, snapshot.updatedAt);
  assert.equal(await page.locator('.store-figure').count(), 0);
  snapshot = original;
  await page.evaluate(() => document.dispatchEvent(new Event('visibilitychange')));
  await page.waitForTimeout(300);
  assert.equal(await page.locator('.store-figure').count(), 0, 'An older snapshot must not revive a valid empty catalog');
  stamp();
  await page.evaluate(() => document.dispatchEvent(new Event('visibilitychange')));
  await page.waitForFunction(date => document.querySelector('.store-fineprint time')?.getAttribute('datetime') === date, snapshot.updatedAt);
  assert.equal(await page.locator('.store-results-grid .store-figure').count(), 1);
  assert.equal(await page.getByRole('dialog').count(), 0, 'A withdrawn selection must not reopen when the product returns');
  console.log(JSON.stringify({ modalUpdated, malformedResponseRetainsData: true, failures }));
  await context.close();
 } finally { await browser.close(); }
 assert.deepEqual(failures, []);
})().catch(error => { console.error(error.message); process.exitCode = 1; });
