const test = require("node:test");
const assert = require("node:assert/strict");
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
const CollectorCommunity = require("../components/collector-community.tsx").default;
const { getCollectors } = require("../lib/api/collectors.ts");

test("collectors loading preserves the mosaic slots without interactive cards", () => {
  const html = renderToStaticMarkup(React.createElement(CollectorCommunity, { whatsappIcon: null }));
  assert.match(html, /Cargando experiencias/);
  assert.match(html, /collector-community-mosaic/);
  for (const slot of ["feature", "top-center", "top-right", "bottom-center", "bottom-right", "float"]) {
    assert.match(html, new RegExp(`collector-story-${slot}`));
  }
  assert.match(html, /aria-busy="true"/);
});

test("collectors API preserves data, order and cancellation without inactive entries", async () => {
  const original = global.fetch;
  const controller = new AbortController();
  try {
    global.fetch = async (_, options) => {
      assert.equal(options.signal, controller.signal);
      return Response.json([
        { id: "second", name: "B", city: "Lima", figure: "Figura", quote: "Bien", slot: "top-center", order: 2 },
        { id: "hidden", name: "C", city: "Lima", figure: "Figura", quote: "Bien", slot: "float", order: 0, is_active: false },
        { id: "first", name: "A", city: "Lima", figure: "Figura", quote: "Bien", slot: "feature", order: 1, image_url: null },
      ]);
    };
    const items = await getCollectors(controller.signal);
    assert.deepEqual(items.map(item => item.id), ["first", "second"]);
    assert.equal(items[0].image_url, "");
  } finally { global.fetch = original; }
});

test("unconfigured reference collectors endpoint returns a controlled JSON error", async () => {
  const { GET } = require("../app/api/collectors/route.ts");
  const response = await GET();
  assert.equal(response.status, 503);
  assert.equal(typeof (await response.json()).error, "string");
});
