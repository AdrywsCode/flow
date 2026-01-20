import type { Project, Task } from "@/lib/types";
import { apiFetch } from "@/services/client";

export type DashboardFiltersQuery = {
  status?: string;
  priority?: string;
  project?: string;
  overdue?: string;
  q?: string;
};

function toQuery(filters?: DashboardFiltersQuery) {
  if (!filters) return "";
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value) params.set(key, value);
  });
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export function fetchDashboard(filters?: DashboardFiltersQuery) {
  return apiFetch<{ projects: Project[]; tasks: Task[] }>(`/api/dashboard${toQuery(filters)}`);
}
