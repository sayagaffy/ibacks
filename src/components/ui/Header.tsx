"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import Link from 'next/link';

export interface HeaderProps {
  title?: string;
  hideBack?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  title = 'ibacks',
  hideBack = false
}) => {
  const router = useRouter();
  const pathname = usePathname();
  
  // Hydration fix for Zustand
  const [mounted, setMounted] = useState(false);
  const items = useCartStore((state) => state.items);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  
  useEffect(() => {
    // Avoid synchronous set state warning by wrapping in setTimeout or queueMicrotask
    queueMicrotask(() => {
      setMounted(true);
    });
  }, []);

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
  const showBack = !hideBack && pathname !== '/';

  return (
    <header className="sticky top-0 z-50 w-full glass-elevated surface-border border-b">
      <div className="flex h-16 items-center justify-between px-4 max-w-3xl mx-auto">
        <div className="flex items-center gap-4">
          {showBack && (
            <button
              onClick={() => router.back()}
              className="p-2 -ml-2 text-on-surface hover:bg-surface-container-low rounded-full transition-colors"
              aria-label="Kembali"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          {title === 'ibacks' ? (
             <Link href="/">
               {/* Using CSS filter invert to make the black logo white in dark mode */}
               {/* eslint-disable-next-line @next/next/no-img-element */}
               <img src="/logo.png" alt="iBacks Logo" className="h-5 md:h-6 object-contain invert brightness-0 dark:invert" />
             </Link>
          ) : (
            <h1 className="text-xl font-bold tracking-tight bg-linear-to-r from-white to-neutral-400 bg-clip-text text-transparent line-clamp-1 max-w-[200px] md:max-w-none">
              {title}
            </h1>
          )}
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/search" className="text-sm font-semibold text-on-surface hover:text-primary transition-colors">Produk</Link>
          <Link href="/ekosistem" className="text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors">Ekosistem</Link>
          <Link href="/teknologi" className="text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors">Teknologi</Link>
          <Link href="/tentang-kami" className="text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors">Tentang Kami</Link>
          <Link href="/dukungan" className="text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors">Dukungan</Link>
        </nav>

        <div className="flex items-center gap-2">
          {mounted && (
            <Link
              href={isAuthenticated ? "/account" : "/login"}
              className="p-2 relative text-on-surface hover:bg-surface-container-low rounded-full transition-colors flex items-center justify-center"
              aria-label="Profil Akun"
            >
              {isAuthenticated && user ? (
                <div className="w-7 h-7 rounded-full bg-primary/20 text-primary border border-primary/50 flex items-center justify-center text-xs font-bold uppercase">
                  {user.name.charAt(0)}
                </div>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              )}
            </Link>
          )}

          <Link
            href="/cart"
            className="p-2 -mr-2 relative text-on-surface hover:bg-surface-container-low rounded-full transition-colors"
            aria-label="Keranjang"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {mounted && totalItems > 0 && (
              <span className="absolute top-0 right-0 bg-primary text-on-primary text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center shadow-lg shadow-primary/50">
                {totalItems}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
};
