import fs from "node:fs";
import path from "node:path";
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { sql } from "drizzle-orm";

type SeedWarehouse = {
  name: string;
  address: string | null;
  city: string;
  lat: number;
  lng: number;
  serviceRadiusKm: number;
  openingHours: string;
  areaName: string;
  areaWkt: string;
};

const loadEnv = () => {
  if (process.env.DATABASE_URL) return;
  const envPath = path.join(process.cwd(), ".env");
  if (!fs.existsSync(envPath)) return;
  const lines = fs.readFileSync(envPath, "utf8").split(/\r?\n/);
  lines.forEach((line) => {
    if (!line || line.trim().startsWith("#")) return;
    const [key, ...rest] = line.split("=");
    if (!key) return;
    if (process.env[key] !== undefined) return;
    process.env[key] = rest.join("=");
  });
};

const seedWarehouses: SeedWarehouse[] = [
  {
    name: "Gudang Jakarta Pusat",
    address: "Jl. MH Thamrin No. 1, Jakarta",
    city: "Jakarta",
    lat: -6.1754,
    lng: 106.8272,
    serviceRadiusKm: 20,
    openingHours: "Senin-Sabtu 09:00-18:00",
    areaName: "Area Layanan Jakarta Pusat",
    areaWkt:
      "POLYGON((106.75 -6.12, 106.90 -6.12, 106.90 -6.24, 106.75 -6.24, 106.75 -6.12))",
  },
  {
    name: "Gudang Surabaya",
    address: "Jl. Tunjungan No. 1, Surabaya",
    city: "Surabaya",
    lat: -7.2575,
    lng: 112.7521,
    serviceRadiusKm: 20,
    openingHours: "Senin-Sabtu 09:00-18:00",
    areaName: "Area Layanan Surabaya",
    areaWkt:
      "POLYGON((112.70 -7.20, 112.85 -7.20, 112.85 -7.35, 112.70 -7.35, 112.70 -7.20))",
  },
  {
    name: "Gudang Bandung",
    address: "Jl. Asia Afrika No. 1, Bandung",
    city: "Bandung",
    lat: -6.9175,
    lng: 107.6191,
    serviceRadiusKm: 20,
    openingHours: "Senin-Sabtu 09:00-18:00",
    areaName: "Area Layanan Bandung",
    areaWkt:
      "POLYGON((107.55 -6.86, 107.68 -6.86, 107.68 -7.00, 107.55 -7.00, 107.55 -6.86))",
  },
  {
    name: "Gudang Medan",
    address: "Jl. Gatot Subroto No. 1, Medan",
    city: "Medan",
    lat: 3.5952,
    lng: 98.6722,
    serviceRadiusKm: 20,
    openingHours: "Senin-Sabtu 09:00-18:00",
    areaName: "Area Layanan Medan",
    areaWkt:
      "POLYGON((98.60 3.54, 98.74 3.54, 98.74 3.66, 98.60 3.66, 98.60 3.54))",
  },
];

const upsertWarehouse = async (
  db: ReturnType<typeof drizzle>,
  seed: SeedWarehouse,
) => {
  const existing = await db.execute(sql`
    SELECT id FROM warehouses WHERE name = ${seed.name} LIMIT 1
  `);

  const geoSql = sql`ST_SetSRID(ST_MakePoint(${seed.lng}, ${seed.lat}), 4326)`;
  let warehouseId = existing.rows[0]?.id as number | undefined;

  if (!warehouseId) {
    const inserted = await db.execute(sql`
      INSERT INTO warehouses (name, address, city, geo, service_radius_km, opening_hours)
      VALUES (
        ${seed.name},
        ${seed.address},
        ${seed.city},
        ${geoSql},
        ${seed.serviceRadiusKm},
        ${seed.openingHours}
      )
      RETURNING id
    `);
    warehouseId = inserted.rows[0]?.id as number | undefined;
  } else {
    await db.execute(sql`
      UPDATE warehouses
      SET
        address = ${seed.address},
        city = ${seed.city},
        geo = ${geoSql},
        service_radius_km = ${seed.serviceRadiusKm},
        opening_hours = ${seed.openingHours}
      WHERE id = ${warehouseId}
    `);
  }

  if (!warehouseId) {
    throw new Error(`Failed to create or find ${seed.name}.`);
  }

  const existingArea = await db.execute(sql`
    SELECT id FROM service_areas
    WHERE warehouse_id = ${warehouseId} AND name = ${seed.areaName}
    LIMIT 1
  `);

  const polygonSql = sql`ST_GeomFromText(${seed.areaWkt}, 4326)`;

  if (existingArea.rows.length === 0) {
    await db.execute(sql`
      INSERT INTO service_areas (warehouse_id, name, polygon)
      VALUES (
        ${warehouseId},
        ${seed.areaName},
        ${polygonSql}
      )
    `);
  } else {
    await db.execute(sql`
      UPDATE service_areas
      SET polygon = ${polygonSql}
      WHERE id = ${existingArea.rows[0]?.id as number}
    `);
  }
};

const run = async () => {
  loadEnv();
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set.");
  }

  const pool = new Pool({ connectionString });
  const db = drizzle(pool);

  for (const seed of seedWarehouses) {
    await upsertWarehouse(db, seed);
  }

  await pool.end();
  console.log("[geo-seed] Seed data applied.");
};

run().catch((error) => {
  console.error("[geo-seed] Failed:", error);
  process.exitCode = 1;
});
