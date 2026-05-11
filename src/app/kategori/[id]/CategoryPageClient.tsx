"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ProductCard } from "@/components/ui/ProductCard";
import { CATEGORY_NAME_MAP, PLACEHOLDER_IMAGE } from "@/lib/constants";

interface Product {
  id: number;
  name: string;
  price: number;
  thumbnail: string | null;
  categoryId: number | null;
}

interface ProductsResponse {
  items: Product[];
}

interface Props {
  categoryId: number;
}

export function CategoryPageClient({ categoryId }: Props) {
  const [products, setProducts] = useState<Product[] | null>(null);
  const loading = products === null;

  useEffect(() => {
    fetch(`/api/products?category=${categoryId}&limit=24&page=1`)
      .then((res) => res.json())
      .then((data: ProductsResponse) => setProducts(data.items || []))
      .catch(() => setProducts([]));
  }, [categoryId]);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {loading ? (
        Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="animate-pulse bg-surface-container-low rounded-xl overflow-hidden"
          >
            <div className="aspect-4/5 bg-surface-container-highest/50" />
            <div className="p-4 flex flex-col gap-2">
              <div className="h-4 w-full bg-surface-container-highest rounded-full" />
              <div className="h-4 w-3/4 bg-surface-container-highest rounded-full" />
              <div className="h-5 w-24 bg-surface-container-highest rounded-full mt-1" />
            </div>
          </div>
        ))
      ) : products.length > 0 ? (
        products.map((product) => (
          <Link key={product.id} href={`/products/${product.id}`}>
            <ProductCard
              name={product.name}
              price={
                product.price > 0
                  ? `Rp ${product.price.toLocaleString("id-ID")}`
                  : "Hubungi Kami"
              }
              imageSrc={product.thumbnail || PLACEHOLDER_IMAGE}
              category={
                product.categoryId
                  ? CATEGORY_NAME_MAP[product.categoryId] || "Aksesoris"
                  : "Aksesoris"
              }
            />
          </Link>
        ))
      ) : (
        <div className="col-span-full text-on-surface-variant text-sm">
          Produk belum tersedia pada kategori ini.
        </div>
      )}
    </div>
  );
}
