import { getPublishedCatalog } from "../../lib/server-catalog";

// Kept outside /api so the Commerce rewrite cannot bypass the validated cache.
export async function GET() {
  return Response.json(await getPublishedCatalog(), { headers: { "Cache-Control": "no-store" } });
}
