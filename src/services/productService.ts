import type { ProductDetails, ProductResponse } from "@/types/product";

const API_URL = "https://dummyjson.com/products";

export type SortBy = "price" | "title" | "rating";
export type SortOrder = "asc" | "desc";

function createParams(
  limit: number,
  skip: number,
  sortBy?: SortBy,
  order?: SortOrder,
) {
  const params = new URLSearchParams({
    limit: String(limit),
    skip: String(skip),
  });

  if (sortBy && order) {
    params.set("sortBy", sortBy);
    params.set("order", order);
  }

  return params;
}

export async function fetchProducts(
  limit = 12,
  skip = 0,
  signal?: AbortSignal,
  sortBy?: SortBy,
  order?: SortOrder,
): Promise<ProductResponse> {
  const params = createParams(limit, skip, sortBy, order);

  const response = await fetch(`${API_URL}?${params}`, { signal });

  if (!response.ok) {
    throw new Error("Unable to fetch products");
  }

  return response.json();
}

export async function searchProducts(
  query: string,
  limit = 12,
  skip = 0,
  signal?: AbortSignal,
  sortBy?: SortBy,
  order?: SortOrder,
): Promise<ProductResponse> {
  const params = createParams(limit, skip, sortBy, order);
  params.set("q", query);

  const response = await fetch(`${API_URL}/search?${params}`, { signal });

  if (!response.ok) {
    throw new Error("Unable to search products");
  }

  return response.json();
}

export async function fetchProductById(
  id: number,
  signal?: AbortSignal,
): Promise<ProductDetails> {
  const response = await fetch(`${API_URL}/${id}`, {
    signal,
  });

  if (!response.ok) {
    throw new Error("Unable to fetch product details");
  }

  return response.json();
}
