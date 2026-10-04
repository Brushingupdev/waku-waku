import { baseProducts } from "../../../data/reference-products";

// Read-only reference catalog until the external Python API is configured.
export async function GET() {
  return Response.json({ products: baseProducts });
}

function backendPending() {
  return Response.json(
    { error: "El guardado estará disponible cuando se conecte el backend." },
    { status: 501 },
  );
}

export async function POST() { return backendPending(); }
export async function PUT() { return backendPending(); }
