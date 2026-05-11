import { NextResponse } from "next/server";
import { getNearestWarehouse } from "@/lib/geo-db/queries";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const latParam = searchParams.get("lat");
  const lngParam = searchParams.get("lng");

  if (latParam == null || lngParam == null) {
    return NextResponse.json(
      { error: "lat and lng query params are required." },
      { status: 400 },
    );
  }

  const lat = Number(latParam);
  const lng = Number(lngParam);

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return NextResponse.json(
      { error: "lat and lng query params are required." },
      { status: 400 },
    );
  }

  const warehouse = await getNearestWarehouse({ lat, lng });

  if (!warehouse) {
    return NextResponse.json({ error: "No warehouse found." }, { status: 404 });
  }

  return NextResponse.json({
    point: { lat, lng },
    warehouse,
  });
}
