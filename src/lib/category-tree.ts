import type { CategoryNode } from '@/lib/types';

export interface FlatCategory {
  id: number;
  name: string;
  parentId: number | null;
}

function sortByName<T extends { name: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => a.name.localeCompare(b.name));
}

export function buildCategoryTree(categories: FlatCategory[]): CategoryNode[] {
  const nodes = new Map<number, CategoryNode>();
  categories.forEach((cat) => {
    nodes.set(cat.id, {
      id: cat.id,
      name: cat.name,
      parentId: cat.parentId,
      children: [],
    });
  });

  const roots: CategoryNode[] = [];
  nodes.forEach((node) => {
    if (node.parentId && nodes.has(node.parentId)) {
      nodes.get(node.parentId)!.children.push(node);
    } else {
      roots.push(node);
    }
  });

  const sortTree = (items: CategoryNode[]) => {
    const sorted = sortByName(items);
    sorted.forEach((item) => {
      item.children = sortTree(item.children);
    });
    return sorted;
  };

  return sortTree(roots);
}

export function flattenCategoryTree(tree: CategoryNode[]): Array<{ id: number; name: string }> {
  const list: Array<{ id: number; name: string }> = [];
  const walk = (nodes: CategoryNode[]) => {
    nodes.forEach((node) => {
      list.push({ id: node.id, name: node.name });
      if (node.children.length > 0) walk(node.children);
    });
  };
  walk(tree);
  return list;
}

export function flattenCategoryNodes(
  tree: CategoryNode[]
): Array<{ id: number; name: string; parentId: number | null }> {
  const list: Array<{ id: number; name: string; parentId: number | null }> = [];
  const walk = (nodes: CategoryNode[]) => {
    nodes.forEach((node) => {
      list.push({ id: node.id, name: node.name, parentId: node.parentId ?? null });
      if (node.children.length > 0) walk(node.children);
    });
  };
  walk(tree);
  return list;
}

export function buildCategoryPath(
  categories: Array<{ id: number; name: string; parentId: number | null }>,
  targetId: number
): Array<{ id: number; name: string }> {
  const map = new Map<number, { id: number; name: string; parentId: number | null }>();
  categories.forEach((cat) => map.set(cat.id, cat));
  const path: Array<{ id: number; name: string }> = [];
  let current = map.get(targetId) || null;
  while (current) {
    path.unshift({ id: current.id, name: current.name });
    if (!current.parentId) break;
    current = map.get(current.parentId) || null;
  }
  return path;
}
