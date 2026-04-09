import { normalizeUrl, safeText } from "./schema-helpers";
import { DEFAULT_CURRENCY, SITE_NAME } from "./site";
import {
  buildAggregateRatingSchema,
  buildReviewSchemas,
  type AggregateRatingInput,
  type ReviewInput,
} from "./rating-schema";

export interface ProductSchemaInput {
  id: number | string;
  name: string;
  description?: string | null;
  urlPath: string;
  images: string[];
  sku?: string | null;
  brand?: string;
  category?: string | null;
  price: number;
  currency?: string;
  inStock: boolean;
  aggregateRating?: AggregateRatingInput | null;
  reviews?: ReviewInput[] | null;
}

export function buildProductSchema(input: ProductSchemaInput) {
  const imageObjects = input.images.map((url) => ({
    "@type": "ImageObject",
    url: normalizeUrl(url),
  }));

  const aggregateRating = buildAggregateRatingSchema(input.aggregateRating);
  const reviews = buildReviewSchemas(input.reviews);

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    productID: String(input.id),
    name: safeText(input.name),
    description: safeText(input.description),
    sku: input.sku || undefined,
    category: input.category || undefined,
    brand: {
      "@type": "Brand",
      name: input.brand || SITE_NAME,
    },
    image: imageObjects,
    url: normalizeUrl(input.urlPath),
    offers: {
      "@type": "Offer",
      priceCurrency: input.currency || DEFAULT_CURRENCY,
      price: input.price,
      availability: `https://schema.org/${input.inStock ? "InStock" : "OutOfStock"}`,
      url: normalizeUrl(input.urlPath),
    },
    aggregateRating: aggregateRating || undefined,
    review: reviews.length > 0 ? reviews : undefined,
  };
}
