import { describe, it, expect, beforeEach } from "vitest";
import { createPinia, setActivePinia } from "pinia";

import { useCartStore } from "@/stores/cart";
import type { Product } from "@/types/product";

const mockProduct = {
  id: 1,
  title: "Test Phone",
  price: 1000,
  stock: 10,
  thumbnail: "test-image.jpg",
} as Product;

describe("Cart Store", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    localStorage.clear();
  });

  it("should add a product to the cart", () => {
    const cart = useCartStore();

    cart.addToCart(mockProduct);

    expect(cart.items).toHaveLength(1);
    expect(cart.items[0]?.product.id).toBe(1);
    expect(cart.items[0]?.quantity).toBe(1);
  });

  it("should increase quantity when adding the same product", () => {
    const cart = useCartStore();

    cart.addToCart(mockProduct);
    cart.addToCart(mockProduct);

    expect(cart.items).toHaveLength(1);
    expect(cart.items[0]?.quantity).toBe(2);
  });

  it("should calculate the correct cart total", () => {
    const cart = useCartStore();

    cart.addToCart(mockProduct);
    cart.addToCart(mockProduct);

    expect(cart.totalPrice).toBe(2000);
    expect(cart.itemCount).toBe(2);
  });
});
