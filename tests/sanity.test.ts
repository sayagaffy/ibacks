import React from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Home from "../src/app/page";

const mockSearchParams = new URLSearchParams();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
  usePathname: () => "/",
  useSearchParams: () => ({
    get: (key: string) => mockSearchParams.get(key),
    toString: () => mockSearchParams.toString(),
  }),
}));

vi.mock("@/store/cartStore", () => ({
  useCartStore: (
    selector: (state: { items: Array<{ quantity: number }> }) => unknown,
  ) => selector({ items: [] }),
}));

vi.mock("@/store/authStore", () => ({
  useAuthStore: (
    selector: (state: {
      isAuthenticated: boolean;
      user: null;
      login: () => void;
    }) => unknown,
  ) => selector({ isAuthenticated: false, user: null, login: vi.fn() }),
}));

vi.mock("@/lib/sanity-client", () => ({
  getPromoHero: vi.fn().mockResolvedValue(null),
}));

vi.mock("@/lib/product-cache", () => ({
  getProducts: vi.fn().mockResolvedValue({
    products: [],
    totalCount: 0,
    syncedAt: new Date().toISOString(),
  }),
  isProductInStock: vi.fn().mockReturnValue(true),
}));

vi.mock("@/lib/promo-hero", () => ({
  buildPromoHeroSlides: vi.fn().mockReturnValue([]),
}));

vi.mock("@/lib/seo/mega-footer", () => ({
  getSeoFooterLinks: vi.fn().mockResolvedValue([]),
  popularSearches: [],
}));

vi.mock("@/lib/seo-content", () => ({
  getHomeSeoContent: vi.fn().mockReturnValue({
    title: "SEO Test",
    intro: "Intro",
    items: [{ question: "Q1", answer: "A1" }],
  }),
}));

describe("Home page", () => {
  it("renders without crashing", async () => {
    const element = await Home();
    render(element as React.ReactElement);
    expect(screen.getByText("SEO Test")).toBeTruthy();
  });
});
