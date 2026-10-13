import { z } from "zod";
import { api } from "./client";
import { collectorSchema, type Collector } from "../models/collector";

export type { Collector };

export async function getCollectors(signal?: AbortSignal): Promise<Collector[]> {
  const list = await api.get("/collectors", z.array(collectorSchema), signal);
  return list.filter(item => item.is_active).sort((a, b) => a.order - b.order);
}
