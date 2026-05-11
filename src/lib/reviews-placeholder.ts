import type { AggregateRatingInput, ReviewInput } from "./seo/rating-schema";

export interface ReviewBundle {
  aggregate: AggregateRatingInput;
  reviews: ReviewInput[];
}

export function getPlaceholderReviews(productName: string): ReviewBundle {
  return {
    aggregate: {
      ratingValue: 4.8,
      reviewCount: 37,
    },
    reviews: [
      {
        author: "Nadia R.",
        rating: 5,
        body: `${productName} terasa kokoh dan finishing-nya rapi. Pengiriman juga cepat.`,
        date: "2026-03-12",
      },
      {
        author: "Rizky A.",
        rating: 4,
        body: `Kualitas ${productName} sesuai ekspektasi, packaging aman, dan warna sesuai foto.`,
        date: "2026-03-05",
      },
      {
        author: "Dewi S.",
        rating: 5,
        body: "Sangat puas! Produk pas dengan perangkat saya dan terasa premium.",
        date: "2026-02-24",
      },
    ],
  };
}
