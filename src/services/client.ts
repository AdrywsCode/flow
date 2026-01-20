import type { ApiResponse } from "@/lib/api";

export async function apiFetch<T>(input: RequestInfo, init?: RequestInit) {
  const res = await fetch(input, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {})
    }
  });

  const data = (await res.json()) as ApiResponse<T>;
  if (!res.ok || !data.success) {
    throw new Error(data.success ? "Erro inesperado" : data.error.message);
  }
  return data.data;
}
