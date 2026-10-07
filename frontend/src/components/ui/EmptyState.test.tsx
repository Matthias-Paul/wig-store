import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { EmptyState } from "./EmptyState";

describe("EmptyState", () => {
  it("renders title", () => {
    render(<EmptyState title="Nothing here" />);
    expect(
      screen.getByRole("heading", { name: "Nothing here" }),
    ).toBeInTheDocument();
  });

  it("renders optional description, icon, and action", () => {
    render(
      <EmptyState
        title="Empty"
        description="Try again"
        icon={<span data-testid="icon">I</span>}
        action={<button type="button">Add</button>}
      />,
    );
    expect(screen.getByText("Try again")).toBeInTheDocument();
    expect(screen.getByTestId("icon")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Add" })).toBeInTheDocument();
  });
});
