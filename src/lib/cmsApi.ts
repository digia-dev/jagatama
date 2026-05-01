export const CMS_TOKEN_KEY = "jagatama_admin_token";

export function getCmsBaseUrl() {
  const v = import.meta.env.VITE_API_BASE_URL;
  if (v && typeof v === "string" && v.length > 0) {
    return v.replace(/\/$/, "");
  }
  // Default fallback
  const h = window.location.hostname;
  const isLocal = h === "localhost" || h === "127.0.0.1" || h.startsWith("192.168.") || h.startsWith("10.") || h.startsWith("0.0.0.0");
  if (isLocal) {
    return `http://${h}:8000`;
  }
  return "https://fire.vadr.my.id/jagatama";
}

export function getAdminToken() {
  return localStorage.getItem(CMS_TOKEN_KEY);
}

export function setAdminToken(token: string | null) {
  if (token) localStorage.setItem(CMS_TOKEN_KEY, token);
  else localStorage.removeItem(CMS_TOKEN_KEY);
}

export async function cmsFetch(path: string, init?: RequestInit) {
  const url = `${getCmsBaseUrl()}/${path.replace(/^\//, "")}`;
  const headers = new Headers(init?.headers);
  if (!headers.has("Content-Type") && init?.body && typeof init.body === "string") {
    headers.set("Content-Type", "application/json");
  }
  const token = getAdminToken();
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  const res = await fetch(url, { ...init, headers });
  const text = await res.text();
  let data: unknown = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }
  if (!res.ok) {
    const msg =
      data && typeof data === "object" && data !== null && "message" in data
        ? String((data as { message: string }).message)
        : res.statusText;
    throw new Error(msg || `HTTP ${res.status}`);
  }
  return data;
}

export async function cmsUploadFile(file: File) {
  const url = `${getCmsBaseUrl()}/upload.php`;
  const fd = new FormData();
  fd.append("file", file);
  const token = getAdminToken();
  const headers = new Headers();
  if (token) headers.set("Authorization", `Bearer ${token}`);
  const res = await fetch(url, { method: "POST", body: fd, headers });
  const text = await res.text();
  let data: { status?: string; message?: string; data?: { url?: string } } = {};
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    throw new Error("Invalid upload response");
  }
  if (!res.ok || data.status !== "success" || !data.data?.url) {
    throw new Error(data.message || "Upload failed");
  }
  return data.data.url as string;
}

export async function cmsLogin(username: string, password: string) {
  const url = `${getCmsBaseUrl()}/admin.php/login`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  const text = await res.text();
  let data: { ok?: boolean; token?: string; message?: string } = {};
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    throw new Error("Invalid response");
  }
  if (!res.ok || !data.ok || !data.token) {
    throw new Error(data.message || "Login failed");
  }
  return data.token;
}
