import type { TaskPriority, TaskStatus } from "@/lib/constants";

export type Project = {
  id: string;
  name: string;
  created_at: string;
};

export type Task = {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  due_date: string | null;
  project_id: string | null;
  created_at: string;
  updated_at: string;
  project?: Project | null;
};
