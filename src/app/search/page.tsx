import { Suspense } from 'react';
import { CatalogPage } from '@/components/ui/CatalogPage';

export const metadata = {
  title: 'Katalog Produk | iBacks',
  description: 'Temukan lengkap produk aksesoris smartphone premium iBacks - screen protector, casing, kabel, audio, dan lebih banyak lagi.',
};

export default function SearchRoute() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-on-surface-variant">
          <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm">Memuat katalog...</p>
        </div>
      </div>
    }>
      <CatalogPage />
    </Suspense>
  );
}
