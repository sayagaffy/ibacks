import fs from "fs";
import path from "path";
import { syncProductsFromJubelio } from "../src/lib/product-cache";

// Load .env manually
const envFile = path.join(process.cwd(), ".env");
if (fs.existsSync(envFile)) {
  fs.readFileSync(envFile, "utf-8")
    .split("\n")
    .forEach((line) => {
      const match = line.match(/^([^#=]+)=(.*)$/);
      if (match) process.env[match[1].trim()] = match[2].trim();
    });
}

async function run() {
  const cache = await syncProductsFromJubelio();
  const cacheDir = path.join(process.cwd(), "data");
  const cachePath = path.join(cacheDir, "products.json");
  const sizeKB = (fs.statSync(cachePath).size / 1024).toFixed(0);
  console.log("Fetched and cached", cache.totalCount, "products");
  console.log("File size:", sizeKB, "KB");
  console.log("Done! Next API requests will be instant (disk reads).");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
