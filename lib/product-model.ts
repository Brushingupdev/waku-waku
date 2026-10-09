export type ProductStatus = "por_confirmar" | "disponible" | "preventa" | "separado" | "agotado";

export type Product = {
  id: string;
  title: string;
  detail: string;
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

export const statusLabels: Record<ProductStatus, string> = {
  por_confirmar: "Por confirmar",
  disponible: "Disponible",
  preventa: "Preventa",
  separado: "Separado",
  agotado: "Agotado",
};

export const validStatuses = Object.keys(statusLabels) as ProductStatus[];
