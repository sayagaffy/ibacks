"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/ui/Header";
import { Button } from "@/components/ui/Button";
import { useCartStore } from "@/store/cartStore";

const inputBase =
  "w-full rounded-2xl border surface-border bg-surface-container px-4 py-3 text-sm text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-primary";

type CheckoutValues = {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  notes: string;
};

const initialValues: CheckoutValues = {
  name: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  notes: "",
};

const validateCheckout = (values: CheckoutValues) => {
  const errors: Partial<Record<keyof CheckoutValues, string>> = {};
  if (!values.name.trim()) errors.name = "Nama lengkap wajib diisi.";
  if (!values.phone.trim()) {
    errors.phone = "Nomor WhatsApp wajib diisi.";
  } else if (!/^[0-9+()\s-]{8,}$/.test(values.phone)) {
    errors.phone = "Nomor WhatsApp tidak valid.";
  }
  if (!values.email.trim()) {
    errors.email = "Email wajib diisi.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = "Format email tidak valid.";
  }
  if (!values.address.trim()) errors.address = "Alamat lengkap wajib diisi.";
  return errors;
};

export default function CheckoutPage() {
  const router = useRouter();
  const { items } = useCartStore();
  const [values, setValues] = useState<CheckoutValues>(initialValues);
  const [touched, setTouched] = useState<Record<keyof CheckoutValues, boolean>>({
    name: false,
    email: false,
    phone: false,
    address: false,
    city: false,
    notes: false,
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const errors = useMemo(() => validateCheckout(values), [values]);
  const totalAmount = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  const markTouched = (field: keyof CheckoutValues) =>
    setTouched((prev) => ({ ...prev, [field]: true }));

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validateCheckout(values);
    setTouched({
      name: true,
      email: true,
      phone: true,
      address: true,
      city: true,
      notes: true,
    });
    if (Object.keys(nextErrors).length > 0) return;

    setIsProcessing(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: totalAmount,
          items,
          customer: values,
        }),
      });
      const data = await res.json();
      if (data.invoiceUrl) {
        window.location.assign(data.invoiceUrl);
      } else {
        alert("Gagal memproses pembayaran. Cek koneksi Anda.");
      }
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan saat checkout.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header title="Checkout" />
        <main className="max-w-2xl mx-auto px-4 py-16 text-center">
          <div className="rounded-3xl border surface-border bg-surface-container p-8">
            <h1 className="text-2xl font-semibold mb-3">
              Keranjang Anda Kosong
            </h1>
            <p className="text-on-surface-variant mb-6">
              Tambahkan produk ke keranjang untuk melanjutkan checkout.
            </p>
            <Link href="/search">
              <Button variant="primary">Mulai Belanja</Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header title="Checkout" />

      <main className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <section className="rounded-3xl border surface-border bg-surface-container p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-on-surface-variant">
                    Guest Checkout
                  </p>
                  <h1 className="text-2xl font-semibold">
                    Checkout Sebagai Tamu
                  </h1>
                </div>
                <Link
                  href="/login"
                  className="text-sm text-primary hover:text-primary-container"
                >
                  Punya akun? Masuk
                </Link>
              </div>
              <p className="text-sm text-on-surface-variant">
                Pembelian paling cepat tanpa membuat akun. Data Anda tetap aman.
              </p>
            </section>

            <section className="rounded-3xl border surface-border bg-surface-container p-6">
              <h2 className="text-lg font-semibold mb-4">Kontak Pembeli</h2>
              <div className="grid gap-4">
                <label className="flex flex-col gap-2 text-sm">
                  <span>Nama Lengkap *</span>
                  <input
                    className={inputBase}
                    value={values.name}
                    onChange={(event) =>
                      setValues((prev) => ({ ...prev, name: event.target.value }))
                    }
                    onBlur={() => markTouched("name")}
                    placeholder="Nama sesuai KTP"
                    aria-invalid={Boolean(touched.name && errors.name)}
                  />
                  {touched.name && errors.name && (
                    <span className="text-xs text-red-400">{errors.name}</span>
                  )}
                </label>
                <label className="flex flex-col gap-2 text-sm">
                  <span>Nomor WhatsApp *</span>
                  <input
                    className={inputBase}
                    value={values.phone}
                    onChange={(event) =>
                      setValues((prev) => ({ ...prev, phone: event.target.value }))
                    }
                    onBlur={() => markTouched("phone")}
                    placeholder="08xxxxxxxx"
                    aria-invalid={Boolean(touched.phone && errors.phone)}
                  />
                  {touched.phone && errors.phone && (
                    <span className="text-xs text-red-400">{errors.phone}</span>
                  )}
                </label>
                <label className="flex flex-col gap-2 text-sm">
                  <span>Email *</span>
                  <input
                    className={inputBase}
                    type="email"
                    value={values.email}
                    onChange={(event) =>
                      setValues((prev) => ({ ...prev, email: event.target.value }))
                    }
                    onBlur={() => markTouched("email")}
                    placeholder="nama@domain.com"
                    aria-invalid={Boolean(touched.email && errors.email)}
                  />
                  {touched.email && errors.email && (
                    <span className="text-xs text-red-400">{errors.email}</span>
                  )}
                </label>
              </div>
            </section>

            <section className="rounded-3xl border surface-border bg-surface-container p-6">
              <h2 className="text-lg font-semibold mb-4">Alamat Pengiriman</h2>
              <div className="grid gap-4">
                <label className="flex flex-col gap-2 text-sm">
                  <span>Alamat Lengkap *</span>
                  <textarea
                    className={`${inputBase} min-h-[110px]`}
                    value={values.address}
                    onChange={(event) =>
                      setValues((prev) => ({ ...prev, address: event.target.value }))
                    }
                    onBlur={() => markTouched("address")}
                    placeholder="Nama jalan, nomor rumah, kecamatan"
                    aria-invalid={Boolean(touched.address && errors.address)}
                  />
                  {touched.address && errors.address && (
                    <span className="text-xs text-red-400">{errors.address}</span>
                  )}
                </label>
                <label className="flex flex-col gap-2 text-sm">
                  <span>Kota / Kabupaten (Opsional)</span>
                  <input
                    className={inputBase}
                    value={values.city}
                    onChange={(event) =>
                      setValues((prev) => ({ ...prev, city: event.target.value }))
                    }
                    onBlur={() => markTouched("city")}
                    placeholder="Contoh: Jakarta Selatan"
                  />
                </label>
                <label className="flex flex-col gap-2 text-sm">
                  <span>Catatan untuk Kurir (Opsional)</span>
                  <textarea
                    className={`${inputBase} min-h-[90px]`}
                    value={values.notes}
                    onChange={(event) =>
                      setValues((prev) => ({ ...prev, notes: event.target.value }))
                    }
                    onBlur={() => markTouched("notes")}
                    placeholder="Contoh: Tolong hubungi sebelum tiba"
                  />
                </label>
              </div>
            </section>

            <section className="rounded-3xl border surface-border bg-surface-container p-6">
              <h2 className="text-lg font-semibold mb-4">Pembayaran Aman</h2>
              <div className="grid gap-3 text-sm text-on-surface-variant">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-surface-container-high">Visa</span>
                  <span className="px-3 py-1 rounded-full bg-surface-container-high">Mastercard</span>
                  <span className="px-3 py-1 rounded-full bg-surface-container-high">QRIS</span>
                  <span className="px-3 py-1 rounded-full bg-surface-container-high">Virtual Account</span>
                </div>
                <p>
                  Pembayaran diproses melalui Xendit. Anda dapat memilih metode
                  pembayaran di halaman aman berikutnya.
                </p>
              </div>
            </section>

            <section className="rounded-3xl border surface-border bg-surface-container p-6">
              <div className="flex flex-col gap-4">
                <Button type="submit" className="w-full" disabled={isProcessing}>
                  {isProcessing ? "Memproses..." : "Bayar Sekarang"}
                </Button>
                <div className="grid gap-2 text-xs text-on-surface-variant">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 11V7a4 4 0 00-8 0v4M5 11h14v8H5z"
                        />
                      </svg>
                    </span>
                    <span>Enkripsi HTTPS 256-bit melindungi data Anda.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </span>
                    <span>Gateway resmi Xendit, sesuai standar PCI DSS.</span>
                  </div>
                </div>
              </div>
            </section>
          </form>

          <aside className="rounded-3xl border surface-border bg-surface-container p-6 h-fit">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Ringkasan Pesanan</h2>
              <button
                type="button"
                onClick={() => router.push("/cart")}
                className="text-xs uppercase tracking-[0.3em] text-primary"
              >
                Edit
              </button>
            </div>
            <div className="flex flex-col gap-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden bg-surface-container-high relative">
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold line-clamp-2">
                      {item.name}
                    </p>
                    <p className="text-xs text-on-surface-variant">
                      {item.quantity} x Rp {item.price.toLocaleString("id-ID")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t surface-border mt-6 pt-4 flex flex-col gap-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-on-surface-variant">Subtotal</span>
                <span className="font-semibold">
                  Rp {totalAmount.toLocaleString("id-ID")}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-on-surface-variant">Pengiriman</span>
                <span className="font-semibold">Dihitung di halaman berikutnya</span>
              </div>
              <div className="flex items-center justify-between text-base font-semibold">
                <span>Total</span>
                <span className="text-primary">
                  Rp {totalAmount.toLocaleString("id-ID")}
                </span>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
