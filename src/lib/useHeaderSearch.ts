import { useEffect, useState } from 'react';
import type { ReadonlyURLSearchParams } from 'next/navigation';
import type { CategoryItem, CategoryNode } from '@/lib/types';
import { addSearchHistory, loadSearchHistory, saveSearchHistory } from '@/lib/search-history';

interface RouterLike {
  push: (href: string) => void;
}

interface UseHeaderSearchArgs {
  pathname: string;
  searchParams: ReadonlyURLSearchParams;
  router: RouterLike;
}

interface SuggestionItem {
  id: number;
  name: string;
  categoryId: number | null;
  thumbnail?: string | null;
}

export function useHeaderSearch({ pathname, searchParams, router }: UseHeaderSearchArgs) {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [categoryTree, setCategoryTree] = useState<CategoryNode[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<SuggestionItem[]>([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const [popularItems, setPopularItems] = useState<SuggestionItem[]>([]);
  const [historyItems, setHistoryItems] = useState<string[]>([]);
  const [activeRootId, setActiveRootId] = useState<number | null>(null);

  useEffect(() => {
    setHistoryItems(loadSearchHistory());
  }, []);

  useEffect(() => {
    fetch('/api/category-tree')
      .then((res) => res.json())
      .then((data) => {
        setCategoryTree(data.tree || []);
        setCategories((data.flat || []).map((item: { id: number; name: string }) => ({
          id: item.id,
          name: item.name,
        })));
      })
      .catch(() => {
        setCategoryTree([]);
        setCategories([]);
      })
      .finally(() => setCategoriesLoading(false));
  }, []);

  useEffect(() => {
    if (categoryTree.length === 0) return;
    setActiveRootId((prev) => prev ?? categoryTree[0]?.id ?? null);
  }, [categoryTree]);

  useEffect(() => {
    fetch('/api/popular-products')
      .then((res) => res.json())
      .then((data) =>
        setPopularItems(
          (data.items || []).map((item: SuggestionItem) => ({
            id: item.id,
            name: item.name,
            categoryId: item.categoryId ?? null,
            thumbnail: item.thumbnail ?? null,
          }))
        )
      )
      .catch(() => setPopularItems([]));
  }, []);

  useEffect(() => {
    if (!pathname.startsWith('/search')) return;
    setQuery(searchParams.get('q') || '');
    setSelectedCategory(searchParams.get('category') || 'all');
  }, [pathname, searchParams]);

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setSuggestions([]);
      setSuggestionsOpen(false);
      return;
    }
    const timer = setTimeout(() => {
      const params = new URLSearchParams();
      params.set('q', trimmed);
      params.set('limit', '6');
      if (selectedCategory !== 'all') params.set('category', selectedCategory);
      setSuggestionsLoading(true);
      fetch(`/api/products?${params.toString()}`)
        .then((res) => res.json())
        .then((data) =>
          setSuggestions(
            (data.items || []).map((item: SuggestionItem) => ({
              id: item.id,
              name: item.name,
              categoryId: item.categoryId ?? null,
              thumbnail: item.thumbnail ?? null,
            }))
          )
        )
        .catch(() => setSuggestions([]))
        .finally(() => setSuggestionsLoading(false));
    }, 220);
    return () => clearTimeout(timer);
  }, [query, selectedCategory]);

  const submitSearch = (override?: { query?: string; category?: string }) => {
    const params = new URLSearchParams();
    const nextQuery = override?.query ?? query;
    const nextCategory = override?.category ?? selectedCategory;
    const trimmed = nextQuery.trim();
    if (trimmed) params.set('q', trimmed);
    if (nextCategory !== 'all') params.set('category', nextCategory);
    const queryString = params.toString();
    router.push(queryString ? `/search?${queryString}` : '/search');
    setCategoryOpen(false);
    setSuggestionsOpen(false);
    if (trimmed) {
      const nextHistory = addSearchHistory(historyItems, trimmed);
      setHistoryItems(nextHistory);
      saveSearchHistory(nextHistory);
    }
  };

  const handleCategorySelect = (value: string) => {
    setSelectedCategory(value);
    setCategoryOpen(false);
    setSuggestionsOpen(false);
    if (value === 'all') {
      router.push('/search');
      return;
    }
    router.push(`/kategori/${value}`);
  };

  return {
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
  };
}
