import type { ProductResponse } from "@/types/product";

interface CacheEntry {
  data: ProductResponse;
  cachedAt: number;
}

const CACHE_TTL = 5 * 60 * 1000;

const productCache = new Map<string, CacheEntry>();

export function getCachedProducts(key: string): ProductResponse | null {
  const entry = productCache.get(key);

  if (!entry) return null;

  const isExpired = Date.now() - entry.cachedAt > CACHE_TTL;

  if (isExpired) {
    productCache.delete(key);
    return null;
  }

  return entry.data;
}

export function setCachedProducts(key: string, data: ProductResponse) {
  productCache.set(key, {
    data,
    cachedAt: Date.now(),
  });
}

export function clearProductCache() {
  productCache.clear();
}
