import type { ProductStatus } from "./models/product";

export type ReferenceProduct = {
  id: string;
  title: string;
  detail: string; // Legacy reference text; API products use collection, edition and height.
  series: string;
  price: number | null;
  status: ProductStatus;
  quantity: number | null;
  month: string;
  image: string;
  gallery?: { image: string; label: string }[];
  source: string;
  visible: boolean;
  updatedAt?: string;
  // Presentation identity is separate from the UUID stored in Commerce Service.
  referenceId?: string;
  seriesId?: string;
  collection?: string | null;
  edition?: string | null;
  height?: string | null;
  highlights?: string[];
};
