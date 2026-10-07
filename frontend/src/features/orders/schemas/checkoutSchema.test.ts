import { describe, expect, it } from "vitest";
import { checkoutSchema } from "./checkoutSchema";

const validPayload = {
  recipientName: "Jane Doe",
  recipientPhone: "08012345678",
  recipientEmail: "jane@example.com",
  shippingAddress: "12 Market Road",
  shippingCity: "Ikeja",
  shippingState: "Lagos" as const,
};

describe("checkoutSchema", () => {
  it("accepts a valid checkout payload", () => {
    const result = checkoutSchema.safeParse(validPayload);
    expect(result.success).toBe(true);
  });

  it("rejects an invalid Nigerian phone number", () => {
    const result = checkoutSchema.safeParse({
      ...validPayload,
      recipientPhone: "12345",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.path.includes("recipientPhone"))).toBe(
        true,
      );
    }
  });

  it("rejects an invalid email address", () => {
    const result = checkoutSchema.safeParse({
      ...validPayload,
      recipientEmail: "not-an-email",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.path.includes("recipientEmail"))).toBe(
        true,
      );
    }
  });

  it("rejects an unknown shipping state", () => {
    const result = checkoutSchema.safeParse({
      ...validPayload,
      shippingState: "Atlantis",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.path.includes("shippingState"))).toBe(
        true,
      );
    }
  });
});
