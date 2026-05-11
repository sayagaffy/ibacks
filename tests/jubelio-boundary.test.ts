import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const root = process.cwd();
const allowedDirs = [
  path.join(root, "src", "lib", "jubelio-adapter"),
  path.join(root, "tests"),
];
const scannedDirs = ["src", "scripts"];
const endpointPattern =
  /(api2\.jubelio\.com|\/inventory\/items|\/inventory\/promotions)/;

function listFiles(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) return listFiles(fullPath);
    return /\.(ts|tsx|js|mjs)$/.test(entry.name) ? [fullPath] : [];
  });
}

describe("Jubelio API boundary", () => {
  it("keeps Jubelio endpoint knowledge inside the adapter", () => {
    const violations = scannedDirs
      .flatMap((dir) => listFiles(path.join(root, dir)))
      .filter((file) => !allowedDirs.some((dir) => file.startsWith(dir)))
      .filter((file) => endpointPattern.test(fs.readFileSync(file, "utf-8")))
      .map((file) => path.relative(root, file));

    expect(violations).toEqual([]);
  });
});
