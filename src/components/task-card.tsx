import { format, parseISO } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { taskPriorityLabels, taskStatusBadgeClasses, taskStatusLabels } from "@/lib/constants";
import type { Task } from "@/lib/types";

type TaskCardProps = {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
};

const priorityVariant = {
  low: "default",
  medium: "warning",
  high: "danger"
} as const;

export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  return (
    <div className="space-y-3 rounded-2xl border bg-white p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex min-w-0 items-start gap-2">
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-semibold">{task.title}</h3>
          {task.description && <p className="mt-1 text-xs text-muted-foreground">{task.description}</p>}
        </div>
        <Badge variant={priorityVariant[task.priority]}>{taskPriorityLabels[task.priority]}</Badge>
      </div>

      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <span
          className={`rounded-full border px-2 py-0.5 ${taskStatusBadgeClasses[task.status]}`}
        >
          {taskStatusLabels[task.status]}
        </span>
        {task.project?.name && <span>{task.project.name}</span>}
        {task.due_date && <span>{format(parseISO(task.due_date), "dd/MM/yyyy")}</span>}
      </div>

      <div className="flex flex-wrap gap-2">
        <Button size="sm" variant="secondary" className="h-auto px-3 py-1.5 text-xs" onClick={() => onEdit(task)}>
          Editar
        </Button>
        <Button size="sm" variant="destructive" className="h-auto px-3 py-1.5 text-xs" onClick={() => onDelete(task)}>
          Excluir
        </Button>
      </div>
    </div>
  );
}
