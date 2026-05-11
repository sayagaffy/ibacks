import { Header } from "@/components/ui/Header";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { Suspense } from "react";

export default function CartPage() {
  return (
    <div className="min-h-screen bg-background">
      <Suspense fallback={<div className="h-16" />}>
        <Header title="Keranjang Belanja" />
      </Suspense>
      <main className="max-w-2xl mx-auto px-4 py-12">
        <section className="rounded-3xl border surface-border bg-surface-container p-6 md:p-8 text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-on-surface-variant mb-3">
            Cart Drawer
          </p>
          <h1 className="text-2xl md:text-3xl font-semibold mb-3">
            Keranjang Dibuka Sebagai Slide-Out
          </h1>
          <p className="text-on-surface-variant max-w-xl mx-auto mb-6">
            Untuk menjaga alur belanja tetap mulus, keranjang kini tampil sebagai
            panel samping. Gunakan tombol keranjang di pojok atas untuk melihat
            isi belanjaan Anda kapan pun.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/search">
              <Button variant="secondary">Lanjut Belanja</Button>
            </Link>
            <Link href="/checkout">
              <Button variant="primary">Checkout Sekarang</Button>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
