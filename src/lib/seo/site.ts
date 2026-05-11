export const SITE_DOMAIN = "https://www.ibackscreation.com";
export const SITE_NAME = "iBacks Creation";
export const DEFAULT_CURRENCY = "IDR";

export function toAbsoluteUrl(pathOrUrl: string): string {
  if (!pathOrUrl) return SITE_DOMAIN;
  if (pathOrUrl.startsWith("http://") || pathOrUrl.startsWith("https://")) {
    return pathOrUrl;
  }
  const path = pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`;
  return `${SITE_DOMAIN}${path}`;
}
