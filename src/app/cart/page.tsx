"use client";

import { useCartStore } from "@/store/cartStore";
import { Header } from "@/components/ui/Header";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";

export default function CartPage() {
  const { items, removeItem, updateQuantity } = useCartStore();
  const [isProcessing, setIsProcessing] = useState(false);

  const totalAmount = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  const handleCheckout = async () => {
    setIsProcessing(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
      const data = await res.json();

      if (data.invoiceUrl) {
        window.location.assign(data.invoiceUrl);
      } else {
        alert("Gagal memproses pembayaran. Cek koneksi Anda.");
        setIsProcessing(false);
      }
    } catch (e) {
      console.error(e);
      alert("Terjadi kesalahan.");
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header title="Keranjang Belanja" />
        <div className="flex flex-col items-center justify-center pt-32 px-4 text-center">
          <div className="w-24 h-24 bg-surface-container rounded-full flex items-center justify-center mb-6">
            <svg
              className="w-10 h-10 text-on-surface-variant"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold mb-2">Keranjang Anda Kosong</h2>
          <p className="text-on-surface-variant mb-8 max-w-sm">
            Temukan produk teknologi pelindung inovatif dari iBacks untuk gadget
            Anda.
          </p>
          <Link href="/search">
            <Button variant="primary">Mulai Belanja</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-32">
      <Header title="Keranjang Belanja" />

      <main className="max-w-3xl mx-auto px-4 mt-8 flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex gap-4 p-4 bg-surface-container border surface-border rounded-2xl items-center relative group"
            >
              <div className="w-20 h-20 bg-surface-container-high rounded-xl flex-shrink-0 overflow-hidden relative">
                <Image
                  src={item.image}
                  alt={`Foto ${item.name}`}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>

              <div className="flex-1 flex flex-col">
                <h3 className="font-semibold text-sm line-clamp-2 pr-8">
                  {item.name}
                </h3>
                <p className="text-primary font-bold mt-1 text-sm">
                  Rp {item.price.toLocaleString("id-ID")}
                </p>

                <div className="flex items-center gap-3 mt-3">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="w-7 h-7 rounded-full bg-surface-container-high border surface-border flex items-center justify-center text-on-surface hover:text-primary transition-colors"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20 12H4"
                      />
                    </svg>
                  </button>
                  <span className="text-sm font-semibold w-4 text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-7 h-7 rounded-full bg-surface-container-high border surface-border flex items-center justify-center text-on-surface hover:text-primary transition-colors"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <button
                onClick={() => removeItem(item.id)}
                className="absolute top-4 right-4 p-2 text-on-surface-variant hover:text-red-500 hover:bg-red-500/10 rounded-full transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>

        <div className="mt-4 p-6 bg-surface-container rounded-3xl border surface-border flex flex-col gap-4">
          <h3 className="font-bold text-lg border-b surface-border pb-3">
            Ringkasan Belanja
          </h3>
          <div className="flex justify-between text-sm">
            <span className="text-on-surface-variant">
              Total Harga ({items.length} Barang)
            </span>
            <span className="font-semibold">
              Rp {totalAmount.toLocaleString("id-ID")}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-on-surface-variant">Total Diskon</span>
            <span className="font-semibold text-green-500">-</span>
          </div>
          <div className="flex justify-between border-t surface-border pt-4 mt-2">
            <span className="font-bold">Total Tagihan</span>
            <span className="font-bold text-xl text-primary">
              Rp {totalAmount.toLocaleString("id-ID")}
            </span>
          </div>

          <Button
            className="w-full mt-4"
            variant="primary"
            onClick={handleCheckout}
            disabled={isProcessing}
          >
            {isProcessing ? "Memproses..." : "Beli Sekarang"}
          </Button>
        </div>
      </main>
    </div>
  );
}
