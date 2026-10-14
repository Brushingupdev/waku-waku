const fs = require('node:fs');
const assert = require('node:assert/strict');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const origin = process.argv[2];
const cookieFile = process.argv[3];

let cookie;
if (cookieFile) {
 const line=fs.readFileSync(cookieFile,'utf8').split(/\r?\n/).find(s=>/^set-cookie:/i.test(s));
 const pair=line.replace(/^set-cookie:\s*/i,'').split(';')[0], split=pair.indexOf('=');
 cookie={name:pair.slice(0,split),value:pair.slice(split+1),url:origin,secure:true};
}
(async()=>{
 const browser=await chromium.launch({headless:true});
 try {
  for(const width of [1440,390]) {
   const context=await browser.newContext({viewport:{width,height:1000},reducedMotion:'reduce'});
   if(cookie)await context.addCookies([cookie]);
   const snapshot=await(await context.request.get(origin+'/catalog-data')).json();
   const page=await context.newPage();
   const errors=[];page.on('pageerror',e=>errors.push(e.message));
   await page.goto(origin,{waitUntil:'domcontentloaded'});
   await page.waitForLoadState("networkidle");
   for(const item of snapshot.series) {
    console.log(width,item.name);
    const button=page.locator(`[data-series-id="${item.id}"]`).nth(1);
    const pickerSrc=await button.locator('img').getAttribute('src');
    await button.evaluate(button=>button.click());
    const logo=page.locator('.series-gallery-logo');
    await logo.waitFor();
    assert.equal(await page.locator(".series-gallery-photo").first().evaluate(el=>getComputedStyle(el).position),"relative","Gallery skeleton must be anchored to its photo");
    assert.equal(await logo.getAttribute('src'),pickerSrc,item.name+' logo must not change');
    await logo.evaluate(img=>img.decode());
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
    await page.getByRole('button',{name:'Volver al catálogo',exact:true}).click();
   }
   assert.deepEqual(errors,[]);
   console.log(JSON.stringify({width,consistentSeries:snapshot.series.length,browserErrors:0}));
   await context.close();
  }
 }finally{await browser.close();}
})().catch(e=>{console.error(e.message);process.exitCode=1;});





