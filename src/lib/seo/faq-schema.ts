import { normalizeUrl, safeText } from "./schema-helpers";

export interface FaqItem {
  question: string;
  answer: string;
}

export function buildFaqSchema(items: FaqItem[], urlPath?: string) {
  if (!items || items.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    url: urlPath ? normalizeUrl(urlPath) : undefined,
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: safeText(item.question),
      acceptedAnswer: {
        "@type": "Answer",
        text: safeText(item.answer),
      },
    })),
  };
}
