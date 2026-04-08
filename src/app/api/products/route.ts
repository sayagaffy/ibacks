import { NextRequest, NextResponse } from 'next/server';
import { getProducts, isProductInStock } from '@/lib/product-cache';

export const dynamic = 'force-dynamic'; // Don't Next.js-cache this route, we manage cache ourselves

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const query = searchParams.get('q') || '';
    const category = searchParams.get('category') || '';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '24', 10);

    // Read from disk cache (fast!) or sync from Jubelio if stale
    const cache = await getProducts();
    let products = cache.products;

    const hasQuery = Boolean(query.trim());

    // Filter by search query
    if (query) {
      const q = query.toLowerCase().trim();
      products = products.filter(p => p.name.toLowerCase().includes(q));
    }

    // Hide sold-out items unless user is explicitly searching by name
    if (!hasQuery) {
      products = products.filter(isProductInStock);
    }

    // Filter by category ID
    if (category && category !== 'all') {
      const catId = parseInt(category, 10);
      products = products.filter(p => p.categoryId === catId);
    }

    const total = products.length;
    const totalPages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    const paginated = products.slice(start, start + limit);

    const items = paginated.map(p => ({
      id: p.id,
      name: p.name,
      price: p.price,
      thumbnail: p.thumbnail,
      categoryId: p.categoryId,
    }));

    return NextResponse.json(
      { items, total, page, totalPages, limit, cachedAt: cache.syncedAt },
      {
        headers: {
          // Allow browser to cache for 5 minutes
          'Cache-Control': 'public, max-age=300, stale-while-revalidate=3600',
        }
      }
    );
  } catch (error) {
    console.error('Products API error:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}
