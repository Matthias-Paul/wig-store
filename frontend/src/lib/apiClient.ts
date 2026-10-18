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
      refreshPromise = null;
    });

  return refreshPromise;
}

function buildHeaders(options: RequestInit): Headers {
  const headers = new Headers(options.headers);
  const method = (options.method ?? "GET").toUpperCase();
  const hasBody = options.body != null && options.body !== "";

  // Setting Content-Type: application/json on GET (no body) breaks some
  // proxies / Passenger setups and yields empty responses → JSON parse errors.
  if (hasBody && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  if (!hasBody && method === "GET") {
    headers.delete("Content-Type");
  }

  return headers;
}

/**
 * Safely parse a JSON response. Avoids "Unexpected end of JSON input"
 * when the proxy returns an empty body.
 */
export async function parseApiJson<T>(res: Response): Promise<T> {
  const text = await res.text();
  if (!text.trim()) {
    throw new Error(
      res.ok
        ? "Empty response from server"
        : `Request failed (${res.status})`,
    );
  }
  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error(`Invalid JSON response (${res.status})`);
  }
}

export async function apiFetch(path: string, options: RequestInit = {}) {
  const baseUrl = getBaseUrl();
  if (!baseUrl) {
    throw new Error(
      "API base URL is not configured. Set NEXT_PUBLIC_API_BASE_URL.",
    );
  }

  const method = (options.method ?? "GET").toUpperCase();
  const headers = buildHeaders(options);

  const doFetch = () =>
    fetch(`${baseUrl}${path}`, {
      ...options,
      method,
      credentials: "include",
      headers,
    });

  let res = await doFetch();

  if (res.status === 401 && !path.startsWith("/auth/refresh")) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      res = await doFetch();
    }
  }

  // One retry for flaky empty GET responses (common behind cPanel proxies)
  if (method === "GET" && res.ok) {
    const peek = res.clone();
    const text = await peek.text();
    if (!text.trim()) {
      res = await doFetch();
    }
  }

  return res;
}
