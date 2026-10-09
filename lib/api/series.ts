import { z } from "zod";
import { api } from "./client";
import { seriesSchema, type Series } from "../models/series";

export type { Series };

export async function getSeries(signal?: AbortSignal): Promise<Series[]> {
  const list = await api.get("/series", z.array(seriesSchema), signal);
  return list.sort((a, b) => a.order - b.order);
}
