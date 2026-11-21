<template>
  <div>
    <!-- Loading state -->
    <div
      v-if="loading"
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
    >
      <div
        v-for="n in 8"
        :key="n"
        class="bg-white rounded-xl border border-gray-200 p-4 animate-pulse"
      >
        <div class="aspect-[4/3] bg-gray-200 rounded-lg"></div>
        <div class="h-4 bg-gray-200 rounded mt-4 w-3/4"></div>
        <div class="h-4 bg-gray-200 rounded mt-3 w-1/2"></div>
        <div class="h-6 bg-gray-200 rounded mt-5 w-1/3"></div>
      </div>
    </div>

    <!-- Error state -->
    <div
      v-else-if="error"
      class="bg-white border border-red-200 rounded-xl p-8 text-center"
    >
      <h3 class="text-lg font-semibold text-gray-900">
        Något gick fel
      </h3>

      <p class="text-gray-500 mt-2">
        {{ error }}
      </p>

      <button
        @click="emit('retry')"
        class="mt-5 px-5 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
      >
        Försök igen
      </button>
    </div>

    <!-- Empty state -->
    <div
      v-else-if="products.length === 0"
      class="bg-white rounded-xl border border-gray-200 p-12 text-center"
    >
      <h3 class="text-lg font-semibold">
        No products found
      </h3>

      <p class="text-gray-500 mt-2">
        Try changing your search or filters.
      </p>
    </div>

    <!-- Product collection -->
    <div
      v-else
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
    >
      <ProductCard
        v-for="product in products"
        :key="product.id"
        :product="product"
        @select="emit('select', product)"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import type { Product } from "@/types/product";
import ProductCard from "@/components/ProductCard.vue";

defineProps<{
  products: Product[];
  loading: boolean;
  error: string | null;
}>();

const emit = defineEmits<{
  retry: [];
  select: [product: Product]
}>();
</script>
