import { NextResponse } from 'next/server';
import { syncProductsFromJubelio, readProductsFromDisk } from '@/lib/product-cache';

export const dynamic = 'force-dynamic'; // Never cache this route itself

export async function GET() {
  const before = readProductsFromDisk();
  
  try {
    const cache = await syncProductsFromJubelio();
    return NextResponse.json({
      success: true,
      totalProducts: cache.totalCount,
      syncedAt: cache.syncedAt,
      previousSyncedAt: before?.syncedAt || null,
    });
  } catch (error) {
    console.error('[sync-products] Error:', error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}
