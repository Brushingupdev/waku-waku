const test = require('node:test');
const assert = require('node:assert/strict');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const { SeriesGallery } = require('../components/catalog/series-gallery.tsx');
const { AnimeLogoMarquee } = require('../components/catalog/anime-logo-marquee.tsx');
const { animeFilterLogos } = require('../lib/catalog-presentation.ts');

for (const name of ['Evangelion', 'Date A Live']) {
 test(`${name} uses the same backend logo in the picker and collection`, () => {
  const logo = 'https://cdn.example.com/' + encodeURIComponent(name) + '.webp';
  const series = { id: name, name, slug: name, logo_url: logo, order: 0 };
  const picker = renderToStaticMarkup(React.createElement(AnimeLogoMarquee, { series: [series], logos: {}, selected: null, onSelect() {} }));
  const gallery = renderToStaticMarkup(React.createElement(SeriesGallery, { name, logoUrl: logo, items: [], onOpen() {}, onBack() {} }));
  assert.ok(picker.includes(`src="${logo}"`));
  assert.ok(gallery.includes(`src="${logo}"`));
 });
 test(`${name} uses the colorful shared fallback when its backend logo is absent`, () => {
  const gallery = renderToStaticMarkup(React.createElement(SeriesGallery, { name, items: [], onOpen() {}, onBack() {} }));
  assert.ok(gallery.includes(`src="${animeFilterLogos[name]}"`));
 });
}
