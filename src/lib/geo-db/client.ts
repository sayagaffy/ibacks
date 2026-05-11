import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set.");
}

const globalForGeo = globalThis as typeof globalThis & {
  geoPool?: Pool;
};

export const geoPool =
  globalForGeo.geoPool ?? new Pool({ connectionString, max: 10 });

if (process.env.NODE_ENV !== "production") {
  globalForGeo.geoPool = geoPool;
}

export const geoDb = drizzle(geoPool);
