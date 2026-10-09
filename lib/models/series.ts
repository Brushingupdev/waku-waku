import { z } from "zod";

export const seriesSchema = z.object({
  id: z.string().min(1),
  name: z.string(),
  slug: z.string(),
  logo_url: z.string().nullish().transform((v) => v ?? ""),
  order: z.number().int().default(0),
});

export type Series = z.infer<typeof seriesSchema>;
