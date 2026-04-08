import { NextResponse } from 'next/server';
import { getFavouriteItems } from '@/lib/jubelio-adapter/favourites';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const items = await getFavouriteItems(6);
    return NextResponse.json(
      { items },
      {
        headers: {
          'Cache-Control': 'public, max-age=300, stale-while-revalidate=3600',
        },
      }
    );
  } catch (error) {
    console.error('Popular products API error:', error);
    return NextResponse.json({ items: [] }, { status: 500 });
  }
}
