"use client";

import { useEffect, useState } from "react";
import { referenceCatalogProducts, referenceCatalogProduct } from "../lib/product-presentation";
import type { Product } from "../lib/product-model";
import { getProducts } from "../lib/products-api";
import { getCommerceProducts, mergeCommerceProducts } from "../lib/commerce-products";

export function useCatalogProducts() {
  const [products, setProducts] = useState<Product[]>(referenceCatalogProducts);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    const commerceMode = Boolean(process.env.NEXT_PUBLIC_COMMERCE_API_URL?.trim() || process.env.NEXT_PUBLIC_API_URL?.trim());
    const load = commerceMode ? getCommerceProducts(controller.signal).then(items => mergeCommerceProducts(referenceCatalogProducts, items)) : getProducts(controller.signal).then(items => items.map(referenceCatalogProduct));
    load.then((items) => {
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
