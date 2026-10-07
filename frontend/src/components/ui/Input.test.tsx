import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Input } from "./Input";

describe("Input", () => {
  it("renders input with label", () => {
    render(<Input id="email" label="Email" />);
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
  });

  it("shows error message", () => {
    render(<Input error="Required" aria-label="field" />);
    expect(screen.getByText("Required")).toBeInTheDocument();
  });

  it("accepts user typing", async () => {
    const user = userEvent.setup();
    render(<Input aria-label="name" />);
    const input = screen.getByLabelText("name");
    await user.type(input, "Jane");
    expect(input).toHaveValue("Jane");
  });
});
