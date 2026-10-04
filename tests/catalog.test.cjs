const test = require("node:test");
const assert = require("node:assert/strict");
const { baseProducts } = require("../data/reference-products.ts");
const { getProducts, saveProduct, parseCatalogResponse } = require("../lib/products-api.ts");
const { productModal } = require("../lib/product-modal.ts");
const { selectFeaturedProducts, selectHomeSeries } = require("../lib/catalog-selectors.ts");
const { showcaseImage, sideCaptionImage } = require("../lib/catalog-presentation.ts");
const { usesReferenceArtwork } = require("../lib/reference-artwork.ts");
const product = baseProducts[1];

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

test("list and save share the configurable endpoint and preserve HTTP errors", async () => {
  const previousFetch = global.fetch;
  const previousUrl = process.env.NEXT_PUBLIC_PRODUCTS_API_URL;
  const calls = [];
  process.env.NEXT_PUBLIC_PRODUCTS_API_URL = "https://backend.example.com/products";
  try {
    global.fetch = async (url, init) => {
      calls.push({ url, init });
      return Response.json(init.method ? { product: { ...product, price: 150.5 } } : { products: [] });
    };
    const controller = new AbortController();
    assert.deepEqual(await getProducts(controller.signal), []);
    assert.equal((await saveProduct(product)).price, 150.5);
    await saveProduct({ ...product, id: "" });
    assert.equal(calls[0].init.signal, controller.signal);
    assert.equal(calls[1].init.method, "PUT");
    assert.equal(calls[2].init.method, "POST");
    assert.ok(calls.every(call => call.url === process.env.NEXT_PUBLIC_PRODUCTS_API_URL));
    assert.deepEqual(JSON.parse(calls[1].init.body), product);
    global.fetch = async () => Response.json({ error: "Inicia sesión" }, { status: 401 });
    await assert.rejects(saveProduct(product), /Inicia sesión/);
    global.fetch = async () => Response.json({ products: baseProducts, error: "Sin conexión" }, { status: 503 });
    await assert.rejects(getProducts(), /Sin conexión/);
  } finally {
    global.fetch = previousFetch;
    if (previousUrl === undefined) delete process.env.NEXT_PUBLIC_PRODUCTS_API_URL;
    else process.env.NEXT_PUBLIC_PRODUCTS_API_URL = previousUrl;
  }
});
