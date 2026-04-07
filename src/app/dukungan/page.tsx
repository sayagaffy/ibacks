import React from 'react';
import { Header } from '@/components/ui/Header';
import Link from 'next/link';

export default function DukunganPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header title="Dukungan" />
      
      <main className="flex-1 w-full flex flex-col items-center justify-center p-6 mt-16">
        <div className="w-full max-w-4xl mx-auto glass-elevated border surface-border rounded-4xl p-12 text-center flex flex-col items-center gap-6">
          <div className="w-20 h-20 rounded-2xl bg-linear-to-tr from-primary/30 to-orange-500/30 flex items-center justify-center mb-4">
            <svg className="w-10 h-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight">Klaim Garansi & Dukungan</h1>
          <p className="text-on-surface-variant max-w-xl text-lg">
            Ketangguhan yang tidak perlu Anda khawatirkan. Temukan panduan pendaftaran garansi dan pusat bantuan resmi kami disini.
          </p>
          <p className="text-primary mt-4 font-mono text-sm">(Pusat Konten Sedang Dalam Pengembangan)</p>
          
          <Link href="/" className="mt-8 px-6 py-3 rounded-full bg-surface-container-high hover:bg-surface-container-highest transition-colors border surface-border text-on-surface font-semibold text-sm">
            Tanya Kami di WhatsApp
          </Link>
        </div>
      </main>
    </div>
  );
}
