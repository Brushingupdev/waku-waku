const fs=require('node:fs');const assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const origin=process.argv[2];
(async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  for(const width of [1440,390]){
   const context=await browser.newContext({viewport:{width,height:1000},reducedMotion:'reduce'});
   if(process.argv[3]){const line=fs.readFileSync(process.argv[3],'utf8').split(/\r?\n/).find(s=>/^set-cookie:/i.test(s));const pair=line.replace(/^set-cookie:\s*/i,'').split(';')[0];const at=pair.indexOf('=');await context.addCookies([{name:pair.slice(0,at),value:pair.slice(at+1),url:origin,secure:true}]);}
   const snapshot=await(await context.request.get(origin+'/catalog-data')).json();
   const banners=snapshot.banners.filter(b=>b.placement==='carousel'&&b.image_url&&b.is_active);
   assert.ok(banners.length>0);
   const page=await context.newPage();const errors=[];let legacy=0;
   page.on('pageerror',error=>errors.push(error.message));
   await page.route(/\/api\/(products|series|collectors)(\?|$)/,route=>{legacy++;return route.abort();});
   const response=await page.goto(origin,{waitUntil:'networkidle',timeout:90000});
   assert.ok((await response.text()).includes('data-site-banner'));
   const center=page.locator('.site-banner-carousel .center');
   await center.locator('img').evaluate(img=>img.decode());
   if(process.env.SCREENSHOT_DIR)await page.screenshot({path:process.env.SCREENSHOT_DIR+'/site-bundle-'+width+'.png'});
   if(banners.length>1){await page.getByRole('button',{name:'Ver destacado 2',exact:true}).click();assert.equal(await center.getAttribute('data-site-banner'),banners[1].id);}
   const next={...snapshot,settings:{...snapshot.settings,phone:'+51 987 654 321'},banners:[{...banners[0],id:'updated-banner',link_url:'javascript:alert(1)'}],updatedAt:new Date(Date.now()+120000).toISOString()};
   await page.route('**/catalog-data',route=>route.fulfill({json:next}));
   await page.evaluate(()=>document.dispatchEvent(new Event('visibilitychange')));
   await page.waitForFunction(()=>document.querySelector('.site-banner-carousel .center')?.getAttribute('data-site-banner')==='updated-banner');
   assert.equal(await center.locator('a').count(),0);
   assert.equal(await page.locator('.store-whatsapp-dark').getAttribute('href'),'https://wa.me/51987654321');
   await page.getByRole('searchbox').fill('Emilia');await page.locator('.store-figure-image').click();
   assert.ok((await page.locator('.store-product-whatsapp').getAttribute('href')).startsWith('https://wa.me/51987654321?text='));
   await page.getByRole('button',{name:'Cerrar detalle',exact:true}).click();
   next.banners=[];next.updatedAt=new Date(Date.now()+240000).toISOString();
   await page.evaluate(()=>document.dispatchEvent(new Event('visibilitychange')));
   await page.locator('.site-banner-carousel').waitFor({state:'detached'});
   assert.equal(await page.locator('.store-showcase-card[data-product-id]').count(),3);
   assert.equal(legacy,0);assert.deepEqual(errors,[]);
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
   console.log(JSON.stringify({width,banners:banners.length,legacyRequests:legacy,settingsRefresh:true,unsafeLinkBlocked:true,emptyBannerFallback:true,jsErrors:0}));
   await context.close();
  }
 }finally{await browser.close();}
})().catch(error=>{console.error(error.message);process.exitCode=1;});
