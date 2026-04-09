import { NextRequest, NextResponse } from "next/server";
import { sql } from "drizzle-orm";
import { geoDb } from "@/lib/geo-db/client";
import { getProducts } from "@/lib/product-cache";
import { fetchShopeeReviews } from "@/lib/reviews/shopee";
import { getShopeeChannelItemId } from "@/lib/reviews/bridge";

const parseLimit = (value: string | null, fallback = 10) => {
  if (!value) return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const resolveItemId = (product: { id: number; variants: { id: number }[] }) =>
  product.variants[0]?.id ?? product.id;

export async function GET(req: NextRequest) {
  const limit = parseLimit(req.nextUrl.searchParams.get("limit"), 10);
  const cache = await getProducts();
  const products = cache.products.slice(0, limit);

  let inserted = 0;

  for (const product of products) {
    const jubelioItemId = resolveItemId(product);
    const shopeeItemId = await getShopeeChannelItemId(jubelioItemId);
    if (!shopeeItemId) continue;

    const reviews = await fetchShopeeReviews(shopeeItemId);

    for (const review of reviews) {
      await geoDb.execute(sql`
        INSERT INTO product_reviews (
          jubelio_item_id,
          channel_id,
          channel_item_id,
          source_review_id,
          rating,
          review_text,
          reviewer_name,
          review_created_at
        ) VALUES (
          ${product.id},
          ${64},
          ${shopeeItemId},
          ${review.id},
          ${review.rating},
          ${review.reviewText},
          ${review.reviewerName},
          ${review.createdAt}
        )
        ON CONFLICT (channel_id, channel_item_id, source_review_id)
        DO NOTHING
      `);
      inserted += 1;
    }
  }

  return NextResponse.json({
    ok: true,
    processed: products.length,
    inserted,
  });
}
