import { describe, expect, it, vi } from "vitest";
import {
  extractShopeeChannelItemId,
  getShopeeChannelItemId,
  SHOPEE_CHANNEL_ID,
} from "@/lib/reviews/bridge";
import { getInventoryItem } from "@/lib/jubelio-adapter/items";

vi.mock("@/lib/jubelio-adapter/items", () => ({
  getInventoryItem: vi.fn(),
}));

describe("extractShopeeChannelItemId", () => {
  it("returns shopee channel item id when present", () => {
    const result = extractShopeeChannelItemId([
      { channel_id: 1, channel_item_id: "x" },
      { channel_id: SHOPEE_CHANNEL_ID, channel_item_id: 98765 },
    ]);

    expect(result).toBe("98765");
  });

  it("returns null when shopee channel is missing", () => {
    const result = extractShopeeChannelItemId([
      { channel_id: 12, channel_item_id: "x" },
    ]);

    expect(result).toBeNull();
  });
});

describe("getShopeeChannelItemId", () => {
  it("uses the inventory item channels", async () => {
    vi.mocked(getInventoryItem).mockResolvedValue({
      item_id: 123,
      channels: [{ channel_id: SHOPEE_CHANNEL_ID, channel_item_id: "ABCD" }],
    });

    const result = await getShopeeChannelItemId(123);
    expect(result).toBe("ABCD");
  });
});
