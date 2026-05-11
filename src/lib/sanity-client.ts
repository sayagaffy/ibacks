import { createClient } from 'next-sanity';

export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'your-project-id',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-04-01',
  useCdn: process.env.NODE_ENV === 'production',
});

export interface PromoHeroSlide {
  id?: string;
  title?: string;
  slug?: string;
  subtitle?: string;
  description?: string;
  highlights?: string[];
  ctaText?: string;
  ctaLink?: string;
  mediaType?: 'image' | 'video';
  youtubeUrl?: string;
  imageUrl?: string;
  posterUrl?: string;
  videoMp4Url?: string;
  videoWebmUrl?: string;
  productIds?: number[];
}

export interface PromoHeroData {
  title?: string;
  slides: PromoHeroSlide[];
}

export function buildSanityImageUrl(url?: string, width = 1400, quality = 70) {
  if (!url) return undefined;
  const baseUrl = url.split('?')[0];
  return `${baseUrl}?auto=format&fit=crop&w=${width}&q=${quality}`;
}

// Helper for fetching Hero Banners
export async function getHeroBanners() {
  return sanityClient.fetch(`*[_type == "heroBanner" && isActive == true] | order(_createdAt desc)`);
}

// Helper for fetching Promo Hero Slides
export async function getPromoHero(): Promise<PromoHeroData | null> {
  const data = await sanityClient.fetch(
    `*[_type == "promoHero" && isActive == true][0]{
      title,
      slides[]{
        _key,
        title,
        subtitle,
        description,
        highlights,
        slug,
        ctaText,
        ctaLink,
        mediaType,
        youtubeUrl,
        productIds,
        image{asset->{url}},
        posterImage{asset->{url}},
        videoMp4{asset->{url}},
        videoWebm{asset->{url}}
      }
    }`
  );

  if (!data) return null;

  const slides = (data.slides || []).map((slide: Record<string, unknown>) => {
    const image = (slide.image as { asset?: { url?: string } } | undefined)?.asset?.url;
    const poster = (slide.posterImage as { asset?: { url?: string } } | undefined)?.asset?.url;
    const mp4 = (slide.videoMp4 as { asset?: { url?: string } } | undefined)?.asset?.url;
    const webm = (slide.videoWebm as { asset?: { url?: string } } | undefined)?.asset?.url;
    const productIds = Array.isArray(slide.productIds)
      ? slide.productIds.map((id) => Number(id)).filter((id) => Number.isFinite(id))
      : [];
    const slug = (slide.slug as { current?: string } | undefined)?.current;

    return {
      id: (slide._key as string | undefined) || undefined,
      title: slide.title as string | undefined,
      slug,
      subtitle: slide.subtitle as string | undefined,
      description: slide.description as string | undefined,
      highlights: Array.isArray(slide.highlights)
        ? slide.highlights.map((item) => String(item))
        : undefined,
      ctaText: slide.ctaText as string | undefined,
      ctaLink: slide.ctaLink as string | undefined,
      mediaType: (slide.mediaType as 'image' | 'video' | undefined) || undefined,
      youtubeUrl: slide.youtubeUrl as string | undefined,
      imageUrl: buildSanityImageUrl(image),
      posterUrl: buildSanityImageUrl(poster, 1400, 72),
      videoMp4Url: mp4,
      videoWebmUrl: webm,
      productIds,
    } satisfies PromoHeroSlide;
  });

  return { title: data.title, slides };
}

// Helper for fetching Customer info by email
export async function getCustomerByEmail(email: string) {
  return sanityClient.fetch(`*[_type == "customer" && email == $email][0]`, { email });
}
