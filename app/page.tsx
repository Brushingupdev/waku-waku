import CatalogClient from "../components/catalog-client";
import { getPublishedCatalog } from "../lib/server-catalog";

export const revalidate = 60;

export default async function Home() {
  return <CatalogClient initialCatalog={await getPublishedCatalog()} />;
}
