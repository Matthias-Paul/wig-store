import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Select } from "./Select";

const options = [
  { label: "One", value: "1" },
  { label: "Two", value: "2" },
];

describe("Select", () => {
  it("renders options", () => {
    render(<Select options={options} aria-label="pick" />);
    expect(screen.getByRole("combobox")).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "One" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Two" })).toBeInTheDocument();
  });

  it("shows label and error", () => {
    render(
      <Select
        id="size"
        label="Size"
        options={options}
        error="Pick one"
      />,
    );
    expect(screen.getByLabelText("Size")).toBeInTheDocument();
    expect(screen.getByText("Pick one")).toBeInTheDocument();
  });

  it("fires onChange when selection changes", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <Select options={options} aria-label="pick" onChange={onChange} />,
    );
    await user.selectOptions(screen.getByRole("combobox"), "2");
    expect(onChange).toHaveBeenCalled();
  });
});
