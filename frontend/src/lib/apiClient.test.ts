import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

describe("apiFetch", () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    vi.resetModules();
    vi.stubGlobal("fetch", fetchMock);
    fetchMock.mockReset();
    process.env.NEXT_PUBLIC_API_BASE_URL = "/api/v1";
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    delete process.env.NEXT_PUBLIC_API_BASE_URL;
  });

  async function loadApiFetch() {
    const mod = await import("./apiClient");
    return mod.apiFetch;
  }

  function mockResponse(init: { ok: boolean; status: number; body?: unknown }) {
    return {
      ok: init.ok,
      status: init.status,
      json: vi.fn().mockResolvedValue(init.body ?? {}),
    } as unknown as Response;
  }

  it("returns a successful response on first request", async () => {
    const success = mockResponse({ ok: true, status: 200, body: { ok: true } });
    fetchMock.mockResolvedValueOnce(success);

    const apiFetch = await loadApiFetch();
    const res = await apiFetch("/cart");

    expect(res).toBe(success);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/v1/cart",
      expect.objectContaining({
        credentials: "include",
        headers: expect.objectContaining({ "Content-Type": "application/json" }),
      }),
    );
  });

  it("retries the original request after a successful token refresh", async () => {
    const unauthorized = mockResponse({ ok: false, status: 401 });
    const refreshOk = mockResponse({ ok: true, status: 200 });
    const retryOk = mockResponse({ ok: true, status: 200, body: { retried: true } });

    fetchMock
      .mockResolvedValueOnce(unauthorized)
      .mockResolvedValueOnce(refreshOk)
      .mockResolvedValueOnce(retryOk);

    const apiFetch = await loadApiFetch();
    const res = await apiFetch("/orders/my");

    expect(res).toBe(retryOk);
    expect(fetchMock).toHaveBeenCalledTimes(3);
    expect(fetchMock.mock.calls[1][0]).toBe("/api/v1/auth/refresh");
    expect(fetchMock.mock.calls[1][1]).toEqual(
      expect.objectContaining({ method: "POST", credentials: "include" }),
    );
    expect(fetchMock.mock.calls[2][0]).toBe("/api/v1/orders/my");
  });

  it("returns the original 401 response when refresh fails", async () => {
    const unauthorized = mockResponse({ ok: false, status: 401 });
    const refreshFail = mockResponse({ ok: false, status: 401 });

    fetchMock.mockResolvedValueOnce(unauthorized).mockResolvedValueOnce(refreshFail);

    const apiFetch = await loadApiFetch();
    const res = await apiFetch("/profile");

    expect(res).toBe(unauthorized);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock.mock.calls[1][0]).toBe("/api/v1/auth/refresh");
  });
});
