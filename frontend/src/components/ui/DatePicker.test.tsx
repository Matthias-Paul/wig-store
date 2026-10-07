import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DateTimePicker } from "./DatePicker";

describe("DateTimePicker", () => {
  it("renders datetime-local input", () => {
    render(<DateTimePicker id="when" label="When" />);
    const input = screen.getByLabelText("When");
    expect(input).toHaveAttribute("type", "datetime-local");
  });
});
