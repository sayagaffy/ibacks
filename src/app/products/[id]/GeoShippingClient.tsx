"use client";

import { useEffect, useState } from "react";
import {
  fetchIpFallbackWarehouse,
  fetchNearestWarehouse,
  type WarehouseMatch,
} from "@/lib/geo-client";

interface GeoState {
  loading: boolean;
  error: string | null;
  warehouse: WarehouseMatch | null;
}

export function GeoShippingClient() {
  const [state, setState] = useState<GeoState>({
    loading: true,
    error: null,
    warehouse: null,
  });

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      try {
        if (navigator.geolocation) {
          const position = await new Promise<GeolocationPosition>(
            (resolve, reject) => {
              navigator.geolocation.getCurrentPosition(resolve, reject, {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0,
              });
            },
          );

          const warehouse = await fetchNearestWarehouse(
            position.coords.latitude,
            position.coords.longitude,
          );
          if (!cancelled) {
            setState({ loading: false, error: null, warehouse });
          }
          return;
        }
      } catch {
        // ignore and fallback to IP
      }

      const fallbackWarehouse = await fetchIpFallbackWarehouse();
      if (!cancelled) {
        setState({
          loading: false,
          error: fallbackWarehouse ? null : "Lokasi tidak tersedia.",
          warehouse: fallbackWarehouse,
        });
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, []);

  const canFast =
    state.warehouse?.withinServiceArea ||
    state.warehouse?.withinRadius ||
    false;

  return (
    <section className="w-full max-w-5xl mx-auto px-4 mt-6">
      <div className="rounded-3xl border surface-border bg-surface-container p-6 md:p-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg md:text-xl font-bold text-on-surface">
              Opsi Pengiriman
            </h2>
            <p className="text-sm text-on-surface-variant mt-1">
              Kami menyesuaikan opsi pengiriman berdasarkan lokasi Anda.
            </p>
          </div>
          {state.loading && (
            <span className="text-xs text-on-surface-variant">
              Memuat lokasi...
            </span>
          )}
        </div>

        {state.error && (
          <div className="mt-4 text-sm text-rose-300 bg-rose-500/10 border border-rose-500/20 rounded-2xl px-4 py-3">
            {state.error}
          </div>
        )}

        {state.warehouse && (
          <div className="mt-4 text-xs text-on-surface-variant">
            Terdekat: {state.warehouse.name} · {state.warehouse.city} ·{" "}
            {state.warehouse.distanceKm.toFixed(1)} km
          </div>
        )}

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[
            {
              label: "Fast Pickup",
              desc: "Ambil produk di gudang terdekat dalam 2 jam.",
              active: canFast,
            },
            {
              label: "Same Day",
              desc: "Pengantaran di hari yang sama (hingga 20 km).",
              active: canFast,
            },
            {
              label: "Regular Shipping",
              desc: "Pengiriman reguler 1-3 hari kerja.",
              active: true,
            },
          ].map((option) => (
            <div
              key={option.label}
              className={`rounded-2xl border p-4 transition-colors ${
                option.active
                  ? "border-primary/40 bg-primary/10"
                  : "border-surface-variant/30 bg-surface-container-highest/40"
              }`}
            >
              <p className="text-sm font-semibold text-on-surface">
                {option.label}
              </p>
              <p className="text-xs text-on-surface-variant mt-2">
                {option.desc}
              </p>
              <p className="text-[11px] mt-3 font-semibold uppercase tracking-widest text-primary">
                {option.active ? "Tersedia" : "Tidak tersedia"}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
