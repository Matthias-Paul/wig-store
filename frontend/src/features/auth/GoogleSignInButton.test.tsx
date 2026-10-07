import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { GoogleSignInButton } from "./GoogleSignInButton";

const mockSignIn = vi.hoisted(() => ({
  triggerSignIn: vi.fn(),
  isPending: false,
}));

vi.mock("@/src/features/auth/hooks/useGoogleSignIn", () => ({
  useGoogleSignIn: () => ({
    triggerSignIn: mockSignIn.triggerSignIn,
    isPending: mockSignIn.isPending,
  }),
}));

describe("GoogleSignInButton", () => {
  beforeEach(() => {
    mockSignIn.triggerSignIn.mockClear();
    mockSignIn.isPending = false;
  });

  it("renders sign-in label", () => {
    render(<GoogleSignInButton />);
    expect(
      screen.getByRole("button", { name: /Sign in with Google/i }),
    ).toBeInTheDocument();
  });

  it("calls triggerSignIn with redirect path on click", async () => {
    const user = userEvent.setup();
    render(<GoogleSignInButton />);
    await user.click(
      screen.getByRole("button", { name: /Sign in with Google/i }),
    );
    expect(mockSignIn.triggerSignIn).toHaveBeenCalledWith("/");
  });

  it("shows pending label and disables button when isPending", () => {
    mockSignIn.isPending = true;
    render(<GoogleSignInButton />);
    expect(screen.getByRole("button", { name: /Signing in/i })).toBeDisabled();
  });
});
