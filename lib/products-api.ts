import { z } from "zod";
import { type Product, validStatuses } from "./product-model";

// This is the boundary between backend JSON and the UI's Product model.
export const productSchema: z.ZodType<Product> = z.object({
  id: z.string().min(1),
  title: z.string(),
  detail: z.string(),
  series: z.string(),
  price: z.number().finite().nonnegative().nullable(),
  status: z.enum(validStatuses as [typeof validStatuses[number], ...typeof validStatuses[number][]]),
  quantity: z.number().int().nonnegative().nullable(),
  month: z.string(),
  image: z.string(),
  gallery: z.array(z.object({ image: z.string(), label: z.string() })).optional(),
  source: z.string(),
  visible: z.boolean(),
  updatedAt: z.string().optional(),
});

const catalogSchema = z.object({ products: z.array(productSchema) });
const savedProductSchema = z.object({ product: productSchema });

export function parseCatalogResponse(value: unknown) {
  return catalogSchema.parse(value).products;
}

function endpoint() {
  return process.env.NEXT_PUBLIC_PRODUCTS_API_URL?.trim() || "/api/products";
}

async function requestProducts(init: RequestInit): Promise<unknown> {
  const response = await fetch(endpoint(), { cache: "no-store", ...init });
  const data: unknown = await response.json();
  if (!response.ok) {
    const failure = z.object({ error: z.string() }).safeParse(data);
    throw new Error(failure.success ? failure.data.error : "No se pudo completar la operación del catálogo.");
  }
  return data;
}

export async function getProducts(signal?: AbortSignal) {
  return parseCatalogResponse(await requestProducts({ signal }));
}

export async function saveProduct(product: Product) {
  const data = await requestProducts({
    method: product.id ? "PUT" : "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(product),
  });
  return savedProductSchema.parse(data).product;
}
