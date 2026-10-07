import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Spinner } from "./Spinner";

describe("Spinner", () => {
  it("renders with default md size", () => {
    const { container } = render(<Spinner />);
    const el = container.firstChild as HTMLElement;
    expect(el).toHaveClass("h-6", "w-6", "animate-spin");
  });

  it("applies size and custom className", () => {
    const { container } = render(<Spinner size="lg" className="mx-auto" />);
    const el = container.firstChild as HTMLElement;
    expect(el).toHaveClass("h-10", "w-10", "mx-auto");
  });
});
