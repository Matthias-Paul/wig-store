import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TransactionStatusBadge } from "./TransactionStatusBadge";

describe("TransactionStatusBadge", () => {
  it("shows Success for success status", () => {
    render(<TransactionStatusBadge status="success" />);
    expect(screen.getByText("Success")).toHaveClass("text-success");
  });

  it("shows Failed for failed status", () => {
    render(<TransactionStatusBadge status="failed" />);
    expect(screen.getByText("Failed")).toHaveClass("text-error");
  });

  it("falls back to raw status text", () => {
    render(<TransactionStatusBadge status="unknown" />);
    expect(screen.getByText("unknown")).toBeInTheDocument();
  });
});
