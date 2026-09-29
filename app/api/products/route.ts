import { env } from "cloudflare:workers";
import { baseProducts } from "../../../lib/catalog";
import { type Product, validStatuses } from "../../../lib/product-model";

export const dynamic = "force-dynamic";

type DbRow = Omit<Product, "visible" | "status"> & { visible: number; status: Product["status"]; updated_at: string };

function database() {
  if (!env.DB) throw new Error("La base de datos no está disponible.");
  return env.DB;
}

async function loadProducts(): Promise<Product[]> {
  const { results } = await database().prepare("SELECT * FROM product_edits ORDER BY updated_at DESC").all<DbRow>();
  const edits = new Map((results ?? []).map((row) => [row.id, {
    id: row.id,
    title: row.title,
    detail: row.detail,
    series: row.series,
    price: row.price,
    status: row.status,
    quantity: row.quantity,
    month: row.month,
    image: row.image,
    source: row.source,
    visible: Boolean(row.visible),
    updatedAt: row.updated_at,
  } satisfies Product]));
  const known = baseProducts.map((product) => edits.get(product.id) ?? product);
  const custom = [...edits.values()].filter((product) => !baseProducts.some((base) => base.id === product.id));
  return [...known, ...custom];
}

function authorized(request: Request) {
  return Boolean(request.headers.get("oai-authenticated-user-id"));
}

function parseProduct(value: unknown, id: string): Product {
  if (!value || typeof value !== "object") throw new Error("Datos de producto inválidos.");
  const raw = value as Record<string, unknown>;
  const title = String(raw.title ?? "").trim();
  if (!title || title.length > 120) throw new Error("Ingresa un nombre de hasta 120 caracteres.");
  const price = raw.price === "" || raw.price === null || raw.price === undefined ? null : Number(raw.price);
  if (price !== null && (!Number.isInteger(price) || price < 0 || price > 100000)) throw new Error("Ingresa un precio válido en soles.");
  const quantity = raw.quantity === "" || raw.quantity === null || raw.quantity === undefined ? null : Number(raw.quantity);
  if (quantity !== null && (!Number.isInteger(quantity) || quantity < 0 || quantity > 100000)) throw new Error("Ingresa una cantidad válida.");
  const status = String(raw.status ?? "por_confirmar") as Product["status"];
  if (!validStatuses.includes(status)) throw new Error("Estado no válido.");
  const image = String(raw.image ?? "").trim();
  if (image && !image.startsWith("/catalogo/")) throw new Error("Elige una imagen del catálogo cargado.");
  return {
    id,
    title,
    detail: String(raw.detail ?? "").trim().slice(0, 180),
    series: String(raw.series ?? "").trim().slice(0, 100),
    price,
    status,
    quantity,
    month: String(raw.month ?? "").trim().slice(0, 60),
    image,
    source: String(raw.source ?? "").trim().slice(0, 300),
    visible: raw.visible !== false,
  };
}

async function saveProduct(product: Product): Promise<Product> {
  const updatedAt = new Date().toISOString();
  await database().prepare(`INSERT INTO product_edits (id,title,detail,series,price,status,quantity,month,image,source,visible,updated_at)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?)
    ON CONFLICT(id) DO UPDATE SET title=excluded.title,detail=excluded.detail,series=excluded.series,price=excluded.price,status=excluded.status,quantity=excluded.quantity,month=excluded.month,image=excluded.image,source=excluded.source,visible=excluded.visible,updated_at=excluded.updated_at`)
    .bind(product.id, product.title, product.detail, product.series, product.price, product.status, product.quantity, product.month, product.image, product.source, product.visible ? 1 : 0, updatedAt).run();
  return { ...product, updatedAt };
}

export async function GET() {
  try { return Response.json({ products: await loadProducts() }); }
  catch { return Response.json({ products: baseProducts, error: "No se pudieron cargar los cambios guardados." }, { status: 503 }); }
}

export async function PUT(request: Request) {
  if (!authorized(request)) return Response.json({ error: "Inicia sesión para editar el catálogo." }, { status: 401 });
  try {
    const body = await request.json() as Record<string, unknown>;
    const id = String(body.id ?? "");
    if (!id || id.length > 100) return Response.json({ error: "Producto inválido." }, { status: 400 });
    const exists = (await loadProducts()).some((product) => product.id === id);
    if (!exists) return Response.json({ error: "Producto no encontrado." }, { status: 404 });
    return Response.json({ product: await saveProduct(parseProduct(body, id)) });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "No se pudo guardar el producto." }, { status: 400 });
  }
}

export async function POST(request: Request) {
  if (!authorized(request)) return Response.json({ error: "Inicia sesión para editar el catálogo." }, { status: 401 });
  try {
    const body = await request.json() as Record<string, unknown>;
    const product = parseProduct(body, `nuevo-${crypto.randomUUID()}`);
    return Response.json({ product: await saveProduct(product) }, { status: 201 });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "No se pudo crear el producto." }, { status: 400 });
  }
}
