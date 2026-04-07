import { Header } from '@/components/ui/Header';
import { ProductCard } from '@/components/ui/ProductCard';
import { jubelio } from '@/lib/jubelio-adapter/client';
import Link from 'next/link';

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const query = searchParams.q || '';
  let products: any[] = [];

  try {
    const response = await jubelio.get<any>(`/inventory/items/?q=${encodeURIComponent(query)}`);
    products = response?.data || [];
  } catch (err) {
    console.error("Search fetch failed", err);
  }

  // Backup data for demonstration if empty or API unconfigured
  if (products.length === 0) {
    products = [
      {
        item_id: 'mock-1',
        item_name: `Hasil untuk "${query}" (Demonstrasi)`,
        price: 150000,
        image_url: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?q=80&w=600'
      }
    ];
  }

  return (
    <div className="min-h-screen bg-background">
      <Header title="Pencarian" />

      <main className="w-full max-w-5xl mx-auto px-4 py-8 flex flex-col gap-8">
        <form className="w-full flex gap-2">
          <input 
            type="text" 
            name="q" 
            defaultValue={query}
            placeholder="Cari produk iBacks..." 
            className="flex-1 bg-surface-container-low text-on-surface border border-surface-variant/30 rounded-2xl px-6 py-4 outline-none focus:border-primary transition-colors"
          />
          <button type="submit" className="glass-elevated px-8 rounded-2xl font-semibold text-primary">
            Cari
          </button>
        </form>

        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-bold text-on-surface">Hasil Pencarian: {query}</h2>
          <p className="text-on-surface-variant">Menemukan {products.length} produk.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((item: any) => (
            <Link key={item.item_id} href={`/products/${item.item_id}`}>
              <ProductCard
                name={item.item_name}
                price={`Rp ${item.price?.toLocaleString('id-ID')}`}
                imageSrc={item.image_url}
              />
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
