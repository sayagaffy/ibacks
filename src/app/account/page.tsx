"use client";

import React, { useEffect } from 'react';
import { Header } from '@/components/ui/Header';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';

export default function AccountPage() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    // Redirect if not logged in
    if (!isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated || !user) return null;

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header title="Akun Saya" />

      <main className="w-full max-w-3xl mx-auto px-4 py-8 flex flex-col gap-8">
        <div className="glass-elevated p-8 rounded-3xl border surface-border flex flex-col md:flex-row gap-6 items-center md:items-start text-center md:text-left">
          <div className="w-24 h-24 rounded-full bg-linear-to-tr from-primary to-emerald-400 flex items-center justify-center text-3xl font-bold text-white ambient-shadow">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex flex-col gap-1 flex-1">
            <h2 className="text-2xl font-bold text-on-surface">{user.name}</h2>
            <p className="text-on-surface-variant">{user.email}</p>
            <p className="text-xs text-primary font-bold tracking-widest uppercase mt-2">Premium Member</p>
          </div>
          <button 
            onClick={handleLogout}
            className="px-6 py-2 rounded-full border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors font-medium text-sm"
          >
            Keluar Akun
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-surface-container-low p-6 rounded-2xl border surface-border">
            <h3 className="text-lg font-bold text-on-surface mb-2">Riwayat Pesanan</h3>
            <p className="text-on-surface-variant text-sm">Anda belum memiliki riwayat pembelian produk iBacks.</p>
          </div>
          <div className="bg-surface-container-low p-6 rounded-2xl border surface-border">
            <h3 className="text-lg font-bold text-on-surface mb-2">Alamat Pengiriman</h3>
            <p className="text-on-surface-variant text-sm mb-4">Tambahkan alamat utama untuk checkout lebih cepat.</p>
            <Button variant="outline" className="w-full py-2">Tambah Alamat</Button>
          </div>
          <div className="bg-surface-container-low p-6 rounded-2xl border surface-border">
            <h3 className="text-lg font-bold text-on-surface mb-2">Sinkronisasi Jubelio</h3>
            <p className="text-on-surface-variant text-sm">Nomor Reference: {user.id === 'dummy123' ? 'Tidak tertaut' : user.id}</p>
          </div>
        </div>
      </main>
    </div>
  );
}
