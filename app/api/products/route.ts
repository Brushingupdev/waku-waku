import { referenceCatalogProducts } from "../../../lib/product-presentation";

// Read-only reference catalog until the external Python API is configured.
export async function GET() {
  return Response.json({ products: referenceCatalogProducts });
}

function backendPending() {
  return Response.json(
    { error: "El guardado estará disponible cuando se conecte el backend." },
    { status: 501 },
  );
}

export async function POST() { return backendPending(); }
export async function PUT() { return backendPending(); }
