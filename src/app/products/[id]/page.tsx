import { notFound } from 'next/navigation';
import { getProductDetailWithDescription, getProducts, isProductInStock } from '@/lib/product-cache';
import type { GalleryImage } from '@/lib/product-cache';
import { CATEGORY_NAME_MAP, PLACEHOLDER_IMAGE } from '@/lib/constants';
import { Header } from '@/components/ui/Header';
import { Accordion } from '@/components/ui/Accordion';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { ProductDetailClient } from '@/components/ui/ProductDetailClient';
import { ProductCard } from '@/components/ui/ProductCard';
import Link from 'next/link';
import { BackLink } from './BackLink';

export const revalidate = 3600;

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const itemId = Number(id);

  // Guard against non-numeric IDs
  if (isNaN(itemId) || itemId <= 0) {
    notFound();
  }

  const [product, productCache] = await Promise.all([
    getProductDetailWithDescription(itemId),
    getProducts(),
  ]);

  // Product not found in cache → proper 404
  if (!product) {
    notFound();
  }

  const categoryName = product.categoryId
    ? CATEGORY_NAME_MAP[product.categoryId] || 'Aksesoris'
    : 'Aksesoris';

  const fallbackGallery: GalleryImage[] = [];
  const seen = new Set<string>();
  const pushImage = (url: string | null) => {
    if (!url || seen.has(url)) return;
    seen.add(url);
    fallbackGallery.push({ full: url, thumb: url });
  };

  pushImage(product.thumbnail || PLACEHOLDER_IMAGE);
  product.variants.forEach((v) => pushImage(v.thumbnail || null));
  if (fallbackGallery.length === 0) {
    pushImage(PLACEHOLDER_IMAGE);
  }

  const galleryImages = product.galleryImages && product.galleryImages.length > 0
    ? product.galleryImages
    : fallbackGallery;

  const similarProducts = productCache.products
    .filter((p) => p.id !== product.id && p.categoryId === product.categoryId)
    .filter(isProductInStock)
    .slice(0, 4);

  const displayItem = {
    id: product.id,
    name: product.name,
    category: categoryName,
    price: product.price,
    originalPrice: product.originalPrice,
    isPromo: product.isPromo,
    image: galleryImages[0]?.full || product.thumbnail || PLACEHOLDER_IMAGE,
    images: galleryImages,
    description: product.description || `Produk ${product.name} dari iBacks.`,
    totalStock: product.totalStock ?? null,
    variants: (product.variants || []).map((v, i) => ({
      id: v.id,
      name: v.name || `Varian ${i + 1}`,
      sku: v.sku,
      price: v.price || product.price,
      thumbnail: v.thumbnail || null,
      stock: v.stock ?? null,
      images: v.images || [],
    })),
  };

  return (
    <div className="min-h-screen bg-background pb-36 flex flex-col">
      <Header />

      <div className="w-full max-w-5xl mx-auto px-4 mt-4 flex flex-col gap-2">
        <BackLink />
        <Breadcrumbs
          items={[
            { label: 'Beranda', href: '/' },
            {
              label: categoryName,
              href: product.categoryId ? `/search?category=${product.categoryId}` : '/search',
            },
            { label: product.name },
          ]}
        />
      </div>

      <main className="w-full max-w-5xl mx-auto flex flex-col md:flex-row gap-8 lg:gap-16 p-4 mt-4">
        {/* Client component handles interactivity: image switcher, variant picker, add to cart */}
        <ProductDetailClient item={displayItem} placeholderImage={PLACEHOLDER_IMAGE} />
      </main>

      {/* Static accordions stay as Server Component */}
      <div className="w-full max-w-5xl mx-auto px-4 pb-4">
        <Accordion title="Detail Product" defaultOpen>
          <div
            className="text-on-surface-variant text-base leading-relaxed prose prose-invert"
            dangerouslySetInnerHTML={{ __html: displayItem.description }}
          />
        </Accordion>
        <Accordion title="Garansi">
          <p className="text-on-surface-variant">
            Pengembalian 30 Hari &amp; Klaim Kecacatan Produksi 1 Tahun.
          </p>
        </Accordion>
      </div>

      {similarProducts.length > 0 && (
        <section className="w-full max-w-5xl mx-auto px-4 mt-8 pb-16">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg md:text-xl font-bold text-on-surface">
              Mungkin Anda Suka
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {similarProducts.map((p) => (
              <Link key={p.id} href={`/products/${p.id}`}>
                <ProductCard
                  name={p.name}
                  price={p.price > 0 ? `Rp ${p.price.toLocaleString('id-ID')}` : 'Hubungi Kami'}
                  imageSrc={p.thumbnail || PLACEHOLDER_IMAGE}
                  category={p.categoryId ? CATEGORY_NAME_MAP[p.categoryId] || 'Aksesoris' : 'Aksesoris'}
                />
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
