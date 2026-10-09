import { getProducts } from "./api/products";
import { productsResponseSchema, type Product } from "./models/product";
import { commerceReferences, getReferenceId } from "./product-presentation";

export function parseCommerceProducts(value: unknown): Product[] {
  return productsResponseSchema.parse(value).products;
}
export function mergeCommerceProducts(reference: Product[], commerce: Product[]) {
  const migrated = new Set([...Object.values(commerceReferences).map(item => item.referenceId), "Da6q6QukYcK-2"]);
  const byReference = new Map(commerce.map(item => [getReferenceId(item), item]));
  const retained = reference.flatMap(item => {
    const live = byReference.get(item.id);
    return live ? [live] : migrated.has(item.id) ? [] : [item];
  });
  return [...retained, ...commerce.filter(item => !reference.some(original => original.id === getReferenceId(item)))];
}
export const getCommerceProducts = getProducts;
