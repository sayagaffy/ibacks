import Link from 'next/link';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-on-surface-variant">
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-2">
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="hover:text-on-surface transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span className={isLast ? 'text-on-surface' : undefined}>{item.label}</span>
              )}
              {!isLast && <span className="text-on-surface-variant/50">/</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
