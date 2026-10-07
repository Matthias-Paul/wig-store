import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { OrderStatusBadge } from "./OrderStatusBadge";

describe("OrderStatusBadge", () => {
  it("shows label for known status", () => {
    render(<OrderStatusBadge status="delivered" />);
    expect(screen.getByText("Delivered")).toBeInTheDocument();
  });

  it("falls back to raw status for unknown", () => {
    render(<OrderStatusBadge status="custom_status" />);
    expect(screen.getByText("custom_status")).toBeInTheDocument();
  });

  it("maps payment_failed to error styling", () => {
    render(<OrderStatusBadge status="payment_failed" />);
    expect(screen.getByText("Payment Failed")).toHaveClass("text-error");
  });
});
