import { z, type ZodTypeAny } from "zod";

const BASE = process.env.NEXT_PUBLIC_API_URL?.trim() || "/api";

export class ApiError extends Error {
  readonly status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

type RequestOptions = {
  signal?: AbortSignal;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
};

async function request<S extends ZodTypeAny>(path: string, schema: S, options: RequestOptions = {}): Promise<z.output<S>> {
  const { signal, method = "GET", body } = options;

  const response = await fetch(`${BASE}${path}`, {
    cache: "no-store",
    method,
    signal,
    headers: body !== undefined ? { "content-type": "application/json" } : undefined,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const raw = await response.text();
  let data: unknown;
  try {
    data = raw ? JSON.parse(raw) : null;
  } catch {
    throw new ApiError(
      `Respuesta no-JSON en ${path} (HTTP ${response.status}). ¿Está el backend en marcha?`,
      response.status,
    );
  }

  if (!response.ok) {
    const parsed = z.object({ error: z.string() }).safeParse(data);
    throw new ApiError(parsed.success ? parsed.data.error : `Error al llamar a ${path}.`, response.status);
  }

  return schema.parse(data);
}

export const api = {
  get: <S extends ZodTypeAny>(path: string, schema: S, signal?: AbortSignal) => request(path, schema, { signal }),
  post: <S extends ZodTypeAny>(path: string, schema: S, body: unknown) => request(path, schema, { method: "POST", body }),
  put: <S extends ZodTypeAny>(path: string, schema: S, body: unknown) => request(path, schema, { method: "PUT", body }),
  patch: <S extends ZodTypeAny>(path: string, schema: S, body: unknown) => request(path, schema, { method: "PATCH", body }),
  del: <S extends ZodTypeAny>(path: string, schema: S, signal?: AbortSignal) => request(path, schema, { method: "DELETE", signal }),
};
