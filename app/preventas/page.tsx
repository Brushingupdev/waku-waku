import { getPublishedCatalog } from "../../lib/server-catalog";
import PreventasClient from "../../components/preventas-client";

export const revalidate = 60;
export default async function PreventasPage() { const { settings } = await getPublishedCatalog(); return <PreventasClient settings={settings}/>; }
