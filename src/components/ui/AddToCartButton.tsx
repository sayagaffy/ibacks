"use client";

import React, { useState } from 'react';
import { Button } from './Button';
import { useCartStore } from '@/store/cartStore';

export interface CartVariant {
  id: number;
  name: string;   // label display: "Varian 1", "Hitam", etc.
  sku: string;
  price: number;
  thumbnail: string | null;
}

export interface AddToCartButtonProps {
  price: string;
  item: {
    id: string;
    name: string;
    rawPrice: number;
    image: string;
  };
  selectedVariant?: CartVariant | null;
  hasVariants?: boolean;
}

export const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  price,
  item,
  selectedVariant,
  hasVariants = false,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  const canAdd = !hasVariants || selectedVariant != null;

  const handleAddToCart = () => {
    if (!canAdd) return;
    setIsAdding(true);

    const variantLabel = selectedVariant ? selectedVariant.name : undefined;
    const effectivePrice = selectedVariant ? selectedVariant.price : item.rawPrice;
    const effectiveImage = (selectedVariant?.thumbnail) || item.image;

    addItem({
      id: selectedVariant ? `${item.id}-${selectedVariant.id}` : item.id,
      name: variantLabel ? `${item.name} (${variantLabel})` : item.name,
      price: effectivePrice,
      quantity: 1,
      image: effectiveImage,
    });

    setTimeout(() => setIsAdding(false), 500);
  };

  const displayPrice = selectedVariant
    ? `Rp ${selectedVariant.price.toLocaleString('id-ID')}`
    : price;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 glass-elevated surface-border border-t p-5 pb-8 ambient-shadow">
      <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
        <div className="flex flex-col">
          <span className="text-xs text-on-surface-variant uppercase tracking-wider font-semibold">
            Total Harga
          </span>
          <span className="text-xl font-bold text-on-surface">
            {displayPrice}
          </span>
          {selectedVariant && (
            <span className="text-xs text-primary mt-0.5">{selectedVariant.name}</span>
          )}
          {hasVariants && !selectedVariant && (
            <span className="text-xs text-on-surface-variant mt-0.5">Pilih varian dulu</span>
          )}
        </div>
        <Button
          variant="primary"
          onClick={handleAddToCart}
          disabled={isAdding || !canAdd}
          className="flex-1 max-w-[200px]"
        >
          {isAdding ? 'Memproses...' : canAdd ? 'Masukkan Keranjang' : 'Pilih Varian'}
        </Button>
      </div>
    </div>
  );
};
