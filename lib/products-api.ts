import { z } from "zod";
import { productsResponseSchema } from "./models/product";

export class ApiError extends Error {
  constructor(message: string, public readonly status: number) {
    super(message);
    this.name = "ApiError";
  }
}

export function parseCatalogResponse(value: unknown) {
  return productsResponseSchema.parse(value).products;
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
