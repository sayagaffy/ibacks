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

export interface GalleryImage {
  full: string;
  thumb: string;
}

export interface CachedVariant {
  id: number;
  name: string;
  price: number;
  sku: string;
  thumbnail: string | null;
  stock?: number | null;
  images?: GalleryImage[];
  description?: string | null;
}

export interface CachedProduct {
  id: number;
  name: string;
  price: number;
  originalPrice?: number; // Used if product is on promo
  isPromo?: boolean;
  thumbnail: string | null;
  categoryId: number | null;
  description?: string | null; // Storing description here to avoid extra API call on PDP
  totalStock?: number | null;
  inStock?: boolean;
  galleryImages?: GalleryImage[];
  variants: CachedVariant[];
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

function parseNumber(value: unknown): number | null {
  if (typeof value === 'number' && !Number.isNaN(value)) return value;
  if (typeof value === 'string' && value.trim() !== '' && !Number.isNaN(Number(value))) {
    return Number(value);
  }
  return null;
}

function resolveStockValue(value: unknown, fallback: unknown): number | null {
  const primary = parseNumber(value);
  if (primary != null) return primary;
  return parseNumber(fallback);
}

function resolveImageUrl(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

function resolveLabelValue(value: unknown): string | null {
  if (typeof value === 'string') return value.trim() || null;
  if (typeof value === 'number') return String(value);
  if (value && typeof value === 'object') {
    const record = value as Record<string, unknown>;
    return (
      resolveLabelValue(record.value) ||
      resolveLabelValue(record.variation_value) ||
      resolveLabelValue(record.name) ||
      resolveLabelValue(record.label) ||
      null
    );
  }
  return null;
}

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
  // Also treat a cache with 0 products as stale — it means a previous sync failed silently.
  if (!cache || cache.products.length === 0) return false;
  const syncedAt = new Date(cache.syncedAt).getTime();
  return Date.now() - syncedAt < CACHE_MAX_AGE_MS;
}

export async function syncProductsFromJubelio(): Promise<ProductCache> {
  console.log('[ProductCache] Fetching all products from Jubelio API...');
  const startTime = Date.now();

  // Keep the old cache just in case Jubelio is down
  const staleCache = readProductsFromDisk();

  try {
    const [itemsResponse, promosResponse] = await Promise.all([
      jubelio.get<{ data: Record<string, unknown>[]; totalCount: number }>('/inventory/items/'),
      jubelio.get<{ data: Record<string, unknown>[] }>('/inventory/promotions/?page=1&pageSize=50').catch((e) => {
        // Promotions might fail independently, we can still show products
        console.warn('[ProductCache] Failed to fetch promotions, continuing without promos.', e.message);
        return { data: [] };
      })
    ]);

    const rawProducts = itemsResponse?.data || [];
    const rawPromos = promosResponse?.data || [];

    if (rawProducts.length === 0) {
      console.warn('[ProductCache] Jubelio returned 0 products. Aborting sync.');
      if (staleCache) {
        console.log('[ProductCache] Falling back to stale cache.');
        return staleCache;
      }
    }

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
        const vStock = resolveStockValue(v.available_qty, v.end_qty);

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
          stock: vStock,
        };
      });

      const regularPrice = basePrice || variants[0]?.price || 0;
      const price = isPromo ? promoPrice : regularPrice;
      const thumbnail = (p.thumbnail as string) || variants.find((v: Record<string, unknown>) => v.thumbnail)?.thumbnail || null;
      const baseStock = resolveStockValue(p.available_qty, p.end_qty);
      const hasUnknownStock = variants.some((v) => v.stock == null);
      const totalStock = variants.length > 0
        ? (hasUnknownStock ? null : variants.reduce((sum, v) => sum + (v.stock || 0), 0))
        : baseStock;
      const inStock = totalStock == null ? true : totalStock > 0;

      return {
        id: p.item_group_id as number,
        name: p.item_name as string,
        price,
        ...(isPromo ? { isPromo: true, originalPrice: regularPrice } : {}),
        thumbnail: thumbnail as string | null,
        categoryId: (p.item_category_id as number) || null,
        totalStock,
        inStock,
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
  } catch (error) {
    console.error('[ProductCache] Failed to sync products from Jubelio:', error instanceof Error ? error.message : String(error));
    if (staleCache) {
      console.log('[ProductCache] Falling back to stale cache due to sync failure.');
      return staleCache;
    }
    // If we have no cache and sync failed, return empty to prevent hard crashing
    return { products: [], totalCount: 0, syncedAt: new Date().toISOString() };
  }
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

export function isProductInStock(product: CachedProduct): boolean {
  if (typeof product.inStock === 'boolean') return product.inStock;
  if (typeof product.totalStock === 'number') return product.totalStock > 0;
  const hasUnknown = product.variants.some((v) => v.stock == null);
  if (hasUnknown) return true;
  return product.variants.some((v) => (v.stock || 0) > 0);
}

/**
 * Returns a full product detail by searching the cache first (instant),
 * then enriching with a live description fetch from Jubelio.
 *
 * `itemId` is the `item_group_id` used in the URL (e.g., `/products/12345`).
 * Jubelio's `/inventory/items/{id}` can accept the group_id to return description.
 */
export async function getProductDetailWithDescription(itemId: number): Promise<CachedProduct | null> {
  // Step 1: Get the product from the cache (fast — disk read or already synced)
  const cache = await getProducts();

  // Search by group ID first (this is what the URL uses)
  let baseProduct = cache.products.find(p => p.id === itemId);

  // Fallback: search by variant item_id (in case URL ever uses variant id)
  if (!baseProduct) {
    baseProduct = cache.products.find(p => p.variants.some(v => v.id === itemId));
  }

  // If not found in cache at all, the product doesn't exist
  if (!baseProduct) {
    console.warn(`[ProductCache] Product ${itemId} not found in cache.`);
    return null;
  }

  let enrichedProduct: CachedProduct = { ...baseProduct };

  try {
    const groupData = await jubelio.get<{ product_skus?: Record<string, unknown>[] }>(
      `/inventory/items/group/${itemId}`
    );

    const groupThumb =
      resolveImageUrl((groupData as Record<string, unknown>)?.thumbnail) ||
      resolveImageUrl((groupData as Record<string, unknown>)?.image) ||
      baseProduct.thumbnail ||
      null;

    const skuDetails = new Map<
      number,
      { images: GalleryImage[]; stock: number | null; label: string | null; thumbnail: string | null }
    >();
    (groupData?.product_skus || []).forEach((sku) => {
      const skuId = parseNumber((sku as Record<string, unknown>).item_id);
      if (skuId == null) return;

      const skuStock = resolveStockValue(
        (sku as Record<string, unknown>).available_qty,
        (sku as Record<string, unknown>).end_qty
      );
      const variationValues = Array.isArray((sku as Record<string, unknown>).variation_values)
        ? ((sku as Record<string, unknown>).variation_values as Record<string, unknown>[])
        : [];
      const labelParts = variationValues
        .map((value) => resolveLabelValue(value))
        .filter((value): value is string => Boolean(value));
      const skuLabel =
        labelParts.length > 0
          ? labelParts.join(' - ')
          : resolveLabelValue((sku as Record<string, unknown>).item_code);

      const rawImages = Array.isArray((sku as Record<string, unknown>).images)
        ? ((sku as Record<string, unknown>).images as Record<string, unknown>[])
        : [];
      const images = rawImages
        .map((img) => {
          const cloudKey = resolveImageUrl((img as Record<string, unknown>).cloud_key);
          const url = resolveImageUrl((img as Record<string, unknown>).url);
          const thumb = resolveImageUrl((img as Record<string, unknown>).thumbnail);
          const full =
            (cloudKey && cloudKey.startsWith('http') ? cloudKey : null) ||
            url ||
            cloudKey ||
            thumb;
          const finalThumb = thumb || full;
          if (!full || !finalThumb) return null;
          return { full, thumb: finalThumb };
        })
        .filter((img): img is GalleryImage => Boolean(img));

      let skuThumbnail = resolveImageUrl((sku as Record<string, unknown>).thumbnail);
      if (images.length > 0) {
        skuThumbnail = images[0]?.thumb || images[0]?.full || skuThumbnail;
      }

      if (images.length === 0) {
        const fallback = skuThumbnail || groupThumb;
        if (fallback) images.push({ full: fallback, thumb: fallback });
      }

      skuDetails.set(skuId, {
        images,
        stock: skuStock,
        label: skuLabel || null,
        thumbnail: skuThumbnail || groupThumb,
      });
    });

    const mergedVariants: CachedVariant[] = baseProduct.variants.map((v) => {
      const detail = skuDetails.get(v.id);
      return {
        ...v,
        name: detail?.label || v.name,
        stock: detail?.stock ?? v.stock ?? null,
        images: detail?.images?.length ? detail.images : v.images,
        thumbnail: detail?.thumbnail || v.thumbnail,
      };
    });

    const seen = new Set<string>();
    const galleryImages: GalleryImage[] = [];
    mergedVariants.forEach((v) => {
      (v.images || []).forEach((img) => {
        if (!seen.has(img.full)) {
          seen.add(img.full);
          galleryImages.push(img);
        }
      });
    });

    const hasUnknownStock = mergedVariants.some((v) => v.stock == null);
    const totalStock = mergedVariants.length > 0
      ? (hasUnknownStock ? null : mergedVariants.reduce((sum, v) => sum + (v.stock || 0), 0))
      : baseProduct.totalStock;

    enrichedProduct = {
      ...baseProduct,
      variants: mergedVariants,
      totalStock,
      inStock: totalStock == null ? baseProduct.inStock ?? true : totalStock > 0,
      galleryImages,
    };
  } catch (error) {
    console.warn(
      `[ProductCache] Could not fetch group details for product ${itemId}, showing without gallery.`,
      error instanceof Error ? error.message : String(error)
    );
  }

  // Step 2: Fetch the live description from Jubelio (light call, just for rich text)
  // We use the first variant's item_id for the description lookup, which Jubelio supports
  const variantIdForDesc = enrichedProduct.variants[0]?.id ?? itemId;
  try {
    const itemData = await jubelio.get<{ description?: string }>(
      `/inventory/items/${variantIdForDesc}`
    );
    return {
      ...enrichedProduct,
      description: itemData?.description || null,
    };
  } catch (error) {
    console.warn(
      `[ProductCache] Could not fetch description for product ${itemId}, showing without it.`,
      error instanceof Error ? error.message : String(error)
    );
    // Return the product from cache without description - better than showing 404
    return { ...enrichedProduct, description: null };
  }
}
