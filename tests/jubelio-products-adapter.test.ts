import { beforeEach, describe, expect, it, vi } from "vitest";
import { jubelio } from "@/lib/jubelio-adapter/client";
import {
  getInventoryItemDescription,
  getInventoryItemGroup,
  getInventoryItems,
  getInventoryPromotions,
} from "@/lib/jubelio-adapter/products";

vi.mock("@/lib/jubelio-adapter/client", () => ({
  jubelio: {
    get: vi.fn(),
  },
}));

describe("Jubelio product adapter", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches inventory items from the Jubelio inventory endpoint", async () => {
    vi.mocked(jubelio.get).mockResolvedValueOnce({
      data: [{ item_group_id: 101, item_name: "iPhone" }],
      totalCount: 1,
    });

    const result = await getInventoryItems();

    expect(jubelio.get).toHaveBeenCalledWith("/inventory/items/");
    expect(result.data[0]?.item_group_id).toBe(101);
    expect(result.totalCount).toBe(1);
  });

  it("fetches active promotion payloads from the Jubelio promotions endpoint", async () => {
    vi.mocked(jubelio.get).mockResolvedValueOnce({
      data: [{ details: [{ item_id: 501, promotion_price: "90000" }] }],
    });

    const result = await getInventoryPromotions();

    expect(jubelio.get).toHaveBeenCalledWith(
      "/inventory/promotions/?page=1&pageSize=50",
    );
    expect(result.data[0]?.details?.[0]?.item_id).toBe(501);
  });

  it("fetches group detail and item description through product adapter functions", async () => {
    vi.mocked(jubelio.get)
      .mockResolvedValueOnce({ product_skus: [{ item_id: 77 }] })
      .mockResolvedValueOnce({ description: "<p>Detail</p>" });

    const group = await getInventoryItemGroup(10);
    const item = await getInventoryItemDescription(77);

    expect(jubelio.get).toHaveBeenNthCalledWith(1, "/inventory/items/group/10");
    expect(jubelio.get).toHaveBeenNthCalledWith(2, "/inventory/items/77");
    expect(group.product_skus?.[0]?.item_id).toBe(77);
    expect(item.description).toBe("<p>Detail</p>");
  });
});
