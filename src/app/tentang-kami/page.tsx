import React from 'react';
import { Header } from '@/components/ui/Header';
import Link from 'next/link';

export default function TentangKamiPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header title="Tentang Kami" />
      
      <main className="flex-1 w-full flex flex-col items-center justify-center p-6 mt-16">
        <div className="w-full max-w-4xl mx-auto glass-elevated border surface-border rounded-4xl p-12 text-center flex flex-col items-center gap-6">
          <div className="w-20 h-20 rounded-2xl bg-linear-to-tr from-primary/30 to-purple-500/30 flex items-center justify-center mb-4">
            <svg className="w-10 h-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight">Tentang iBacks</h1>
          <p className="text-on-surface-variant max-w-xl text-lg">
            Kami adalah agregator esensi digital. Desain editorial kami bersinggungan langsung dengan ketangguhan perangkat keras murni.
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
