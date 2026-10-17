import { getApiBaseUrl } from "@/src/lib/apiBaseUrl";

function getBaseUrl() {
  return getApiBaseUrl();
}

let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;

async function refreshAccessToken(): Promise<boolean> {
  if (isRefreshing && refreshPromise) return refreshPromise;

  isRefreshing = true;
  refreshPromise = fetch(`${getBaseUrl()}/auth/refresh`, {
    method: "POST",
    credentials: "include",
  })
    .then((res) => res.ok)
    .finally(() => {
      isRefreshing = false;
    });

  return refreshPromise;
}

export async function apiFetch(path: string, options: RequestInit = {}) {
  const baseUrl = getBaseUrl();
  if (!baseUrl) {
    throw new Error(
      "API base URL is not configured. Set NEXT_PUBLIC_API_BASE_URL.",
    );
  }

  const res = await fetch(`${baseUrl}${path}`, {
    ...options,
    credentials: "include",
    headers: { "Content-Type": "application/json", ...options.headers },
  });

  if (res.status === 401) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      return fetch(`${baseUrl}${path}`, {
        ...options,
        credentials: "include",
        headers: { "Content-Type": "application/json", ...options.headers },
      });
    }
  }

  return res;
}
