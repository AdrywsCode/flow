import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import type { Project } from "@/lib/types";

type ProjectSelectProps = {
  projects: Project[];
  value?: string | null;
  onChange: (value: string | null) => void;
  label?: string;
};

export function ProjectSelect({ projects, value, onChange, label = "Projeto" }: ProjectSelectProps) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Select value={value ?? "none"} onValueChange={(next) => onChange(next === "none" ? null : next)}>
        <SelectTrigger>
          <SelectValue placeholder="Selecione" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">Sem projeto</SelectItem>
          {projects.map((project) => (
            <SelectItem key={project.id} value={project.id}>
              {project.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
