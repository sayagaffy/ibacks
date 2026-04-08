import Link from 'next/link';

const footerLinks = [
  { href: '/search', label: 'Produk' },
  { href: '/ekosistem', label: 'Ekosistem' },
  { href: '/teknologi', label: 'Teknologi' },
  { href: '/tentang-kami', label: 'Tentang Kami' },
  { href: '/dukungan', label: 'Dukungan' },
];

export function Footer() {
  return (
    <footer className="mt-auto border-t surface-border bg-surface">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="flex flex-col gap-2">
          <span className="text-sm tracking-[0.4em] uppercase text-on-surface-variant">creation</span>
          <p className="text-xs text-on-surface-variant">
            Aksesori teknologi premium yang dirancang untuk ritme hidup modern.
          </p>
        </div>
        <nav className="flex flex-wrap gap-4 text-sm font-semibold text-on-surface-variant">
          {footerLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:text-on-surface transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
