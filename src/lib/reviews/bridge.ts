import { getInventoryItem, type JubelioChannel } from "@/lib/jubelio-adapter/items";

export const SHOPEE_CHANNEL_ID = 64;

export function extractShopeeChannelItemId(
  channels: JubelioChannel[] | null | undefined,
): string | null {
  if (!Array.isArray(channels)) return null;
  const match = channels.find(
    (channel) => channel?.channel_id === SHOPEE_CHANNEL_ID,
  );
  if (!match?.channel_item_id) return null;
  const id = String(match.channel_item_id).trim();
  return id ? id : null;
}

export async function getShopeeChannelItemId(
  jubelioItemId: number,
): Promise<string | null> {
  const item = await getInventoryItem(jubelioItemId);
  return extractShopeeChannelItemId(item?.channels ?? null);
}
