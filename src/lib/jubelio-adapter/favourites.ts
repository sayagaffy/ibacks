import { jubelio } from './client';

export interface FavouriteItem {
  id: number;
  name: string;
  price: number;
  thumbnail: string | null;
  categoryId: number | null;
}

export async function getFavouriteItems(limit = 4): Promise<FavouriteItem[]> {
  const response = await jubelio.get<{ data?: Record<string, unknown>[] }>(
    `/inventory/items/?page=1&pageSize=${limit}&isFavourite=true`
  );
  const raw = response?.data || [];
  return raw.map((item) => ({
    id: Number(item.item_group_id || item.id || item.item_id),
    name: String(item.item_name || item.name || ''),
    price: Number(item.sell_price || 0),
    thumbnail: (item.thumbnail as string) || null,
    categoryId: (item.item_category_id as number) || null,
  }));
}
