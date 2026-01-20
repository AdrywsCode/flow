import type { Doc } from "@/lib/types";
import { apiFetch } from "@/services/client";

export type DocFiltersQuery = {
  language?: string;
  visibility?: string;
  q?: string;
};

function toQuery(filters?: DocFiltersQuery) {
  if (!filters) return "";
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value) params.set(key, value);
  });
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export function fetchDocs(filters?: DocFiltersQuery) {
  return apiFetch<Doc[]>(`/api/docs${toQuery(filters)}`);
}

export function createDoc(payload: Partial<Doc>) {
  return apiFetch<Doc>("/api/docs", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function updateDoc(id: string, payload: Partial<Doc>) {
  return apiFetch<Doc>(`/api/docs/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload)
  });
}

export function deleteDoc(id: string) {
  return apiFetch<{ id: string }>(`/api/docs/${id}`, {
    method: "DELETE"
  });
}
