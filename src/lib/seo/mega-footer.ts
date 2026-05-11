import { buildCategoryTree } from "@/lib/category-tree";
import { getCategories } from "@/lib/category-cache";
import { fallbackCategoryTree } from "@/lib/fallback-category-tree";
import type { CategoryNode } from "@/lib/types";

export interface SeoLinkItem {
  label: string;
  href: string;
}

export interface SeoLinkGroup {
  title: string;
  href: string;
  links: SeoLinkItem[];
}

const popularSearchTerms = [
  "Casing iPhone 15 Pro",
  "Tempered Glass iPhone",
  "Powerbank fast charging 10000mah",
  "Adaptor charger 65W",
  "Kabel data USB-C original",
  "Earphone bluetooth untuk olahraga",
  "Case MacBook Air M2",
  "Screen protector anti gores",
  "Charger mobil USB-C",
  "TWS noise cancelling",
];

export const popularSearches: SeoLinkItem[] = popularSearchTerms.map(
  (term) => ({
    label: term,
    href: `/search?q=${encodeURIComponent(term)}`,
  }),
);

const isAllCategory = (name: string) =>
  /semua kategori|all categories/i.test(name);

const toCategoryHref = (node: CategoryNode) =>
  `/kategori/${node.filterId ?? node.id}`;

const collectLinks = (root: CategoryNode): SeoLinkItem[] => {
  const links: SeoLinkItem[] = [];
  const seen = new Set<string>();
  const pushLink = (node: CategoryNode) => {
    const href = toCategoryHref(node);
    if (seen.has(href)) return;
    seen.add(href);
    links.push({ label: node.name, href });
  };

  root.children.forEach((child) => {
    pushLink(child);
    child.children.forEach(pushLink);
  });

  return links;
};

export const buildSeoGroupsFromTree = (
  tree: CategoryNode[],
): SeoLinkGroup[] => {
  return tree
    .filter((root) => !isAllCategory(root.name))
    .map((root) => ({
      title: root.name,
      href: toCategoryHref(root),
      links: collectLinks(root),
    }));
};

export async function getSeoFooterLinks(): Promise<SeoLinkGroup[]> {
  const cache = await getCategories();
  const flat = cache.categories.map((cat) => ({
    id: cat.id,
    name: cat.name,
    parentId: cat.parentId ?? null,
  }));
  const tree = flat.length > 0 ? buildCategoryTree(flat) : fallbackCategoryTree;
  return buildSeoGroupsFromTree(tree);
}
