function normalizeApiBase(raw: string) {
  const trimmed = raw.replace(/\/+$/g, "");
  return trimmed.endsWith("/api") ? trimmed : `${trimmed}/api`;
}

function normalizeApiPath(path: string) {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (normalized === "/api") {
    return "";
  }
  return normalized.startsWith("/api/") ? normalized.slice(4) : normalized;
}

const API_BASE_URL = normalizeApiBase(process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000");

export async function getJson<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${normalizeApiPath(path)}`, {
    credentials: "include"
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export async function postJson<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${normalizeApiPath(path)}`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as { detail?: string } | null;
    throw new Error(payload?.detail ?? `Request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}
