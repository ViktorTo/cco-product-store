import { ref } from "vue";
import type { ProductDetails } from "@/types/product";
import { fetchProductById } from "@/services/productService";

// Shared cache across composable instances
interface CachedProduct {
  product: ProductDetails;
  cachedAt: number;
}

const CACHE_TTL = 5 * 60 * 1000;

const productCache = new Map<number, CachedProduct>();

export function useProductDetails() {
  const product = ref<ProductDetails | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  let controller: AbortController | null = null;

  async function loadProduct(id: number, forceRefresh = false) {
    // Cancel previous request
    controller?.abort();

    const requestController = new AbortController();
    controller = requestController;

    product.value = null;
    loading.value = true;
    error.value = null;

    try {
      // Return cached product if available

      const cachedProduct = productCache.get(id);

      if (
        cachedProduct &&
        !forceRefresh &&
        Date.now() - cachedProduct.cachedAt < CACHE_TTL
      ) {
        product.value = cachedProduct.product;
        return;
      }

      const fetchedProduct = await fetchProductById(id);

      if (requestController.signal.aborted) return;

      productCache.set(id, {
        product: fetchedProduct,
        cachedAt: Date.now(),
      });

      product.value = fetchedProduct;
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") {
        return;
      }

      error.value = err instanceof Error ? err.message : "Something went wrong";
    } finally {
      if (!requestController.signal.aborted) {
        loading.value = false;
      }
    }
  }

  function clearProduct() {
    controller?.abort();

    product.value = null;
    error.value = null;
    loading.value = false;
  }

  function clearCache() {
    productCache.clear();
  }

  return {
    product,
    loading,
    error,
    loadProduct,
    clearProduct,
    clearCache,
  };
}
