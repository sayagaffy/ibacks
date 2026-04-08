'use client';

import { useState } from 'react';
import { AddToCartButton, CartVariant } from './AddToCartButton';

interface GalleryImage {
  full: string;
  thumb: string;
}

interface Variant {
  id: number;
  name: string;
  sku: string;
  price: number;
  thumbnail: string | null;
  stock?: number | null;
  images?: GalleryImage[];
}

interface ProductDetailItem {
  id: number;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  isPromo?: boolean;
  image: string;
  images: GalleryImage[];
  description: string;
  totalStock?: number | null;
  variants: Variant[];
}

interface Props {
  item: ProductDetailItem;
  placeholderImage: string;
}

export function ProductDetailClient({ item, placeholderImage }: Props) {
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [activeImage, setActiveImage] = useState<string>(
    item.images[0]?.full || item.image
  );
  const [imgError, setImgError] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const hasMultipleVariants = item.variants.length > 1;
  const hasSingleVariant = item.variants.length === 1;

  const galleryImages = item.images.length > 0 ? item.images : [
    { full: item.image, thumb: item.image }
  ];

  const displayPrice = selectedVariant ? selectedVariant.price : item.price;
  const mainImg = imgError ? placeholderImage : activeImage;
  const totalStock = typeof item.totalStock === 'number' ? item.totalStock : null;
  const selectedStock = selectedVariant?.stock ?? (hasSingleVariant ? item.variants[0]?.stock : null);
  const isQuantityLocked = hasMultipleVariants && !selectedVariant;
  const effectiveStock = isQuantityLocked ? null : selectedStock ?? totalStock;
  const maxQuantity = isQuantityLocked
    ? 0
    : typeof effectiveStock === 'number'
    ? Math.max(0, effectiveStock)
    : 99;
  const isSoldOut = isQuantityLocked
    ? (totalStock != null ? totalStock <= 0 : false)
    : typeof effectiveStock === 'number'
    ? effectiveStock <= 0
    : (totalStock != null ? totalStock <= 0 : false);

  const handleVariantClick = (v: Variant) => {
    if (selectedVariant?.id === v.id) {
      // Deselect
      setSelectedVariant(null);
      setImgError(false);
      setActiveImage(item.images[0]?.full || item.image);
      setQuantity(1);
    } else {
      setSelectedVariant(v);
      setImgError(false);
      const nextImage = v.images?.[0]?.full || v.thumbnail;
      if (nextImage) setActiveImage(nextImage);
      setQuantity(1);
    }
  };

  // For single variant products, auto-select variant for cart but don't show picker
  const cartVariant: CartVariant | null = hasSingleVariant && item.variants[0]
    ? {
        id: item.variants[0].id,
        name: 'Standar',
        sku: item.variants[0].sku,
        price: item.variants[0].price,
        thumbnail: item.variants[0].thumbnail,
      }
    : selectedVariant
    ? {
        id: selectedVariant.id,
        name: selectedVariant.name,
        sku: selectedVariant.sku,
        price: selectedVariant.price,
        thumbnail: selectedVariant.thumbnail,
      }
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
                onClick={() => {
                  setImgError(false);
                  setActiveImage(img.full);
                }}
                className={`flex-none w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                  activeImage === img.full
                    ? 'border-primary scale-105 shadow-lg shadow-primary/20'
                    : 'border-surface-variant/30 hover:border-primary/50'
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.thumb}
                  alt={`Gambar ${i + 1}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* RIGHT: Info + Variant Selector */}
      <div className="w-full md:w-1/2 flex flex-col pt-4 md:pt-8 gap-8">
        <div className="flex flex-col gap-3 border-b surface-border pb-7">
          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-surface-container-high/60 border surface-border px-3 py-1 text-xs font-bold tracking-[0.25em] text-primary uppercase">
            {item.category}
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-on-surface leading-tight">
            {item.name}
          </h1>
          {/* Price - with promo support */}
          <div className="flex items-center gap-3 mt-3 flex-wrap">
            <p className="text-2xl md:text-3xl font-bold text-primary">
              {displayPrice > 0
                ? `Rp ${displayPrice.toLocaleString('id-ID')}`
                : 'Hubungi Kami'}
            </p>
            {item.isPromo && item.originalPrice && item.originalPrice > item.price && (
              <>
                <span className="text-base text-on-surface-variant line-through">
                  Rp {item.originalPrice.toLocaleString('id-ID')}
                </span>
                <span className="bg-primary/20 text-primary text-xs font-bold px-2.5 py-1 rounded-full">
                  -{Math.round((1 - item.price / item.originalPrice) * 100)}%
                </span>
              </>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`text-xs md:text-sm font-semibold px-3.5 py-1.5 rounded-full ${
                isSoldOut
                  ? 'bg-rose-500/20 text-rose-300'
                  : 'bg-primary/20 text-primary'
              }`}
            >
              {isSoldOut ? 'Stok Habis' : 'Stok Tersedia'}
            </span>
            {!isQuantityLocked && typeof effectiveStock === 'number' && effectiveStock > 0 && (
              <span className="text-xs text-on-surface-variant">
                Sisa {effectiveStock}
              </span>
            )}
          </div>
        </div>

        {/* Variant Selector — only shown when > 1 variant */}
        {hasMultipleVariants && (
          <div className="flex flex-col gap-4 bg-surface-container-low rounded-2xl p-4 md:p-5 border surface-border">
            <div className="flex items-center justify-between">
              <p className="text-sm md:text-base font-bold text-on-surface tracking-[0.2em] uppercase">
                Varian
              </p>
              {selectedVariant ? (
                <span className="text-xs md:text-sm text-primary font-semibold bg-primary/15 px-3 py-1 rounded-full">
                  {selectedVariant.name} dipilih
                </span>
              ) : (
                <span className="text-xs md:text-sm text-on-surface-variant">Pilih varian</span>
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {item.variants.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => handleVariantClick(v)}
                    className={`px-4 py-3 rounded-2xl text-sm md:text-base font-semibold border transition-all text-left leading-snug ${
                      selectedVariant?.id === v.id
                        ? 'bg-primary text-on-primary border-primary shadow-md shadow-primary/25'
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

        {/* Quantity Selector */}
        <div className="flex items-center justify-between bg-surface-container rounded-2xl p-4 border surface-border">
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-on-surface">Jumlah</span>
            <span className="text-xs text-on-surface-variant">
              {isQuantityLocked
                ? 'Pilih varian dulu'
                : typeof effectiveStock === 'number' && maxQuantity > 0
                ? `Maks ${maxQuantity}`
                : 'Atur jumlah pembelian'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={isQuantityLocked || isSoldOut || quantity <= 1}
              className="w-9 h-9 rounded-full bg-surface-container-high text-on-surface disabled:opacity-40 disabled:cursor-not-allowed hover:bg-surface-container-highest transition-colors"
              aria-label="Kurangi jumlah"
            >
              -
            </button>
            <span className="w-8 text-center text-sm font-semibold text-on-surface">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() =>
                setQuantity((q) => (maxQuantity > 0 ? Math.min(maxQuantity, q + 1) : q + 1))
              }
              disabled={isQuantityLocked || isSoldOut || (maxQuantity > 0 && quantity >= maxQuantity)}
              className="w-9 h-9 rounded-full bg-surface-container-high text-on-surface disabled:opacity-40 disabled:cursor-not-allowed hover:bg-surface-container-highest transition-colors"
              aria-label="Tambah jumlah"
            >
              +
            </button>
          </div>
        </div>

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
          quantity={quantity}
          isSoldOut={isSoldOut}
        />
      </div>
    </>
  );
}
