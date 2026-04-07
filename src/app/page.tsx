import { Header } from '@/components/ui/Header';
import { HeroBanner } from '@/components/ui/HeroBanner';
import { PromoSlider, PromoProduct } from '@/components/ui/PromoSlider';
import { ProductCard } from '@/components/ui/ProductCard';
import { getHeroBanners } from '@/lib/sanity-client';
import { getProducts } from '@/lib/product-cache';
import Link from 'next/link';

// Opt out of caching if you want highly dynamic data, but for e-commerce catalog, ISR is better.
export const revalidate = 3600; // 1 hour

export default async function Home() {
  // Parallel fetching from CMS & WMS
  const [heroBanners, productsCache] = await Promise.all([
    getHeroBanners().catch(() => []),
    getProducts().catch(() => ({ products: [], totalCount: 0, syncedAt: '' }))
  ]);

  // Fallback if CMS fails/empty
  const activeBanner = heroBanners?.[0] || {
    title: "The Ultimate Future",
    subtitle: "Kejernihan presisi layar sentuh yang belum pernah ada sebelumnya. Memperkenalkan pelindung kaca asimetris iBacks.",
    imageUrl: "https://images.unsplash.com/photo-1621330396167-a414f61f7db1?q=80&w=2000&auto=format&fit=crop",
    ctaText: "Eksplorasi Sekarang",
    ctaLink: "#products"
  };

  const allProducts = productsCache?.products || [];
  const products = allProducts.slice(0, 8);

  const promoProducts: PromoProduct[] = allProducts
    .filter((p) => p.isPromo)
    .slice(0, 10)
    .map((p) => ({
      id: p.id,
      name: p.name,
      category: p.categoryId === 12642 ? 'Screen Protector' : 'Aksesoris', // Basic mapping fallback
      price: p.price,
      originalPrice: p.originalPrice || p.price,
      image: p.thumbnail || 'https://images.unsplash.com/photo-1592890288564-76628a30a657?q=80&w=800',
    }));

  return (
    <div className="min-h-screen bg-background pb-32 flex flex-col">
      <Header title="ibacks" />

      <main className="flex-1 w-full flex flex-col items-center">
        {/* Banner Section (CMS Driven) */}
        <section className="w-full max-w-7xl mx-auto px-4 mt-6">
          <HeroBanner 
            title={activeBanner.title}
            subtitle={activeBanner.subtitle}
            imageUrl={activeBanner.desktopImage?.asset?.url || activeBanner.imageUrl}
            ctaText={activeBanner.ctaText}
            ctaLink={activeBanner.ctaLink}
          />
        </section>

        {/* Promo Slider Section */}
        {promoProducts.length > 0 && (
          <section className="w-full max-w-7xl mx-auto mt-12 md:mt-16">
            <PromoSlider products={promoProducts} />
          </section>
        )}

        {/* Jelajahi Ekosistem Section Expanded based on Mockup */}
        <section className="w-full max-w-7xl mx-auto px-4 mt-16 md:mt-24">
          <div className="flex items-center justify-between mb-8 border-b surface-border pb-4">
            <h2 className="text-xl md:text-2xl font-bold text-on-surface tracking-tight">
              Jelajahi Ekosistem
            </h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              { id: 'screen-protector', name: 'Screen Protector', icon: 'M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z' },
              { id: 'case', name: 'Casing', icon: 'M4 5a2 2 0 012-2h12a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm4 0h8v14H8V5z' },
              { id: 'charger', name: 'Adaptor Charger', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
              { id: 'cable', name: 'Kabel Data', icon: 'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1' },
              { id: 'powerbank', name: 'Powerbank', icon: 'M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4' },
              { id: 'audio', name: 'Audio & Earphone', icon: 'M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3' },
              { id: 'holder', name: 'Car Holder & Mount', icon: 'M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z' },
              { id: 'wearables', name: 'Smartwatch Strap', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
              { id: 'bag', name: 'Sleeve & Bag', icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z' },
              { id: 'accessories', name: 'Aksesoris Lainnya', icon: 'M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z' }
            ].map(cat => (
              <a href={`/search?q=${cat.name}`} key={cat.id} className="group flex flex-col items-center justify-center p-6 md:p-8 bg-surface-container rounded-3xl border surface-border hover:border-primary/50 transition-all hover:-translate-y-1 text-center">
                <svg className="w-8 h-8 md:w-10 md:h-10 mb-3 md:mb-4 text-on-surface-variant group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={cat.icon} />
                </svg>
                <span className="text-xs md:text-sm font-semibold text-on-surface leading-tight">{cat.name}</span>
              </a>
            ))}
          </div>
        </section>

        {/* Product Listing Section */}
        <section id="products" className="w-full max-w-7xl mx-auto px-4 mt-20 flex flex-col gap-10">
          <div className="flex items-end justify-between border-b surface-border pb-4">
            <h2 className="text-3xl font-bold tracking-tight text-white glow-primary/20">Semua Produk</h2>
            <Link href="/search" className="text-primary hover:text-primary-container transition-colors text-sm font-semibold tracking-widest uppercase">
              Lihat Semua
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.length > 0 ? (
              products.map((p) => (
                  <Link key={p.id} href={`/products/${p.id}`}>
                    <ProductCard
                      name={p.name}
                      price={p.price > 0 ? `Rp ${p.price.toLocaleString('id-ID')}` : 'Hubungi Kami'}
                      imageSrc={p.thumbnail || 'https://images.unsplash.com/photo-1592890288564-76628a30a657?q=80&w=800'}
                      category={p.categoryId === 12642 ? 'Screen Protector' : 'Aksesoris'}
                    />
                  </Link>
                ))
            ) : (
              Array.from({length: 4}).map((_, i) => (
                <Link key={i} href={`/search`}>
                  <ProductCard
                    name={`iBacks High-End Case Series ${i+1}`}
                    price="Rp 299.000"
                    imageSrc={`https://images.unsplash.com/photo-1592890288564-76628a30a657?q=80&w=800&auto=format&fit=crop&sig=${i}`}
                    category="Essential"
                  />
                </Link>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
