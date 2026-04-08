"use client";

import Link from 'next/link';

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
  return (
    <div className="flex items-center gap-2 shrink-0">
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
