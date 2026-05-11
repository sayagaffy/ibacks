INSERT INTO warehouses (name, address, city, geo, service_radius_km, opening_hours)
VALUES
  (
    'Gudang Jakarta Pusat',
    'Jl. MH Thamrin No. 1, Jakarta',
    'Jakarta',
    ST_SetSRID(ST_MakePoint(106.8272, -6.1754), 4326),
    20,
    'Senin-Sabtu 09:00-18:00'
  )
ON CONFLICT DO NOTHING;

INSERT INTO service_areas (warehouse_id, name, polygon)
SELECT
  id,
  'Area Layanan Jakarta Pusat',
  ST_GeomFromText(
    'POLYGON((106.75 -6.12, 106.90 -6.12, 106.90 -6.24, 106.75 -6.24, 106.75 -6.12))',
    4326
  )
FROM warehouses
WHERE name = 'Gudang Jakarta Pusat'
ON CONFLICT DO NOTHING;
