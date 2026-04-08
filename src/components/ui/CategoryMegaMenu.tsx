import type { CategoryNode } from '@/lib/types';

interface CategoryMegaMenuProps {
  open: boolean;
  loading: boolean;
  categories: CategoryNode[];
  activeRootId: number | null;
  onActiveRootChange: (id: number) => void;
  onCategorySelect: (value: string) => void;
}

export function CategoryMegaMenu({
  open,
  loading,
  categories,
  activeRootId,
  onActiveRootChange,
  onCategorySelect,
}: CategoryMegaMenuProps) {
  if (!open) return null;
  const isAllCategory = (name: string) => /semua kategori|all categories/i.test(name);
  const visibleCategories = categories.filter((root) => !isAllCategory(root.name));
  const activeRoot =
    visibleCategories.find((root) => root.id === activeRootId) || visibleCategories[0];

  return (
    <div className="absolute z-50 mt-3 w-[720px] max-w-[90vw] rounded-3xl border surface-border bg-surface-container shadow-2xl overflow-hidden">
      {loading ? (
        <div className="px-5 py-4 text-sm text-on-surface-variant">Memuat kategori...</div>
      ) : visibleCategories.length === 0 ? (
        <div className="px-5 py-4 text-sm text-on-surface-variant">Kategori belum tersedia.</div>
      ) : (
        <div className="flex">
          <div className="w-60 border-r surface-border p-4 bg-surface-container-low">
            <div className="text-[11px] uppercase tracking-[0.35em] text-on-surface-variant px-3 pb-3">
              Kategori
            </div>
            {visibleCategories.map((root) => {
              const isActive = activeRoot && root.id === activeRoot.id;
              const hasChildren = root.children.length > 0;
              return (
              <button
                key={root.id}
                type="button"
                onMouseEnter={() => onActiveRootChange(root.id)}
                onFocus={() => onActiveRootChange(root.id)}
                onClick={() => onCategorySelect(String(root.filterId ?? root.id))}
                className={`w-full px-3 py-2.5 rounded-xl text-left text-sm font-semibold transition-colors flex items-center justify-between ${
                  isActive
                    ? 'bg-primary/10 text-primary ring-1 ring-primary/20'
                    : 'text-on-surface hover:bg-surface-container-high'
                }`}
                aria-selected={isActive}
              >
                <span>{root.name}</span>
                {hasChildren && (
                  <svg
                    className={`w-4 h-4 ${isActive ? 'text-primary' : 'text-on-surface-variant'}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                )}
              </button>
              );
            })}
          </div>
          <div className="flex-1 p-5 max-h-96 overflow-auto">
            {activeRoot ? (
              <div className="grid grid-cols-2 gap-6">
                {activeRoot.children.map((child) => (
                  <div key={child.id} className="flex flex-col gap-3">
                    <button
                      type="button"
                      onClick={() => onCategorySelect(String(child.filterId ?? child.id))}
                      className="text-sm font-semibold text-on-surface hover:text-primary transition-colors text-left flex items-center gap-2"
                    >
                      <span>{child.name}</span>
                      {child.children.length > 0 && (
                        <svg
                          className="w-3.5 h-3.5 text-on-surface-variant"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      )}
                    </button>
                    {child.children.length > 0 && (
                      <div className="flex flex-col gap-2 pl-1">
                        {child.children.map((grand) => (
                          <button
                            key={grand.id}
                            type="button"
                            onClick={() => onCategorySelect(String(grand.filterId ?? grand.id))}
                            className="text-xs text-on-surface-variant hover:text-on-surface transition-colors text-left"
                          >
                            {grand.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-on-surface-variant">Kategori belum tersedia.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
