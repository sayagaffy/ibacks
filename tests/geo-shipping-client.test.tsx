import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { GeoShippingClient } from "@/app/products/[id]/GeoShippingClient";
import {
  fetchIpFallbackWarehouse,
  fetchNearestWarehouse,
  type WarehouseMatch,
} from "@/lib/geo-client";

vi.mock("@/lib/geo-client", () => ({
  fetchNearestWarehouse: vi.fn(),
  fetchIpFallbackWarehouse: vi.fn(),
}));

const mockGeolocationSuccess = () => {
  const getCurrentPosition = vi.fn((success: PositionCallback) => {
    success({
      coords: {
        latitude: -6.2,
        longitude: 106.8,
      },
    } as GeolocationPosition);
  });

  Object.defineProperty(global.navigator, "geolocation", {
    value: { getCurrentPosition },
    configurable: true,
  });
};

const makeWarehouse = (overrides?: Partial<WarehouseMatch>): WarehouseMatch => ({
  id: 1,
  name: "Gudang Jakarta Pusat",
  address: "Jl. MH Thamrin No. 1, Jakarta",
  city: "Jakarta",
  serviceRadiusKm: 20,
  openingHours: "Senin-Sabtu 09:00-18:00",
  distanceKm: 5.2,
  withinServiceArea: false,
  withinRadius: false,
  ...(overrides || {}),
});

describe("GeoShippingClient", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    mockGeolocationSuccess();
  });

  it("shows fast pickup when user is within service area", async () => {
    vi.mocked(fetchNearestWarehouse).mockResolvedValue(
      makeWarehouse({ withinServiceArea: true }),
    );

    render(<GeoShippingClient />);

    await screen.findByText(/Terdekat:/i);

    expect(screen.queryByText("Tidak tersedia")).not.toBeInTheDocument();
    expect(screen.getAllByText("Tersedia")).toHaveLength(3);
  });

  it("shows regular shipping only when user is outside radius", async () => {
    vi.mocked(fetchNearestWarehouse).mockResolvedValue(
      makeWarehouse({ withinServiceArea: false, withinRadius: false }),
    );

    render(<GeoShippingClient />);

    await screen.findByText(/Terdekat:/i);

    expect(screen.getAllByText("Tidak tersedia")).toHaveLength(2);
    expect(screen.getAllByText("Tersedia")).toHaveLength(1);
    expect(fetchIpFallbackWarehouse).not.toHaveBeenCalled();
  });
});
