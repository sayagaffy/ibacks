"use client";

import { Header } from '@/components/ui/Header';
import { Button } from '@/components/ui/Button';
import { Accordion } from '@/components/ui/Accordion';
import { ProductCard } from '@/components/ui/ProductCard';
import { AddToCartButton } from '@/components/ui/AddToCartButton';

export default function Home() {
  return (
    <div className="min-h-screen bg-surface pb-32">
      <Header title="ibacks" cartItemCount={2} />

      <main className="max-w-screen-md mx-auto p-4 flex flex-col gap-8">
        <section>
          <h2 className="text-xl font-bold mb-4">Buttons</h2>
          <div className="flex flex-wrap gap-4">
            <Button variant="primary">Primary Button</Button>
            <Button variant="secondary">Secondary Button</Button>
            <Button variant="outline">Outline Button</Button>
            <Button variant="ghost">Ghost Button</Button>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-4">Accordion</h2>
          <div className="bg-surface-container-lowest rounded-md p-4">
            <Accordion title="Spesifikasi">
              <p>Ini adalah spesifikasi produk yang sangat detail.</p>
            </Accordion>
            <Accordion title="Deskripsi Produk" defaultOpen>
              <p>Produk ini sangat bagus dan terbuat dari bahan berkualitas tinggi.</p>
            </Accordion>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-4">Product Card</h2>
          <div className="grid grid-cols-2 gap-4">
            <ProductCard
              name="iBacks Premium Case"
              price="Rp 299.000"
              imageSrc="https://via.placeholder.com/150"
            />
          </div>
        </section>
      </main>

      <AddToCartButton
        price="Rp 299.000"
        onAddToCart={() => console.log('Added')}
      />
    </div>
  );
}
