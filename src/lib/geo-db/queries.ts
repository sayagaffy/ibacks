import { sql } from "drizzle-orm";
import { geoDb } from "./client";

export interface GeoPoint {
  lat: number;
  lng: number;
}

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

export const isValidPoint = ({ lat, lng }: GeoPoint) =>
  Number.isFinite(lat) &&
  Number.isFinite(lng) &&
  lat >= -90 &&
  lat <= 90 &&
  lng >= -180 &&
  lng <= 180;

export const toNumber = (value: unknown, fallback = 0) => {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (
    typeof value === "string" &&
    value.trim() !== "" &&
    Number.isFinite(Number(value))
  ) {
    return Number(value);
  }
  return fallback;
};

export interface WarehouseLocation {
  id: number;
  name: string;
  address: string | null;
  city: string;
  serviceRadiusKm: number;
  openingHours: string | null;
  lat: number;
  lng: number;
}

export async function getNearestWarehouse(
  point: GeoPoint,
): Promise<WarehouseMatch | null> {
  if (!isValidPoint(point)) return null;

  const pointSql = sql`ST_SetSRID(ST_MakePoint(${point.lng}, ${point.lat}), 4326)`;

  const result = await geoDb.execute(sql`
    SELECT
      id,
      name,
      address,
      city,
      service_radius_km,
      opening_hours,
      ST_DistanceSphere(geo, ${pointSql}) / 1000 AS distance_km
    FROM warehouses
    ORDER BY distance_km ASC
    LIMIT 1
  `);

  const row = result.rows[0];
  if (!row) return null;

  const withinAreaResult = await geoDb.execute(sql`
    SELECT EXISTS(
      SELECT 1
      FROM service_areas
      WHERE warehouse_id = ${row.id}
        AND ST_Contains(polygon, ${pointSql})
    ) AS within_area
  `);

  const distanceKm = toNumber(row.distance_km, 0);
  const serviceRadiusKm = toNumber(row.service_radius_km, 0);
  const withinRadius =
    serviceRadiusKm > 0 ? distanceKm <= serviceRadiusKm : false;

  return {
    id: toNumber(row.id, 0),
    name: row.name as string,
    address: (row.address as string) || null,
    city: row.city as string,
    serviceRadiusKm,
    openingHours: (row.opening_hours as string) || null,
    distanceKm,
    withinServiceArea: Boolean(withinAreaResult.rows[0]?.within_area),
    withinRadius,
  };
}

export async function getWarehousesByCity(
  city: string,
): Promise<WarehouseLocation[]> {
  const normalized = city.trim().toLowerCase();
  if (!normalized) return [];

  const result = await geoDb.execute(sql`
    SELECT
      id,
      name,
      address,
      city,
      service_radius_km,
      opening_hours,
      ST_Y(geo) AS lat,
      ST_X(geo) AS lng
    FROM warehouses
    WHERE LOWER(city) = ${normalized}
    ORDER BY name ASC
  `);

  return result.rows.map((row) => ({
    id: toNumber(row.id, 0),
    name: row.name as string,
    address: (row.address as string) || null,
    city: row.city as string,
    serviceRadiusKm: toNumber(row.service_radius_km, 0),
    openingHours: (row.opening_hours as string) || null,
    lat: toNumber(row.lat, 0),
    lng: toNumber(row.lng, 0),
  }));
}
