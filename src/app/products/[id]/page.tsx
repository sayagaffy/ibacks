import { getProducts } from '@/lib/product-cache';
import { Header } from '@/components/ui/Header';
import { Accordion } from '@/components/ui/Accordion';
import { ProductDetailClient } from '@/components/ui/ProductDetailClient';

export const revalidate = 3600;

const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1592890288564-76628a30a657?q=80&w=1200&auto=format&fit=crop';

const CATEGORY_NAME_MAP: Record<number, string> = {
  12642: 'Screen Protector',
  5524: 'Casing',
  12644: 'Aksesoris',
  7423: 'Kabel & Charger',
  5521: 'Audio',
  7426: 'Powerbank',
  7413: 'Earphone',
  18940: 'Teknologi',
  7410: 'Gaming',
  12649: 'Lainnya',
};

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const cache = await getProducts();
  const product = cache.products.find((p) => String(p.id) === String(id));

  const displayItem = product
    ? {
        id: product.id,
        name: product.name,
        category: product.categoryId
          ? CATEGORY_NAME_MAP[product.categoryId] || 'Aksesoris'
          : 'Aksesoris',
        price: product.price,
        image: product.thumbnail || PLACEHOLDER_IMAGE,
        description: `Produk ${product.name} dari iBacks. Tersedia dalam ${product.variants?.length || 1} varian.`,
        variants: (product.variants || []).map((v, i) => ({
          id: v.id,
          // Generate a readable display label from SKU suffix or index
          name: `Varian ${i + 1}`,
          sku: v.sku,
          price: v.price || product.price,
          thumbnail: v.thumbnail || null,
        })),
      }
    : {
        id: 0,
        name: 'iBacks Precision Glass Elite 3D',
        category: 'Screen Protector',
        price: 350000,
        image: PLACEHOLDER_IMAGE,
        description: 'Pelindung layar ultra tipis generasi terbaru dengan transmisi optik 99%.',
        variants: [],
      };

  return (
    <div className="min-h-screen bg-background pb-36 flex flex-col">
      <Header title="Detail Produk" />

      <main className="w-full max-w-5xl mx-auto flex flex-col md:flex-row gap-8 lg:gap-16 p-4 mt-4">
        {/* Client component handles interactivity: image switcher, variant picker, add to cart */}
        <ProductDetailClient item={displayItem} placeholderImage={PLACEHOLDER_IMAGE} />
      </main>

      {/* Static accordions stay as Server Component */}
      <div className="w-full max-w-5xl mx-auto px-4 pb-4">
        <Accordion title="Komposisi & Material" defaultOpen>
          <p className="leading-relaxed text-on-surface-variant">
            Pemrosesan Asimetris 5-Lapis, Kaca Safir Sintetis ringan, Tahan Benturan dan Goresan (Skala 9H+).
          </p>
        </Accordion>
        <Accordion title="Cara Instalasi">
          <ol className="list-decimal pl-4 flex flex-col gap-2 text-on-surface-variant">
            <li>Bersihkan layar dari debu menggunakan tisu basah yang disediakan.</li>
            <li>Gunakan stiker debu untuk kotoran mikro.</li>
            <li>Selaraskan dari ujung atas, biarkan silikon otomatis menyebar.</li>
          </ol>
        </Accordion>
        <Accordion title="Garansi">
          <p className="text-on-surface-variant">
            Pengembalian 30 Hari &amp; Klaim Kecacatan Produksi 1 Tahun.
          </p>
        </Accordion>
      </div>
    </div>
  );
}
