"use client";

import React, { useState } from 'react';
import { Header } from '@/components/ui/Header';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/authStore';
import Link from 'next/link';

export default function LoginPage() {
  const login = useAuthStore(state => state.login);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Stub integration to /api/auth/login later
      // Simulasi bypass login untuk saat ini
      setTimeout(() => {
        if(email && password) {
          login({ id: 'dummy123', name: 'Premium User', email });
          window.location.href = '/account';
        } else {
          setError('Email dan Password wajib diisi.');
          setLoading(false);
        }
      }, 1000);
    } catch (err) {
      setError('Terjadi kesalahan pada server.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header title="Masuk" />

      <main className="flex-1 w-full max-w-lg mx-auto p-6 flex flex-col justify-center">
        <div className="glass-elevated p-8 rounded-4xl surface-border border flex flex-col gap-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold bg-linear-to-r from-white to-neutral-400 bg-clip-text text-transparent">Selamat Datang Kembali</h1>
            <p className="text-on-surface-variant text-sm mt-2">Masuk ke akun iBacks Anda untuk pengalaman editorial berbelanja yang personal.</p>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant">Email</label>
              <input 
                type="email" 
                className="w-full bg-surface-container border surface-border rounded-xl px-4 py-3 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="email@anda.com"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant">Password</label>
              <input 
                type="password" 
                className="w-full bg-surface-container border surface-border rounded-xl px-4 py-3 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            
            <div className="text-right">
              <span className="text-primary text-xs hover:text-white cursor-pointer font-medium transition-colors">Lupa Password?</span>
            </div>

            <Button variant="primary" type="submit" disabled={loading} className="py-4 mt-2">
              {loading ? 'Memvalidasi...' : 'Masuk Sekarang'}
            </Button>
          </form>

          <div className="text-center mt-2 border-t surface-border pt-6">
            <p className="text-on-surface-variant text-sm flex gap-2 items-center justify-center">
              Belum memiliki akun? <Link href="/register" className="text-primary font-bold hover:text-white transition-colors">Daftar Eksekutif</Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
