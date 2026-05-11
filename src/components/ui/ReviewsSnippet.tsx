import React from "react";
import type {
  AggregateRatingInput,
  ReviewInput,
} from "@/lib/seo/rating-schema";

interface ReviewsSnippetProps {
  aggregate: AggregateRatingInput;
  reviews: ReviewInput[];
}

function renderStars(rating: number) {
  const fullStars = Math.round(rating);
  return Array.from({ length: 5 }).map((_, index) => (
    <span
      key={index}
      className={index < fullStars ? "text-primary" : "text-on-surface-variant"}
    >
      *
    </span>
  ));
}

export function ReviewsSnippet({ aggregate, reviews }: ReviewsSnippetProps) {
  const hasReviews = aggregate.reviewCount > 0;
  return (
    <section className="w-full max-w-5xl mx-auto px-4 mt-8">
      <div className="rounded-3xl border surface-border bg-surface-container p-6 md:p-8">
        <div className="flex items-center gap-4">
          {hasReviews ? (
            <>
              <div className="text-3xl font-bold text-on-surface">
                {aggregate.ratingValue.toFixed(1)}
              </div>
              <div className="flex flex-col">
                <div className="text-lg">
                  {renderStars(aggregate.ratingValue)}
                </div>
                <p className="text-xs md:text-sm text-on-surface-variant">
                  Berdasarkan {aggregate.reviewCount} ulasan terverifikasi
                </p>
              </div>
            </>
          ) : (
            <p className="text-sm text-on-surface-variant">
              Belum ada ulasan untuk produk ini.
            </p>
          )}
        </div>

        {hasReviews && (
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {reviews.slice(0, 3).map((review, index) => (
              <div
                key={`${review.author}-${index}`}
                className="rounded-2xl bg-surface-container-highest p-4"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-on-surface">
                    {review.author}
                  </p>
                  <span className="text-xs text-on-surface-variant">
                    {review.rating.toFixed(1)}
                  </span>
                </div>
                <p className="mt-2 text-sm text-on-surface-variant">
                  {review.body}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
