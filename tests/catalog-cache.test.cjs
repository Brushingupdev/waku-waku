const test = require("node:test");
const assert = require("node:assert/strict");
const { loadCatalogSnapshot, catalogSnapshotSchema } = require("../lib/catalog-snapshot.ts");
const fixture = require("./fixtures/commerce-products.json");
const seed = require("../data/catalog-snapshot.json");
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
const CatalogClient = require("../components/catalog-client.tsx").default;
const { requestCatalogSnapshot } = require("../lib/catalog-refresh.ts");

test("a stalled browser request expires and a later request can recover", async () => {
  const signal = new AbortController().signal;
  const stalled = async (_, options) => new Promise((resolve, reject) => {
    options.signal.addEventListener("abort", () => reject(new DOMException("Timed out", "AbortError")), { once: true });
  });
  await assert.rejects(requestCatalogSnapshot(signal, stalled, 20), { name: "AbortError" });
  const next = await requestCatalogSnapshot(signal, async () => Response.json(seed), 20);
  assert.equal(next.products.length, 37);
});

test("leaving the page aborts its background request", async () => {
  const controller = new AbortController();
  const stalled = async (_, options) => new Promise((resolve, reject) => {
    options.signal.addEventListener("abort", () => reject(new DOMException("Page closed", "AbortError")), { once: true });
  });
  const pending = requestCatalogSnapshot(controller.signal, stalled, 1000);
  controller.abort();
  await assert.rejects(pending, { name: "AbortError" });
});

test("snapshot collects validated public data together and hides inactive entries", async () => {
  const series = fixture.products[0].series;
  const snapshot = await loadCatalogSnapshot("https://backend.example", async () => Response.json({
    settings: {site_name:"Waku Waku"}, banners: [], products: fixture.products,
    series: [series, { ...series, id: "inactive", is_active: false }],
    collectors: [{ id: "hidden", name: "A", city: "Lima", figure: "A", quote: "A", slot: "feature", is_active: false }],
  }));
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
  const snapshot = await loadCatalogSnapshot("https://backend.example", async () => Response.json({settings:{site_name:"Waku Waku"},banners:[],products:[],series:[],collectors:[]}));
  assert.deepEqual(snapshot.products, []);
});

test("first server render includes product images and collectors without waiting for browser API calls", () => {
  const html = renderToStaticMarkup(React.createElement(CatalogClient, { initialCatalog: seed }));
  assert.match(html, /store-collection-carousel/);
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
