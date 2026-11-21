<template>
  <div class="min-h-screen">
    <AppHeader />

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <!-- Page heading -->
      <section class="mb-8">
        <p class="text-sm font-semibold text-gray-600 uppercase tracking-wider">
          Utforska vår katalog
        </p>

        <h1 class="text-3xl sm:text-4xl font-bold text-gray-900 mt-2">
          Produkter
        </h1>

        <p class="text-gray-500 mt-3 max-w-2xl">
          Hitta din nya favorit!
        </p>
      </section>

      <!-- Filters -->
      <section
        class="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 mb-8"
      >
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- Search -->
          <div>
            <label
              for="search"
              class="block text-sm font-medium text-gray-700 mb-2"
            >
              Sök produkter
            </label>

            <input
              id="search"
              v-model="searchQuery"
              type="search"
              placeholder="Produkt.."
              class="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
            />
          </div>

          <!-- Category -->
          <div>
            <label
              for="category"
              class="block text-sm font-medium text-gray-700 mb-2"
            >
              Kategori
            </label>

            <select
              id="category"
              v-model="selectedCategory"
              class="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm bg-white focus:ring-2 focus:ring-gray-500"
            >
              <option value="all">
                Alla kategorier
              </option>

              <option
                v-for="category in categories"
                :key="category"
                :value="category"
              >
                {{ category }}
              </option>
            </select>
          </div>

          <!-- Sorting -->
          <div>
            <label
              for="sort"
              class="block text-sm font-medium text-gray-700 mb-2"
            >
              Sortera
            </label>

            <select
              id="sort"
              v-model="sortOption"
              class="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm bg-white focus:ring-2 focus:ring-gray-500"
            >
              <option value="default">Ingen sortering</option>
              <option value="price-asc">Pris: lågt till högt</option>
              <option value="price-desc">Pris: Högt till lågt</option>
              <option value="title-asc">Namn: A–Z</option>
              <option value="title-desc">Namn: Z–A</option>
              <option value="rating-desc">Populärast</option>
            </select>
          </div>
        </div>

        <!-- Reset filters -->
        <div class="flex justify-end mt-4">
          <button
            @click="resetFilters"
            class="text-sm text-gray-600 font-medium hover:text-gray-800"
          >
            Rensa filter
          </button>
        </div>
      </section>

      <!-- Results information -->
      <section class="flex flex-wrap items-center justify-between gap-3 mb-5">
        <h2 class="text-lg font-semibold text-gray-900">
          Produkter
        </h2>

        <span class="text-sm text-gray-500">
          {{ total }} produkter hittade
        </span>
      </section>

      <!-- Product grid -->
      <ProductGrid
        :products="products"
        :loading="loading"
        :error="error"
        @retry="loadProducts"
        @select="openProductModal"
      />

      <BaseModal
        :show="showProductModal"
        title="Product details"
        @close="closeProductModal"
      >
        <!-- Loading -->
        <div v-if="detailsLoading" class="py-12 text-center">
          <div
            class="w-8 h-8 border-4 border-gray-600 border-t-transparent rounded-full animate-spin mx-auto"
          />

          <p class="text-gray-500 mt-4">
            Loading product details...
          </p>
        </div>

        <!-- Error -->
        <div v-else-if="detailsError" class="py-8 text-center">
          <p class="text-red-600">
            {{ detailsError }}
          </p>

          <button
            @click="selectedProduct && loadProduct(selectedProduct.id)"
            class="mt-4 text-gray-600 font-medium"
          >
            Try again
          </button>
        </div>

        <!-- Product details -->
        <div v-else-if="selectedProduct" class="space-y-5">
          <!-- Product images -->
          <div class="grid grid-cols-2 gap-3">
            <img
              v-for="(image, index) in selectedProduct.images"
              :key="index"
              :src="image"
              :alt="selectedProduct.title"
              class="w-full h-40 object-contain bg-gray-50 rounded-lg"
            />
          </div>

          <!-- Basic information -->
          <div>
            <span class="text-sm text-gray-600 font-medium">
              {{ selectedProduct.category }}
            </span>

            <h3 class="text-xl font-bold mt-1">
              {{ selectedProduct.title }}
            </h3>

            <p class="text-sm text-gray-500 mt-2">
              {{ selectedProduct.description }}
            </p>
          </div>

          <!-- Price and rating -->
          <div class="flex items-center justify-between">
            <span class="text-2xl font-bold">
              {{ formatPrice(selectedProduct.price) }}
            </span>

            <span class="text-amber-500 font-medium">
              ★ {{ selectedProduct.rating.toFixed(1) }}
            </span>
          </div>

          <!-- Product information -->
          <div class="border-t border-gray-200 pt-4 space-y-3">
            <h4 class="font-semibold">
              Product information
            </h4>

            <div class="flex justify-between text-sm">
              <span class="text-gray-500">Brand</span>
              <span class="font-medium">
                {{ selectedProduct.brand }}
              </span>
            </div>

            <div class="flex justify-between text-sm">
              <span class="text-gray-500">SKU</span>
              <span class="font-medium">
                {{ selectedProduct.sku }}
              </span>
            </div>

            <div class="flex justify-between text-sm">
              <span class="text-gray-500">Weight</span>
              <span class="font-medium"> {{ selectedProduct.weight }} kg </span>
            </div>

            <div class="flex justify-between text-sm">
              <span class="text-gray-500">Stock</span>
              <span class="font-medium">
                {{ selectedProduct.stock }} units
              </span>
            </div>

            <div class="flex justify-between text-sm">
              <span class="text-gray-500">Availability</span>
              <span class="font-medium">
                {{ selectedProduct.availabilityStatus }}
              </span>
            </div>

            <div class="flex justify-between text-sm">
              <span class="text-gray-500">Minimum order</span>
              <span class="font-medium">
                {{ selectedProduct.minimumOrderQuantity }}
              </span>
            </div>
          </div>

          <!-- Shipping and warranty -->
          <div class="border-t border-gray-200 pt-4 space-y-3">
            <h4 class="font-semibold">
              Shipping & warranty
            </h4>

            <p class="text-sm text-gray-600">
              {{ selectedProduct.shippingInformation }}
            </p>

            <p class="text-sm text-gray-600">
              {{ selectedProduct.warrantyInformation }}
            </p>

            <p class="text-sm text-gray-600">
              {{ selectedProduct.returnPolicy }}
            </p>
          </div>

          <!-- Tags -->
          <div class="flex flex-wrap gap-2">
            <span
              v-for="tag in selectedProduct.tags"
              :key="tag"
              class="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full"
            >
              {{ tag }}
            </span>
          </div>

          <!-- Reviews -->
          <div class="border-t border-gray-200 pt-4">
            <h4 class="font-semibold mb-3">
              Customer reviews ({{ selectedProduct.reviews.length }})
            </h4>

            <div
              v-for="(review, index) in selectedProduct.reviews"
              :key="index"
              class="border-b border-gray-100 py-3 last:border-0"
            >
              <div class="flex items-center justify-between">
                <span class="font-medium text-sm">
                  {{ review.reviewerName }}
                </span>

                <span class="text-amber-500 text-sm">
                  ★ {{ review.rating }}
                </span>
              </div>

              <p class="text-sm text-gray-600 mt-2">
                {{ review.comment }}
              </p>
            </div>
          </div>
        </div>

        <template #footer>
          <div class="flex gap-3">
            <button
              @click="closeProductModal"
              class="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-lg hover:bg-gray-100 transition"
            >
              Close
            </button>

            <button
              @click="addProductToCart"
              :disabled="!selectedProduct || selectedProduct.stock <= 0"
              class="flex-1 bg-gray-600 text-white py-2.5 rounded-lg hover:bg-gray-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Add to cart
            </button>
          </div>
        </template>
      </BaseModal>

      <!-- Pagination -->
      <nav
        v-if="!loading && totalPages > 1"
        class="flex items-center justify-between gap-4 mt-10"
      >
        <button
          @click="changePage(currentPage - 1)"
          :disabled="currentPage === 1"
          class="px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 disabled:opacity-40"
        >
          Previous
        </button>

        <span class="text-sm font-medium text-gray-600">
          {{ currentPage }} / {{ totalPages }}
        </span>

        <button
          @click="changePage(currentPage + 1)"
          :disabled="currentPage === totalPages"
          class="px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 disabled:opacity-40"
        >
          Next
        </button>
      </nav>
    </main>

    <!-- Footer -->
    <footer class="border-t border-gray-200 bg-white mt-16">
      <div class="max-w-7xl mx-auto px-4 py-6 text-center">
        <p class="text-sm text-gray-500">
          CCO Merch Store
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import type { Product } from "@/types/product";
import { ref, computed, watch } from "vue";
import { useProductDetails } from "@/composables/useProductDetails";
import { useProducts } from "@/composables/useProducts";
import { formatPrice } from "@/utils/formatPrice";
import BaseModal from "@/components/BaseModal.vue";
import AppHeader from "@/components/AppHeader.vue";
import ProductGrid from "@/components/ProductGrid.vue";
import { useCartStore } from "@/stores/cart";
import { useToast } from "@/composables/useToast";

const { showToast } = useToast();
const cart = useCartStore();

const {
  product: selectedProduct,
  loading: detailsLoading,
  error: detailsError,
  loadProduct,
  clearProduct,
} = useProductDetails();

const showProductModal = ref(false);

// API state
const {
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
} = useProducts();

// Filter state
const selectedCategory = ref("all");

type SortOption = "default" | "price-asc" | "price-desc" | "rating";

const sortBy = ref<SortOption>("default");

// Pagination state
const pageSize = 12;

// Get unique categories from API products
const categories = computed(() => {
  return [...new Set(products.value.map((product) => product.category))].sort();
});

// Search and category filtering
const filteredProducts = computed(() => {
  return products.value.filter((product) => {
    const matchesSearch = product.title
      .toLowerCase()
      .includes(searchQuery.value.toLowerCase());

    const matchesCategory =
      selectedCategory.value === "all" ||
      product.category === selectedCategory.value;

    return matchesSearch && matchesCategory;
  });
});

// Reset page when filters change
watch(searchQuery, () => {
  currentPage.value = 1;
});

function resetFilters() {
  searchQuery.value = "";
  selectedCategory.value = "all";
  sortBy.value = "default";
  currentPage.value = 1;
}

async function openProductModal(product: Product) {
  showProductModal.value = true;

  await loadProduct(product.id);
}

function closeProductModal() {
  showProductModal.value = false;
  clearProduct();
}

function addProductToCart() {
  if (!selectedProduct.value) return;

  cart.addToCart(selectedProduct.value);
  showProductModal.value = false;

  showToast(`${selectedProduct.value.title} added to cart`, "success");
}
</script>
