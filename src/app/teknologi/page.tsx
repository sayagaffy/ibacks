import React from 'react';
import { Header } from '@/components/ui/Header';
import Link from 'next/link';

export default function TeknologiPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header title="Teknologi" />
      
      <main className="flex-1 w-full flex flex-col items-center justify-center p-6 mt-16">
        <div className="w-full max-w-4xl mx-auto glass-elevated border surface-border rounded-4xl p-12 text-center flex flex-col items-center gap-6">
          <div className="w-20 h-20 rounded-2xl bg-linear-to-tr from-primary/30 to-blue-500/30 flex items-center justify-center mb-4">
            <svg className="w-10 h-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight">Evolusi Teknik</h1>
          <p className="text-on-surface-variant max-w-xl text-lg">
            Mengupas tuntas inovasi di balik material hibrida industri dan sistem pendingin arsitektur termal GaN milik iBacks.
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
