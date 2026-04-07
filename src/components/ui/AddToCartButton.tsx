"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
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
  const router = useRouter();
  const [isAdding, setIsAdding] = useState(false);
  const [showModal, setShowModal] = useState(false);
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

    setTimeout(() => {
      setIsAdding(false);
      setShowModal(true);
    }, 500);
  };

  const handleContinueShopping = () => {
    setShowModal(false);
    // Simple Next.js routing logic for now.
    // TODO: Implement a more robust history stack or global state to track previous list/search page
    router.back();
  };

  const handleCheckout = () => {
    setShowModal(false);
    router.push('/cart');
  };

  const displayPrice = selectedVariant
    ? `Rp ${selectedVariant.price.toLocaleString('id-ID')}`
    : price;

  return (
    <>
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

      {/* SUCCESS MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-surface-container rounded-3xl p-6 w-full max-w-sm flex flex-col gap-6 surface-border ambient-shadow relative animate-in fade-in zoom-in-95 duration-200">
            <div className="flex flex-col items-center text-center gap-3">
              <div className="w-16 h-16 rounded-full bg-primary/20 text-primary flex items-center justify-center mb-2">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-on-surface">Berhasil Ditambahkan</h3>
              <p className="text-sm text-on-surface-variant">
                Produk telah masuk ke keranjang belanja Anda.
              </p>
            </div>

            <div className="flex flex-col gap-3 mt-2">
              <Button variant="primary" onClick={handleCheckout} className="w-full">
                Bayar Sekarang
              </Button>
              <Button variant="outline" onClick={handleContinueShopping} className="w-full border-surface-variant text-on-surface">
                Lanjut Belanja
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
