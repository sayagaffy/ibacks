"use client";

import React, { useState } from 'react';
import { Button } from './Button';
import { useCartStore } from '@/store/cartStore';

export interface AddToCartButtonProps {
  price: string;
  item: {
    id: string;
    name: string;
    rawPrice: number;
    image: string;
  };
}

export const AddToCartButton: React.FC<AddToCartButtonProps> = ({ price, item }) => {
  const [isAdding, setIsAdding] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    setIsAdding(true);
    addItem({
      id: item.id,
      name: item.name,
      price: item.rawPrice,
      quantity: 1,
      image: item.image,
    });
    // Simulate slight delay for premium UX
    setTimeout(() => {
      setIsAdding(false);
      // Pilihan: Buka drawer cart atau show a toast/notification glow
    }, 500);
  };
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 glass-elevated surface-border border-t p-5 pb-8 ambient-shadow">
      <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
        <div className="flex flex-col">
          <span className="text-xs text-on-surface-variant uppercase tracking-wider font-semibold">
            Total Harga
          </span>
          <span className="text-xl font-bold text-on-surface">
            {price}
          </span>
        </div>
        <Button
          variant="primary"
          onClick={handleAddToCart}
          disabled={isAdding}
          className="flex-1 max-w-[200px]"
        >
          {isAdding ? 'Memproses...' : 'Masukkan Keranjang'}
        </Button>
      </div>
    </div>
  );
};
