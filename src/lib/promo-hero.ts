import type { PromoHeroData, PromoHeroSlide } from '@/lib/sanity-client';
import type { CachedProduct } from '@/lib/product-cache';

export function slugifyPromo(value?: string) {
  if (!value) return '';
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

export function resolvePromoSlug(slide: PromoHeroSlide): string | undefined {
  if (slide.slug && slide.slug.trim()) return slide.slug.trim();
  if (slide.title) return slugifyPromo(slide.title);
  return undefined;
}

export function buildPromoHeroSlides(
  promoHero: PromoHeroData | null,
  products: CachedProduct[]
): PromoHeroSlide[] {
  if (promoHero?.slides && promoHero.slides.length > 0) {
    return promoHero.slides.map((slide, index) => ({
      ...slide,
      id: slide.id || `promo-${index}`,
      slug: resolvePromoSlug(slide),
    }));
  }

  const fallbackProductIds = products.slice(0, 12).map((product) => product.id);

  return [
    {
      id: 'fallback-1',
      slug: 'promo-eksklusif-ibacks',
      title: 'Promo Eksklusif iBacks',
      subtitle: 'Kurasi pelindung kaca presisi untuk perangkat favoritmu.',
      description:
        'Diskon terbatas untuk seri premium iBacks—tipis, presisi, dan tetap nyaman untuk pemakaian harian.',
      ctaText: 'Lihat Promo',
      ctaLink: '/promo/promo-eksklusif-ibacks',
      mediaType: 'image',
      imageUrl: '/promo/promo-1.svg',
      productIds: fallbackProductIds.slice(0, 4),
      highlights: ['Diskon terbatas', 'Kurasi resmi iBacks', 'Stok pilihan'],
    },
    {
      id: 'fallback-2',
      slug: 'preview-video-produk',
      title: 'Lihat Dari Dekat',
      subtitle: 'Preview video singkat, detail produk terlihat jelas.',
      description:
        'Rasakan pengalaman visual: material, tekstur, dan finishing tampil nyata dalam tayangan singkat.',
      ctaText: 'Lihat Videonya',
      ctaLink: '/promo/preview-video-produk',
      mediaType: 'video',
      youtubeUrl: 'https://www.youtube.com/watch?v=9gyLA5Z8qJE&t=3s',
      posterUrl: '/promo/promo-2.svg',
      productIds: fallbackProductIds.slice(4, 8),
      highlights: ['Video hero 301px', 'Autoplay tanpa suara', 'Nuansa cinematic'],
    },
    {
      id: 'fallback-3',
      slug: 'seri-premium-ibacks',
      title: 'Seri Premium iBacks',
      subtitle: 'Material high‑end, potongan presisi, perlindungan maksimal.',
      description:
        'Koleksi unggulan dengan desain clean dan finishing halus untuk perlindungan elegan.',
      ctaText: 'Eksplorasi Koleksi',
      ctaLink: '/promo/seri-premium-ibacks',
      mediaType: 'image',
      imageUrl: '/promo/promo-3.svg',
      productIds: fallbackProductIds.slice(8, 12),
      highlights: ['Material premium', 'Detail presisi', 'Perlindungan elegan'],
    },
  ];
}
