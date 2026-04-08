export interface CategoryItem {
  id: number;
  name: string;
  count?: number;
}

export interface CategoryNode {
  id: number;
  name: string;
  parentId: number | null;
  filterId?: number;
  children: CategoryNode[];
}
