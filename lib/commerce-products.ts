import { getProducts } from "./api/products";
import { productsResponseSchema, type Product as CommerceProduct } from "./models/product";
import type { Product } from "./product-model";

// Reviewed UUID associations. Bakugo 23 cm belongs to the first reference
// product, never to the 25 cm / S/150 poster in the main carousel.
export const commerceReferences: Record<string, { referenceId: string; file: string }> = {
  "e9392956-c405-48ce-ac6a-45e291e80cbe": { referenceId: "Da6q6QukYcK-1", file: "bakugo" },
  "10b1a137-4df9-42db-8d84-c8111b625edc": { referenceId: "DaGveDbnxoS-1", file: "douma" },
  "95b8d9d1-8dae-49a5-9ac8-9d1497cd7761": { referenceId: "DU6btvSARSm-1", file: "gojo" },
  "ead9d117-12fe-4160-8b44-81278d081a90": { referenceId: "DaELkMLHwJw-1", file: "killua" },
  "90f9e03c-83b1-41bc-a506-7fda36129264": { referenceId: "DVKO171kQPy-1", file: "law" },
  "945d96e8-5411-4aa6-90e3-62c42be2fe43": { referenceId: "DQ2tT3EEQoO-1", file: "miku" },
  "2a5e8649-bd0b-46e7-8d6d-6e76a8b9fa1e": { referenceId: "DU1S9PjgWPy-2", file: "rem" },
  "52b5480a-f8b5-4ee9-917e-e8a9697468d8": { referenceId: "DaoZfSFn3XY-1", file: "toga" },
};

export function parseCommerceProducts(value: unknown): Product[] {
  return adaptCommerceProducts(productsResponseSchema.parse(value).products);
}

function adaptCommerceProducts(products: CommerceProduct[]): Product[] {
  return products.map(item => ({
    id: item.id, referenceId: commerceReferences[item.id]?.referenceId,
    title: item.title, seriesId: item.series_id, series: item.series?.name || "Sin serie",
    collection: item.collection, edition: item.edition, height: item.height,
    detail: [item.collection, item.edition, item.height].filter(Boolean).join(" · "),
    price: item.price, status: item.status, quantity: item.quantity,
    image: item.image || "", gallery: item.gallery, highlights: item.highlights,
    visible: item.visible, month: "", source: "",
  }));
}

export function mergeCommerceProducts(reference: Product[], commerce: Product[]) {
  // A missing backend record must not silently revive its old reference data.
  const migrated = new Set([...Object.values(commerceReferences).map(item => item.referenceId), "Da6q6QukYcK-2"]);
  const byReference = new Map(commerce.filter(item => item.referenceId).map(item => [item.referenceId, item]));
  const retained = reference.flatMap(item => {
    const live = byReference.get(item.id);
    return live ? [live] : migrated.has(item.id) ? [] : [item];
  });
  return [...retained, ...commerce.filter(item => !item.referenceId || !reference.some(original => original.id === item.referenceId))];
}

export async function getCommerceProducts(signal?: AbortSignal) {
  return adaptCommerceProducts(await getProducts(signal));
}
