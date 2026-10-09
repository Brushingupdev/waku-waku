"use client";

import { useEffect, useState } from "react";
import { baseProducts } from "../data/reference-products";
import type { Product } from "../lib/product-model";
import { getProducts } from "../lib/products-api";
import { getCommerceProducts, mergeCommerceProducts } from "../lib/commerce-products";

export function useCatalogProducts() {
  const [products, setProducts] = useState<Product[]>(baseProducts);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    const commerceMode = Boolean(process.env.NEXT_PUBLIC_COMMERCE_API_URL?.trim() || process.env.NEXT_PUBLIC_API_URL?.trim());
    const load = commerceMode ? getCommerceProducts(controller.signal) : getProducts(controller.signal);
    load.then((items) => {
      if (!controller.signal.aborted) setProducts(commerceMode ? mergeCommerceProducts(baseProducts, items) : items);
    }).catch((cause: unknown) => {
      if (!controller.signal.aborted) {
        setError(cause instanceof Error ? cause.message : "No se pudo cargar el catálogo.");
      }
    });
    return () => controller.abort();
  }, []);

  return { products, error };
}
