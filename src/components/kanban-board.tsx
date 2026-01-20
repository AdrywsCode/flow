import { taskStatusLabels } from "@/lib/constants";
import { groupTasksByStatus } from "@/lib/filters";
import type { Task } from "@/lib/types";
import { TaskCard } from "@/components/task-card";

type KanbanBoardProps = {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
};

const columns = [
  { key: "todo", title: taskStatusLabels.todo },
  { key: "doing", title: taskStatusLabels.doing },
  { key: "done", title: taskStatusLabels.done }
] as const;

export function KanbanBoard({ tasks, onEdit, onDelete }: KanbanBoardProps) {
  const grouped = groupTasksByStatus(tasks);

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {columns.map((column) => (
        <section key={column.key} className="space-y-4 rounded-3xl border bg-white/60 p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              {column.title}
            </h2>
            <span className="rounded-full border bg-white px-2 text-xs">
              {grouped[column.key].length}
            </span>
          </div>
          <div className="space-y-4">
            {grouped[column.key].length === 0 ? (
              <p className="rounded-2xl border border-dashed bg-white/80 p-4 text-sm text-muted-foreground">
                Sem tarefas por aqui.
              </p>
            ) : (
              grouped[column.key].map((task) => (
                <TaskCard key={task.id} task={task} onEdit={onEdit} onDelete={onDelete} />
              ))
            )}
          </div>
        </section>
      ))}
    </div>
  );
}
