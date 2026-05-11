import { NextRequest, NextResponse } from "next/server";

const parseFloatValue = (value?: string | null) => {
  if (!value) return null;
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
};

const getHeaderIp = (req: NextRequest) => {
  const realIp = req.headers.get("x-real-ip");
  if (realIp) return realIp;
  const forwarded = req.headers.get("x-forwarded-for");
  if (!forwarded) return null;
  return forwarded.split(",")[0]?.trim() || null;
};

const isPrivateIp = (ip: string) => {
  return (
    ip === "127.0.0.1" ||
    ip === "::1" ||
    ip.startsWith("10.") ||
    ip.startsWith("192.168.") ||
    ip.startsWith("169.254.") ||
    /^172\.(1[6-9]|2\d|3[0-1])\./.test(ip)
  );
};

const fetchIpApi = async (ip?: string | null) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 2500);
  const target = ip ? `http://ip-api.com/json/${ip}` : "http://ip-api.com/json";

  try {
    const res = await fetch(`${target}?fields=status,lat,lon,message`, {
      signal: controller.signal,
    });
    const data = (await res.json()) as {
      status: string;
      lat?: number;
      lon?: number;
      message?: string;
    };
    if (data.status !== "success") return null;
    if (typeof data.lat !== "number" || typeof data.lon !== "number")
      return null;
    return { lat: data.lat, lng: data.lon };
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
};

export async function GET(req: NextRequest) {
  const geo = (
    req as NextRequest & {
      geo?: { latitude?: string; longitude?: string };
    }
  ).geo;
  const geoLat = parseFloatValue(geo?.latitude || null);
  const geoLng = parseFloatValue(geo?.longitude || null);

  if (geoLat != null && geoLng != null) {
    return NextResponse.json({
      lat: geoLat,
      lng: geoLng,
      source: "request-geo",
    });
  }

  const ip = getHeaderIp(req);
  if (ip && isPrivateIp(ip)) {
    return NextResponse.json({ lat: null, lng: null, source: "private-ip" });
  }

  const fallback = await fetchIpApi(ip);
  if (!fallback) {
    return NextResponse.json(
      { lat: null, lng: null, source: "ip-api" },
      { status: 404 },
    );
  }

  return NextResponse.json({ ...fallback, source: "ip-api" });
}
