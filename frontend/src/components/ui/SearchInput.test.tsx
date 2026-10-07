import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { SearchInput } from "./SearchInput";

describe("SearchInput", () => {
  it("renders a search input", () => {
    render(<SearchInput placeholder="Search products" />);
    expect(screen.getByPlaceholderText("Search products")).toHaveAttribute(
      "type",
      "search",
    );
  });

  it("forwards props and accepts typing", async () => {
    const user = userEvent.setup();
    render(<SearchInput aria-label="search" />);
    const input = screen.getByLabelText("search");
    await user.type(input, "wig");
    expect(input).toHaveValue("wig");
  });
});
