import { beforeEach, describe, expect, it, vi } from "vitest";
import { apiFetch } from "@/src/lib/apiClient";
import { getAdminUsers } from "./adminUsersApi";

vi.mock("@/src/lib/apiClient", () => ({
  apiFetch: vi.fn(),
}));

const apiFetchMock = vi.mocked(apiFetch);

function jsonRes(data: unknown, ok = true): Response {
  return {
    ok,
    status: ok ? 200 : 500,
    json: vi.fn().mockResolvedValue(data),
  } as unknown as Response;
}

describe("adminUsersApi", () => {
  beforeEach(() => {
    apiFetchMock.mockReset();
  });

  it("getAdminUsers returns paginated users on success", async () => {
    const data = { users: [], pagination: { total: 0, page: 1, limit: 10 } };
    apiFetchMock.mockResolvedValue(jsonRes(data));

    await expect(getAdminUsers({ page: 1, role: "admin" })).resolves.toEqual(data);
    expect(apiFetchMock).toHaveBeenCalledWith("/users?page=1&role=admin");
  });

  it("getAdminUsers throws on failure", async () => {
    apiFetchMock.mockResolvedValue(jsonRes(null, false));
    await expect(getAdminUsers({})).rejects.toThrow("Failed to load users");
  });
});
