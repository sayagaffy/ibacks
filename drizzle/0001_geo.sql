CREATE EXTENSION IF NOT EXISTS postgis;

CREATE TABLE IF NOT EXISTS warehouses (
  id SERIAL PRIMARY KEY,
  name VARCHAR(160) NOT NULL,
  address TEXT,
  city VARCHAR(120) NOT NULL,
  geo geometry(Point,4326) NOT NULL,
  service_radius_km NUMERIC(6,2) NOT NULL DEFAULT 0,
  opening_hours TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS warehouses_geo_idx
  ON warehouses
  USING GIST (geo);

CREATE TABLE IF NOT EXISTS service_areas (
  id SERIAL PRIMARY KEY,
  warehouse_id INTEGER NOT NULL REFERENCES warehouses(id) ON DELETE CASCADE,
  name VARCHAR(160) NOT NULL,
  polygon geometry(Polygon,4326) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS service_areas_polygon_idx
  ON service_areas
  USING GIST (polygon);
