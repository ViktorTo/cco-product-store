<script setup lang="ts">
import BaseModal from "@/components/BaseModal.vue";
import { useCartStore } from "@/stores/cart";
import { formatPrice } from "@/utils/formatPrice";
import { Minus, Plus, Trash2 } from "lucide-vue-next";

defineProps<{
  show: boolean;
}>();

const emit = defineEmits<{
  close: [];
}>();

const cart = useCartStore();
</script>

<template>
  <BaseModal :show="show" title="Shopping cart" @close="emit('close')">
    <!-- Empty cart -->
    <div v-if="cart.items.length === 0" class="py-10 text-center">
      <p class="text-gray-500">
        Your shopping cart is empty.
      </p>

      <button
        @click="emit('close')"
        class="mt-4 text-gray-600 font-medium hover:text-gray-900"
      >
        Continue shopping
      </button>
    </div>

    <!-- Cart items -->
    <div v-else class="space-y-5">
      <div
        v-for="item in cart.items"
        :key="item.product.id"
        class="flex gap-4 border-b border-gray-100 pb-5"
      >
        <!-- Product image -->
        <img
          :src="item.product.thumbnail"
          :alt="item.product.title"
          class="w-20 h-20 object-contain bg-gray-50 rounded-lg shrink-0"
        />

        <!-- Product information -->
        <div class="flex-1 min-w-0">
          <div class="flex justify-between gap-2">
            <h3 class="font-medium text-gray-900 truncate">
              {{ item.product.title }}
            </h3>

            <button
              @click="cart.removeFromCart(item.product.id)"
              aria-label="Remove product"
              class="text-gray-400 hover:text-red-600 shrink-0"
            >
              <Trash2 :size="18" />
            </button>
          </div>

          <p class="text-sm text-gray-500 mt-1">
            {{ formatPrice(item.product.price) }}
          </p>

          <!-- Quantity controls -->
          <div class="flex items-center justify-between mt-3">
            <div class="flex items-center gap-3">
              <button
                @click="cart.updateQuantity(item.product.id, item.quantity - 1)"
                :disabled="item.quantity <= 1"
                aria-label="Decrease quantity"
                class="w-7 h-7 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-100 disabled:opacity-40"
              >
                <Minus :size="14" />
              </button>

              <span class="text-sm font-medium w-4 text-center">
                {{ item.quantity }}
              </span>

              <button
                @click="cart.updateQuantity(item.product.id, item.quantity + 1)"
                :disabled="item.quantity >= item.product.stock"
                aria-label="Increase quantity"
                class="w-7 h-7 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-100 disabled:opacity-40"
              >
                <Plus :size="14" />
              </button>
            </div>

            <span class="font-semibold text-gray-900">
              {{ formatPrice(item.product.price * item.quantity) }}
            </span>
          </div>
        </div>
      </div>

      <!-- Cart total -->
      <div class="pt-2">
        <div class="flex justify-between items-center">
          <span class="text-gray-600 font-medium">
            Total
          </span>

          <span class="text-xl font-bold text-gray-900">
            {{ formatPrice(cart.totalPrice) }}
          </span>
        </div>

        <p class="text-xs text-gray-500 mt-2">
          Shipping and additional costs are not included.
        </p>
      </div>

      <!-- Clear cart -->
      <button
        @click="cart.clearCart()"
        class="w-full border border-gray-300 rounded-lg py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 transition"
      >
        Clear cart
      </button>
    </div>

    <template #footer>
      <button
        @click="emit('close')"
        class="w-full bg-gray-600 text-white py-2.5 rounded-lg hover:bg-gray-700 transition"
      >
        Continue shopping
      </button>
    </template>
  </BaseModal>
</template>
