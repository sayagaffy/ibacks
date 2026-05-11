const STORAGE_KEY = 'ibacks-search-history';

export function loadSearchHistory(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((item) => typeof item === 'string') : [];
  } catch {
    return [];
  }
}

export function saveSearchHistory(items: string[]) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    return;
  }
}

export function addSearchHistory(items: string[], value: string, limit = 6): string[] {
  const trimmed = value.trim();
  if (!trimmed) return items;
  const next = [trimmed, ...items.filter((item) => item.toLowerCase() !== trimmed.toLowerCase())];
  return next.slice(0, limit);
}
