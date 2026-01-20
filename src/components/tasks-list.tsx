import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Task } from "@/lib/types";

type TasksListProps = {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onMove: (task: Task, status: Task["status"]) => void;
};

const priorityVariant = {
  low: "default",
  medium: "warning",
  high: "danger"
} as const;

export function TasksList({ tasks, onEdit, onDelete, onMove }: TasksListProps) {
  if (tasks.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed bg-white/80 p-6 text-sm text-muted-foreground">
        Nenhuma tarefa encontrada com os filtros atuais.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <div
          key={task.id}
          className="flex flex-col gap-4 rounded-2xl border bg-white p-4 transition duration-200 hover:-translate-y-0.5 hover:shadow-md md:flex-row"
        >
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold">{task.title}</h3>
              <Badge variant={priorityVariant[task.priority]}>{task.priority}</Badge>
              <Badge>{task.status}</Badge>
            </div>
            {task.description && <p className="text-xs text-muted-foreground">{task.description}</p>}
            <div className="text-xs text-muted-foreground">
              {task.project?.name ?? "Sem projeto"}
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="outline" onClick={() => onMove(task, "todo")}>
              Todo
            </Button>
            <Button size="sm" variant="outline" onClick={() => onMove(task, "doing")}>
              Doing
            </Button>
            <Button size="sm" variant="outline" onClick={() => onMove(task, "done")}>
              Done
            </Button>
            <Button size="sm" variant="secondary" onClick={() => onEdit(task)}>
              Editar
            </Button>
            <Button size="sm" variant="destructive" onClick={() => onDelete(task)}>
              Excluir
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
