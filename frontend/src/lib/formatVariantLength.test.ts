import { describe, expect, it } from "vitest";
import {
  formatVariantLength,
  isAccessoriesAndKitsCategory,
} from "./formatVariantLength";

describe("formatVariantLength", () => {
  it("appends inch mark for normal lengths", () => {
    expect(formatVariantLength("14")).toBe('14"');
    expect(formatVariantLength(" 20 ")).toBe('20"');
  });

  it("does not double the inch mark", () => {
    expect(formatVariantLength('14"')).toBe('14"');
  });

  it("skips inch mark for accessories-and-kits category", () => {
    expect(formatVariantLength("none", "accessories-and-kits")).toBe("none");
    expect(formatVariantLength("14", "accessories-and-kits")).toBe("14");
  });

  it('skips inch mark when length is "none"', () => {
    expect(formatVariantLength("none")).toBe("none");
    expect(formatVariantLength("None")).toBe("None");
  });

  it("returns empty string for blank input", () => {
    expect(formatVariantLength("")).toBe("");
    expect(formatVariantLength("   ")).toBe("");
  });
});

describe("isAccessoriesAndKitsCategory", () => {
  it("returns true only for accessories-and-kits", () => {
    expect(isAccessoriesAndKitsCategory("accessories-and-kits")).toBe(true);
    expect(isAccessoriesAndKitsCategory("luxury-hairs")).toBe(false);
    expect(isAccessoriesAndKitsCategory(null)).toBe(false);
    expect(isAccessoriesAndKitsCategory(undefined)).toBe(false);
  });
});
