import fs from "node:fs";
import path from "node:path";
import { Pool } from "pg";

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

const run = async () => {
  loadEnv();
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set.");
  }

  const migrationsDir = path.join(process.cwd(), "drizzle");
  const migrationFiles = fs
    .readdirSync(migrationsDir)
    .filter((file) => /^\d+_.+\.sql$/.test(file))
    .sort((a, b) => a.localeCompare(b));
  const pool = new Pool({ connectionString });

  try {
    for (const file of migrationFiles) {
      const sqlPath = path.join(migrationsDir, file);
      const sql = fs.readFileSync(sqlPath, "utf8");
      await pool.query(sql);
      console.log(`[geo-migrate] Applied ${file}`);
    }
  } finally {
    await pool.end();
  }
};

run().catch((error) => {
  console.error("[geo-migrate] Failed:", error);
  process.exitCode = 1;
});
