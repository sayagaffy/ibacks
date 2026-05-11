import { splitHighlight } from '@/lib/search-suggestions';

interface HighlightedTextProps {
  text: string;
  query: string;
}

export function HighlightedText({ text, query }: HighlightedTextProps) {
  const parts = splitHighlight(text, query);
  if (!parts.match) return <>{parts.before}</>;
  return (
    <>
      {parts.before}
      <span className="text-primary font-semibold">{parts.match}</span>
      {parts.after}
    </>
  );
}
