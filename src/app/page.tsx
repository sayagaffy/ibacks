import { Header } from '@/components/ui/Header';
import { HeroBanner } from '@/components/ui/HeroBanner';
import { ProductCard } from '@/components/ui/ProductCard';
import { getHeroBanners } from '@/lib/sanity-client';
import { jubelio } from '@/lib/jubelio-adapter/client';
import Link from 'next/link';

// Opt out of caching if you want highly dynamic data, but for e-commerce catalog, ISR is better.
export const revalidate = 3600; // 1 hour

export default async function Home() {
  // Parallel fetching from CMS & WMS
  const [heroBanners, productsResponse] = await Promise.all([
    getHeroBanners().catch(() => []),
    jubelio.get<any>('/inventory/items', { limit: '8' }).catch(() => ({ data: [] }))
  ]);

  // Fallback if CMS fails/empty
  const activeBanner = heroBanners?.[0] || {
    title: "The Ultimate Future",
    subtitle: "Kejernihan presisi layar sentuh yang belum pernah ada sebelumnya. Memperkenalkan pelindung kaca asimetris iBacks.",
    imageUrl: "https://images.unsplash.com/photo-1621330396167-a414f61f7db1?q=80&w=2000&auto=format&fit=crop",
    ctaText: "Eksplorasi Sekarang",
    ctaLink: "#products"
  };

  const products = productsResponse?.data || [];

  return (
    <div className="min-h-screen bg-background pb-32 flex flex-col">
      <Header title="ibacks" />

      <main className="flex-1 w-full flex flex-col items-center">
        {/* Banner Section */}
        <section className="w-full max-w-7xl mx-auto px-4 mt-6">
          <HeroBanner 
            title={activeBanner.title}
            subtitle={activeBanner.subtitle}
            imageUrl={activeBanner.desktopImage?.asset?.url || activeBanner.imageUrl}
            ctaText={activeBanner.ctaText}
            ctaLink={activeBanner.ctaLink}
          />
        </section>

        {/* Jelajahi Ekosistem Section */}
        <section className="w-full max-w-7xl mx-auto px-4 mt-16 md:mt-24">
          <div className="flex items-center justify-between mb-8 border-b surface-border pb-4">
            <h2 className="text-xl md:text-2xl font-bold text-on-surface tracking-tight">
              Jelajahi Ekosistem
            </h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { id: 'case', name: 'Casing', icon: 'M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z' },
              { id: 'cable', name: 'Kabel', icon: 'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1' },
              { id: 'powerbank', name: 'Powerbank', icon: 'M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4' },
              { id: 'audio', name: 'Audio', icon: 'M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3' },
              { id: 'tech', name: 'Teknologi', icon: 'M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z' }
            ].map(cat => (
              <a href={`/search?q=${cat.name}`} key={cat.id} className="group flex flex-col items-center justify-center p-8 bg-surface-container rounded-3xl border surface-border hover:border-primary/50 transition-all hover:-translate-y-1">
                <svg className="w-10 h-10 mb-4 text-on-surface-variant group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={cat.icon} />
                </svg>
                <span className="text-sm font-semibold text-on-surface">{cat.name}</span>
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
              products.map((p: any) => (
                <Link key={p.item_id} href={`/products/${p.item_id}`}>
                  <ProductCard
                    name={p.item_name}
                    price={`Rp ${p.price?.toLocaleString('id-ID') || "299.000"}`}
                    imageSrc={p.image_url || "https://images.unsplash.com/photo-1592890288564-76628a30a657?q=80&w=800"}
                    category={p.item_group_name || 'Accessories'}
                  />
                </Link>
              ))
            ) : (
              // Fake skeleton/placeholders for now if Jubelio WMS config is empty
              Array.from({length: 4}).map((_, i) => (
                <Link key={i} href={`/products/mock-id-${i}`}>
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
