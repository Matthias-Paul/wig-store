import { beforeEach, describe, expect, it, vi } from "vitest";
import { apiFetch } from "@/src/lib/apiClient";
import {
  getAllNotificationsForAdmin,
  getMyNotifications,
  markNotificationRead,
  registerDeviceToken,
} from "./notificationsApi";

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

describe("notificationsApi", () => {
  beforeEach(() => {
    apiFetchMock.mockReset();
  });

  it("getMyNotifications returns paginated data on success", async () => {
    const data = { notifications: [], pagination: { total: 0, page: 1 } };
    apiFetchMock.mockResolvedValue(jsonRes(data));

    await expect(getMyNotifications(2)).resolves.toEqual(data);
    expect(apiFetchMock).toHaveBeenCalledWith("/notifications/my?page=2");
  });

  it("getMyNotifications throws on failure", async () => {
    apiFetchMock.mockResolvedValue(jsonRes(null, false));
    await expect(getMyNotifications()).rejects.toThrow("Failed to load notifications");
  });

  it("markNotificationRead resolves on success", async () => {
    apiFetchMock.mockResolvedValue(jsonRes(null));

    await expect(markNotificationRead("n1")).resolves.toBeUndefined();
    expect(apiFetchMock).toHaveBeenCalledWith("/notifications/n1/read", {
      method: "PATCH",
    });
  });

  it("markNotificationRead throws on failure", async () => {
    apiFetchMock.mockResolvedValue(jsonRes(null, false));
    await expect(markNotificationRead("n1")).rejects.toThrow("Failed to mark as read");
  });

  it("registerDeviceToken resolves on success", async () => {
    apiFetchMock.mockResolvedValue(jsonRes(null));

    await expect(registerDeviceToken("token-abc")).resolves.toBeUndefined();
    expect(apiFetchMock).toHaveBeenCalledWith("/notifications/device-token", {
      method: "POST",
      body: JSON.stringify({ token: "token-abc" }),
    });
  });

  it("registerDeviceToken throws on failure", async () => {
    apiFetchMock.mockResolvedValue(jsonRes(null, false));
    await expect(registerDeviceToken("token-abc")).rejects.toThrow(
      "Failed to register device for notifications",
    );
  });

  it("getAllNotificationsForAdmin returns data on success", async () => {
    const data = { notifications: [], pagination: { total: 0, page: 1 } };
    apiFetchMock.mockResolvedValue(jsonRes(data));

    await expect(getAllNotificationsForAdmin(3)).resolves.toEqual(data);
    expect(apiFetchMock).toHaveBeenCalledWith("/notifications?page=3");
  });

  it("getAllNotificationsForAdmin throws on failure", async () => {
    apiFetchMock.mockResolvedValue(jsonRes(null, false));
    await expect(getAllNotificationsForAdmin()).rejects.toThrow(
      "Failed to load notifications",
    );
  });
});
