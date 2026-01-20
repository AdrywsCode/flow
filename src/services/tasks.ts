import type { Task } from "@/lib/types";
import { apiFetch } from "@/services/client";

export type TaskFiltersQuery = {
  status?: string;
  priority?: string;
  project?: string;
  overdue?: string;
  q?: string;
};

function toQuery(filters?: TaskFiltersQuery) {
  if (!filters) return "";
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value) params.set(key, value);
  });
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export function fetchTasks(filters?: TaskFiltersQuery) {
  return apiFetch<Task[]>(`/api/tasks${toQuery(filters)}`);
}

export function createTask(payload: Partial<Task>) {
  return apiFetch<Task>("/api/tasks", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function updateTask(id: string, payload: Partial<Task>) {
  return apiFetch<Task>(`/api/tasks/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload)
  });
}

export function deleteTask(id: string) {
  return apiFetch<{ id: string }>(`/api/tasks/${id}`, {
    method: "DELETE"
  });
}

export function updateTaskStatus(id: string, status: Task["status"]) {
  return apiFetch<Task>(`/api/tasks/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status })
  });
}
