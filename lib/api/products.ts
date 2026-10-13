import { api } from "./client";
import { productsResponseSchema, type Product } from "../models/product";

export async function getProducts(signal?: AbortSignal): Promise<Product[]> {
  const response = await api.get("/products", productsResponseSchema, signal);
  return response.products;
}
