import { z } from "zod";
import { validStatuses } from "./product-model";
import type { ReferenceProduct as Product } from "./reference-product-model";

// Validation for the read-only reference catalog. Commerce Service has its own adapter.
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
export class ApiError extends Error {
  constructor(message: string, public readonly status: number) {
    super(message);
    this.name = "ApiError";
  }
}

export function parseCatalogResponse(value: unknown) {
  return catalogSchema.parse(value).products;
}

function endpoint() {
  return "/api/products";
}

async function requestJson(url: string, init: RequestInit): Promise<unknown> {
  const response = await fetch(url, { cache: "no-store", ...init });
  let data: unknown;
  try {
    data = await response.json();
  } catch {
    throw new ApiError("La API no devolvió una respuesta JSON válida.", response.status);
  }
  if (!response.ok) {
    const failure = z.object({ error: z.string() }).safeParse(data);
    throw new ApiError(failure.success ? failure.data.error : "No se pudo completar la operación del catálogo.", response.status);
  }
  return data;
}

export async function getProducts(signal?: AbortSignal) {
  return parseCatalogResponse(await requestJson(endpoint(), { signal }));
}
