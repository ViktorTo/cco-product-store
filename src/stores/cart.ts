import { defineStore } from "pinia";
import { computed, ref, watch } from "vue";
import type { Product } from "@/types/product";

export interface CartItem {
  product: Product;
  quantity: number;
}

const STORAGE_KEY = "shopstore-cart";

function loadCart(): CartItem[] {
  try {
    const savedCart = localStorage.getItem(STORAGE_KEY);

    if (!savedCart) return [];

    const parsedCart: unknown = JSON.parse(savedCart);

    if (!Array.isArray(parsedCart)) return [];

    return parsedCart.filter((item): item is CartItem => {
      return (
        typeof item === "object" &&
        item !== null &&
        "product" in item &&
        "quantity" in item &&
        typeof item.quantity === "number" &&
        Number.isInteger(item.quantity) &&
        item.quantity > 0 &&
        typeof item.product === "object" &&
        item.product !== null &&
        "id" in item.product &&
        typeof item.product.id === "number"
      );
    });
  } catch (error) {
    console.error("Failed to load cart:", error);
    return [];
  }
}

export const useCartStore = defineStore("cart", () => {
  // Restore cart from localStorage
  const items = ref<CartItem[]>(loadCart());

  // Total number of individual products
  const itemCount = computed(() =>
    items.value.reduce((total, item) => total + item.quantity, 0),
  );

  // Total cart price
  const totalPrice = computed(() =>
    items.value.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0,
    ),
  );

  // Add product to cart
  function addToCart(product: Product) {
    const existingItem = items.value.find(
      (item) => item.product.id === product.id,
    );

    if (existingItem) {
      if (existingItem.quantity < product.stock) {
        existingItem.quantity++;
      }
    } else if (product.stock > 0) {
      items.value.push({
        product,
        quantity: 1,
      });
    }
  }

  // Remove product
  function removeFromCart(productId: number) {
    items.value = items.value.filter((item) => item.product.id !== productId);
  }

  // Update quantity
  function updateQuantity(productId: number, quantity: number) {
    const item = items.value.find((item) => item.product.id === productId);

    if (!item) return;

    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    item.quantity = Math.min(quantity, item.product.stock);
  }

  // Clear cart
  function clearCart() {
    items.value = [];
  }

  // Automatically save changes
  watch(
    items,
    (newItems) => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newItems));
      } catch (error) {
        console.error("Failed to save cart:", error);
      }
    },
    { deep: true },
  );

  return {
    items,
    itemCount,
    totalPrice,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  };
});
