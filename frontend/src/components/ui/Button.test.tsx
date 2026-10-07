import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Button } from "./Button";

describe("Button", () => {
  it("renders children", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole("button", { name: "Click me" })).toBeInTheDocument();
  });

  it("calls onClick when clicked", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Go</Button>);
    await user.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("respects disabled state", () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("renders icon on the left by default", () => {
    render(
      <Button icon={<span data-testid="icon">*</span>}>Label</Button>,
    );
    const button = screen.getByRole("button");
    expect(button).toHaveTextContent("*Label");
  });

  it("renders icon on the right when iconPosition is right", () => {
    render(
      <Button icon={<span data-testid="icon">*</span>} iconPosition="right">
        Label
      </Button>,
    );
    expect(screen.getByRole("button")).toHaveTextContent("Label*");
  });
});
