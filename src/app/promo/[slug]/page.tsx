import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Header } from '@/components/ui/Header';
import { Footer } from '@/components/ui/Footer';
import { ProductCard } from '@/components/ui/ProductCard';
import { getPromoHero, PromoHeroSlide } from '@/lib/sanity-client';
import { getProducts, isProductInStock } from '@/lib/product-cache';
import { CATEGORY_NAME_MAP, PLACEHOLDER_IMAGE } from '@/lib/constants';
import { buildPromoHeroSlides, resolvePromoSlug, slugifyPromo } from '@/lib/promo-hero';

export const revalidate = 3600;

function getYoutubeEmbedUrl(url?: string) {
  if (!url) return null;
  const idMatch = url.match(/(?:v=|\/)([0-9A-Za-z_-]{11})/);
  const id = idMatch?.[1];
  if (!id) return null;
  const startMatch = url.match(/[?&]t=(\d+)/);
  const startSeconds = startMatch?.[1] || '0';
  return `https://www.youtube.com/embed/${id}?start=${startSeconds}&autoplay=1&mute=1&controls=0&loop=1&playlist=${id}`;
}

function findSlideBySlug(slides: PromoHeroSlide[], slug: string) {
  if (!slug) return undefined;
  const normalized = slugifyPromo(slug);
  if (!normalized) return undefined;
  return slides.find((slide) => resolvePromoSlug(slide) === normalized);
}

export default async function PromoDetailPage({ params }: { params: { slug: string } }) {
  const [promoHero, productCache] = await Promise.all([getPromoHero().catch(() => null), getProducts()]);
  const allProducts = productCache.products.filter(isProductInStock);
  const slides = buildPromoHeroSlides(promoHero, allProducts);
  const slide = findSlideBySlug(slides, params.slug);

  const activeSlide = slide || slides[0];
  if (!activeSlide) notFound();

  const productsById = allProducts.reduce<Record<number, typeof allProducts[number]>>((acc, product) => {
    acc[product.id] = product;
    return acc;
  }, {});

  const promoProducts = (activeSlide.productIds || [])
    .map((id) => productsById[id])
    .filter((product): product is typeof allProducts[number] => Boolean(product));

  const youtubeEmbed = getYoutubeEmbedUrl(activeSlide.youtubeUrl);
  const heroTitle = activeSlide.title || 'Promo iBacks';
  const heroSubtitle = activeSlide.subtitle || 'Kurasi promo iBacks terbaik untukmu.';
  const heroDescription = activeSlide.description;

  return (
    <div className="min-h-screen bg-background pb-24 flex flex-col">
      <Header title="ibacks" />

      <main className="flex-1 w-full flex flex-col items-center">
        <section className="w-full max-w-7xl mx-auto px-4 mt-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-6 items-start">
            <div className="relative w-full h-[340px] md:h-[380px] rounded-3xl overflow-hidden bg-surface-container-highest ambient-shadow">
              {youtubeEmbed ? (
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src={youtubeEmbed}
                  title={heroTitle}
                  allow="autoplay; encrypted-media; picture-in-picture"
                  allowFullScreen
                />
              ) : activeSlide.mediaType === 'video' && (activeSlide.videoMp4Url || activeSlide.videoWebmUrl) ? (
                <video
                  className="absolute inset-0 w-full h-full object-cover"
                  poster={activeSlide.posterUrl || activeSlide.imageUrl}
                  autoPlay
                  muted
                  loop
                  playsInline
                >
                  {activeSlide.videoWebmUrl && <source src={activeSlide.videoWebmUrl} type="video/webm" />}
                  {activeSlide.videoMp4Url && <source src={activeSlide.videoMp4Url} type="video/mp4" />}
                </video>
              ) : (
                <img
                  src={activeSlide.imageUrl || activeSlide.posterUrl || PLACEHOLDER_IMAGE}
                  alt={heroTitle}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              )}
            </div>

            <div className="flex flex-col gap-4">
              <span className="text-xs uppercase tracking-[0.4em] text-primary font-semibold">
                Promo iBacks
              </span>
              <div className="flex flex-col gap-3">
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-on-surface">
                  {heroTitle}
                </h1>
                <p className="text-base md:text-lg text-on-surface-variant">
                  {heroSubtitle}
                </p>
                {heroDescription && (
                  <p className="text-sm md:text-base text-on-surface-variant leading-relaxed">
                    {heroDescription}
                  </p>
                )}
              </div>

              {activeSlide.highlights && activeSlide.highlights.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {activeSlide.highlights.map((item, idx) => (
                    <span
                      key={`${item}-${idx}`}
                      className="px-3 py-1 rounded-full text-xs font-semibold text-on-surface bg-surface-container-low"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="/search"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-primary text-on-primary text-sm font-semibold shadow-lg shadow-primary/30 hover:bg-primary-container transition-colors"
                >
                  Lihat Semua Produk
                </Link>
                <Link
                  href="/"
                  className="text-xs md:text-sm font-semibold tracking-widest uppercase text-on-surface-variant hover:text-on-surface transition-colors"
                >
                  Kembali ke Beranda
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full max-w-7xl mx-auto px-4 mt-12">
          <div className="flex items-center justify-between border-b surface-border pb-4">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-on-surface">
              Produk Terpilih
            </h2>
            <span className="text-xs md:text-sm uppercase tracking-[0.3em] text-on-surface-variant">
              {promoProducts.length} Item
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
            {promoProducts.map((product) => (
              <Link key={product.id} href={`/products/${product.id}`}>
                <ProductCard
                  name={product.name}
                  price={product.price > 0 ? `Rp ${product.price.toLocaleString('id-ID')}` : 'Hubungi Kami'}
                  imageSrc={product.thumbnail || PLACEHOLDER_IMAGE}
                  category={product.categoryId ? CATEGORY_NAME_MAP[product.categoryId] || 'Aksesoris' : 'Aksesoris'}
                />
              </Link>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
