import { describe, expect, it } from "vitest";
import { NIGERIAN_STATES } from "./nigerianStates";

describe("NIGERIAN_STATES", () => {
  it("is a non-empty list of states", () => {
    expect(NIGERIAN_STATES.length).toBeGreaterThan(0);
  });

  it("includes well-known Nigerian states", () => {
    expect(NIGERIAN_STATES).toContain("Lagos");
    expect(NIGERIAN_STATES).toContain("Kano");
    expect(NIGERIAN_STATES).toContain("Federal Capital Territory");
  });
});
