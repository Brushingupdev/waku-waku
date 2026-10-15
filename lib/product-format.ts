import { siteContact } from "./site-content";
import type { Product } from "./product-model";
import { productSpecifications } from "./product-specifications";

export const wa = (product: Product, phone?: string | null) => {
  const specs = productSpecifications(product);
  const fields = [specs.collection && `Colección: ${specs.collection}`, specs.edition && `Edición: ${specs.edition}`, specs.height && `Altura: ${specs.height}`].filter(Boolean);
  return `${siteContact(phone)}?text=${encodeURIComponent([`Hola, vi ${product.title} en el catálogo Waku Waku.`, ...fields, "¿Me confirman precio y disponibilidad?"].join("\n"))}`;
};
export const money = (value: number | null) => value === null ? "Consultar" : `S/ ${value}`;
