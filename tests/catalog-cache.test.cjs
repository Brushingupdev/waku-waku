const test = require("node:test");
const assert = require("node:assert/strict");
const { loadCatalogSnapshot, catalogSnapshotSchema } = require("../lib/catalog-snapshot.ts");
const fixture = require("./fixtures/commerce-products.json");
const seed = require("../data/catalog-snapshot.json");
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
const CatalogClient = require("../components/catalog-client.tsx").default;

test("snapshot collects validated public data together and hides inactive entries", async () => {
  const series = fixture.products[0].series;
  const snapshot = await loadCatalogSnapshot("https://backend.example", async (url) => {
    if (url.endsWith("/products")) return Response.json(fixture);
    if (url.endsWith("/series")) return Response.json([series, { ...series, id: "inactive", is_active: false }]);
    return Response.json([{ id: "hidden", name: "A", city: "Lima", figure: "A", quote: "A", slot: "feature", is_active: false }]);
  });
  assert.equal(snapshot.products.length, fixture.products.filter(p => p.visible).length);
  assert.deepEqual(snapshot.series.map(s => s.id), [series.id]);
  assert.deepEqual(snapshot.collectors, []);
  assert.ok(catalogSnapshotSchema.safeParse(snapshot).success);
});

test("a failed or malformed refresh throws instead of caching an empty or fallback catalog", async () => {
  await assert.rejects(loadCatalogSnapshot("https://backend.example", async () => Response.json({ error: "sleeping" }, { status: 503 })));
  await assert.rejects(loadCatalogSnapshot("https://backend.example", async () => Response.json({ products: [{ id: "invalid" }] })));
});

test("successful empty catalog is valid so removed products cannot reappear from the seed", async () => {
  const snapshot = await loadCatalogSnapshot("https://backend.example", async url => Response.json(url.endsWith("/products") ? { products: [] } : []));
  assert.deepEqual(snapshot.products, []);
});

test("first server render includes product images and collectors without waiting for browser API calls", () => {
  const html = renderToStaticMarkup(React.createElement(CatalogClient, { initialCatalog: seed }));
  assert.match(html, /data-product-id=/);
  assert.match(html, /collector-story-feature/);
  assert.doesNotMatch(html, /Cargando catálogo|Cargando experiencias/);
  assert.match(html, /fetchPriority="high"/);
  assert.match(html, /supabase\.co/);
});

test("empty published data stays empty on the first render", () => {
  const html = renderToStaticMarkup(React.createElement(CatalogClient, { initialCatalog: { ...seed, products: [], collectors: [] } }));
  assert.doesNotMatch(html, /data-product-id=/);
  assert.doesNotMatch(html, /Cargando catálogo|Cargando experiencias/);
});
