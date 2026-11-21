
import { ref, computed, watch } from 'vue'
import type { Product } from '@/types/product'

import {
  fetchProducts,
  searchProducts,
  type SortBy,
  type SortOrder,
} from '@/services/productService'

import {
  getCachedProducts,
  setCachedProducts,
} from '@/services/productCache'

const PAGE_SIZE = 12

export type SortOption =
  | 'default'
  | 'price-asc'
  | 'price-desc'
  | 'title-asc'
  | 'title-desc'
  | 'rating-desc'

const sortOptions: Record<
  SortOption,
  { sortBy?: SortBy; order?: SortOrder }
> = {
  default: {},
  'price-asc': { sortBy: 'price', order: 'asc' },
  'price-desc': { sortBy: 'price', order: 'desc' },
  'title-asc': { sortBy: 'title', order: 'asc' },
  'title-desc': { sortBy: 'title', order: 'desc' },
  'rating-desc': { sortBy: 'rating', order: 'desc' },
}

export function useProducts() {
  const products = ref<Product[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const searchQuery = ref('')
  const sortOption = ref<SortOption>('default')

  const currentPage = ref(1)
  const total = ref(0)

  let controller: AbortController | null = null

  const totalPages = computed(() =>
    Math.ceil(total.value / PAGE_SIZE)
  )

  async function loadProducts(forceRefresh = false) {
    controller?.abort()

    const requestController = new AbortController()
    controller = requestController

    loading.value = true
    error.value = null

    const query = searchQuery.value.trim()
    const page = currentPage.value
    const skip = (page - 1) * PAGE_SIZE

    const { sortBy, order } = sortOptions[sortOption.value]

    // Include search, page and sorting in cache key
    const cacheKey = [
      query.toLowerCase() || 'all',
      page,
      sortBy ?? 'default',
      order ?? 'default',
    ].join(':')

    try {
      if (!forceRefresh) {
        const cachedData = getCachedProducts(cacheKey)

        if (cachedData) {
          products.value = cachedData.products
          total.value = cachedData.total
          return
        }
      }

      const response = query
        ? await searchProducts(
            query,
            PAGE_SIZE,
            skip,
            requestController.signal,
            sortBy,
            order
          )
        : await fetchProducts(
            PAGE_SIZE,
            skip,
            requestController.signal,
            sortBy,
            order
          )

      if (requestController.signal.aborted) return

      setCachedProducts(cacheKey, response)

      products.value = response.products
      total.value = response.total

    } catch (err) {
      if (
        err instanceof Error &&
        err.name === 'AbortError'
      ) {
        return
      }

      error.value = err instanceof Error
        ? err.message
        : 'Something went wrong'

      products.value = []
      total.value = 0

    } finally {
      if (controller === requestController) {
        loading.value = false
      }
    }
  }

  // Reset pagination when search or sorting changes
  watch(
    [searchQuery, sortOption, currentPage],
    ([query, sort], oldValues, onCleanup) => {
  const [oldQuery, oldSort] = oldValues ?? [query, sort]
      if (
        (query !== oldQuery || sort !== oldSort) &&
        currentPage.value !== 1
      ) {
        currentPage.value = 1
        return
      }

      const timeout = window.setTimeout(
        loadProducts,
        query.trim() ? 350 : 0
      )

      onCleanup(() => window.clearTimeout(timeout))
    },
    { immediate: true }
  )

  function changePage(page: number) {
    if (page < 1 || page > totalPages.value) return

    currentPage.value = page
  }

  function resetSearch() {
    searchQuery.value = ''
    currentPage.value = 1
  }

  return {
    products,
    loading,
    error,
    searchQuery,
    sortOption,
    currentPage,
    total,
    totalPages,
    loadProducts,
    changePage,
    resetSearch,
  }
}
