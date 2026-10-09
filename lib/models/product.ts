import { z } from "zod";
import { seriesSchema } from "./series";

export const productStatuses = [
    "por_confirmar",
    "disponible",
    "preventa",
    "separado",
    "agotado"
] as const;

export type ProductStatus = (typeof productStatuses)[number];

export const galleryItemSchema = z.object({
  image: z.string().min(1),
  label: z.string(),
});

export const productSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1),
  series_id: z.string().min(1),
  series: seriesSchema.nullable(),
  collection: z.string().nullable(),
  edition: z.string().nullable(),
  height: z.string().nullable(),
  price: z.number().finite().nonnegative().nullable(),
  status: z.enum(productStatuses),
  quantity: z.number().int().nonnegative().nullable(),
  image: z.string().nullable(),
  gallery: z.array(galleryItemSchema).default([]),
  highlights: z.array(z.string()).default([]),
  visible: z.boolean(),
}).superRefine((value, context) => {
  if (value.series && value.series.id !== value.series_id) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "La serie del producto no corresponde a series_id." });
  }
});

export const productsResponseSchema = z.object({ products: z.array(productSchema) });

export type Product = z.infer<typeof productSchema>;
export type GalleryItem = z.infer<typeof galleryItemSchema>;

export const statusLabels: Record<ProductStatus, string> = {
  por_confirmar: "Por confirmar",
  disponible: "Disponible",
  preventa: "Preventa",
  separado: "Separado",
  agotado: "Agotado",
};
