import React from 'react';
import { Header } from '@/components/ui/Header';
import Link from 'next/link';

export default function EkosistemPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header title="Ekosistem ibacks" />
      
      <main className="flex-1 w-full flex flex-col items-center justify-center p-6 mt-16">
        <div className="w-full max-w-4xl mx-auto glass-elevated border surface-border rounded-4xl p-12 text-center flex flex-col items-center gap-6">
          <div className="w-20 h-20 rounded-2xl bg-linear-to-tr from-primary/30 to-emerald-500/30 flex items-center justify-center mb-4">
            <svg className="w-10 h-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight">Ekosistem Keterhubungan</h1>
          <p className="text-on-surface-variant max-w-xl text-lg">
            Sinergi tak terlihat antara Casing, Kabel, Powerbank, dan Audio dalam meredefinisi ketahanan dan produktivitas perangkat digital Anda.
          </p>
          <p className="text-primary mt-4 font-mono text-sm">(Pusat Konten Sedang Dalam Pengembangan)</p>
          
          <Link href="/" className="mt-8 px-6 py-3 rounded-full bg-surface-container-high hover:bg-surface-container-highest transition-colors border surface-border text-on-surface font-semibold text-sm">
            Kembali ke Beranda
          </Link>
        </div>
      </main>
    </div>
  );
}
