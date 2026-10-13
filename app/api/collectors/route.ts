// API_BASE_URL rewrites this route to Commerce when the backend is configured.
// The reference catalog has no approved customer testimonials to substitute.
export function GET() {
  return Response.json({ error: "Las experiencias de coleccionistas todavía no están disponibles." }, { status: 503 });
}
