import { NextResponse } from 'next/server';
import { getProducts, isProductInStock } from '@/lib/product-cache';
import { CATEGORY_NAME_MAP } from '@/lib/constants';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const cache = await getProducts();
    const products = cache.products.filter(isProductInStock);

    // Count items per category
    const catCounts: Record<string, number> = {};
    products.forEach(p => {
      if (p.categoryId) {
        const key = String(p.categoryId);
        catCounts[key] = (catCounts[key] || 0) + 1;
      }
    });

    const categories = Object.entries(catCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 12)
      .map(([id, count]) => ({
        id: parseInt(id),
        name: CATEGORY_NAME_MAP[parseInt(id)] || `Kategori ${id}`,
        count,
      }));

    return NextResponse.json(
      { categories, total: products.length, cachedAt: cache.syncedAt },
      {
        headers: {
          'Cache-Control': 'public, max-age=300, stale-while-revalidate=3600',
        }
      }
    );
  } catch (error) {
    console.error('Categories API error:', error);
    return NextResponse.json({ categories: [], total: 0 }, { status: 500 });
  }
}
