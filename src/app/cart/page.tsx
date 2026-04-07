"use client";

import React, { useState } from 'react';
import { useCartStore } from '@/store/cartStore';
import { Header } from '@/components/ui/Header';
import { Button } from '@/components/ui/Button';

export default function CartPage() {
  const { items, updateQuantity, removeItem } = useCartStore();
  const [isProcessing, setIsProcessing] = useState(false);

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleCheckout = async () => {
    if (items.length === 0) return;
    setIsProcessing(true);
    
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, amount: subtotal })
      });
      const data = await response.json();
      
      if (data.invoiceUrl) {
        window.location.href = data.invoiceUrl;
      } else {
        alert("Gagal memproses pembayaran. Cek koneksi Anda.");
        setIsProcessing(false);
      }
    } catch(err) {
      console.error(err);
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-32 flex flex-col">
      <Header title="Keranjang Belanja" />

      <main className="w-full max-w-3xl mx-auto px-4 py-8 flex flex-col gap-8">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed surface-border rounded-2xl">
            <h2 className="text-xl font-bold text-on-surface">Keranjang Anda Kosong</h2>
            <p className="text-on-surface-variant mt-2 text-sm max-w-sm mb-6">Mulai eksplorasi produk iBacks, pelindung layar dan casing premium menanti Anda.</p>
            <Button variant="primary" onClick={() => window.location.href = '/'}>Mulai Belanja</Button>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              {items.map(item => (
                <div key={item.id} className="flex gap-4 p-4 rounded-xl bg-surface-container-low border surface-border items-center">
                  <div className="w-20 h-20 bg-surface-container overflow-hidden rounded-lg">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 flex flex-col">
                    <h3 className="text-base font-medium text-on-surface line-clamp-1">{item.name}</h3>
                    <p className="text-primary font-bold mt-1">Rp {item.price.toLocaleString('id-ID')}</p>
                    
                    <div className="flex items-center gap-4 mt-3">
                      <div className="flex items-center gap-3 bg-background rounded-full px-3 py-1 border surface-border">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="text-on-surface-variant hover:text-white transition-colors">−</button>
                        <span className="text-sm font-semibold">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="text-on-surface-variant hover:text-white transition-colors">+</button>
                      </div>
                      <button onClick={() => removeItem(item.id)} className="text-xs text-red-400 font-semibold hover:text-red-300 transition-colors uppercase tracking-widest">
                        Hapus
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="glass-elevated p-6 rounded-2xl flex flex-col gap-4 mt-6">
              <div className="flex justify-between items-center text-on-surface-variant">
                <span>Subtotal</span>
                <span>Rp {subtotal.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between items-center text-on-surface-variant border-b border-surface-variant/30 pb-4">
                <span>Pajak (Termasuk)</span>
                <span>Rp 0</span>
              </div>
              <div className="flex justify-between items-center text-on-surface font-bold text-xl pt-2">
                <span>Total</span>
                <span className="text-primary">Rp {subtotal.toLocaleString('id-ID')}</span>
              </div>
              
              <Button variant="primary" onClick={handleCheckout} disabled={isProcessing} className="w-full mt-4">
                {isProcessing ? 'Memproses Gateway...' : 'Lanjut ke Pembayaran'}
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
