import type { Product } from "./models/product";
export function productSpecifications(product: Product) {
  return { collection: product.collection, edition: product.edition, height: product.height };
}
