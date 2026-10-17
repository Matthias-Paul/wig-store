import { afterEach, describe, expect, it, vi } from "vitest";

describe("getApiBaseUrl", () => {
  afterEach(() => {
    vi.resetModules();
    delete process.env.NEXT_PUBLIC_API_BASE_URL;
    delete process.env.NEXT_PUBLIC_BACKEND_URL;
  });

  it("prefers NEXT_PUBLIC_API_BASE_URL and strips trailing slash", async () => {
    process.env.NEXT_PUBLIC_API_BASE_URL = "https://api.example.com/api/v1/";
    process.env.NEXT_PUBLIC_BACKEND_URL = "https://ignored.example.com";
    const { getApiBaseUrl } = await import("./apiBaseUrl");
    expect(getApiBaseUrl()).toBe("https://api.example.com/api/v1");
  });

  it("falls back to NEXT_PUBLIC_BACKEND_URL", async () => {
    process.env.NEXT_PUBLIC_BACKEND_URL = "https://api.example.com/api/v1";
    const { getApiBaseUrl } = await import("./apiBaseUrl");
    expect(getApiBaseUrl()).toBe("https://api.example.com/api/v1");
  });
});
