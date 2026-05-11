export interface WarehouseMatch {
  id: number;
  name: string;
  address: string | null;
  city: string;
  serviceRadiusKm: number;
  openingHours: string | null;
  distanceKm: number;
  withinServiceArea: boolean;
  withinRadius: boolean;
}

export const fetchNearestWarehouse = async (
  lat: number,
  lng: number,
): Promise<WarehouseMatch | null> => {
  const res = await fetch(`/api/geo/nearest?lat=${lat}&lng=${lng}`);
  if (!res.ok) return null;
  const data = (await res.json()) as { warehouse: WarehouseMatch };
  return data.warehouse;
};

export const fetchIpFallbackWarehouse =
  async (): Promise<WarehouseMatch | null> => {
    const res = await fetch("/api/geo/resolve-ip");
    if (!res.ok) return null;
    const data = (await res.json()) as {
      lat: number | null;
      lng: number | null;
    };
    if (data.lat == null || data.lng == null) return null;
    return fetchNearestWarehouse(data.lat, data.lng);
  };
