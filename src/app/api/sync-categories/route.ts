import { NextResponse } from 'next/server';
import { syncCategoriesFromJubelio } from '@/lib/category-cache';

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    const cache = await syncCategoriesFromJubelio();
    return NextResponse.json({ total: cache.categories.length, syncedAt: cache.syncedAt });
  } catch (error) {
    console.error('Sync categories error:', error);
    return NextResponse.json({ error: 'Failed to sync categories' }, { status: 500 });
  }
}
