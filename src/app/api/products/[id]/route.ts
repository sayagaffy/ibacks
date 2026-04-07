import { NextRequest, NextResponse } from 'next/server';
import { getProducts, CachedProduct } from '@/lib/product-cache';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const cache = await getProducts();
    const product = cache.products.find(p => String(p.id) === String(id));

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const CATEGORY_NAME_MAP: Record<number, string> = {
      12642: 'Screen Protector',
      5524: 'Casing',
      12644: 'Aksesoris',
      7423: 'Kabel & Charger',
      5521: 'Audio',
      7426: 'Powerbank',
      7413: 'Earphone',
      18940: 'Teknologi',
      7410: 'Gaming',
      12649: 'Lainnya',
    };

    return NextResponse.json({
      id: product.id,
      name: product.name,
      category: product.categoryId ? (CATEGORY_NAME_MAP[product.categoryId] || 'Aksesoris') : 'Aksesoris',
      categoryId: product.categoryId,
      price: product.price,
      image: product.thumbnail,
      description: `Produk ${product.name} dari iBacks. Tersedia dalam ${product.variants.length || 1} varian.`,
      variants: product.variants,
    });
  } catch (error) {
    console.error('Product detail API error:', error);
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}
