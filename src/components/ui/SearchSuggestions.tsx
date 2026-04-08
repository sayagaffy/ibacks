import type { CategoryItem } from '@/lib/types';
import { getCategoryName, getFilteredHistory } from '@/lib/search-suggestions';
import { PLACEHOLDER_IMAGE } from '@/lib/constants';
import { SuggestionRow } from './SuggestionRow';
import { HistoryIcon, SearchIcon, StarIcon } from './SuggestionIcons';

interface SuggestionItem {
  id: number;
  name: string;
  categoryId: number | null;
  thumbnail?: string | null;
}

interface SearchSuggestionsProps {
  open: boolean;
  loading: boolean;
  suggestions: SuggestionItem[];
  popularItems: SuggestionItem[];
  historyItems: string[];
  categories: CategoryItem[];
  query: string;
  onSelect: (value: string) => void;
  onProductSelect: (id: number) => void;
}

export function SearchSuggestions({
  open,
  loading,
  suggestions,
  popularItems,
  historyItems,
  categories,
  query,
  onSelect,
  onProductSelect,
}: SearchSuggestionsProps) {
  if (!open) return null;
  const categoryMap = new Map(categories.map((cat) => [cat.id, cat.name]));

  const trimmed = query.trim();
  const showLive = trimmed.length >= 2;
  const filteredHistory = getFilteredHistory(historyItems, query);
  const rankedSuggestions = showLive
    ? [...suggestions].sort((a, b) => {
        const q = trimmed.toLowerCase();
        const aName = a.name.toLowerCase();
        const bName = b.name.toLowerCase();
        const aIndex = aName.indexOf(q);
        const bIndex = bName.indexOf(q);
        const aScore = aIndex === -1 ? 99 : aIndex;
        const bScore = bIndex === -1 ? 99 : bIndex;
        if (aScore !== bScore) return aScore - bScore;
        return aName.length - bName.length;
      })
    : suggestions;
  const topMatches = rankedSuggestions.slice(0, 2);
  const searchMatches = rankedSuggestions.slice(2);

  return (
    <div className="absolute left-0 right-0 top-full mt-3 rounded-2xl border surface-border bg-surface-container shadow-2xl overflow-hidden z-40">
      {loading && showLive ? (
        <div className="px-4 py-3 text-sm text-on-surface-variant">Mencari rekomendasi...</div>
      ) : (
        <div className="max-h-80 overflow-auto py-3 flex flex-col gap-4">
          {showLive && topMatches.length > 0 && (
            <div className="flex flex-col gap-3">
              <span className="px-4 text-xs uppercase tracking-[0.3em] text-on-surface-variant">
                Paling cocok
              </span>
              {topMatches.map((item) => (
                <SuggestionRow
                  key={item.id}
                  name={item.name}
                  query={query}
                  category={getCategoryName(categoryMap, item.categoryId)}
                  imageSrc={item.thumbnail || PLACEHOLDER_IMAGE}
                  onSelect={() => onProductSelect(item.id)}
                />
              ))}
            </div>
          )}

          {showLive && searchMatches.length > 0 && (
            <div className="flex flex-col gap-2">
              <span className="px-4 text-xs uppercase tracking-[0.3em] text-on-surface-variant">
                Saran pencarian
              </span>
              {searchMatches.map((item) => (
                <SuggestionRow
                  key={item.id}
                  name={item.name}
                  query={query}
                  category={getCategoryName(categoryMap, item.categoryId)}
                  icon={<SearchIcon />}
                  onSelect={() => onSelect(item.name)}
                />
              ))}
            </div>
          )}

          {!showLive && filteredHistory.length > 0 && (
            <div className="flex flex-col gap-2">
              <span className="px-4 text-xs uppercase tracking-[0.3em] text-on-surface-variant">
                Pencarian Terakhir
              </span>
              {filteredHistory.map((item) => (
                <SuggestionRow
                  key={item}
                  name={item}
                  query={query}
                  icon={<HistoryIcon />}
                  onSelect={() => onSelect(item)}
                />
              ))}
            </div>
          )}

          {!showLive && popularItems.length > 0 && (
            <div className="flex flex-col gap-2">
              <span className="px-4 text-xs uppercase tracking-[0.3em] text-on-surface-variant">
                Favorit iBacks
              </span>
              {popularItems.map((item) => (
                <SuggestionRow
                  key={item.id}
                  name={item.name}
                  query={query}
                  category={getCategoryName(categoryMap, item.categoryId)}
                  icon={<StarIcon />}
                  onSelect={() => onSelect(item.name)}
                />
              ))}
            </div>
          )}

          {!showLive && filteredHistory.length === 0 && popularItems.length === 0 && (
            <div className="px-4 py-3 text-sm text-on-surface-variant">Belum ada rekomendasi.</div>
          )}

          {showLive && suggestions.length === 0 && !loading && (
            <div className="px-4 py-3 text-sm text-on-surface-variant">Tidak ada rekomendasi.</div>
          )}
        </div>
      )}
    </div>
  );
}
