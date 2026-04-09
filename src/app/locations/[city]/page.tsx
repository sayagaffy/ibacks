import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/ui/Header";
import { JsonLd } from "@/components/ui/JsonLd";
import { SITE_DOMAIN, SITE_NAME, toAbsoluteUrl } from "@/lib/seo/site";
import { getWarehousesByCity } from "@/lib/geo-db/queries";

const toDisplayName = (slug: string) =>
  slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

const CITY_CONFIG = {
  jakarta: {
    name: "Jakarta",
    neighborhoods: [
      "Jakarta Pusat",
      "Jakarta Selatan",
      "Jakarta Barat",
      "Jakarta Utara",
      "Jakarta Timur",
    ],
    fallbackWarehouse: {
      id: 0,
      name: "Gudang Jakarta Pusat",
      address: "Jl. MH Thamrin No. 1, Jakarta",
      city: "Jakarta",
      serviceRadiusKm: 20,
      openingHours: "Senin-Sabtu 09:00-18:00",
      lat: -6.1754,
      lng: 106.8272,
    },
  },
  surabaya: {
    name: "Surabaya",
    neighborhoods: ["Tegalsari", "Wonokromo", "Gubeng", "Rungkut"],
    fallbackWarehouse: {
      id: 0,
      name: "Gudang Surabaya",
      address: null,
      city: "Surabaya",
      serviceRadiusKm: 0,
      openingHours: "Senin-Sabtu 09:00-18:00",
      lat: -7.2575,
      lng: 112.7521,
    },
  },
  bandung: {
    name: "Bandung",
    neighborhoods: ["Dago", "Setiabudi", "Cicendo", "Lengkong"],
    fallbackWarehouse: {
      id: 0,
      name: "Gudang Bandung",
      address: null,
      city: "Bandung",
      serviceRadiusKm: 0,
      openingHours: "Senin-Sabtu 09:00-18:00",
      lat: -6.9175,
      lng: 107.6191,
    },
  },
  medan: {
    name: "Medan",
    neighborhoods: ["Medan Baru", "Medan Kota", "Medan Selayang"],
    fallbackWarehouse: {
      id: 0,
      name: "Gudang Medan",
      address: null,
      city: "Medan",
      serviceRadiusKm: 0,
      openingHours: "Senin-Sabtu 09:00-18:00",
      lat: 3.5952,
      lng: 98.6722,
    },
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const cityConfig =
    CITY_CONFIG[resolvedParams.city as keyof typeof CITY_CONFIG] ?? null;
  const cityName = cityConfig
    ? cityConfig.name
    : toDisplayName(resolvedParams.city);
  const title = `Lokasi ${cityName}`;
  const description = `Same Day Delivery available in ${cityName} dan Fast Pickup at our ${cityName} warehouse.`;

  return {
    title,
    description,
    alternates: { canonical: `/locations/${resolvedParams.city}` },
    openGraph: {
      title,
      description,
      url: toAbsoluteUrl(`/locations/${resolvedParams.city}`),
      type: "website",
    },
  };
}

export default async function LocationPage({
  params,
}: {
  params: Promise<{ city: string }>;
}) {
  const resolvedParams = await params;
  const cityConfig =
    CITY_CONFIG[resolvedParams.city as keyof typeof CITY_CONFIG] ?? null;
  if (!cityConfig) {
    notFound();
  }

  const cityName = cityConfig.name;
  const warehouses = await getWarehousesByCity(cityName);
  const effectiveWarehouses =
    warehouses.length > 0 ? warehouses : [cityConfig.fallbackWarehouse];

  const primary = effectiveWarehouses[0];
  const description = `Same Day Delivery available in ${cityName}. Fast Pickup at our ${cityName} warehouse untuk pengambilan cepat dan layanan harian.`;
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: `${SITE_NAME} ${cityName}`,
    url: `${SITE_DOMAIN}/locations/${resolvedParams.city}`,
    description,
    branchOf: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_DOMAIN,
    },
    areaServed: {
      "@type": "City",
      name: cityName,
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: cityName,
      addressCountry: "ID",
      streetAddress: primary.address || undefined,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: primary.lat,
      longitude: primary.lng,
    },
    openingHours: primary.openingHours ? [primary.openingHours] : undefined,
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <Header title={`Lokasi ${cityName}`} />

      <main className="w-full max-w-5xl mx-auto px-4 py-8 flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl md:text-3xl font-bold text-on-surface">
            Gudang & Layanan di {cityName}
          </h1>
          <p className="text-sm md:text-base text-on-surface-variant">
            Same Day Delivery available in {cityName}. Fast Pickup at our{" "}
            {cityName} warehouse untuk pengambilan cepat dan pengiriman harian
            yang lebih efisien.
          </p>
          <p className="text-sm md:text-base text-on-surface-variant">
            Fokus layanan meliputi area{" "}
            {cityConfig.neighborhoods.join(", ")} dan sekitarnya.
          </p>
        </div>

        <section className="grid gap-4">
          {effectiveWarehouses.map((warehouse) => (
            <div
              key={warehouse.id}
              className="rounded-3xl border surface-border bg-surface-container p-6"
            >
              <div className="flex flex-col gap-2">
                <h2 className="text-lg font-semibold text-on-surface">
                  {warehouse.name}
                </h2>
                <p className="text-sm text-on-surface-variant">
                  {warehouse.address || "Alamat gudang sedang kami siapkan."}
                </p>
                <div className="flex flex-wrap gap-2 text-xs text-on-surface-variant">
                  {warehouse.serviceRadiusKm > 0 ? (
                    <span className="px-3 py-1 rounded-full bg-surface-container-high">
                      Radius layanan: {warehouse.serviceRadiusKm} km
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full bg-surface-container-high">
                      Radius layanan sedang dipersiapkan.
                    </span>
                  )}
                  {warehouse.openingHours && (
                    <span className="px-3 py-1 rounded-full bg-surface-container-high">
                      Jam operasional: {warehouse.openingHours}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </section>
      </main>

      <JsonLd data={localBusinessSchema} />
    </div>
  );
}
