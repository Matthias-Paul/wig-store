import { beforeEach, describe, expect, it, vi } from "vitest";

const { sonnerSuccess, sonnerError, sonnerInfo } = vi.hoisted(() => ({
  sonnerSuccess: vi.fn(),
  sonnerError: vi.fn(),
  sonnerInfo: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: Object.assign(sonnerInfo, {
    success: sonnerSuccess,
    error: sonnerError,
  }),
}));

describe("toast helpers", () => {
  beforeEach(() => {
    sonnerSuccess.mockClear();
    sonnerError.mockClear();
    sonnerInfo.mockClear();
  });

  it("calls sonner success with branded styles", async () => {
    const { toast } = await import("./toast");
    toast.success("Saved");

    expect(sonnerSuccess).toHaveBeenCalledWith("Saved", {
      style: { background: "#16A34A", color: "#fff", border: "none" },
    });
  });

  it("calls sonner error with branded styles", async () => {
    const { toast } = await import("./toast");
    toast.error("Failed");

    expect(sonnerError).toHaveBeenCalledWith("Failed", {
      style: { background: "#DC2626", color: "#fff", border: "none" },
    });
  });

  it("calls sonner info with branded styles", async () => {
    const { toast } = await import("./toast");
    toast.info("Note");

    expect(sonnerInfo).toHaveBeenCalledWith("Note", {
      style: { background: "#7E297E", color: "#fff", border: "none" },
    });
  });
});
