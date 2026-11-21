<template>
  <article
    @click="emit('select', product)"
    @keydown.enter="emit('select', product)"
    @keydown.space.prevent="emit('select', product)"
    tabindex="0"
    role="button"
    :aria-label="`View ${product.title}`"
    class="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
  >
    <div class="relative bg-gray-100 aspect-[4/3] overflow-hidden">
      <img
        :src="product.thumbnail"
        :alt="product.title"
        loading="lazy"
        class="w-full h-full object-contain p-5 group-hover:scale-105 transition-transform duration-300"
      />

      <span
        class="absolute top-3 left-3 bg-gray-600 text-white text-xs font-semibold px-2 py-1 rounded-md"
      >
        {{ product.category }}
      </span>
    </div>

    <div class="p-4">
      <h3 class="font-semibold text-gray-900 truncate">
        {{ product.title }}
      </h3>

      <p class="text-sm text-gray-500 mt-2 line-clamp-2 min-h-10">
        {{ product.description }}
      </p>

      <div class="flex items-center justify-between mt-4">
        <span class="text-lg font-bold text-gray-900">
          {{ formatPrice(product.price) }}
        </span>

        <span class="text-sm text-amber-500 font-medium">
          ★ {{ product.rating.toFixed(1) }}
        </span>
      </div>

      <div class="mt-3 pt-3 border-t border-gray-100">
        <span
          :class="product.stock > 0 ? 'text-green-600' : 'text-red-600'"
          class="text-xs font-medium"
        >
          {{ product.stock > 0 ? `${product.stock} kvar` : "Slut såld" }}
        </span>
      </div>
    </div>
  </article>
</template>
<script setup lang="ts">
import type { Product } from "@/types/product";
import { formatPrice } from "@/utils/formatPrice";

defineProps<{
  product: Product;
}>();

const emit = defineEmits<{
  select: [product: Product]
}>()
</script>
