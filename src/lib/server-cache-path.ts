import os from "node:os";
import path from "node:path";

const SERVER_CACHE_DIR_NAME = "ibacks-cache";

interface ServerCacheEnv {
  VERCEL?: string;
  [key: string]: string | undefined;
}

export function resolveServerCacheDir(
  env: ServerCacheEnv = process.env,
  cwd = process.cwd(),
  tmpRoot = os.tmpdir(),
): string {
  if (env.VERCEL) {
    return path.join(tmpRoot, SERVER_CACHE_DIR_NAME);
  }

  return path.join(cwd, "data");
}
