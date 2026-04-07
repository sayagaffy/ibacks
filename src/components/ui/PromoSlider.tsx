'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { ProductCard } from './ProductCard';

export interface PromoProduct {
  id: number;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  image: string;
}

export interface PromoSliderProps {
  title?: string;
  products: PromoProduct[];
}

export const PromoSlider: React.FC<PromoSliderProps> = ({
  title = "Produk Promo",
  products
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left'
        ? scrollLeft - clientWidth * 0.8
        : scrollLeft + clientWidth * 0.8;

      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  if (!products || products.length === 0) return null;

  return (
    <div className="w-full relative py-8">
      <div className="flex items-center justify-between mb-6 border-b surface-border pb-4 px-4">
        <h2 className="text-2xl font-bold text-on-surface tracking-tight flex items-center gap-2">
          <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
          </svg>
          {title}
        </h2>
        <div className="hidden md:flex gap-2">
          <button
            onClick={() => scroll('left')}
            className="p-2 rounded-full border surface-border bg-surface hover:bg-surface-container transition-colors"
            aria-label="Scroll Left"
          >
            <svg className="w-5 h-5 text-on-surface" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-2 rounded-full border surface-border bg-surface hover:bg-surface-container transition-colors"
            aria-label="Scroll Right"
          >
            <svg className="w-5 h-5 text-on-surface" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
      </div>

      {/* Slider Container */}
      <div
        ref={scrollRef}
        className="flex overflow-x-auto gap-4 md:gap-6 px-4 pb-8 snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none' }}
      >
        {products.map((p) => (
          <div key={p.id} className="min-w-[240px] max-w-[280px] flex-none snap-start relative">
             <Link href={`/products/${p.id}`}>
               {/* "Diskon" Badge */}
               <div className="absolute top-4 left-4 z-10 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                 PROMO
               </div>
               <ProductCard
                 name={p.name}
                 price={`Rp ${p.price.toLocaleString('id-ID')}`}
                 // We can pass originalPrice into a customized ProductCard,
                 // or for now, just show it next to the title manually if ProductCard is dumb
                 imageSrc={p.image}
                 category={p.category}
               />
               {/* Original Price Overlay (Since ProductCard is locked right now, we overlay it) */}
               {p.originalPrice && p.originalPrice > p.price && (
                 <div className="absolute bottom-4 left-4 right-4 text-xs text-on-surface-variant/80 line-through text-center">
                   Rp {p.originalPrice.toLocaleString('id-ID')}
                 </div>
               )}
             </Link>
          </div>
        ))}
      </div>
    </div>
  );
};
