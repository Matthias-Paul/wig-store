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

  async function loadApi() {
    return import("./apiClient");
  }

  function mockResponse(init: {
    ok: boolean;
    status: number;
    body?: string;
  }) {
    const body = init.body ?? "{}";
    return {
      ok: init.ok,
      status: init.status,
      headers: new Headers(),
      clone() {
        return mockResponse(init);
      },
      text: vi.fn().mockResolvedValue(body),
      json: vi.fn().mockResolvedValue(JSON.parse(body || "null")),
    } as unknown as Response;
  }

  it("does not send Content-Type on GET requests", async () => {
    fetchMock.mockResolvedValueOnce(
      mockResponse({ ok: true, status: 200, body: '{"ok":true}' }),
    );

    const { apiFetch } = await loadApi();
    await apiFetch("/products");

    const headers = fetchMock.mock.calls[0][1].headers as Headers;
    expect(headers.get("Content-Type")).toBeNull();
  });

  it("sends Content-Type when a JSON body is present", async () => {
    fetchMock.mockResolvedValueOnce(
      mockResponse({ ok: true, status: 200, body: "{}" }),
    );

    const { apiFetch } = await loadApi();
    await apiFetch("/auth/google", {
      method: "POST",
      body: JSON.stringify({ idToken: "x" }),
    });

    const headers = fetchMock.mock.calls[0][1].headers as Headers;
    expect(headers.get("Content-Type")).toBe("application/json");
  });

  it("retries the original request after a successful token refresh", async () => {
    fetchMock
      .mockResolvedValueOnce(mockResponse({ ok: false, status: 401 }))
      .mockResolvedValueOnce(mockResponse({ ok: true, status: 200 }))
      .mockResolvedValueOnce(
        mockResponse({ ok: true, status: 200, body: '{"retried":true}' }),
      );

    const { apiFetch } = await loadApi();
    const res = await apiFetch("/orders/my");

    expect(res.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledTimes(3);
    expect(fetchMock.mock.calls[1][0]).toBe("/api/v1/auth/refresh");
  });

  it("returns the original 401 response when refresh fails", async () => {
    fetchMock
      .mockResolvedValueOnce(mockResponse({ ok: false, status: 401 }))
      .mockResolvedValueOnce(mockResponse({ ok: false, status: 401 }));

    const { apiFetch } = await loadApi();
    const res = await apiFetch("/profile");

    expect(res.status).toBe(401);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("retries GET once when the first response body is empty", async () => {
    fetchMock
      .mockResolvedValueOnce(mockResponse({ ok: true, status: 200, body: "" }))
      .mockResolvedValueOnce(
        mockResponse({ ok: true, status: 200, body: '{"products":[]}' }),
      );

    const { apiFetch } = await loadApi();
    const res = await apiFetch("/products");
    const text = await res.text();

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(text).toBe('{"products":[]}');
  });
});

describe("parseApiJson", () => {
  it("parses valid JSON", async () => {
    const { parseApiJson } = await import("./apiClient");
    const res = {
      ok: true,
      status: 200,
      text: async () => '{"a":1}',
    } as Response;
    await expect(parseApiJson<{ a: number }>(res)).resolves.toEqual({ a: 1 });
  });

  it("throws a clear error on empty body", async () => {
    const { parseApiJson } = await import("./apiClient");
    const res = {
      ok: true,
      status: 200,
      text: async () => "",
    } as Response;
    await expect(parseApiJson(res)).rejects.toThrow("Empty response");
  });
});
