"use client";

import React from 'react';
import type { CategoryItem, CategoryNode } from '@/lib/types';
import { SearchSuggestions } from './SearchSuggestions';
import { CategoryMegaMenu } from './CategoryMegaMenu';
interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onClear: () => void;
  categories: CategoryItem[];
  categoryTree: CategoryNode[];
  activeRootId: number | null;
  onActiveRootChange: (id: number) => void;
  onCategorySelect: (value: string) => void;
  isCategoryOpen: boolean;
  onToggleCategory: () => void;
  isLoadingCategories: boolean;
  suggestions: Array<{ id: number; name: string; categoryId: number | null; thumbnail?: string | null }>;
  popularItems: Array<{ id: number; name: string; categoryId: number | null; thumbnail?: string | null }>;
  historyItems: string[];
  isSuggestionsOpen: boolean;
  isSuggestionsLoading: boolean;
  onSuggestionSelect: (value: string) => void;
  onProductSelect: (id: number) => void;
  onInputFocus: () => void;
  onInputBlur: () => void;
}
export function SearchBar({
  value,
  onChange,
  onSubmit,
  onClear,
  categories,
  categoryTree,
  activeRootId,
  onActiveRootChange,
  onCategorySelect,
  isCategoryOpen,
  onToggleCategory,
  isLoadingCategories,
  suggestions,
  popularItems,
  historyItems,
  isSuggestionsOpen,
  isSuggestionsLoading,
  onSuggestionSelect,
  onProductSelect,
  onInputFocus,
  onInputBlur,
}: SearchBarProps) {
  const activeCategory = 'Kategori';
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
      className="relative flex items-center w-full bg-surface-container-low border surface-border rounded-full px-2 py-1.5 gap-2 shadow-sm"
      role="search"
    >
      <div className="relative">
        <button
          type="button"
          onClick={onToggleCategory}
          aria-haspopup="listbox"
          aria-expanded={isCategoryOpen}
          className="flex items-center gap-2 px-3 py-2 rounded-full text-sm font-semibold text-on-surface bg-surface-container hover:bg-surface-container-high transition-colors max-w-[200px]"
        >
          <span className="hidden sm:inline truncate">{activeCategory}</span>
          <span className="sm:hidden">Kategori</span>
          <svg className="w-4 h-4 text-on-surface-variant" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        <CategoryMegaMenu
          open={isCategoryOpen}
          loading={isLoadingCategories}
          categories={categoryTree}
          activeRootId={activeRootId}
          onActiveRootChange={onActiveRootChange}
          onCategorySelect={onCategorySelect}
        />
      </div>
      <div className="relative flex-1 min-w-0">
        <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="search"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onFocus={onInputFocus}
          onBlur={onInputBlur}
          placeholder="Cari produk iBacks..."
          aria-label="Cari produk"
          className="w-full bg-transparent text-on-surface placeholder:text-on-surface-variant pl-12 pr-12 py-2.5 text-sm md:text-base outline-none"
        />
        {value && (
          <button
            type="button"
            onClick={onClear}
            aria-label="Hapus pencarian"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
      <button
        type="submit"
        className="px-4 py-2 rounded-full bg-primary text-on-primary text-sm font-semibold hover:bg-primary/90 transition-colors"
      >
        Cari
      </button>
      <SearchSuggestions
        open={isSuggestionsOpen}
        loading={isSuggestionsLoading}
        suggestions={suggestions}
        popularItems={popularItems}
        historyItems={historyItems}
        categories={categories}
        query={value}
        onSelect={onSuggestionSelect}
        onProductSelect={onProductSelect}
      />
    </form>
  );
}
