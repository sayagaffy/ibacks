import type { MetadataRoute } from "next";
import { getProducts } from "@/lib/product-cache";
import { getCategories } from "@/lib/category-cache";
import { flattenCategoryNodes } from "@/lib/category-tree";
import { fallbackCategoryTree } from "@/lib/fallback-category-tree";
import { SITE_DOMAIN } from "@/lib/seo/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [productCache, categoryCache] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  const products = productCache.products || [];
  const categories =
    categoryCache.categories.length > 0
      ? categoryCache.categories
      : flattenCategoryNodes(fallbackCategoryTree).map((node) => ({
          id: node.id,
          name: node.name,
          parentId: node.parentId ?? null,
        }));

  const productLastModified = new Date(productCache.syncedAt);
  const categoryLastModified = new Date(categoryCache.syncedAt);

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: SITE_DOMAIN,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${SITE_DOMAIN}/search`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.7,
    },
    {
      url: `${SITE_DOMAIN}/ekosistem`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: `${SITE_DOMAIN}/teknologi`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: `${SITE_DOMAIN}/tentang-kami`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: `${SITE_DOMAIN}/dukungan`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.4,
    },
  ];

  const categoryRoutes: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${SITE_DOMAIN}/kategori/${category.id}`,
    lastModified: categoryLastModified,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const productRoutes: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${SITE_DOMAIN}/products/${product.id}`,
    lastModified: productLastModified,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
