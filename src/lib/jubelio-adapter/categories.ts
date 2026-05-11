import { jubelio } from './client';

export interface JubelioCategory {
  id: number;
  name: string;
  parent_id: number | null;
}

export async function getItemCategories(): Promise<JubelioCategory[]> {
  const response = await jubelio.get<{ data?: Record<string, unknown>[] }>(
    '/inventory/categories/item-categories/'
  );
  // TEMP DEBUG: verify category payload shape from Jubelio
  console.log(
    '[Jubelio] item-categories',
    Array.isArray(response?.data) ? response.data.length : 'no-data'
  );
  if (Array.isArray(response?.data) && response.data[0]) {
    console.log('[Jubelio] item-categories sample keys', Object.keys(response.data[0]));
  }
  const raw = response?.data || [];
  return raw
    .map((item) => ({
      id: Number(item.category_id ?? item.id),
      name: String(item.category_name || item.name || ''),
      parent_id: item.parent_id !== null && item.parent_id !== undefined
        ? Number(item.parent_id)
        : null,
    }))
    .filter((item) => Number.isFinite(item.id) && item.name);
}
