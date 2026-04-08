/**
 * Category Cache Layer
 *
 * Stores Jubelio item categories on disk to avoid repeated API calls.
 * Cache is refreshed max once per hour, or on demand via /api/sync-categories.
 */

import fs from 'fs';
import path from 'path';
import { getItemCategories } from '@/lib/jubelio-adapter/categories';

export interface CachedCategory {
  id: number;
  name: string;
  parentId: number | null;
}

export interface CategoryCache {
  categories: CachedCategory[];
  syncedAt: string;
}

const CACHE_DIR = path.join(process.cwd(), 'data');
const CACHE_FILE = path.join(CACHE_DIR, 'categories.json');
const CACHE_MAX_AGE_MS = 60 * 60 * 1000; // 1 hour

function ensureCacheDir() {
  if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
  }
}

export function readCategoriesFromDisk(): CategoryCache | null {
  try {
    if (!fs.existsSync(CACHE_FILE)) return null;
    const raw = fs.readFileSync(CACHE_FILE, 'utf-8');
    return JSON.parse(raw) as CategoryCache;
  } catch {
    return null;
  }
}

export function isCategoryCacheFresh(cache: CategoryCache | null): boolean {
  if (!cache || cache.categories.length === 0) return false;
  const syncedAt = new Date(cache.syncedAt).getTime();
  return Date.now() - syncedAt < CACHE_MAX_AGE_MS;
}

export async function syncCategoriesFromJubelio(): Promise<CategoryCache> {
  const stale = readCategoriesFromDisk();
  try {
    const items = await getItemCategories();
    const categories: CachedCategory[] = items.map((item) => ({
      id: item.id,
      name: item.name,
      parentId: item.parent_id ?? null,
    }));
    const cache: CategoryCache = {
      categories,
      syncedAt: new Date().toISOString(),
    };
    ensureCacheDir();
    fs.writeFileSync(CACHE_FILE, JSON.stringify(cache), 'utf-8');
    return cache;
  } catch (error) {
    console.error('[CategoryCache] Failed to sync categories:', error);
    if (stale) return stale;
    return { categories: [], syncedAt: new Date().toISOString() };
  }
}

export async function getCategories(): Promise<CategoryCache> {
  const cached = readCategoriesFromDisk();
  if (isCategoryCacheFresh(cached)) {
    return cached!;
  }
  return syncCategoriesFromJubelio();
}
