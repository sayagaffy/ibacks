import type { FaqItem } from "./seo/faq-schema";

export interface SeoContentBlockContent {
  title: string;
  items: FaqItem[];
  intro?: string;
}

export function getHomeSeoContent(): SeoContentBlockContent {
  return {
    title: "Jawaban Cepat Seputar iBacks",
    intro:
      "Ringkasan singkat untuk membantu Anda menemukan aksesoris yang tepat.",
    items: [
      {
        question: "Apa saja kategori utama aksesoris yang tersedia di iBacks?",
        answer:
          "Kami fokus pada aksesoris esensial seperti casing, screen protector, kabel data, adaptor charger, powerbank, dan audio.",
      },
      {
        question:
          "Bagaimana memilih aksesoris yang cocok untuk perangkat saya?",
        answer:
          "Gunakan pencarian berdasarkan tipe perangkat, lalu periksa kecocokan model di deskripsi produk sebelum checkout.",
      },
      {
        question: "Apakah ada produk dengan harga promo?",
        answer:
          "Produk promo ditandai di halaman utama. Anda juga bisa melihat harga coret jika ada diskon aktif.",
      },
      {
        question: "Apakah semua produk ready stock?",
        answer:
          "Ketersediaan stok ditampilkan pada halaman produk dan disinkronkan dari sistem gudang secara berkala.",
      },
    ],
  };
}

export function getCategorySeoContent(
  categoryName: string,
): SeoContentBlockContent {
  return {
    title: `Panduan ${categoryName}`,
    intro: `Informasi ringkas sebelum memilih ${categoryName.toLowerCase()} untuk perangkat Anda.`,
    items: [
      {
        question: `Apa keunggulan ${categoryName.toLowerCase()} di iBacks?`,
        answer: `Koleksi ${categoryName.toLowerCase()} kami dipilih untuk performa, kompatibilitas, dan tampilan yang tetap rapi.`,
      },
      {
        question: `Bagaimana memastikan ${categoryName.toLowerCase()} cocok dengan perangkat saya?`,
        answer:
          "Periksa model perangkat di deskripsi produk dan pastikan sesuai dengan spesifikasi yang tertera.",
      },
      {
        question: "Apakah ada rekomendasi produk terlaris di kategori ini?",
        answer:
          "Produk terlaris biasanya muncul di bagian atas daftar kategori dan sering mendapatkan ulasan positif.",
      },
      {
        question: "Kapan waktu terbaik membeli untuk mendapatkan promo?",
        answer:
          "Promo biasanya muncul di bagian utama situs. Pantau juga penanda harga coret pada produk kategori ini.",
      },
    ],
  };
}

export function getProductSeoContent(
  productName: string,
  categoryName: string,
): SeoContentBlockContent {
  return {
    title: `Tanya Jawab ${productName}`,
    intro: `Pertanyaan umum tentang ${productName} dan kategori ${categoryName.toLowerCase()}.`,
    items: [
      {
        question: `Apakah ${productName} cocok untuk penggunaan harian?`,
        answer: `${productName} dirancang untuk penggunaan rutin dengan fokus pada daya tahan dan kenyamanan.`,
      },
      {
        question: `Bagaimana cara merawat ${productName}?`,
        answer:
          "Gunakan kain lembut untuk membersihkan dan hindari paparan panas ekstrem agar kualitas tetap terjaga.",
      },
      {
        question: `Apa perbedaan ${productName} dengan produk serupa di kategori ${categoryName}?`,
        answer: `${productName} menonjol pada detail finishing dan keseimbangan antara proteksi serta estetika.`,
      },
      {
        question: "Bagaimana memastikan stok tersedia sebelum membeli?",
        answer:
          "Status stok ditampilkan di halaman produk. Jika stok terbatas, kami sarankan checkout secepatnya.",
      },
    ],
  };
}
