import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi, beforeEach } from "vitest";
import type { ProductVariant } from "@/src/types/product";
import { VariantCardList } from "./VariantCardList";

vi.mock("@/src/lib/formatVariantLength", () => ({
  formatVariantLength: (length: string) => `${length}"`,
}));

const inStock: ProductVariant = {
  id: "v1",
  length: "14",
  color: "Black",
  sku: "SKU1",
  price: 50000,
  stock: 10,
};

const outOfStock: ProductVariant = {
  id: "v2",
  length: "16",
  color: "Brown",
  sku: "SKU2",
  price: 60000,
  stock: 0,
};

const lowStock: ProductVariant = {
  id: "v3",
  length: "18",
  color: "Blonde",
  sku: "SKU3",
  price: 70000,
  stock: 2,
};

describe("VariantCardList", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("calls onSelect when in-stock variant is clicked", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(
      <VariantCardList
        variants={[inStock]}
        selectedVariantId={null}
        onSelect={onSelect}
      />,
    );
    await user.click(screen.getByRole("button", { name: /In Stock/i }));
    expect(onSelect).toHaveBeenCalledWith(inStock);
  });

  it("disables out-of-stock variant and shows Sold Out", () => {
    const onSelect = vi.fn();
    render(
      <VariantCardList
        variants={[outOfStock]}
        selectedVariantId={null}
        onSelect={onSelect}
      />,
    );
    const button = screen.getByRole("button", { name: /Sold Out/i });
    expect(button).toBeDisabled();
    expect(screen.getByText("Sold Out")).toBeInTheDocument();
  });

  it("does not call onSelect when out-of-stock is clicked", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(
      <VariantCardList
        variants={[outOfStock]}
        selectedVariantId={null}
        onSelect={onSelect}
      />,
    );
    await user.click(screen.getByRole("button", { name: /Sold Out/i }));
    expect(onSelect).not.toHaveBeenCalled();
  });

  it("shows low stock label", () => {
    render(
      <VariantCardList
        variants={[lowStock]}
        selectedVariantId={null}
        onSelect={() => {}}
      />,
    );
    expect(screen.getByText("2 left")).toBeInTheDocument();
  });

  it("highlights selected variant", () => {
    render(
      <VariantCardList
        variants={[inStock]}
        selectedVariantId="v1"
        onSelect={() => {}}
      />,
    );
    expect(screen.getByRole("button")).toHaveClass("border-brand");
  });
});
