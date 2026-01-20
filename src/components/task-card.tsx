import { format, parseISO } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Task } from "@/lib/types";

type TaskCardProps = {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onMove: (task: Task, status: Task["status"]) => void;
};

const priorityVariant = {
  low: "default",
  medium: "warning",
  high: "danger"
} as const;

export function TaskCard({ task, onEdit, onDelete, onMove }: TaskCardProps) {
  const nextStatuses: Task["status"][] =
    task.status === "todo"
      ? ["doing", "done"]
      : task.status === "doing"
        ? ["done", "todo"]
        : ["todo", "doing"];

  return (
    <div className="space-y-3 rounded-2xl border bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold">{task.title}</h3>
          {task.description && <p className="mt-1 text-xs text-muted-foreground">{task.description}</p>}
        </div>
        <Badge variant={priorityVariant[task.priority]}>{task.priority}</Badge>
      </div>

      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <span className="rounded-full border px-2 py-0.5">{task.status}</span>
        {task.project?.name && <span>{task.project.name}</span>}
        {task.due_date && <span>{format(parseISO(task.due_date), "dd/MM/yyyy")}</span>}
      </div>

      <div className="flex flex-wrap gap-2">
        {nextStatuses.map((status) => (
          <Button
            key={status}
            size="sm"
            variant="outline"
            onClick={() => onMove(task, status)}
          >
            Mover para {status === "todo" ? "Todo" : status === "doing" ? "Doing" : "Done"}
          </Button>
        ))}
        <Button size="sm" variant="secondary" onClick={() => onEdit(task)}>
          Editar
        </Button>
        <Button size="sm" variant="destructive" onClick={() => onDelete(task)}>
          Excluir
        </Button>
      </div>
    </div>
  );
}
