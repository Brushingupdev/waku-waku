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
};

export const statusLabels: Record<ProductStatus, string> = {
  por_confirmar: "Por confirmar",
  disponible: "Disponible",
  preventa: "Preventa",
  separado: "Separado",
  agotado: "Agotado",
};

export const validStatuses = Object.keys(statusLabels) as ProductStatus[];
