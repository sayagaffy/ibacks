export interface ShopeeReview {
  id: string;
  rating: number;
  reviewerName: string;
  reviewText: string;
  createdAt: string;
}

const clampRating = (value: number) => Math.min(5, Math.max(1, value));

const hashString = (value: string) =>
  value.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);

export async function fetchShopeeReviews(
  shopeeItemId: string,
): Promise<ShopeeReview[]> {
  const base = hashString(shopeeItemId);
  const ratings = [
    clampRating((base % 5) + 1),
    clampRating(((base + 2) % 5) + 1),
    clampRating(((base + 3) % 5) + 1),
  ];

  return ratings.map((rating, index) => ({
    id: `${shopeeItemId}-r${index + 1}`,
    rating,
    reviewerName: `Pembeli Shopee #${(base + index) % 97}`,
    reviewText:
      rating >= 4
        ? "Produk sesuai deskripsi dan pengiriman cepat."
        : "Produk cukup baik, semoga kualitas terus meningkat.",
    createdAt: new Date(Date.now() - index * 86_400_000).toISOString(),
  }));
}
