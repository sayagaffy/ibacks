import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Header } from "@/components/ui/Header";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { CategoryPageClient } from "./CategoryPageClient";
import { getCategories } from "@/lib/category-cache";
import { buildCategoryPath } from "@/lib/category-tree";
import { fallbackCategoryTree } from "@/lib/fallback-category-tree";
import { flattenCategoryNodes } from "@/lib/category-tree";
import { SeoContentBlock } from "@/components/ui/SeoContentBlock";
import { getCategorySeoContent } from "@/lib/seo-content";
import { buildFaqSchema } from "@/lib/seo/faq-schema";
import { JsonLd } from "@/components/ui/JsonLd";
import { SITE_NAME, toAbsoluteUrl } from "@/lib/seo/site";
import { getSeoFooterLinks, popularSearches } from "@/lib/seo/mega-footer";

export const revalidate = 3600;

async function resolveCategoryData(categoryId: number) {
  const cache = await getCategories();
  const fallbackFlat = flattenCategoryNodes(fallbackCategoryTree);
  const flatCategories =
    cache.categories.length > 0
      ? cache.categories.map((cat) => ({
          id: cat.id,
          name: cat.name,
          parentId: cat.parentId ?? null,
        }))
      : fallbackFlat;

  const path = buildCategoryPath(flatCategories, categoryId);
  const categoryName = path[path.length - 1]?.name || "Kategori";
  return { path, categoryName };
}

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const resolvedParams = await params;
  const categoryId = Number(resolvedParams.id);
  if (Number.isNaN(categoryId)) {
    return {
      title: `Kategori | ${SITE_NAME}`,
      robots: { index: false, follow: false },
    };
  }

  const { categoryName } = await resolveCategoryData(categoryId);
  const title = categoryName;
  const description = `Temukan pilihan ${categoryName.toLowerCase()} terbaik untuk perangkat Anda di ${SITE_NAME}.`;

  return {
    title,
    description,
    alternates: { canonical: `/kategori/${categoryId}` },
    openGraph: {
      title,
      description,
      url: toAbsoluteUrl(`/kategori/${categoryId}`),
      type: "website",
    },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const categoryId = Number(id);
  if (Number.isNaN(categoryId)) notFound();

  const [categoryData, footerLinks] = await Promise.all([
    resolveCategoryData(categoryId),
    getSeoFooterLinks(),
  ]);
  const { path, categoryName } = categoryData;
  const seoContent = getCategorySeoContent(categoryName);
  const faqSchema = buildFaqSchema(seoContent.items, `/kategori/${categoryId}`);

  return (
    <div className="min-h-screen bg-background pb-24">
      <Header />

      <main className="w-full max-w-7xl mx-auto px-4 md:px-6 py-6 flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <Breadcrumbs
            items={[
              { label: "Beranda", href: "/" },
              ...path.map((node) => ({
                label: node.name,
                href: `/kategori/${node.id}`,
              })),
            ]}
          />
          <h1 className="text-2xl md:text-3xl font-bold text-on-surface">
            {categoryName}
          </h1>
        </div>

        <CategoryPageClient categoryId={categoryId} />
        <SeoContentBlock
          title={seoContent.title}
          intro={seoContent.intro}
          items={seoContent.items}
          linkGroups={footerLinks}
          popularSearches={popularSearches}
        />
      </main>
      <JsonLd data={faqSchema} />
    </div>
  );
}
