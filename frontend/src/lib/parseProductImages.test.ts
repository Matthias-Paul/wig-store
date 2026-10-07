import { describe, expect, it } from "vitest";
import { parseProductImages } from "./parseProductImages";

describe("parseProductImages", () => {
  it("returns trimmed urls", () => {
    expect(parseProductImages([" https://a.com/1.jpg ", "https://a.com/2.jpg"])).toEqual([
      "https://a.com/1.jpg",
      "https://a.com/2.jpg",
    ]);
  });

  it("splits comma-separated entries", () => {
    expect(
      parseProductImages(["https://a.com/1.jpg, https://a.com/2.jpg"]),
    ).toEqual(["https://a.com/1.jpg", "https://a.com/2.jpg"]);
  });

  it("filters empty values", () => {
    expect(parseProductImages(["", " , ", "https://a.com/1.jpg"])).toEqual([
      "https://a.com/1.jpg",
    ]);
  });

  it("returns empty array for empty input", () => {
    expect(parseProductImages([])).toEqual([]);
  });
});
