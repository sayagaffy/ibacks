"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { PromoHeroCarousel } from "./PromoHeroCarousel";
import { ProductCard } from "./ProductCard";
import type { PromoHeroSlide } from "@/lib/sanity-client";
import { resolvePromoSlug } from "@/lib/promo-hero";

export interface PromoHeroProduct {
  id: number;
  name: string;
  priceLabel: string;
  image: string;
  categoryLabel: string;
}

export interface PromoHeroSectionProps {
  slides: PromoHeroSlide[];
  productsById: Record<number, PromoHeroProduct>;
}

export const PromoHeroSection: React.FC<PromoHeroSectionProps> = ({
  slides,
  productsById,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const safeIndex = slides.length > 0 ? activeIndex % slides.length : 0;

  const activeProducts = useMemo(() => {
    const ids = slides[safeIndex]?.productIds || [];
    return ids
      .map((id) => productsById[id])
      .filter((product): product is PromoHeroProduct => Boolean(product));
  }, [slides, safeIndex, productsById]);

  const activeSlide = slides[safeIndex];
  const promoSlug = activeSlide ? resolvePromoSlug(activeSlide) : undefined;
  const promoHref = promoSlug
    ? `/promo/${promoSlug}`
    : activeSlide?.ctaLink || "/search";

  if (!slides || slides.length === 0) return null;

  return (
    <div className="w-full flex flex-col gap-6">
      <PromoHeroCarousel
        slides={slides}
        activeIndex={safeIndex}
        onChange={setActiveIndex}
      />

      {activeSlide && (
        <div className="flex flex-col gap-3 px-1 items-center text-center">
          <span className="text-xs uppercase tracking-[0.45em] text-primary font-semibold">
            ibacks exclusive promotion
          </span>
          <div className="flex flex-col gap-2 items-center text-center">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-on-surface">
              {activeSlide.title}
            </h2>
            {activeSlide.subtitle && (
              <p className="text-sm md:text-base text-on-surface-variant max-w-2xl">
                {activeSlide.subtitle}
              </p>
            )}
            {activeSlide.description && (
              <p className="text-sm md:text-base text-on-surface-variant leading-relaxed max-w-2xl">
                {activeSlide.description}
              </p>
            )}
          </div>

          {activeSlide.highlights && activeSlide.highlights.length > 0 && (
            <div className="flex flex-wrap gap-2 justify-center">
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

          <div className="flex items-center gap-3 mt-1">
            <Link
              href={promoHref}
              className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-primary text-on-primary text-sm font-semibold shadow-lg shadow-primary/30 hover:bg-primary-container transition-colors"
            >
              {activeSlide.ctaText || "Lihat Promo"}
            </Link>
          </div>
        </div>
      )}

      {activeProducts.length > 0 && (
        <div className="relative overflow-hidden rounded-3xl bg-surface-container-lowest/80 p-5 md:p-6 ambient-shadow">
          <div className="absolute -top-24 -right-16 w-72 h-72 bg-primary/15 blur-3xl rounded-full pointer-events-none" />
          <div className="absolute -bottom-24 left-10 w-64 h-64 bg-tertiary/10 blur-3xl rounded-full pointer-events-none" />

          <div className="relative flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-[0.3em] text-primary bg-primary/15">
                Promo Kurasi
              </span>
              <h3 className="text-lg md:text-xl font-bold text-on-surface tracking-tight">
                Produk dari Promo Ini
              </h3>
            </div>
            <Link
              href={promoHref}
              className="text-primary text-xs md:text-sm font-semibold tracking-widest uppercase hover:text-primary-container transition-colors"
            >
              Lihat Semua
            </Link>
          </div>

          <div
            className="relative mt-5 flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory"
            style={{ scrollbarWidth: "none" }}
          >
            {activeProducts.map((product) => (
              <div
                key={product.id}
                className="min-w-[200px] max-w-[240px] flex-none snap-start"
              >
                <Link href={`/products/${product.id}`}>
                  <ProductCard
                    name={product.name}
                    price={product.priceLabel}
                    imageSrc={product.image}
                    category={product.categoryLabel}
                  />
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
