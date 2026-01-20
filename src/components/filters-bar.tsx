import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Project } from "@/lib/types";
import { taskPriorities, taskStatuses } from "@/lib/constants";

export type FiltersState = {
  status?: string;
  priority?: string;
  project?: string;
  overdue?: boolean;
  q?: string;
};

type FiltersBarProps = {
  projects: Project[];
  value: FiltersState;
  onChange: (value: FiltersState) => void;
};

export function FiltersBar({ projects, value, onChange }: FiltersBarProps) {
  return (
    <div className="grid gap-4 rounded-2xl border bg-white/70 p-4 md:grid-cols-5">
      <div className="space-y-2">
        <Label>Status</Label>
        <Select
          value={value.status ?? "all"}
          onValueChange={(status) => onChange({ ...value, status: status === "all" ? undefined : status })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            {taskStatuses.map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Prioridade</Label>
        <Select
          value={value.priority ?? "all"}
          onValueChange={(priority) =>
            onChange({ ...value, priority: priority === "all" ? undefined : priority })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            {taskPriorities.map((priority) => (
              <SelectItem key={priority} value={priority}>
                {priority}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Projeto</Label>
        <Select
          value={value.project ?? "all"}
          onValueChange={(project) =>
            onChange({ ...value, project: project === "all" ? undefined : project })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            {projects.map((project) => (
              <SelectItem key={project.id} value={project.id}>
                {project.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Busca</Label>
        <Input
          placeholder="Titulo ou descricao"
          value={value.q ?? ""}
          onChange={(event) => onChange({ ...value, q: event.target.value })}
        />
      </div>

      <div className="flex items-end gap-2">
        <button
          type="button"
          className={`flex h-10 w-full items-center justify-center rounded-md border px-3 text-sm ${
            value.overdue ? "bg-rose-100 text-rose-900" : "bg-white/60"
          }`}
          onClick={() => onChange({ ...value, overdue: !value.overdue })}
        >
          {value.overdue ? "Vencidas" : "Mostrar vencidas"}
        </button>
      </div>
    </div>
  );
}
