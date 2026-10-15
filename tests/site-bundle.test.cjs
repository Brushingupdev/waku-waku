const test = require('node:test');
const assert = require('node:assert/strict');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const { loadCatalogSnapshot } = require('../lib/catalog-snapshot.ts');
const CatalogClient = require('../components/catalog-client.tsx').default;
const seed = require('../data/catalog-snapshot.json');
const settings = {site_name:'Waku Test',logo_url:'https://cdn.example/logo.webp',phone:'999999999',texts:{}};
const banner = {id:'banner',title:'Banner editable',image_url:'https://cdn.example/banner.webp',link_url:'https://example.com/figura',order:1,is_active:true,placement:'carousel'};
const bundle = {settings,banners:[banner],products:seed.products,series:seed.series,collectors:seed.collectors};
test('site bundle needs exactly one request and keeps all public sections',async()=>{
 const calls=[];
 const next=await loadCatalogSnapshot('https://backend.example/api/',async(url,options)=>{calls.push(url);assert.equal(options.cache,'no-store');return Response.json(bundle);});
 assert.deepEqual(calls,['https://backend.example/api/site']);
 assert.equal(next.products.length,37);assert.equal(next.settings.site_name,'Waku Test');assert.equal(next.banners[0].id,'banner');
});
test('incomplete site bundles reject the whole refresh',async()=>{
 for(const key of ['settings','banners','products','series','collectors']){
  const value={...bundle}; delete value[key];
  await assert.rejects(loadCatalogSnapshot('https://backend.example',async()=>Response.json(value)),key);
 }
});
test('published banners replace only the showcase and settings retain the working contact for a placeholder phone',()=>{
 const html=renderToStaticMarkup(React.createElement(CatalogClient,{initialCatalog:{...seed,settings,banners:[banner]}}));
 assert.match(html,/data-site-banner="banner"/);assert.match(html,/https:\/\/cdn.example\/banner.webp/);
 assert.match(html,/https:\/\/cdn.example\/logo.webp/);assert.match(html,/https:\/\/wa.me\/51937809466/);
 assert.doesNotMatch(html,/wa.me\/999999999/);assert.match(html,/store-collection-carousel/);
});


test('banner destinations reject executable and protocol-relative links',()=>{
 const {bannerHref,siteContact}=require('../lib/site-content.ts');
 for(const url of ['javascript:alert(1)','data:text/html,hi','//evil.example','/\\evil.example','/\nevil.example'])assert.equal(bannerHref(url),undefined,url);
 assert.equal(bannerHref('/?q=Emilia'),'/?q=Emilia');assert.equal(siteContact('+51 987 654 321'),'https://wa.me/51987654321');
});

test('inactive banners are excluded and remaining banners keep their configured order',async()=>{
 const next=await loadCatalogSnapshot('https://backend.example',async()=>Response.json({...bundle,banners:[{...banner,id:'last',order:9},{...banner,id:'hidden',is_active:false},{...banner,id:'first',order:0}]}));
 assert.deepEqual(next.banners.map(b=>b.id),['first','last']);
});
