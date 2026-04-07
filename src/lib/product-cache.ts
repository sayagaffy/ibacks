/**
 * Product Cache Layer
 * 
 * Stores all Jubelio products in a local JSON file to avoid
 * fetching 1200+ items on every request. Cache is refreshed
 * max once per hour, or on demand via /api/sync-products.
 */

import { jubelio } from '@/lib/jubelio-adapter/client';
import fs from 'fs';
import path from 'path';

export interface CachedProduct {
  id: number;
  name: string;
  price: number;
  originalPrice?: number; // Used if product is on promo
  isPromo?: boolean;
  thumbnail: string | null;
  categoryId: number | null;
  description?: string | null; // Storing description here to avoid extra API call on PDP
  variants: Array<{
    id: number;
    name: string;
    price: number;
    sku: string;
    thumbnail: string | null;
    description?: string | null;
  }>;
}

export interface ProductCache {
  products: CachedProduct[];
  totalCount: number;
  syncedAt: string; // ISO timestamp
}

// Store in data/ directory — persists across builds and hot reloads
const CACHE_DIR = path.join(process.cwd(), 'data');
const CACHE_FILE = path.join(CACHE_DIR, 'products.json');
const CACHE_MAX_AGE_MS = 60 * 60 * 1000; // 1 hour

function ensureCacheDir() {
  if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
  }
}

export function readProductsFromDisk(): ProductCache | null {
  try {
    if (!fs.existsSync(CACHE_FILE)) return null;
    const raw = fs.readFileSync(CACHE_FILE, 'utf-8');
    return JSON.parse(raw) as ProductCache;
  } catch {
    return null;
  }
}

export function isCacheFresh(cache: ProductCache | null): boolean {
  if (!cache) return false;
  const syncedAt = new Date(cache.syncedAt).getTime();
  return Date.now() - syncedAt < CACHE_MAX_AGE_MS;
}

export async function syncProductsFromJubelio(): Promise<ProductCache> {
  console.log('[ProductCache] Fetching all products from Jubelio API...');
  const startTime = Date.now();

  const [itemsResponse, promosResponse] = await Promise.all([
    jubelio.get<{ data: Record<string, unknown>[]; totalCount: number }>('/inventory/items/').catch(() => ({ data: [], totalCount: 0 })),
    jubelio.get<{ data: Record<string, unknown>[] }>('/inventory/promotions/?page=1&pageSize=50').catch(() => ({ data: [] }))
  ]);

  const rawProducts = itemsResponse?.data || [];
  const rawPromos = promosResponse?.data || [];

  const now = new Date();

  // Create a map of active promotion variant IDs to their promo prices
  const activePromosMap = new Map<number, number>();

  rawPromos.forEach((promo: Record<string, unknown>) => {
    // Check if promo is active based on dates
    const startDate = new Date(promo.start_date as string);
    const endDate = new Date(promo.end_date as string);

    if (now >= startDate && now <= endDate && Array.isArray(promo.details)) {
      promo.details.forEach((detail: Record<string, unknown>) => {
        if (typeof detail.item_id === 'number' && detail.promotion_price) {
          activePromosMap.set(detail.item_id, parseFloat(detail.promotion_price as string));
        }
      });
    }
  });

  // Note: we'll fetch full descriptions lazily when PDP is accessed, OR we could fetch them here
  // but fetching 1200+ descriptions one-by-one would be too slow. We'll leave `description` undefined
  // in the bulk cache and fetch it on-demand in a separate function.

  const products: CachedProduct[] = rawProducts.map((p: Record<string, unknown>) => {
    const basePrice = parseFloat(p.sell_price as string) || 0;
    let isPromo = false;
    let promoPrice = 0;

    const variants = ((p.variants as Record<string, unknown>[]) || []).map((v: Record<string, unknown>) => {
      let vPrice = parseFloat(v.sell_price as string) || basePrice;

      // Check if this variant is on promotion
      if (typeof v.item_id === 'number' && activePromosMap.has(v.item_id)) {
        isPromo = true;
        vPrice = activePromosMap.get(v.item_id)!;
        // Keep the lowest promo price for the base product if there are multiple variants on promo
        if (promoPrice === 0 || vPrice < promoPrice) {
          promoPrice = vPrice;
        }
      }

      return {
        id: v.item_id as number,
        name: v.item_name as string,
        price: vPrice,
        sku: (v.item_code as string) || '',
        thumbnail: (v.thumbnail as string) || null,
      };
    });

    const regularPrice = basePrice || variants[0]?.price || 0;
    const price = isPromo ? promoPrice : regularPrice;
    const thumbnail = (p.thumbnail as string) || variants.find((v: Record<string, unknown>) => v.thumbnail)?.thumbnail || null;

    return {
      id: p.item_group_id as number,
      name: p.item_name as string,
      price,
      ...(isPromo ? { isPromo: true, originalPrice: regularPrice } : {}),
      thumbnail: thumbnail as string | null,
      categoryId: (p.item_category_id as number) || null,
      variants,
    };
  });

  const cache: ProductCache = {
    products,
    totalCount: products.length,
    syncedAt: new Date().toISOString(),
  };

  ensureCacheDir();
  fs.writeFileSync(CACHE_FILE, JSON.stringify(cache), 'utf-8');

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`[ProductCache] Synced ${products.length} products in ${elapsed}s → written to disk`);

  return cache;
}

/**
 * Main entry point: returns cached products, refreshing if stale.
 * First call takes ~5-10s. Subsequent calls within 1h are instant (disk read).
 */
export async function getProducts(): Promise<ProductCache> {
  const cached = readProductsFromDisk();

  if (isCacheFresh(cached)) {
    return cached!;
  }

  // Cache is stale or missing — sync from Jubelio
  return syncProductsFromJubelio();
}

/**
 * Fetches product detail from Jubelio and returns a merged CachedProduct
 * with the full description populated. It first tries to find it in the cache,
 * then fetches the specific `/inventory/items/{id}` endpoint.
 * Note: `id` should be the variant `item_id` (e.g., 6074) for best description results.
 */
export async function getProductDetailWithDescription(itemId: number): Promise<CachedProduct | null> {
  // We don't cache this on disk yet, it's fetched per PDP load (handled by Next.js Data Cache)
  try {
    const itemData = await jubelio.get<Record<string, unknown>>(`/inventory/items/${itemId}`);

    // We try to find the base product from cache
    const cache = await getProducts();
    // Since itemId here is likely the variant id (item_id), we search through variants
    let baseProduct = cache.products.find(p => p.variants.some(v => v.id === itemId));

    // If we can't find it by variant ID, it might be the group ID
    if (!baseProduct) {
        baseProduct = cache.products.find(p => p.id === itemId);
    }

    if (!baseProduct) return null;

    // Create a new object to avoid mutating the cache
    return {
      ...baseProduct,
      description: (itemData.description as string) || null,
    };
  } catch (error) {
    console.error(`[ProductCache] Error fetching detail for ${itemId}:`, error);
    return null;
  }
}
