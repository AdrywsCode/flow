import { isBefore, isValid, parseISO } from "date-fns";
import { taskStatuses, type TaskStatus } from "@/lib/constants";
import type { Task } from "@/lib/types";

export type TaskFilters = {
  status?: TaskStatus;
  priority?: Task["priority"];
  project?: string;
  overdue?: boolean;
  q?: string;
};

export function applyTaskFilters(tasks: Task[], filters: TaskFilters) {
  const query = filters.q?.trim().toLowerCase();

  return tasks.filter((task) => {
    if (filters.status && task.status !== filters.status) return false;
    if (filters.priority && task.priority !== filters.priority) return false;
    if (filters.project && task.project_id !== filters.project) return false;
    if (filters.overdue && task.due_date) {
      const due = parseISO(task.due_date);
      if (!isValid(due)) return false;
      if (!isBefore(due, new Date())) return false;
    }
    if (filters.overdue && !task.due_date) return false;
    if (query) {
      const haystack = `${task.title} ${task.description ?? ""}`.toLowerCase();
      if (!haystack.includes(query)) return false;
    }
    return true;
  });
}

export function groupTasksByStatus(tasks: Task[]) {
  return taskStatuses.reduce(
    (acc, status) => {
      acc[status] = tasks.filter((task) => task.status === status);
      return acc;
    },
    { todo: [], doing: [], done: [] } as Record<TaskStatus, Task[]>
  );
}

export function sortTasksByDueDate(tasks: Task[]) {
  return [...tasks].sort((a, b) => {
    if (!a.due_date && !b.due_date) return 0;
    if (!a.due_date) return 1;
    if (!b.due_date) return -1;
    return parseISO(a.due_date).getTime() - parseISO(b.due_date).getTime();
  });
}
