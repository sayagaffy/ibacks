"use client";

import React, { useState } from 'react';
import { Header } from '@/components/ui/Header';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function RegisterPage() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Stub: Simulate API call to /api/auth/register
    setTimeout(() => {
      alert("Registrasi sukses! Silakan masuk.");
      window.location.href = '/login';
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header title="Daftar" />

      <main className="flex-1 w-full max-w-lg mx-auto p-6 flex flex-col justify-center">
        <div className="glass-elevated p-8 rounded-4xl surface-border border flex flex-col gap-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white">Buat Akun iBacks</h1>
            <p className="text-on-surface-variant text-sm mt-2">Bergabung dengan ekosistem kami untuk memantau garansi dan pembelian instan.</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant">Nama Lengkap</label>
              <input 
                type="text" 
                required
                className="w-full bg-surface-container border surface-border rounded-xl px-4 py-3 text-on-surface focus:border-primary outline-none transition-all"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>
            
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant">Nomor Whatsapp</label>
              <input 
                type="tel" 
                required
                className="w-full bg-surface-container border surface-border rounded-xl px-4 py-3 text-on-surface focus:border-primary outline-none transition-all"
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant">Email Pribadi</label>
              <input 
                type="email" 
                required
                className="w-full bg-surface-container border surface-border rounded-xl px-4 py-3 text-on-surface focus:border-primary outline-none transition-all"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant">Katasandi</label>
              <input 
                type="password" 
                required
                minLength={6}
                className="w-full bg-surface-container border surface-border rounded-xl px-4 py-3 text-on-surface focus:border-primary outline-none transition-all"
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
              />
            </div>

            <Button variant="primary" type="submit" disabled={loading} className="py-4 mt-4">
              {loading ? 'Memproses Pendaftaran...' : 'Daftar Sebagai Member'}
            </Button>
          </form>

          <div className="text-center mt-2 border-t surface-border pt-6">
            <p className="text-on-surface-variant text-sm flex gap-2 items-center justify-center">
              Sudah ada akun? <Link href="/login" className="text-primary font-bold hover:text-white transition-colors">Akses Masuk</Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
