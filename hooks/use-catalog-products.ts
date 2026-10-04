"use client";

import { useEffect, useState } from "react";
import { baseProducts } from "../data/reference-products";
import type { Product } from "../lib/product-model";
import { getProducts } from "../lib/products-api";

export function useCatalogProducts() {
  const [products, setProducts] = useState<Product[]>(baseProducts);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    getProducts(controller.signal).then((items) => {
      if (!controller.signal.aborted) setProducts(items);
    }).catch((cause: unknown) => {
      if (!controller.signal.aborted) {
        setError(cause instanceof Error ? cause.message : "No se pudo cargar el catálogo.");
      }
    });
    return () => controller.abort();
  }, []);

  return { products, error };
}
