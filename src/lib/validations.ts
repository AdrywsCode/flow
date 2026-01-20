import { z } from "zod";
import { taskPriorities, taskStatuses } from "@/lib/constants";

export const projectSchema = z.object({
  name: z.string().min(1, "Nome obrigatorio").max(120)
});

export const projectUpdateSchema = projectSchema.partial();

export const taskSchema = z.object({
  title: z.string().min(1, "Titulo obrigatorio").max(160),
  description: z.string().max(2000).optional().nullable(),
  status: z.enum(taskStatuses),
  priority: z.enum(taskPriorities).default("medium"),
  due_date: z.string().optional().nullable(),
  project_id: z.string().uuid().optional().nullable()
});

export const taskUpdateSchema = taskSchema.partial();

export const taskStatusSchema = z.object({
  status: z.enum(taskStatuses)
});

export const filtersSchema = z.object({
  status: z.enum(taskStatuses).optional(),
  priority: z.enum(taskPriorities).optional(),
  project: z.string().uuid().optional(),
  overdue: z.string().optional(),
  q: z.string().optional()
});
