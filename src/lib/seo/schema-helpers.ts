import { toAbsoluteUrl } from "./site";

export function stripHtml(value?: string | null): string {
  if (!value) return "";
  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function safeText(value?: string | null, fallback = ""): string {
  const cleaned = stripHtml(value);
  return cleaned || fallback;
}

export function normalizeUrl(pathOrUrl: string): string {
  return toAbsoluteUrl(pathOrUrl);
}

export function ensureArray<T>(value: T | T[] | null | undefined): T[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

export function clampRating(value: number, min = 1, max = 5): number {
  if (Number.isNaN(value)) return min;
  return Math.min(Math.max(value, min), max);
}
