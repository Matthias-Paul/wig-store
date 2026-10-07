import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Badge } from "./Badge";

describe("Badge", () => {
  it("renders children", () => {
    render(<Badge>New</Badge>);
    expect(screen.getByText("New")).toBeInTheDocument();
  });

  it("defaults to neutral variant", () => {
    render(<Badge>Tag</Badge>);
    expect(screen.getByText("Tag")).toHaveClass("bg-gray-100");
  });

  it("applies success variant classes", () => {
    render(<Badge variant="success">OK</Badge>);
    expect(screen.getByText("OK")).toHaveClass("text-success");
  });
});
