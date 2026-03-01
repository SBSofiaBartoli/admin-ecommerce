const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message ?? "Something went wrong");
  }

  return res.json();
}
