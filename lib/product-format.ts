import type { Product } from "./product-model";

export const wa = (product: Product) => `https://wa.me/51937809466?text=${encodeURIComponent(`Hola, vi ${product.title} (${product.detail}) en el catálogo Waku Waku. ¿Me confirman precio y disponibilidad?`)}`;
export const money = (value: number | null) => value === null ? "Consultar" : `S/ ${value}`;
