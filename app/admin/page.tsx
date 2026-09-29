"use client";

import { useEffect, useMemo, useState } from "react";
import { baseProducts, pdfGroups } from "../../lib/catalog";
import { type Product, type ProductStatus, statusLabels, validStatuses } from "../../lib/product-model";

const blank: Product = { id: "", title: "", detail: "", series: "", price: null, status: "por_confirmar", quantity: null, month: "", image: "/catalogo/pdf/pagina-04.jpg", source: "PDF página 4", visible: true };
type CatalogTool = { name: string; title: string; description: string; inputSchema: object; annotations: { readOnlyHint: boolean; untrustedContentHint: boolean }; execute: (input: unknown) => unknown | Promise<unknown> };
type ToolDocument = Document & { modelContext?: { registerTool: (tool: CatalogTool, options: { signal: AbortSignal }) => void | Promise<void> } };

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>(baseProducts);
  const [selectedId, setSelectedId] = useState(baseProducts[0].id);
  const [draft, setDraft] = useState<Product>({ ...baseProducts[0] });
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    fetch("/api/products", { cache: "no-store" }).then(async (response) => {
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "No se pudo cargar el catálogo.");
      setProducts(data.products);
      setDraft({ ...data.products[0] });
      setSelectedId(data.products[0].id);
    }).catch((error) => setLoadError(error instanceof Error ? error.message : "No se pudo cargar el catálogo."));
  }, []);

  const shown = useMemo(() => products.filter((product) => `${product.title} ${product.detail} ${product.series}`.toLocaleLowerCase("es").includes(search.toLocaleLowerCase("es"))), [products, search]);
  const counts = useMemo(() => ({ total: products.length, confirm: products.filter((x) => x.status === "por_confirmar").length, available: products.filter((x) => x.status === "disponible").length, separated: products.filter((x) => x.status === "separado").length }), [products]);

  useEffect(() => {
    const context = (document as ToolDocument).modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();
    const tools: CatalogTool[] = [
      { name: "list_catalog_products", title: "Listar productos", description: "Lee los productos visibles en el panel de Waku Waku y sus estados actuales.", inputSchema: { type: "object", properties: {}, additionalProperties: false }, annotations: { readOnlyHint: true, untrustedContentHint: false }, execute: () => products.map(({ id, title, price, status, quantity }) => ({ id, title, price, status, quantity })) },
      { name: "update_catalog_product", title: "Actualizar producto", description: "Actualiza precio, cantidad o estado de un producto existente y refleja el cambio en el panel.", inputSchema: { type: "object", properties: { id: { type: "string" }, price: { type: ["number", "null"] }, quantity: { type: ["integer", "null"] }, status: { type: "string", enum: validStatuses } }, required: ["id"], additionalProperties: false }, annotations: { readOnlyHint: false, untrustedContentHint: false }, async execute(input) {
        const patch = input as { id?: string; price?: number | null; quantity?: number | null; status?: ProductStatus };
        const current = products.find((product) => product.id === patch.id);
        if (!current) throw new Error("Producto no encontrado.");
        const next = { ...current, ...(patch.price !== undefined ? { price: patch.price } : {}), ...(patch.quantity !== undefined ? { quantity: patch.quantity } : {}), ...(patch.status !== undefined ? { status: patch.status } : {}) };
        const response = await fetch("/api/products", { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify(next) });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "No se pudo guardar.");
        const saved = data.product as Product;
        setProducts((items) => items.map((item) => item.id === saved.id ? saved : item));
        setDraft((currentDraft) => currentDraft.id === saved.id ? saved : currentDraft);
        return { id: saved.id, price: saved.price, quantity: saved.quantity, status: saved.status };
      } },
    ];
    for (const tool of tools) void Promise.resolve(context.registerTool(tool, { signal: lifecycle.signal })).catch(() => {});
    return () => lifecycle.abort();
  }, [products]);

  function select(product: Product) { setSelectedId(product.id); setDraft({ ...product }); setMessage(""); }
  function setField<K extends keyof Product>(field: K, value: Product[K]) { setDraft((current) => ({ ...current, [field]: value })); }

  async function save() {
    if (saving) return;
    setSaving(true); setMessage("");
    try {
      const response = await fetch("/api/products", { method: draft.id ? "PUT" : "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(draft) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "No se pudo guardar.");
      const saved = data.product as Product;
      setProducts((current) => current.some((item) => item.id === saved.id) ? current.map((item) => item.id === saved.id ? saved : item) : [...current, saved]);
      setDraft(saved); setSelectedId(saved.id); setMessage("Cambios guardados. El catálogo ya muestra esta información.");
    } catch (error) { setMessage(error instanceof Error ? error.message : "No se pudo guardar."); }
    finally { setSaving(false); }
  }

  return <main className="admin-shell">
    <header className="admin-header"><a href="/" className="admin-brand"><span className="brand-mark">わく<br/>わく</span><strong>waku waku</strong></a><span>Panel del catálogo</span><a href="/" className="admin-back">Ver catálogo ↗</a></header>
    <div className="admin-main"><div className="admin-title"><div><span className="eyebrow">GESTIÓN DE PRODUCTOS</span><h1>Tu catálogo, al día.</h1><p>Edita precio, cantidad y estado. Guarda para actualizar las fichas del catálogo.</p></div><button type="button" className="primary-button" onClick={() => { setSelectedId(""); setDraft({ ...blank }); setMessage(""); }}>+ Nuevo producto</button></div>
      <div className="admin-stats"><div><strong>{counts.total}</strong><span>Productos</span></div><div><strong>{counts.confirm}</strong><span>Por confirmar</span></div><div><strong>{counts.available}</strong><span>Disponibles</span></div><div><strong>{counts.separated}</strong><span>Separados</span></div></div>
      {loadError && <p className="notice" role="alert">{loadError} No podrás editar hasta que vuelva a estar disponible.</p>}
      <div className="admin-layout"><aside className="admin-list"><label className="search-box"><span aria-hidden="true">⌕</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar producto" aria-label="Buscar producto" /></label><div className="admin-list-items">{shown.map((product) => <button type="button" className={`admin-list-item ${selectedId === product.id ? "selected" : ""}`} key={product.id} onClick={() => select(product)}><img src={product.image || "/favicon.svg"} alt=""/><span><strong>{product.title}</strong><small>{product.price === null ? "Sin precio" : `S/ ${product.price}`} · {statusLabels[product.status]}</small></span><span aria-hidden="true">›</span></button>)}</div></aside>
      <section className="editor" aria-labelledby="editor-title"><div className="editor-heading"><div><span className="eyebrow">FICHA DE PRODUCTO</span><h2 id="editor-title">{draft.id ? "Editar producto" : "Nuevo producto"}</h2></div><span className={`editor-status status-${draft.status}`}>{statusLabels[draft.status]}</span></div><div className="editor-content"><div className="editor-fields"><label>Nombre<input value={draft.title} onChange={(event) => setField("title", event.target.value)} placeholder="Ej. Hatsune Miku" required /></label><div className="form-row"><label>Serie<input value={draft.series} onChange={(event) => setField("series", event.target.value)} placeholder="Ej. Vocaloid" /></label><label>Detalle<input value={draft.detail} onChange={(event) => setField("detail", event.target.value)} placeholder="Línea, tamaño o variante" /></label></div><div className="form-row"><label>Precio (S/)<input type="number" min="0" step="1" value={draft.price ?? ""} onChange={(event) => setField("price", event.target.value === "" ? null : Number(event.target.value))} placeholder="Sin confirmar" /></label><label>Cantidad<input type="number" min="0" step="1" value={draft.quantity ?? ""} onChange={(event) => setField("quantity", event.target.value === "" ? null : Number(event.target.value))} placeholder="Sin registrar" /></label></div><div className="form-row"><label>Estado<select value={draft.status} onChange={(event) => setField("status", event.target.value as ProductStatus)}>{validStatuses.map((status) => <option key={status} value={status}>{statusLabels[status]}</option>)}</select></label><label>Mes anunciado<input value={draft.month} onChange={(event) => setField("month", event.target.value)} placeholder="Ej. Enero 2027" /></label></div><label>Imagen<select value={draft.image} onChange={(event) => { const image = event.target.value; setField("image", image); if (image.startsWith("/catalogo/pdf/")) setField("source", `PDF página ${Number(image.match(/\d+(?=\.jpg)/)?.[0] ?? 0)}`); }}><option value={draft.image}>{draft.image.startsWith("/catalogo/pdf/") ? `PDF · página ${Number(draft.image.match(/\d+(?=\.jpg)/)?.[0] ?? 0)}` : "Imagen actual de Instagram"}</option>{pdfGroups.flatMap((group) => group.pages.map((page) => <option key={page} value={`/catalogo/pdf/pagina-${String(page).padStart(2, "0")}.jpg`}>{group.month} · página {page}</option>))}</select></label><label>Fuente<input value={draft.source} onChange={(event) => setField("source", event.target.value)} placeholder="Enlace de Instagram o página del PDF" /></label><label className="checkbox-line"><input type="checkbox" checked={draft.visible} onChange={(event) => setField("visible", event.target.checked)} /> Mostrar en el catálogo</label></div><div className="editor-preview"><div className="preview-image">{draft.image ? <img src={draft.image} alt="Vista previa de la ficha"/> : "Sin imagen"}</div><p>Vista previa de la imagen</p>{draft.source && <small>Fuente: {draft.source}</small>}</div></div><div className="editor-actions"><p role="status">{message}</p><button type="button" className="primary-button" disabled={saving || Boolean(loadError)} onClick={save}>{saving ? "Guardando…" : "Guardar cambios"}</button></div></section></div>
    </div>
  </main>;
}
