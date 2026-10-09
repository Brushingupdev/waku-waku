export type { Product, ProductStatus } from "./models/product";
export { statusLabels } from "./models/product";
import { productStatuses } from "./models/product";
export const validStatuses = [...productStatuses];
