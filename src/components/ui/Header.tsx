import React from 'react';

export interface HeaderProps {
  title?: string;
  onBack?: () => void;
  onCartClick?: () => void;
  cartItemCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  title = 'ibacks',
  onBack,
  onCartClick,
  cartItemCount = 0
}) => {
  return (
    <header className="sticky top-0 z-50 w-full glass border-b border-surface-variant/30">
      <div className="flex h-16 items-center justify-between px-4 max-w-screen-md mx-auto">
        <div className="flex items-center gap-4">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 -ml-2 text-on-surface hover:bg-surface-container-low rounded-full transition-colors"
              aria-label="Kembali"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          <h1 className="text-xl font-bold tracking-tight text-on-surface">
            {title}
          </h1>
        </div>

        {onCartClick && (
          <button
            onClick={onCartClick}
            className="p-2 -mr-2 relative text-on-surface hover:bg-surface-container-low rounded-full transition-colors"
            aria-label="Keranjang"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {cartItemCount > 0 && (
              <span className="absolute top-1 right-1 bg-tertiary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                {cartItemCount}
              </span>
            )}
          </button>
        )}
      </div>
    </header>
  );
};
