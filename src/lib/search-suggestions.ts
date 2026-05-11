export function splitHighlight(text: string, query: string) {
  const trimmed = query.trim();
  if (!trimmed) return { before: text, match: '', after: '' };
  const lower = text.toLowerCase();
  const needle = trimmed.toLowerCase();
  const index = lower.indexOf(needle);
  if (index === -1) return { before: text, match: '', after: '' };
  return {
    before: text.slice(0, index),
    match: text.slice(index, index + needle.length),
    after: text.slice(index + needle.length),
  };
}

export function getCategoryName(categoryMap: Map<number, string>, id: number | null) {
  if (!id) return 'Aksesoris';
  return categoryMap.get(id) || 'Aksesoris';
}

export function getFilteredHistory(items: string[], query: string) {
  const trimmed = query.trim();
  if (trimmed.length < 2) return items;
  const needle = trimmed.toLowerCase();
  return items.filter((item) => item.toLowerCase().includes(needle));
}
