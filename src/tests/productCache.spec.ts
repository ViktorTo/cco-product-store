import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

import type { ProductResponse } from "@/types/product";

import {
  getCachedProducts,
  setCachedProducts,
  clearProductCache,
} from "@/services/productCache";

const mockResponse = {
  products: [
    {
      id: 1,
      title: "Test Phone",
      price: 1000,
    },
  ],
  total: 1,
  skip: 0,
  limit: 12,
} as ProductResponse;

describe("Product Cache", () => {
  beforeEach(() => {
    clearProductCache();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should store and retrieve cached products", () => {
    setCachedProducts("phone:1", mockResponse);

    const result = getCachedProducts("phone:1");

    expect(result).toEqual(mockResponse);
  });

  it("should return null when cache does not exist", () => {
    const result = getCachedProducts("laptop:1");

    expect(result).toBeNull();
  });

  it("should expire cached products after five minutes", () => {
    setCachedProducts("phone:1", mockResponse);

    // Move time forward by more than five minutes
    vi.advanceTimersByTime(5 * 60 * 1000 + 1);

    const result = getCachedProducts("phone:1");

    expect(result).toBeNull();
  });
});
