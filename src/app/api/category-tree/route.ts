import { NextResponse } from 'next/server';
import { buildCategoryTree, flattenCategoryTree } from '@/lib/category-tree';
import { getCategories } from '@/lib/category-cache';
import { fallbackCategoryFlat, fallbackCategoryTree } from '@/lib/fallback-category-tree';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const cache = await getCategories();
    const flat = cache.categories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      parentId: cat.parentId ?? null,
    }));
    if (flat.length === 0) {
      return NextResponse.json(
        { tree: fallbackCategoryTree, flat: fallbackCategoryFlat },
        {
          headers: {
            'Cache-Control': 'public, max-age=300, stale-while-revalidate=3600',
          },
        }
      );
    }

    const tree = buildCategoryTree(flat);
    const flatList = flattenCategoryTree(tree);

    return NextResponse.json(
      { tree, flat: flatList },
      {
        headers: {
          'Cache-Control': 'public, max-age=300, stale-while-revalidate=3600',
        },
      }
    );
  } catch (error) {
    console.error('Category tree API error:', error);
    return NextResponse.json({ tree: [], flat: [] }, { status: 500 });
  }
}
