'use client';

import { useState, useEffect, useCallback, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/ui/Header';

interface Product {
  id: number;
  name: string;
  price: number;
  thumbnail: string | null;
  categoryId: number | null;
}

interface Category {
  id: number;
  name: string;
  count: number;
}

interface ProductsResponse {
  items: Product[];
  total: number;
  page: number;
  totalPages: number;
  limit: number;
}

const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1592890288564-76628a30a657?q=80&w=800&auto=format&fit=crop';

function formatPrice(price: number) {
  return `Rp ${price.toLocaleString('id-ID')}`;
}

function ProductCardSkeleton() {
  return (
    <div className="animate-pulse bg-surface-container-low rounded-xl overflow-hidden">
      <div className="aspect-4/5 bg-surface-container-highest/50" />
      <div className="p-4 flex flex-col gap-2">
        <div className="h-4 w-full bg-surface-container-highest rounded-full" />
        <div className="h-4 w-3/4 bg-surface-container-highest rounded-full" />
        <div className="h-5 w-24 bg-surface-container-highest rounded-full mt-1" />
      </div>
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  const [imgError, setImgError] = useState(false);
  const imgSrc = (!imgError && product.thumbnail) ? product.thumbnail : PLACEHOLDER_IMAGE;

  return (
    <Link href={`/products/${product.id}`} className="group">
      <div className="relative flex flex-col bg-surface-container-low rounded-xl overflow-hidden ambient-shadow transition-transform duration-300 hover:-translate-y-1.5 cursor-pointer">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl z-0 group-hover:bg-primary/20 transition-colors duration-500 pointer-events-none" />
        
        <div className="bg-surface-container-highest/50 aspect-4/5 overflow-hidden relative">
          <img
            src={imgSrc}
            alt={product.name}
            className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
            onError={() => setImgError(true)}
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <span className="glass-elevated px-4 py-2 rounded-full text-sm font-semibold tracking-wide text-white">Lihat Detail</span>
          </div>
        </div>
        
        <div className="flex flex-col gap-1.5 p-4 relative z-10">
          <h3 className="text-on-surface text-base font-medium leading-snug line-clamp-2">{product.name}</h3>
          <p className="text-primary text-lg font-semibold mt-1">
            {product.price > 0 ? formatPrice(product.price) : 'Hubungi Kami'}
          </p>
        </div>
      </div>
    </Link>
  );
}

function Pagination({ page, totalPages, onPageChange }: { page: number; totalPages: number; onPageChange: (p: number) => void }) {
  const pages: (number | '...')[] = [];
  
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (page > 3) pages.push('...');
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i);
    if (page < totalPages - 2) pages.push('...');
    pages.push(totalPages);
  }

  return (
    <div className="flex items-center justify-center gap-2 py-8">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="w-10 h-10 flex items-center justify-center rounded-xl bg-surface-container text-on-surface-variant hover:bg-surface-container-high disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        aria-label="Halaman sebelumnya"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
      </button>

      {pages.map((p, i) => (
        p === '...' ? (
          <span key={`dot-${i}`} className="w-10 h-10 flex items-center justify-center text-on-surface-variant select-none">…</span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p as number)}
            aria-label={`Halaman ${p}`}
            aria-current={page === p ? 'page' : undefined}
            className={`w-10 h-10 flex items-center justify-center rounded-xl font-semibold text-sm transition-colors ${
              page === p
                ? 'bg-primary text-on-primary'
                : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
            }`}
          >
            {p}
          </button>
        )
      ))}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className="w-10 h-10 flex items-center justify-center rounded-xl bg-surface-container text-on-surface-variant hover:bg-surface-container-high disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        aria-label="Halaman berikutnya"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
      </button>
    </div>
  );
}

export function CatalogPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const query = searchParams.get('q') || '';
  const category = searchParams.get('category') || 'all';
  const page = parseInt(searchParams.get('page') || '1', 10);

  const [inputValue, setInputValue] = useState(query);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [catsLoading, setCatsLoading] = useState(true);

  const updateURL = useCallback((params: { q?: string; category?: string; page?: number }) => {
    const current = new URLSearchParams(searchParams.toString());
    if (params.q !== undefined) { params.q ? current.set('q', params.q) : current.delete('q'); }
    if (params.category !== undefined) { 
      params.category && params.category !== 'all' ? current.set('category', params.category) : current.delete('category'); 
    }
    if (params.page !== undefined) { 
      params.page && params.page > 1 ? current.set('page', String(params.page)) : current.delete('page'); 
    }
    startTransition(() => router.push(`/search?${current.toString()}`));
  }, [router, searchParams]);

  useEffect(() => {
    fetch('/api/categories')
      .then(r => r.json())
      .then(data => { setCategories(data.categories || []); })
      .catch(console.error)
      .finally(() => setCatsLoading(false));
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (category && category !== 'all') params.set('category', category);
    params.set('page', String(page));
    params.set('limit', '24');

    fetch(`/api/products?${params.toString()}`)
      .then(r => r.json())
      .then((data: ProductsResponse) => {
        setProducts(data.items || []);
        setTotal(data.total || 0);
        setTotalPages(data.totalPages || 0);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [query, category, page]);

  useEffect(() => { setInputValue(query); }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateURL({ q: inputValue.trim(), page: 1 });
  };

  const handleCategoryChange = (catId: string) => {
    updateURL({ category: catId, page: 1 });
  };

  const handlePageChange = (p: number) => {
    updateURL({ page: p });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <Header title="Katalog Produk" />

      <main className="w-full max-w-7xl mx-auto px-4 py-8 flex flex-col gap-6">
        
        {/* Search Form */}
        <form onSubmit={handleSearch} className="w-full flex gap-3">
          <div className="flex-1 relative">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              name="q"
              id="search-input"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              placeholder="Cari produk iBacks..."
              className="w-full bg-surface-container text-on-surface border border-surface-variant/30 rounded-2xl pl-12 pr-12 py-4 outline-none focus:border-primary transition-colors text-base"
            />
            {inputValue && (
              <button 
                type="button" 
                onClick={() => { setInputValue(''); updateURL({ q: '', page: 1 }); }} 
                className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors"
                aria-label="Hapus pencarian"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            )}
          </div>
          <button id="search-submit" type="submit" className="px-8 py-4 rounded-2xl bg-primary text-on-primary font-semibold hover:bg-primary/90 transition-colors shrink-0">
            Cari
          </button>
        </form>

        {/* Category Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4" style={{ scrollbarWidth: 'none' }}>
          <button
            id="cat-all"
            onClick={() => handleCategoryChange('all')}
            className={`flex-none px-5 py-2.5 rounded-full text-sm font-semibold transition-all whitespace-nowrap border ${
              category === 'all'
                ? 'bg-primary text-on-primary border-primary shadow-lg shadow-primary/20'
                : 'bg-surface-container text-on-surface-variant border-surface-variant/20 hover:bg-surface-container-high'
            }`}
          >
            Semua {!loading && total > 0 && <span className="opacity-70">({total.toLocaleString('id-ID')})</span>}
          </button>

          {catsLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex-none h-10 w-28 rounded-full bg-surface-container animate-pulse" />
            ))
          ) : (
            categories.map(cat => (
              <button
                key={cat.id}
                id={`cat-${cat.id}`}
                onClick={() => handleCategoryChange(String(cat.id))}
                className={`flex-none px-5 py-2.5 rounded-full text-sm font-semibold transition-all whitespace-nowrap border ${
                  category === String(cat.id)
                    ? 'bg-primary text-on-primary border-primary shadow-lg shadow-primary/20'
                    : 'bg-surface-container text-on-surface-variant border-surface-variant/20 hover:bg-surface-container-high'
                }`}
              >
                {cat.name} <span className="opacity-60">({cat.count})</span>
              </button>
            ))
          )}
        </div>

        {/* Results summary */}
        <div className="flex items-center justify-between min-h-[24px]">
          <p className="text-on-surface-variant text-sm">
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <span className="w-4 h-4 border border-primary border-t-transparent rounded-full animate-spin inline-block" />
                Memuat produk...
              </span>
            ) : (
              <>
                {query && <><span className="text-on-surface font-medium">&ldquo;{query}&rdquo;</span> — </>}
                <span className="font-medium text-on-surface">{total.toLocaleString('id-ID')}</span> produk ditemukan
                {totalPages > 1 && ` · Halaman ${page} dari ${totalPages}`}
              </>
            )}
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-5">
          {loading ? (
            Array.from({ length: 24 }).map((_, i) => <ProductCardSkeleton key={i} />)
          ) : products.length > 0 ? (
            products.map(product => <ProductCard key={product.id} product={product} />)
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-20 gap-4 text-on-surface-variant">
              <svg className="w-16 h-16 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-lg font-medium">Tidak ada produk ditemukan</p>
              <p className="text-sm">Coba ubah kata kunci atau filter kategori</p>
              {(query || category !== 'all') && (
                <button 
                  onClick={() => updateURL({ q: '', category: 'all', page: 1 })}
                  className="mt-2 px-6 py-2.5 rounded-full bg-surface-container text-on-surface text-sm font-medium hover:bg-surface-container-high transition-colors"
                >
                  Reset Filter
                </button>
              )}
            </div>
          )}
        </div>

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
        )}
      </main>
    </div>
  );
}
