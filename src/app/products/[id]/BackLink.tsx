"use client";

import { useRouter } from 'next/navigation';

interface BackLinkProps {
  label?: string;
}

export function BackLink({ label = 'Kembali' }: BackLinkProps) {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.back()}
      className="inline-flex items-center gap-2 text-xs md:text-sm font-semibold text-on-surface-variant hover:text-on-surface transition-colors"
      aria-label="Kembali ke halaman sebelumnya"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
      {label}
    </button>
  );
}
