import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Avatar } from "./Avatar";

describe("Avatar", () => {
  it("shows initials when no src", () => {
    render(<Avatar name="Jane Doe" />);
    expect(screen.getByText("JD")).toBeInTheDocument();
  });

  it("shows image when src is provided", () => {
    render(<Avatar name="Jane Doe" src="https://example.com/a.jpg" />);
    const img = screen.getByRole("img", { name: "Jane Doe" });
    expect(img).toHaveAttribute("src", "https://example.com/a.jpg");
  });

  it("uses single initial for one-word names", () => {
    render(<Avatar name="Alice" />);
    expect(screen.getByText("A")).toBeInTheDocument();
  });
});
