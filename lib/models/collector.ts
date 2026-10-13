import { z } from "zod";

export const collectorSlots = ["feature", "top-center", "top-right", "bottom-center", "bottom-right", "float"] as const;
export type CollectorSlot = (typeof collectorSlots)[number];

export const collectorSchema = z.object({
  id: z.string().min(1),
  name: z.string(),
  city: z.string(),
  figure: z.string(),
  quote: z.string(),
  image_url: z.string().nullish().transform((v) => v ?? ""),
  alt: z.string().nullish().transform((v) => v ?? ""),
  slot: z.enum(collectorSlots),
  order: z.number().int().default(0),
  is_active: z.boolean().default(true),
});

export type Collector = z.infer<typeof collectorSchema>;
