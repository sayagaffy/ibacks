import { notFound } from 'next/navigation';
import { Header } from '@/components/ui/Header';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { CategoryPageClient } from './CategoryPageClient';
import { getCategories } from '@/lib/category-cache';
import { buildCategoryPath } from '@/lib/category-tree';
import { fallbackCategoryTree } from '@/lib/fallback-category-tree';
import { flattenCategoryNodes } from '@/lib/category-tree';

export const revalidate = 3600;

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const categoryId = Number(id);
  if (Number.isNaN(categoryId)) notFound();

  const cache = await getCategories();
  const fallbackFlat = flattenCategoryNodes(fallbackCategoryTree);
  const flatCategories = cache.categories.length > 0
    ? cache.categories.map((cat) => ({
        id: cat.id,
        name: cat.name,
        parentId: cat.parentId ?? null,
      }))
    : fallbackFlat;

  const path = buildCategoryPath(flatCategories, categoryId);
  const categoryName = path[path.length - 1]?.name || 'Kategori';

  return (
    <div className="min-h-screen bg-background pb-24">
      <Header />

      <main className="w-full max-w-7xl mx-auto px-4 md:px-6 py-6 flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <Breadcrumbs
            items={[
              { label: 'Beranda', href: '/' },
              ...path.map((node) => ({ label: node.name, href: `/kategori/${node.id}` })),
            ]}
          />
          <h1 className="text-2xl md:text-3xl font-bold text-on-surface">{categoryName}</h1>
        </div>

        <CategoryPageClient categoryId={categoryId} />
      </main>
    </div>
  );
}
