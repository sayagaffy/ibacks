import React from 'react';
import { Button } from './Button';

export interface AddToCartButtonProps {
  price: string;
  onAddToCart: () => void;
  isAdding?: boolean;
}

export const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  price,
  onAddToCart,
  isAdding = false
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-surface-container-lowest border-t border-surface-variant p-4 pb-safe ambient-shadow">
      <div className="max-w-screen-md mx-auto flex items-center justify-between gap-4">
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
          onClick={onAddToCart}
          disabled={isAdding}
          className="flex-1 max-w-[200px]"
        >
          {isAdding ? 'Memproses...' : 'Masukkan Keranjang'}
        </Button>
      </div>
    </div>
  );
};
