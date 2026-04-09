import { clampRating, safeText } from "./schema-helpers";

export interface ReviewInput {
  author: string;
  rating: number;
  body: string;
  date?: string;
}

export interface AggregateRatingInput {
  ratingValue: number;
  reviewCount: number;
  bestRating?: number;
  worstRating?: number;
}

export function buildAggregateRatingSchema(
  input?: AggregateRatingInput | null,
) {
  if (!input || input.reviewCount <= 0) return null;
  return {
    "@type": "AggregateRating",
    ratingValue: clampRating(input.ratingValue),
    reviewCount: input.reviewCount,
    bestRating: input.bestRating ?? 5,
    worstRating: input.worstRating ?? 1,
  };
}

export function buildReviewSchemas(reviews?: ReviewInput[] | null) {
  if (!reviews || reviews.length === 0) return [];
  return reviews.map((review) => ({
    "@type": "Review",
    author: {
      "@type": "Person",
      name: safeText(review.author, "Pelanggan iBacks"),
    },
    reviewRating: {
      "@type": "Rating",
      ratingValue: clampRating(review.rating),
      bestRating: 5,
      worstRating: 1,
    },
    reviewBody: safeText(review.body),
    datePublished: review.date,
  }));
}
