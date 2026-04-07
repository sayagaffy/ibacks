# Workflow: Build E-commerce Page
Deskripsi: Alur kerja untuk merakit halaman e-commerce Ibacks dari desain ke kode yang terhubung dengan Jubelio.

1. **Analisis Konteks:** Baca deskripsi halaman yang diminta pengguna dan patuhi aturan di `@.agents/rules/ibacks-core.md`.
2. **Scaffold Komponen UI:** Buat UI di `/src/components/ui/` menggunakan Tailwind CSS (Dark mode).
3. **Integrasi Data (Jubelio API):** Panggil skill `jubelio-api-sync` untuk menyambungkan komponen UI dengan adaptor Jubelio.
// turbo
4. **Verifikasi:** Jalankan server lokal (`bun run dev`) dan gunakan Browser Subagent untuk menavigasi ke halaman tersebut, pastikan tidak ada error, lalu ambil screenshot sebagai bukti.