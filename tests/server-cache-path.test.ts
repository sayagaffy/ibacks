import path from "node:path";
import { describe, expect, it } from "vitest";
import { resolveServerCacheDir } from "@/lib/server-cache-path";

describe("resolveServerCacheDir", () => {
  it("uses tmp storage on Vercel", () => {
    const cacheDir = resolveServerCacheDir(
      { VERCEL: "1" },
      "/repo",
      "/tmp",
    );

    expect(cacheDir).toBe(path.join("/tmp", "ibacks-cache"));
  });

  it("keeps local development cache in the project data directory", () => {
    const cacheDir = resolveServerCacheDir({}, "/repo", "/tmp");

    expect(cacheDir).toBe(path.join("/repo", "data"));
  });
});
