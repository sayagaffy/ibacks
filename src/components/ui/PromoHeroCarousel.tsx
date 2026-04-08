'use client';

import React from 'react';
import Link from 'next/link';
import type { PromoHeroSlide } from '@/lib/sanity-client';
import { resolvePromoSlug } from '@/lib/promo-hero';

export interface PromoHeroCarouselProps {
  slides: PromoHeroSlide[];
  activeIndex: number;
  onChange: (index: number) => void;
}

export const PromoHeroCarousel: React.FC<PromoHeroCarouselProps> = ({
  slides,
  activeIndex,
  onChange,
}) => {
  if (!slides || slides.length === 0) return null;

  const maxIndex = slides.length - 1;
  const safeIndex = Math.min(Math.max(activeIndex, 0), maxIndex);

  const handlePrev = () => onChange(safeIndex === 0 ? maxIndex : safeIndex - 1);
  const handleNext = () => onChange(safeIndex === maxIndex ? 0 : safeIndex + 1);

  const getYoutubeEmbedUrl = (url?: string) => {
    if (!url) return null;
    const idMatch = url.match(/(?:v=|\/)([0-9A-Za-z_-]{11})/);
    const id = idMatch?.[1];
    if (!id) return null;
    const startMatch = url.match(/[?&]t=(\d+)/);
    const startSeconds = startMatch?.[1] || '0';
    return `https://www.youtube.com/embed/${id}?start=${startSeconds}&autoplay=1&mute=1&controls=0&loop=1&playlist=${id}`;
  };

  return (
    <div className="relative w-full h-[301px] rounded-3xl overflow-hidden bg-surface-container-highest ambient-shadow">
      <div
        className="flex h-full transition-transform duration-700 ease-out"
        style={{ transform: `translateX(-${safeIndex * 100}%)` }}
      >
        {slides.map((slide, index) => {
          const title = slide.title || 'Promo iBacks';
          const subtitle = slide.subtitle || 'Nikmati promo eksklusif dengan kurasi premium.';
          const youtubeEmbed = getYoutubeEmbedUrl(slide.youtubeUrl);
          const mediaIsVideo = slide.mediaType === 'video' && (slide.videoMp4Url || slide.videoWebmUrl);
          const imageFallback = slide.imageUrl || slide.posterUrl || '/promo/promo-1.svg';

          const slug = resolvePromoSlug(slide);
          const href = slug ? `/promo/${slug}` : slide.ctaLink;

          return (
            <div key={slide.id || index} className="relative w-full h-full shrink-0">
              {youtubeEmbed ? (
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src={youtubeEmbed}
                  title={title}
                  allow="autoplay; encrypted-media; picture-in-picture"
                  allowFullScreen
                />
              ) : mediaIsVideo ? (
                <video
                  className="absolute inset-0 w-full h-full object-cover"
                  poster={slide.posterUrl || slide.imageUrl}
                  autoPlay
                  muted
                  loop
                  playsInline
                >
                  {slide.videoWebmUrl && <source src={slide.videoWebmUrl} type="video/webm" />}
                  {slide.videoMp4Url && <source src={slide.videoMp4Url} type="video/mp4" />}
                </video>
              ) : (
                <img
                  src={imageFallback}
                  alt={title}
                  className="absolute inset-0 w-full h-full object-cover"
                  loading={index === 0 ? 'eager' : 'lazy'}
                />
              )}

              {href && (
                <Link
                  href={href}
                  className="absolute inset-0 z-10"
                  aria-label={`Buka promo ${title}`}
                />
              )}
            </div>
          );
        })}
      </div>

      <button
        type="button"
        onClick={handlePrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 text-white backdrop-blur hover:bg-black/60 transition-colors z-20"
        aria-label="Slide sebelumnya"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        type="button"
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 text-white backdrop-blur hover:bg-black/60 transition-colors z-20"
        aria-label="Slide berikutnya"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
        {slides.map((_, idx) => (
          <button
            key={`dot-${idx}`}
            type="button"
            onClick={() => onChange(idx)}
            className={`h-2.5 rounded-full transition-all ${
              idx === safeIndex ? 'w-8 bg-white' : 'w-2.5 bg-white/40'
            }`}
            aria-label={`Pergi ke slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
