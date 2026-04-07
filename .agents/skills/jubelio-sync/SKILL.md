---
name: jubelio-api-sync
description: Skill untuk mengambil data katalog produk dan harga promo dari Jubelio WMS API. Gunakan skill ini setiap kali membuat halaman yang menampilkan produk atau memproses checkout.
---

# Jubelio API Integration Skill

> **Persona Override**: Saat menggunakan `SKILL` ini dan menampilkan datanya ke layar, pastikan Anda bertindak sebagai **Top Level Frontend & UI/UX Expert 2026**. Data dari Jubelio tidak boleh hanya "ditampilkan", melainkan harus disajikan dengan prinsip *High-End Editorial*, jarak presisi, asimetris elegan, dan mengikuti ketat pedoman rekayasa performa UI tingkat tinggi.

## Authentication
- Selalu gunakan endpoint `POST https://api2.jubelio.com/login`.
- Gunakan variabel `JUBELIO_EMAIL` dan `JUBELIO_PASSWORD` dari file `.env`. Simpan Access Token secara aman.

## Data Fetching Rules
- **Daftar Produk:** Gunakan endpoint `GET /inventory/items/` untuk katalog utama.
- **Detail Produk:** Gunakan endpoint `GET /inventory/items/{id}`.
- **Promo/Diskon:** Gunakan endpoint `GET /inventory/promotions/` untuk mencocokkan harga coret.
- Selalu buat antarmuka TypeScript (Interfaces) yang ketat untuk respons dari Jubelio. **JANGAN PERNAH me-mock database/API**, gunakan implementasi nyata.