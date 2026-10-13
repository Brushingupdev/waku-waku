import type { Product } from "../../lib/product-model";
import { productSpecifications } from "../../lib/product-specifications";

export function ProductSpecifications({ product }: { product: Product }) {
  const specs = productSpecifications(product);
  return <dl className="store-product-specifications">
    {specs.collection && <div><dt>Colección</dt><dd>{specs.collection}</dd></div>}
    {specs.edition && <div><dt>Edición</dt><dd>{specs.edition}</dd></div>}
    {specs.height && <div><dt>Altura</dt><dd>{specs.height}</dd></div>}
  </dl>;
}
