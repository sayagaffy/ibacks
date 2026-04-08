"use client";

import React, { useEffect, useRef, useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import Link from 'next/link';
import { SearchBar } from './SearchBar';
import { useHeaderSearch } from '@/lib/useHeaderSearch';
import { HeaderActions } from './HeaderActions';

export interface HeaderProps {
  title?: string;
}

export const Header: React.FC<HeaderProps> = ({
  title = 'ibacks',
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
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
  const {
    query,
    setQuery,
    selectedCategory,
    categories,
    categoryTree,
    categoriesLoading,
    categoryOpen,
    setCategoryOpen,
    submitSearch,
    handleCategorySelect,
    suggestions,
    suggestionsLoading,
    suggestionsOpen,
    setSuggestionsOpen,
    popularItems,
    historyItems,
    activeRootId,
    setActiveRootId,
  } = useHeaderSearch({ pathname, searchParams, router });
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!categoryOpen && !suggestionsOpen) return;
    const handleClick = (event: MouseEvent) => {
      if (!searchRef.current?.contains(event.target as Node)) {
        setCategoryOpen(false);
        setSuggestionsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [categoryOpen, suggestionsOpen, setCategoryOpen, setSuggestionsOpen]);



  return (
    <header className="sticky top-0 z-50 w-full glass-elevated surface-border border-b">
      <div className="flex flex-col md:flex-row md:items-center gap-4 px-4 md:px-6 py-3 max-w-7xl mx-auto">
        <div className="flex items-center gap-3 md:gap-4 shrink-0">
          {title === 'ibacks' ? (
            <Link href="/" className="flex items-center gap-2">
              {/* Using CSS filter invert to make the black logo white in dark mode */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.png" alt="iBacks Logo" className="h-5 md:h-6 object-contain invert brightness-0 dark:invert" />
              <span className="hidden sm:inline text-xs tracking-[0.4em] text-on-surface-variant uppercase">
                creation
              </span>
            </Link>
          ) : (
            <h1 className="text-lg md:text-xl font-bold tracking-tight bg-linear-to-r from-white to-neutral-400 bg-clip-text text-transparent line-clamp-1 max-w-[200px] md:max-w-none">
              {title}
            </h1>
          )}
        </div>

        <div className="flex-1 min-w-0" ref={searchRef}>
          <SearchBar
            value={query}
            onChange={setQuery}
            onSubmit={submitSearch}
            onClear={() => {
              setQuery('');
              setSuggestionsOpen(false);
              if (pathname.startsWith('/search')) {
                const params = new URLSearchParams();
                if (selectedCategory !== 'all') params.set('category', selectedCategory);
                router.push(params.toString() ? `/search?${params.toString()}` : '/search');
              }
            }}
            categories={categories}
            categoryTree={categoryTree}
            activeRootId={activeRootId}
            onActiveRootChange={setActiveRootId}
            onCategorySelect={handleCategorySelect}
            isCategoryOpen={categoryOpen}
            onToggleCategory={() => {
              setCategoryOpen((open) => !open);
              setSuggestionsOpen(false);
            }}
            isLoadingCategories={categoriesLoading}
            suggestions={suggestions}
            popularItems={popularItems}
            historyItems={historyItems}
            isSuggestionsOpen={suggestionsOpen && !categoryOpen}
            isSuggestionsLoading={suggestionsLoading}
            onSuggestionSelect={(value) => {
              setQuery(value);
              setSuggestionsOpen(false);
              submitSearch({ query: value });
            }}
            onProductSelect={(id) => {
              setSuggestionsOpen(false);
              setCategoryOpen(false);
              router.push(`/products/${id}`);
            }}
            onInputFocus={() => {
              setSuggestionsOpen(true);
            }}
            onInputBlur={() => {
              setTimeout(() => setSuggestionsOpen(false), 150);
            }}
          />
        </div>

        <HeaderActions
          mounted={mounted}
          isAuthenticated={isAuthenticated}
          user={user}
          totalItems={totalItems}
        />
      </div>
    </header>
  );
};
