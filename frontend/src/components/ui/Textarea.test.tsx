import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Textarea } from "./Textarea";

describe("Textarea", () => {
  it("renders with label", () => {
    render(<Textarea id="notes" label="Notes" />);
    expect(screen.getByLabelText("Notes")).toBeInTheDocument();
  });

  it("shows error", () => {
    render(<Textarea error="Too short" aria-label="bio" />);
    expect(screen.getByText("Too short")).toBeInTheDocument();
  });

  it("accepts input", async () => {
    const user = userEvent.setup();
    render(<Textarea aria-label="bio" />);
    await user.type(screen.getByLabelText("bio"), "Hello");
    expect(screen.getByLabelText("bio")).toHaveValue("Hello");
  });
});
