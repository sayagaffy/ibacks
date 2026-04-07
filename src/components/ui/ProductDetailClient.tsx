'use client';

import { useState } from 'react';
import { AddToCartButton, CartVariant } from './AddToCartButton';

interface Variant {
  id: number;
  name: string;
  sku: string;
  price: number;
  thumbnail: string | null;
}

interface ProductDetailItem {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  description: string;
  variants: Variant[];
}

interface Props {
  item: ProductDetailItem;
  placeholderImage: string;
}

export function ProductDetailClient({ item, placeholderImage }: Props) {
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [activeImage, setActiveImage] = useState<string>(item.image);
  const [imgError, setImgError] = useState(false);

  const hasMultipleVariants = item.variants.length > 1;
  const hasSingleVariant = item.variants.length === 1;

  // Build image gallery from variant thumbnails (deduplicated)
  const galleryImages: string[] = [];
  const seen = new Set<string>();
  if (item.image && item.image !== placeholderImage) {
    galleryImages.push(item.image);
    seen.add(item.image);
  }
  item.variants.forEach((v) => {
    if (v.thumbnail && !seen.has(v.thumbnail)) {
      galleryImages.push(v.thumbnail);
      seen.add(v.thumbnail);
    }
  });

  const displayPrice = selectedVariant ? selectedVariant.price : item.price;
  const mainImg = imgError ? placeholderImage : activeImage;

  const handleVariantClick = (v: Variant) => {
    if (selectedVariant?.id === v.id) {
      // Deselect
      setSelectedVariant(null);
      setActiveImage(item.image);
    } else {
      setSelectedVariant(v);
      if (v.thumbnail) setActiveImage(v.thumbnail);
    }
  };

  // For single variant products, auto-select variant for cart but don't show picker
  const cartVariant: CartVariant | null = hasSingleVariant
    ? { ...item.variants[0], name: 'Standar' }
    : selectedVariant
    ? { ...selectedVariant }
    : null;

  return (
    <>
      {/* LEFT: Image Gallery */}
      <div className="w-full md:w-1/2 flex flex-col gap-4">
        {/* Main Image */}
        <div className="bg-surface-container-low rounded-4xl aspect-4/5 md:aspect-square flex justify-center items-center overflow-hidden ambient-shadow relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            key={mainImg}
            src={mainImg}
            alt={item.name}
            className="w-full h-full object-cover transition-all duration-500"
            onError={() => setImgError(true)}
          />
          {selectedVariant && (
            <div className="absolute top-3 right-3 bg-primary text-on-primary text-xs font-bold px-3 py-1 rounded-full">
              {selectedVariant.name}
            </div>
          )}
        </div>

        {/* Gallery Thumbnails */}
        {galleryImages.length > 1 && (
          <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
            {galleryImages.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(img)}
                className={`flex-none w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                  activeImage === img
                    ? 'border-primary scale-105 shadow-lg shadow-primary/20'
                    : 'border-surface-variant/30 hover:border-primary/50'
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img} alt={`Gambar ${i + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* RIGHT: Info + Variant Selector */}
      <div className="w-full md:w-1/2 flex flex-col pt-4 md:pt-8 gap-6">
        <div className="flex flex-col gap-2 border-b surface-border pb-6">
          <span className="text-sm font-bold tracking-[0.2em] text-primary uppercase">
            {item.category}
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-on-surface leading-tight">
            {item.name}
          </h1>
          <p className="text-on-surface-variant text-base leading-relaxed mt-2">
            {item.description}
          </p>
          <p className="text-2xl font-bold text-primary mt-3">
            {displayPrice > 0
              ? `Rp ${displayPrice.toLocaleString('id-ID')}`
              : 'Hubungi Kami'}
          </p>
        </div>

        {/* Variant Selector — only shown when > 1 variant */}
        {hasMultipleVariants && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-on-surface-variant uppercase tracking-widest">
                Varian
              </p>
              {selectedVariant ? (
                <span className="text-xs text-primary font-medium">
                  {selectedVariant.name} dipilih
                </span>
              ) : (
                <span className="text-xs text-on-surface-variant">Pilih varian</span>
              )}
            </div>

            {/* If variants have thumbnails: image-based swatch grid */}
            {item.variants.some((v) => v.thumbnail) ? (
              <div className="flex flex-wrap gap-3">
                {item.variants.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => handleVariantClick(v)}
                    title={v.name}
                    className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                      selectedVariant?.id === v.id
                        ? 'border-primary scale-105 shadow-lg shadow-primary/30 ring-2 ring-primary/30'
                        : 'border-surface-variant/30 hover:border-primary/50 hover:scale-102'
                    }`}
                  >
                    {v.thumbnail ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={v.thumbnail}
                        alt={v.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-surface-container-high flex items-center justify-center">
                        <span className="text-[10px] text-on-surface-variant font-medium">
                          {v.name.replace('Varian ', '')}
                        </span>
                      </div>
                    )}
                    {selectedVariant?.id === v.id && (
                      <div className="absolute inset-0 bg-primary/20 flex items-end justify-center pb-1">
                        <svg className="w-4 h-4 text-white drop-shadow" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            ) : (
              /* Text-only chips when no thumbnails */
              <div className="flex flex-wrap gap-2">
                {item.variants.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => handleVariantClick(v)}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
                      selectedVariant?.id === v.id
                        ? 'bg-primary text-on-primary border-primary shadow-md shadow-primary/20'
                        : 'bg-surface-container text-on-surface border-surface-variant/30 hover:border-primary/50'
                    }`}
                  >
                    {v.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Sticky Cart Bar */}
        <AddToCartButton
          price={
            displayPrice > 0
              ? `Rp ${displayPrice.toLocaleString('id-ID')}`
              : 'Hubungi Kami'
          }
          item={{
            id: String(item.id),
            name: item.name,
            rawPrice: displayPrice,
            image: item.image,
          }}
          selectedVariant={cartVariant}
          hasVariants={hasMultipleVariants}
        />
      </div>
    </>
  );
}
