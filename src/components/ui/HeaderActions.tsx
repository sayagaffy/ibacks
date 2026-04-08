"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';

interface HeaderUser {
  name: string;
}

interface HeaderActionsProps {
  mounted: boolean;
  isAuthenticated: boolean;
  user: HeaderUser | null;
  totalItems: number;
}

export function HeaderActions({
  mounted,
  isAuthenticated,
  user,
  totalItems,
}: HeaderActionsProps) {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const saved = window.localStorage.getItem('ibacks-theme');
    const nextTheme = saved === 'light' ? 'light' : 'dark';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('ibacks-theme', nextTheme);
      document.documentElement.setAttribute('data-theme', nextTheme);
    }
  };

  return (
    <div className="flex items-center gap-2 shrink-0">
      <button
        type="button"
        onClick={toggleTheme}
        className={`relative w-12 h-7 rounded-full border transition-colors ${
          theme === 'dark'
            ? 'bg-surface-container-highest border-white/10'
            : 'bg-surface-container-low border-black/10'
        }`}
        aria-label="Toggle Tema"
        title="Toggle Tema"
      >
        <span
          className={`absolute top-1 left-1 h-5 w-5 rounded-full transition-all ${
            theme === 'dark' ? 'translate-x-5 bg-white' : 'translate-x-0 bg-white'
          } shadow-md`}
        />
        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-on-surface-variant">
          {theme === 'dark' ? (
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
            </svg>
          ) : (
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v2m0 14v2m9-9h-2M5 12H3m14.364-7.364l-1.414 1.414M7.05 16.95l-1.414 1.414m0-12.728L7.05 7.05m9.9 9.9l1.414 1.414M12 8a4 4 0 100 8 4 4 0 000-8z" />
            </svg>
          )}
        </span>
        <span className="sr-only">Tema {theme === 'dark' ? 'Gelap' : 'Terang'}</span>
      </button>

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
          <span className="absolute -top-1 -right-1 bg-primary text-on-primary text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center shadow-lg shadow-primary/50 ring-2 ring-background">
            {totalItems}
          </span>
        )}
      </Link>
    </div>
  );
}
