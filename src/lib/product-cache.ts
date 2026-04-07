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
  thumbnail: string | null;
  categoryId: number | null;
  variants: Array<{
    id: number;
    name: string;
    price: number;
    sku: string;
    thumbnail: string | null;
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

  const response = await jubelio.get<{ data: any[]; totalCount: number }>('/inventory/items/');
  const rawProducts = response?.data || [];

  const products: CachedProduct[] = rawProducts.map((p: any) => {
    const basePrice = parseFloat(p.sell_price) || 0;
    const variants = (p.variants || []).map((v: any) => ({
      id: v.item_id,
      name: v.item_name,
      price: v.sell_price || basePrice,
      sku: v.item_code || '',
      thumbnail: v.thumbnail || null,
    }));

    const price = basePrice || variants[0]?.price || 0;
    const thumbnail = p.thumbnail || variants.find((v: any) => v.thumbnail)?.thumbnail || null;

    return {
      id: p.item_group_id,
      name: p.item_name,
      price,
      thumbnail,
      categoryId: p.item_category_id || null,
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
