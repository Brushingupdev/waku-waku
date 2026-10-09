const test = require("node:test");
const assert = require("node:assert/strict");
const { baseProducts: legacyProducts } = require("../data/reference-products.ts");
const { referenceCatalogProducts: baseProducts } = require("../lib/product-presentation.ts");
const { getProducts, parseCatalogResponse, ApiError } = require("../lib/products-api.ts");
const { productModal } = require("../lib/product-modal.ts");
const { selectFeaturedProducts, selectHomeSeries } = require("../lib/catalog-selectors.ts");
const { showcaseImage, sideCaptionImage } = require("../lib/catalog-presentation.ts");
const { usesReferenceArtwork } = require("../lib/reference-artwork.ts");
const product = baseProducts[1];
const { parseCommerceProducts, mergeCommerceProducts, getCommerceProducts } = require("../lib/commerce-products.ts");
const commerceFixture = require("./fixtures/commerce-products.json");
const commerceMedia = require("../data/commerce-media.json");
const { getSeries } = require("../lib/api/series.ts");
const { ApiError: CommerceApiError } = require("../lib/api/client.ts");
const { productSpecifications } = require("../lib/product-specifications.ts");
const { wa } = require("../lib/product-format.ts");

test("series requests sort the backend order, accept missing logos and forward cancellation", async () => {
  const previousFetch = global.fetch;
  const controller = new AbortController();
  try {
    global.fetch = async (url, options) => {
      assert.match(url, /\/series$/);
      assert.equal(options.signal, controller.signal);
      return Response.json([
        { id: "second", name: "Second", slug: "second", order: 2, logo_url: null },
        { id: "first", name: "First", slug: "first", order: 1, logo_url: "https://cdn.example.com/logo.webp" },
      ]);
    };
    const series = await getSeries(controller.signal);
    assert.deepEqual(series.map(item => item.id), ["first", "second"]);
    assert.equal(series[1].logo_url, "");
    global.fetch = async () => Response.json({ error: "Unavailable" }, { status: 503 });
    await assert.rejects(getSeries(), error => error instanceof CommerceApiError && error.status === 503);
    global.fetch = async () => Response.json([{ id: "bad", name: "Bad", slug: "bad", order: "1" }]);
    await assert.rejects(getSeries());
  } finally { global.fetch = previousFetch; }
});

test("approved cloud media preserves compositions and respects new API images and prices", () => {
  const products = parseCommerceProducts(commerceFixture).map(p => ({ ...p, image: commerceMedia[p.id].image, gallery: commerceMedia[p.id].gallery.map(({ image, label }) => ({ image, label })) }));
  const toga = products.find(p => p.title === "Toga vs Uraraka");
  assert.equal(showcaseImage(toga, true), commerceMedia[toga.id].presentation.hero);
  assert.equal(sideCaptionImage(toga), commerceMedia[toga.id].presentation.lettering);
  assert.ok(productModal(toga).photos.some(photo => photo.provenance));
  assert.equal(showcaseImage({ ...toga, price: 999 }, true), toga.image);
  const replacement = { ...toga, image: "https://cdn.example.com/replacement.webp", gallery: [] };
  assert.equal(usesReferenceArtwork(replacement), false);
  assert.equal(showcaseImage(replacement, true), replacement.image);
  assert.equal(sideCaptionImage(replacement), undefined);
  const bakugo = products.find(p => p.title === "Katsuki Bakugo");
  assert.equal(showcaseImage(bakugo, true), bakugo.image);
  assert.equal(productModal(bakugo).photos.length, 3);
});

test("Commerce Service preserves UUIDs, structured fields and the remaining catalog", () => {
  const live = parseCommerceProducts(commerceFixture);
  assert.deepEqual(live, commerceFixture.products);
  const merged = mergeCommerceProducts(baseProducts, live);
  assert.equal(live.length, 8);
  assert.equal(merged.length, 37); // Remove the other Bakugo variant by explicit choice.
  assert.ok(baseProducts.filter(p => p.id.startsWith("pdf-")).every(p => merged.includes(p)));
  const featured = selectFeaturedProducts(merged.filter(p => p.visible));
  assert.equal(featured.length, 8);
  assert.ok(featured.every(p => live.includes(p)));
  assert.equal(featured[1].id, "e9392956-c405-48ce-ac6a-45e291e80cbe");
  assert.equal(featured[1].price, 180);
  assert.ok(!("detail" in featured[1]));
  assert.deepEqual(productSpecifications(featured[1]), { collection: "Ichiban Kuji", edition: "Premio B", height: "23 cm" });
  const inquiry = new URL(wa(featured[1])).searchParams.get("text");
  assert.match(inquiry, /Colección: Ichiban Kuji\nEdición: Premio B\nAltura: 23 cm/);
  assert.equal(productModal(featured[1]).size, "23 cm");
  assert.equal(productModal(featured[1]).collection, "Ichiban Kuji");
  assert.ok(!("month" in featured[1]));
  assert.ok(!("source" in featured[1]));
  assert.equal(showcaseImage(featured[1], true), featured[1].image);
  assert.match(showcaseImage(featured[0], true), /carousel-energy\/toga.png$/);
  assert.equal(merged.find(p => p.id === featured[0].id), featured[0]);
});

test("Commerce validation rejects invalid status, mismatched series and broken payloads", () => {
  const item = commerceFixture.products[0];
  for (const change of [{ status: "UNKNOWN" }, { series: { ...item.series, id: "wrong" } }, { quantity: -1 }, { price: "180" }, { gallery: ["photo"] }]) {
    assert.throws(() => parseCommerceProducts({ products: [{ ...item, ...change }] }));
  }
  const [missing] = parseCommerceProducts({ products: [{ ...item, series: null, image: null, gallery: [], collection: null, edition: null, height: null }] });
  assert.equal(missing.series, null);
  assert.equal(missing.image, null);
  assert.equal(productModal(missing).size, undefined);
  const stale = { ...missing, detail: "Otra colección · Otra edición · 99 cm" };
  assert.deepEqual(productSpecifications(stale), { collection: null, edition: null, height: null });
});

test("the products service validates the shared model without changing the API product structure", async () => {
  const previousFetch = global.fetch;
  const controller = new AbortController();
  try {
    global.fetch = async (url, options) => {
      assert.match(url, /\/products$/);
      assert.equal(options.signal, controller.signal);
      return Response.json(commerceFixture);
    };
    assert.deepEqual(await getCommerceProducts(controller.signal), parseCommerceProducts(commerceFixture));
    const item = commerceFixture.products[0];
    global.fetch = async () => Response.json({ products: [{ ...item, series: null, image: null }] });
    const [missing] = await getCommerceProducts();
    assert.equal(missing.series, null);
    assert.equal(missing.image, null);
    global.fetch = async () => Response.json({ products: [{ ...item, series_id: "mismatched" }] });
    await assert.rejects(getCommerceProducts());
  } finally { global.fetch = previousFetch; }
});

test("missing and hidden migrated products do not revive old records or stale posters", () => {
  const live = parseCommerceProducts(commerceFixture);
  const removed = mergeCommerceProducts(baseProducts, live.filter(p => p.title !== "Douma"));
  assert.ok(!removed.some(p => p.title === "Douma"));
  const toga = live.find(p => p.title === "Toga vs Uraraka");
  assert.equal(showcaseImage({ ...toga, price: 999 }, true), toga.image);
  const hidden = mergeCommerceProducts(baseProducts, live.map(p => ({ ...p, visible: false })));
  assert.deepEqual(selectFeaturedProducts(hidden.filter(p => p.visible)), []);
});

test("the Vercel reference endpoint is readable and cannot persist writes", async () => {
  const { GET, POST, PUT } = require("../app/api/products/route.ts");
  const response = await GET();
  assert.equal(response.status, 200);
  assert.deepEqual(parseCatalogResponse(await response.json()), legacyProducts);
  for (const handler of [POST, PUT]) {
    const result = await handler();
    assert.equal(result.status, 501);
    assert.match((await result.json()).error, /backend/);
  }
  assert.deepEqual(parseCatalogResponse(await (await GET()).json()), legacyProducts);
});

test("the existing catalog retains its data, nullable prices and editorial order", () => {
  assert.deepEqual(parseCatalogResponse({ products: legacyProducts }), legacyProducts);
  assert.equal(baseProducts.at(-1).price, null);
  assert.deepEqual(selectFeaturedProducts(baseProducts).map(p => p.id), [
    "DaoZfSFn3XY-1", "Da6q6QukYcK-2", "DQ2tT3EEQoO-1", "DVKO171kQPy-1",
    "DU6btvSARSm-1", "DaELkMLHwJw-1", "DaGveDbnxoS-1", "DU1S9PjgWPy-2",
  ]);
  assert.deepEqual(selectHomeSeries([...new Set(baseProducts.map(p => p.series.name))]), ["My Hero Academia", "Vocaloid", "One Piece", "Re:Zero"]);
});

test("a successful empty catalog replaces reference data", () => {
  assert.deepEqual(parseCatalogResponse({ products: [] }), []);
  assert.deepEqual(selectFeaturedProducts([]), []);
  assert.deepEqual(selectHomeSeries([]), []);
});

test("malformed products are rejected at the API boundary", () => {
  for (const change of [{ status: "unknown" }, { price: "150" }, { price: -1 }, { quantity: 1.5 }, { visible: 1 }, { title: null }, { gallery: ["photo.png"] }]) {
    assert.throws(() => parseCatalogResponse({ products: [{ ...legacyProducts[1], ...change }] }));
  }
  assert.throws(() => parseCatalogResponse({ results: [] }));
});

test("backend products with new IDs and series can populate the home", () => {
  const custom = { ...product, id: "python-1", title: "Nueva figura", series_id: "new-series", series: { id: "new-series", name: "Nueva serie", slug: "new-series", logo_url: "", order: 0 }, image: "https://cdn.example.com/figure.webp" };
  assert.deepEqual(selectFeaturedProducts([custom]), []);
  assert.deepEqual(selectHomeSeries([custom.series.name]), [custom.series.name]);
  assert.equal(showcaseImage(custom, true), custom.image);
  assert.deepEqual(productModal(custom).photos, [{ image: custom.image, label: "Foto original", provenance: undefined }]);
});

test("backend images and galleries override reference artwork even with existing IDs", () => {
  const changed = { ...product, image: "https://cdn.example.com/new.webp", price: 150.5 };
  assert.equal(usesReferenceArtwork(changed), false);
  assert.equal(showcaseImage(changed, true), changed.image);
  assert.equal(sideCaptionImage(changed), undefined);
  assert.deepEqual(selectFeaturedProducts([{ ...product, price: 150.5 }]), []);
  assert.deepEqual(selectFeaturedProducts([{ ...product, status: "disponible" }]), []);
  assert.equal(productModal(changed).photos[0].image, changed.image);
  const gallery = [{ image: "https://cdn.example.com/front.webp", label: "Frontal" }, { image: "https://cdn.example.com/back.webp", label: "Posterior" }];
  assert.deepEqual(productModal({ ...product, gallery }).photos, gallery);
  assert.equal(usesReferenceArtwork({ ...product, title: "Otra figura" }), false);
  assert.equal(usesReferenceArtwork(product), true);
  assert.equal(productModal(product).photos.length, 6);
});

test("non-JSON backend responses become a readable API error", async () => {
  const previousFetch = global.fetch;
  try {
    global.fetch = async () => new Response("Unavailable", { status: 502 });
    await assert.rejects(getProducts(), error => error instanceof ApiError && error.status === 502 && /JSON/.test(error.message));
  } finally { global.fetch = previousFetch; }
});
