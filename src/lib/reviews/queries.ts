import { sql } from "drizzle-orm";
import { geoDb } from "@/lib/geo-db/client";
import type {
  AggregateRatingInput,
  ReviewInput,
} from "@/lib/seo/rating-schema";

const toNumber = (value: unknown, fallback = 0) => {
  const num = typeof value === "number" ? value : Number(value);
  return Number.isFinite(num) ? num : fallback;
};

export async function getReviewsBundle(jubelioItemId: number): Promise<{
  aggregate: AggregateRatingInput;
  reviews: ReviewInput[];
}> {
  if (!Number.isFinite(jubelioItemId) || jubelioItemId <= 0) {
    return { aggregate: { ratingValue: 0, reviewCount: 0 }, reviews: [] };
  }

  try {
    const [aggregateResult, reviewResult] = await Promise.all([
      geoDb.execute(sql`
        SELECT COUNT(*)::int AS count, COALESCE(AVG(rating), 0) AS avg
        FROM product_reviews
        WHERE jubelio_item_id = ${jubelioItemId}
      `),
      geoDb.execute(sql`
        SELECT reviewer_name, rating, review_text, review_created_at
        FROM product_reviews
        WHERE jubelio_item_id = ${jubelioItemId}
        ORDER BY review_created_at DESC NULLS LAST, id DESC
        LIMIT 6
      `),
    ]);

    const count = toNumber(aggregateResult.rows[0]?.count, 0);
    const avg = toNumber(aggregateResult.rows[0]?.avg, 0);

    const reviews = reviewResult.rows.map((row) => ({
      author: (row.reviewer_name as string) || "Pelanggan iBacks",
      rating: toNumber(row.rating, 0),
      body: (row.review_text as string) || "Ulasan belum tersedia.",
      date: row.review_created_at
        ? new Date(row.review_created_at as string).toISOString()
        : undefined,
    }));

    return {
      aggregate: { ratingValue: avg, reviewCount: count },
      reviews,
    };
  } catch {
    return { aggregate: { ratingValue: 0, reviewCount: 0 }, reviews: [] };
  }
}
