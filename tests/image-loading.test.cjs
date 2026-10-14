const test = require('node:test');
const assert = require('node:assert/strict');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const CatalogClient = require('../components/catalog-client.tsx').default;
const seed = require('../data/catalog-snapshot.json');

test('first collection row starts eagerly while later collections remain lazy', () => {
 const html = renderToStaticMarkup(React.createElement(CatalogClient, { initialCatalog: seed }));
 const sections = html.split('store-collection-stage').slice(1);
 assert.ok(sections.length >= 2);
 const first = sections[0].split('store-collection-dots')[0];
 assert.equal((first.match(/loading="eager"/g) || []).length, 4);
 assert.equal((first.match(/loading="lazy"/g) || []).length, 0);
 assert.match(sections[1], /loading="lazy"/);
});
