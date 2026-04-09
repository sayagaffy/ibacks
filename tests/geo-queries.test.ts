import { describe, expect, it } from "vitest";
import { isValidPoint, toNumber } from "@/lib/geo-db/queries";

describe("geo query helpers", () => {
  it("validates latitude/longitude bounds", () => {
    expect(isValidPoint({ lat: -6.2, lng: 106.8 })).toBe(true);
    expect(isValidPoint({ lat: 91, lng: 10 })).toBe(false);
    expect(isValidPoint({ lat: 0, lng: 181 })).toBe(false);
  });

  it("coerces numeric values safely", () => {
    expect(toNumber(12.5)).toBe(12.5);
    expect(toNumber("42")).toBe(42);
    expect(toNumber("not-a-number", 7)).toBe(7);
  });
});
