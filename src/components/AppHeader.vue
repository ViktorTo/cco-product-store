<template>
  <header class="bg-white border-b border-gray-200">
    <div
      class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between"
    >
      <a href="/" class="flex items-center gap-2">
        <div
          class="w-13 h-9 rounded-lg bg-black flex items-center justify-center"
        >
          <span class="text-white font-bold text-lg">CCO</span>
        </div>

        <span class="text-xl font-bold tracking-tight">
          Merch
          <span class="text-gray-600">Store</span>
        </span>
      </a>

      <div class="hidden sm:block text-sm text-gray-500">
        Utforska vårt sortiment
      </div>

      <!-- Shopping cart -->
      <button
        type="button"
        @click="showCart = true"
        aria-label="Open shopping cart"
        class="relative p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
      >
        <ShoppingCart :size="24" />

        <!-- Cart badge -->
        <span
          v-if="cart.itemCount > 0"
          class="absolute -top-1 -right-1 bg-gray-600 text-white text-xs font-bold rounded-full min-w-5 h-5 px-1 flex items-center justify-center"
        >
          {{ cart.itemCount }}
        </span>
      </button>
    </div>

    <!-- Cart modal -->
    <CartModal :show="showCart" @close="showCart = false" />
  </header>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { ShoppingCart } from "lucide-vue-next";

import { useCartStore } from "@/stores/cart";
import CartModal from "@/components/CartModal.vue";

const cart = useCartStore();

const showCart = ref(false);
</script>
