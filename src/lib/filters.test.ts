import { describe, expect, it } from "vitest";
import { applyTaskFilters, groupTasksByStatus, sortTasksByDueDate } from "@/lib/filters";
import type { Task } from "@/lib/types";

const baseTask: Task = {
  id: "1",
  title: "Tarefa base",
  description: "Descricao",
  status: "todo",
  priority: "medium",
  due_date: null,
  project_id: "p1",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

describe("applyTaskFilters", () => {
  it("filtra por status, prioridade e busca", () => {
    const tasks: Task[] = [
      { ...baseTask, id: "1", title: "Comprar cafe", status: "todo", priority: "high" },
      { ...baseTask, id: "2", title: "Relatorio", status: "doing", priority: "low" },
      { ...baseTask, id: "3", title: "Cafe com o time", status: "todo", priority: "high" }
    ];

    const result = applyTaskFilters(tasks, { status: "todo", priority: "high", q: "cafe" });
    expect(result).toHaveLength(2);
  });
});

describe("helpers de agrupamento e ordenacao", () => {
  it("agrupa por status e ordena por data limite", () => {
    const tasks: Task[] = [
      { ...baseTask, id: "1", status: "todo", due_date: "2024-05-10" },
      { ...baseTask, id: "2", status: "done", due_date: "2024-05-01" },
      { ...baseTask, id: "3", status: "todo", due_date: "2024-05-05" }
    ];

    const grouped = groupTasksByStatus(tasks);
    expect(grouped.todo).toHaveLength(2);
    expect(grouped.done).toHaveLength(1);

    const sorted = sortTasksByDueDate(grouped.todo);
    expect(sorted[0].id).toBe("3");
  });
});
