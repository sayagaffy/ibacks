import { jubelio } from "./client";

export interface JubelioChannel {
  channel_id: number;
  channel_item_id?: string | number | null;
}

export interface JubelioInventoryItem {
  item_id: number;
  item_code?: string | null;
  item_name?: string | null;
  channels?: JubelioChannel[] | null;
}

export async function getInventoryItem(
  itemId: number,
): Promise<JubelioInventoryItem | null> {
  if (!Number.isFinite(itemId) || itemId <= 0) return null;
  const response = await jubelio.get<Record<string, unknown>>(
    `/inventory/items/${itemId}`,
  );

  if (!response || typeof response !== "object") return null;
  const candidate = response as Partial<JubelioInventoryItem>;
  if (typeof candidate.item_id !== "number") return null;
  return candidate as JubelioInventoryItem;
}
