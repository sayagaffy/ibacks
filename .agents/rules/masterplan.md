---
trigger: always_on
---

# Masterplan & Rencana Implementasi: Ibacks Headless E-commerce

Dokumen ini adalah **MANDATORY MASTERPLAN** yang harus dirujuk dan diikuti dalam setiap interaksi pengerjaan kode e-commerce Ibacks. Jika Anda baru memulai *chat* atau ditugaskan melanjutkan, periksa status proyek (kode yang sudah ada) lalu cocokkan dengan tahapan di bawah ini, dan kerjakan langkah berikutnya yang belum diselesaikan.

## Visi Utama
Proyek ini membangun antarmuka e-commerce "High-Tech Editorial" untuk Ibacks (berbasis Next.js App Router).
- **Backend Core (80%)**: Memanfaatkan **Jubelio WMS API** sebagai *Source of Truth* utama (katalog, inventaris, sinkronisasi promo sistem berjalan).
- **CMS & Auth (20%)**: Memanfaatkan **Sanity (Free Tier)** untuk menampung spanduk pahlawan (hero banner), UI promo eksklusif platform non-Jubelio, dan manajemen/otentikasi pelanggan (*end-user auth*).
- **Payment Gateway**: Integrasi tunggal dengan **Xendit**.

## Aturan Eksekusi Pembangunan
Pembangunan UI harus mematuhi prinsip **Atomic Design**, batasan aturan ukuran file dan gaya tulisan yang tertera di `ibacks-role.md`, serta menggunakan `tailwind.config.ts` Dark Mode ala sentuhan teknis Ibacks.

---

## Tahap 1: Setup Infrastruktur & Styling
Fokus menyiapkan dasar-dasar agar UI bisa dikerjakan dengan lancar sesuai desain *High-Tech Editorial* (Dark Mode) dari Stitch.
- **Tugas:** Menerapkan tema *Deep space grey/black* di Tailwind. Menyiapkan variabel utilitas bayangan halus (*Ambient Shadows*, *Glassmorphism* blur tokens).
- **Integrasi API Jubelio:** Setup `src/lib/jubelio-adapter/client.ts` untuk memfasilitasi autentikasi stateful ke `POST /login` Jubelio WMS dan mengelola *access token*.

## Tahap 2: Integrasi Sanity Headless CMS (Data 20% & Auth)
Menautkan Next.js dengan proyek Sanity.
- **Tugas:** Inisiasi aplikasi `sanity/` studio untuk admin panel Ibacks.
- **Skema Data:** Membangun *schema* minimalis untuk `heroBanner`, `promoSection`, serta basis tabel `customer` (End-User Credential/Account).
- **Klien Fetcher:** Pembuatan *query builder* di `src/lib/sanity-client.ts`.

## Tahap 3: Scaffold Komponen UI Dasar (Atomic Design)
Merakit komponen UI murni (*stateless/presentational*) di `src/components/ui/` bebas dari *side function* panggilan API eksternal. Wajib mengadopsi aturan `No-Line` (tidak memakai pemisah grid kaku/border solid).
- **Tugas Utama:** Membuat `button`, *card* produk bergaya majalah editorial asimetris, menu bar `glass-navbar`, letakan gambar *lifestyle* `hero-banner`, dan *technical chips* statik.

## Tahap 4: Perakitan Halaman Frontend (Page Assembly)
Menggabungkan data-data murni dari Sanity dan Katalog Jubelio, untuk dipasok ke komponen presentasional.
- **Tugas:**
  - `src/app/page.tsx` (Beranda): Gabungan hasil dari `cms.getHeroBanners()` dan `jubelioAdapter.getProducts()`.
  - `src/app/products/[id]/page.tsx` (Detail Produk): Penguraian JSON produk ke tata letak makro presisi.
  - `src/app/search/page.tsx` (Pencarian Dinamis).

## Tahap 5: Transaksi, Keranjang & Xendit
Menyelesaikan alur keranjang belanja interaktif dan serah terima informasi pembayaran.
- **Tugas:** 
  - Form checkout berbasis *state management* murni di `src/app/checkout/page.tsx`.
  - API Routes khusus sebagai jembatan *billing* Xendit dan sistem log internal.
  - Tampilan struk invoice elegan di `src/app/checkout/success/page.tsx`.

## Tahap 6: Pengguna & Autentikasi Pelanggan (My Account)
Pengelolaan sesi pelanggan Ibacks.
- **Tugas:** Antarmuka masuk dan daftar di `src/app/account/page.tsx`. Semua *authentication flow* dan referensi order pelanggan bermuara ke *dataset* `customer` Sanity CMS yang sudah dirakit pada tahap 2.

## Tahap 7: Modul Ekosistem & Artikel Blog (Minor Ekstra)
- **Tugas:** Halaman placeholder statis untuk profil perusahaan, dukungan, dan navigasi (sudah selesai). Skema Sanity tambahan untuk mengakomodasi penulisan katalog Artikel Blog.

---

# STATUS CHECKPOINT TERAKHIR (Sync: 7 April 2026)
Di sesi sebelumnya, kita telah membangun fondasi Frontend UI secara lengkap dan interaktif:
1. **[SELESAI]** Desain UI, Integrasi Navbar (Produk, Ekosistem, dll) dan *Atomic Components*.
2. **[SELESAI]** Konektor Jubelio (Metode GET) & *State* Troli Belanja Zustand persisten.
3. **[SELESAI]** Pembuatan form statis Login, Registrasi, dan Dasbor Profil Pelanggan.

**YANG HARUS DILANJUTKAN PADA SESI BERIKUTNYA:**
> Mulailah dari sisa **Tahap 5 & Tahap 6** khusus bagian *Back-End Logics*!
1. **Logika Halaman Checkout Berhasil (Tahap 5):** Buat rute halaman yang menyambut pengguna setelah membayar Xendit, dan sinkronkan dengan menembak data Sales Order ke WMS Jubelio agar stok terpotong.
2. **Jalur API Otentikasi Sanity (Tahap 6):** Rakit `/api/auth/register` dan `/api/auth/login` menggunakan Klien Mutasi Sanity agar pengguna bisa menyimpan kredensial ke Sanity dan menyelaraskan nomor WhatsApp/pelanggan mereka ke Kontak Jubelio.
