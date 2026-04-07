import { Header } from '@/components/ui/Header';
import { Accordion } from '@/components/ui/Accordion';
import { AddToCartButton } from '@/components/ui/AddToCartButton';
import { jubelio } from '@/lib/jubelio-adapter/client';

export const revalidate = 3600; // 1 hour caching per detail item

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  let product: any = null;
  
  try {
    // Fetch product detail from Jubelio using adapter
    const response = await jubelio.get<any>(`/inventory/items/${params.id}`);
    product = response?.data;
  } catch (err) {
    console.error("Failed to fetch product from Jubelio", err);
  }

  // Backup mock for demonstration if API isn't live yet
  const item = product || {
    item_id: params.id,
    item_name: "iBacks Precision Glass Elite 3D",
    item_group_name: "Essential Screen Protector",
    price: 350000,
    description: "Pelindung layar ultra tipis generasi terbaru dengan transmisi optik 99%. Memberikan sensasi sentuh halus seakan tidak memakai pelindung.",
    image_url: "https://images.unsplash.com/photo-1558562805-4bf628073aef?q=80&w=1200",
  };

  return (
    <div className="min-h-screen bg-background pb-36 flex flex-col">
      <Header title="Detail Produk" />

      <main className="w-full max-w-5xl mx-auto flex flex-col md:flex-row gap-8 lg:gap-16 p-4 mt-4">
        
        {/* Left Side: Product Image Showcase */}
        <div className="w-full md:w-1/2 flex flex-col gap-4">
          <div className="bg-surface-container-low rounded-4xl aspect-4/5 md:aspect-square flex justify-center items-center overflow-hidden ambient-shadow">
            <img 
              src={item.image_url} 
              alt={item.item_name} 
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-[1.03]" 
            />
          </div>
        </div>

        {/* Right Side: Product Details & Context */}
        <div className="w-full md:w-1/2 flex flex-col pt-4 md:pt-8 gap-6">
          <div className="flex flex-col gap-2 border-b surface-border pb-6">
            <span className="text-sm font-bold tracking-[0.2em] text-primary uppercase">
              {item.item_group_name}
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold text-on-surface leading-tight">
              {item.item_name}
            </h1>
            <p className="text-on-surface-variant text-base leading-relaxed mt-2">
              {item.description}
            </p>
          </div>

          <div className="flex flex-col gap-0 mt-4">
            <Accordion title="Komposisi & Material" defaultOpen>
              <p className="leading-relaxed">Pemrosesan Asimetris 5-Lapis, Kaca Safir Sintetis ringan, Tahan Benturan dan Goresan (Skala 9H+).</p>
            </Accordion>
            <Accordion title="Cara Instalasi">
              <ol className="list-decimal pl-4 flex flex-col gap-2">
                <li>Bersihkan layar dari debu menggunakan tisu basah yang disediakan.</li>
                <li>Gunakan stiker debu untuk kotoran mikro.</li>
                <li>Selaraskan dari ujung atas, biarkan silikon otomatis menyebar.</li>
              </ol>
            </Accordion>
            <Accordion title="Garansi">
              <p>Pengembalian 30 Hari & Klaim Kecacatan Produksi 1 Tahun.</p>
            </Accordion>
          </div>
        </div>
      </main>

      {/* Persistent Bottom Bar Action */}
      <AddToCartButton 
        price={`Rp ${item.price.toLocaleString('id-ID')}`}
        item={{
          id: item.item_id,
          name: item.item_name,
          rawPrice: item.price,
          image: item.image_url
        }}
      />
    </div>
  );
}
