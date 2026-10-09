const test = require("node:test");
const assert = require("node:assert/strict");
const { baseProducts } = require("../data/reference-products.ts");
const { getProducts, parseCatalogResponse, ApiError } = require("../lib/products-api.ts");
const { productModal } = require("../lib/product-modal.ts");
const { selectFeaturedProducts, selectHomeSeries } = require("../lib/catalog-selectors.ts");
const { showcaseImage, sideCaptionImage } = require("../lib/catalog-presentation.ts");
const { usesReferenceArtwork } = require("../lib/reference-artwork.ts");
const product = baseProducts[1];
const { parseCommerceProducts, mergeCommerceProducts } = require("../lib/commerce-products.ts");
const commerceFixture = require("./fixtures/commerce-products.json");
const commerceMedia = require("../data/commerce-media.json");

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
  const merged = mergeCommerceProducts(baseProducts, live);
  assert.equal(live.length, 8);
  assert.equal(merged.length, 37); // Remove the other Bakugo variant by explicit choice.
  assert.ok(baseProducts.filter(p => p.id.startsWith("pdf-")).every(p => merged.includes(p)));
  const featured = selectFeaturedProducts(merged.filter(p => p.visible));
  assert.equal(featured.length, 8);
  assert.ok(featured.every(p => live.includes(p)));
  assert.equal(featured[1].id, "e9392956-c405-48ce-ac6a-45e291e80cbe");
  assert.equal(featured[1].price, 180);
  assert.equal(productModal(featured[1]).size, "23 cm");
  assert.equal(productModal(featured[1]).collection, "Ichiban Kuji");
  assert.equal(featured[1].month, "");
  assert.equal(featured[1].source, "");
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
  assert.equal(missing.series, "Sin serie");
  assert.equal(missing.image, "");
  assert.equal(productModal(missing).size, undefined);
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
  assert.deepEqual(parseCatalogResponse(await response.json()), baseProducts);
  for (const handler of [POST, PUT]) {
    const result = await handler();
    assert.equal(result.status, 501);
    assert.match((await result.json()).error, /backend/);
  }
  assert.deepEqual(parseCatalogResponse(await (await GET()).json()), baseProducts);
});

test("the existing catalog retains its data, nullable prices and editorial order", () => {
  assert.deepEqual(parseCatalogResponse({ products: baseProducts }), baseProducts);
  assert.equal(baseProducts.at(-1).price, null);
  assert.deepEqual(selectFeaturedProducts(baseProducts).map(p => p.id), [
    "DaoZfSFn3XY-1", "Da6q6QukYcK-2", "DQ2tT3EEQoO-1", "DVKO171kQPy-1",
    "DU6btvSARSm-1", "DaELkMLHwJw-1", "DaGveDbnxoS-1", "DU1S9PjgWPy-2",
  ]);
  assert.deepEqual(selectHomeSeries([...new Set(baseProducts.map(p => p.series))]), ["My Hero Academia", "Vocaloid", "One Piece", "Re:Zero"]);
});

test("a successful empty catalog replaces reference data", () => {
  assert.deepEqual(parseCatalogResponse({ products: [] }), []);
  assert.deepEqual(selectFeaturedProducts([]), []);
  assert.deepEqual(selectHomeSeries([]), []);
});

test("malformed products are rejected at the API boundary", () => {
  for (const change of [{ status: "unknown" }, { price: "150" }, { price: -1 }, { quantity: 1.5 }, { visible: 1 }, { title: null }, { gallery: ["photo.png"] }]) {
    assert.throws(() => parseCatalogResponse({ products: [{ ...product, ...change }] }));
  }
  assert.throws(() => parseCatalogResponse({ results: [] }));
});

test("backend products with new IDs and series can populate the home", () => {
  const custom = { ...product, id: "python-1", title: "Nueva figura", series: "Nueva serie", image: "https://cdn.example.com/figure.webp" };
  assert.deepEqual(selectFeaturedProducts([custom]), []);
  assert.deepEqual(selectHomeSeries([custom.series]), [custom.series]);
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
