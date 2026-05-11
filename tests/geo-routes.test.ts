import { describe, expect, it, vi, afterEach } from "vitest";
import { GET as nearestGet } from "@/app/api/geo/nearest/route";
import { GET as resolveGet } from "@/app/api/geo/resolve-ip/route";
import { getNearestWarehouse } from "@/lib/geo-db/queries";

vi.mock("@/lib/geo-db/queries", () => ({
  getNearestWarehouse: vi.fn(),
}));

const mockedNearest = vi.mocked(getNearestWarehouse);

describe("/api/geo/nearest", () => {
  it("returns 400 when lat/lng missing", async () => {
    const res = await nearestGet(
      new Request("http://localhost/api/geo/nearest"),
    );
    expect(res.status).toBe(400);
  });

  it("returns 404 when no warehouse", async () => {
    mockedNearest.mockResolvedValueOnce(null);
    const res = await nearestGet(
      new Request("http://localhost/api/geo/nearest?lat=-6&lng=106"),
    );
    expect(res.status).toBe(404);
  });

  it("returns nearest warehouse payload", async () => {
    mockedNearest.mockResolvedValueOnce({
      id: 1,
      name: "Gudang Jakarta Pusat",
      address: "Jl. MH Thamrin No. 1",
      city: "Jakarta",
      serviceRadiusKm: 20,
      openingHours: "Senin-Sabtu 09:00-18:00",
      distanceKm: 2.4,
      withinServiceArea: true,
      withinRadius: true,
    });

    const res = await nearestGet(
      new Request("http://localhost/api/geo/nearest?lat=-6.17&lng=106.82"),
    );
    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.warehouse.name).toBe("Gudang Jakarta Pusat");
    expect(json.warehouse.withinServiceArea).toBe(true);
  });
});

describe("/api/geo/resolve-ip", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("uses request.geo when available", async () => {
    const req = new Request(
      "http://localhost/api/geo/resolve-ip",
    ) as Request & {
      geo?: { latitude?: string; longitude?: string };
    };
    req.geo = { latitude: "-6.2", longitude: "106.8" };

    const res = await resolveGet(req as never);
    const json = await res.json();
    expect(json.source).toBe("request-geo");
    expect(json.lat).toBe(-6.2);
  });

  it("falls back to ip-api when geo not available", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        json: async () => ({ status: "success", lat: -6.2, lon: 106.8 }),
      }),
    );

    const req = new Request("http://localhost/api/geo/resolve-ip", {
      headers: { "x-forwarded-for": "8.8.8.8" },
    });

    const res = await resolveGet(req as never);
    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.source).toBe("ip-api");
  });
});
