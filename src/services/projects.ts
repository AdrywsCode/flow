import type { Project } from "@/lib/types";
import { apiFetch } from "@/services/client";

export function fetchProjects() {
  return apiFetch<Project[]>("/api/projects");
}

export function createProject(payload: { name: string }) {
  return apiFetch<Project>("/api/projects", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function updateProject(id: string, payload: { name?: string }) {
  return apiFetch<Project>(`/api/projects/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload)
  });
}

export function deleteProject(id: string) {
  return apiFetch<{ id: string }>(`/api/projects/${id}`, {
    method: "DELETE"
  });
}
