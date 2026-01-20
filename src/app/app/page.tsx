"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { FiltersBar, type FiltersState } from "@/components/filters-bar";
import { KanbanBoard } from "@/components/kanban-board";
import { TasksList } from "@/components/tasks-list";
import { TaskModal } from "@/components/task-modal";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/env";
import { useDebouncedValue } from "@/lib/use-debounced-value";
import type { Project, Task } from "@/lib/types";
import { createProject, deleteProject, fetchProjects, updateProject } from "@/services/projects";
import { createTask, deleteTask, fetchTasks, updateTask, updateTaskStatus } from "@/services/tasks";
import { ClipboardList, Folder, KanbanSquare, LayoutGrid, Settings, User } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filters, setFilters] = useState<FiltersState>({});
  const [loading, setLoading] = useState(true);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [view, setView] = useState<"kanban" | "list">("kanban");
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const debouncedQuery = useDebouncedValue(filters.q ?? "", 400);

  const fetchFilters = useMemo(() => {
    return {
      status: filters.status,
      priority: filters.priority,
      project: filters.project,
      overdue: filters.overdue ? "1" : undefined,
      q: debouncedQuery.trim() ? debouncedQuery : undefined
    };
  }, [filters, debouncedQuery]);

  const loadProjects = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setProjects([]);
      setProjectsLoading(false);
      return;
    }
    try {
      setProjectsLoading(true);
      const data = await fetchProjects();
      setProjects(data);
    } catch (error) {
      toast.error("Erro ao carregar projetos", { description: String(error) });
    } finally {
      setProjectsLoading(false);
    }
  }, []);

  const loadTasks = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setTasks([]);
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const data = await fetchTasks(fetchFilters);
      setTasks(data);
    } catch (error) {
      toast.error("Erro ao carregar tarefas", { description: String(error) });
    } finally {
      setLoading(false);
    }
  }, [fetchFilters]);

  useEffect(() => {
    void loadProjects();
  }, [loadProjects]);

  useEffect(() => {
    void loadTasks();
  }, [loadTasks]);

  const handleLogout = async () => {
    if (!isSupabaseConfigured) {
      router.push("/auth/login");
      return;
    }
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  const handleSaveProject = async () => {
    if (!projectName.trim()) {
      toast.error("Informe o nome do projeto");
      return;
    }

    try {
      if (editingProject) {
        await updateProject(editingProject.id, { name: projectName });
        toast.success("Projeto atualizado");
      } else {
        await createProject({ name: projectName });
        toast.success("Projeto criado");
      }
      setProjectModalOpen(false);
      setProjectName("");
      setEditingProject(null);
      await loadProjects();
    } catch (error) {
      toast.error("Erro ao salvar projeto", { description: String(error) });
    }
  };

  const handleDeleteProject = async (project: Project) => {
    if (!confirm(`Excluir o projeto "${project.name}"?`)) return;
    try {
      await deleteProject(project.id);
      toast.success("Projeto removido");
      await loadProjects();
      await loadTasks();
    } catch (error) {
      toast.error("Erro ao excluir projeto", { description: String(error) });
    }
  };

  const handleSaveTask = async (values: {
    title: string;
    description?: string | null;
    status: Task["status"];
    priority: Task["priority"];
    due_date?: string | null;
    project_id?: string | null;
  }, taskId?: string) => {
    const payload = {
      ...values,
      due_date: values.due_date || null,
      project_id: values.project_id || null
    };

    try {
      if (taskId) {
        await updateTask(taskId, payload);
        toast.success("Tarefa atualizada");
      } else {
        await createTask(payload);
        toast.success("Tarefa criada");
      }
      setTaskModalOpen(false);
      setSelectedTask(null);
      await loadTasks();
    } catch (error) {
      toast.error("Erro ao salvar tarefa", { description: String(error) });
    }
  };

  const handleDeleteTask = async (task: Task) => {
    if (!confirm(`Excluir a tarefa "${task.title}"?`)) return;
    try {
      await deleteTask(task.id);
      toast.success("Tarefa removida");
      await loadTasks();
    } catch (error) {
      toast.error("Erro ao excluir tarefa", { description: String(error) });
    }
  };

  const handleMoveTask = async (task: Task, status: Task["status"]) => {
    try {
      await updateTaskStatus(task.id, status);
      await loadTasks();
    } catch (error) {
      toast.error("Erro ao mover tarefa", { description: String(error) });
    }
  };

  return (
    <main className="min-h-screen px-6 py-10">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[240px_1fr]">
        <aside className="hidden h-full rounded-3xl border bg-white/70 p-4 lg:flex lg:flex-col lg:gap-4">
          <div className="rounded-2xl border bg-white px-3 py-3">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Menu</p>
            <div className="mt-3 space-y-1">
              {[
                { label: "Dashboard", icon: LayoutGrid, active: true },
                { label: "Projetos", icon: Folder },
                { label: "Tarefas", icon: ClipboardList },
                { label: "Kanban", icon: KanbanSquare },
                { label: "Perfil", icon: User },
                { label: "Ajustes", icon: Settings }
              ].map((item) => (
                <button
                  key={item.label}
                  type="button"
                  className={`flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm ${
                    item.active ? "bg-stone-900 text-white" : "text-stone-600 hover:bg-white"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </button>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border bg-white/80 p-3 text-xs text-muted-foreground">
            Dica: use os filtros para focar no que importa hoje.
          </div>
        </aside>

        <div className="flex flex-col gap-8">
          <header className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-semibold">Painel de tarefas</h1>
              <p className="text-sm text-muted-foreground">
                Organize projetos, acompanhe prioridades e mova tarefas rapidamente.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                data-testid="new-project-button"
                variant="outline"
                onClick={() => {
                  setProjectName("");
                  setEditingProject(null);
                  setProjectModalOpen(true);
                }}
              >
                Novo projeto
              </Button>
              <Button
                data-testid="new-task-button"
                onClick={() => {
                  setSelectedTask(null);
                  setTaskModalOpen(true);
                }}
              >
                Nova tarefa
              </Button>
              <Button variant="secondary" onClick={handleLogout}>
                Sair
              </Button>
            </div>
          </header>
          {!isSupabaseConfigured && (
            <div className="rounded-2xl border border-dashed bg-white/80 p-4 text-sm text-muted-foreground">
              Supabase nao configurado. Defina as variaveis em `.env.local` para habilitar login e
              dados persistentes.
            </div>
          )}

          <section className="grid gap-6 lg:grid-cols-[260px_1fr]">
            <aside className="space-y-4 rounded-3xl border bg-white/70 p-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Projetos
                </h2>
                <span className="rounded-full border bg-white px-2 text-xs">{projects.length}</span>
              </div>
              <Separator />
              {projectsLoading ? (
                <p className="text-sm text-muted-foreground">Carregando projetos...</p>
              ) : projects.length === 0 ? (
                <p className="text-sm text-muted-foreground">Nenhum projeto criado ainda.</p>
              ) : (
                <div className="space-y-2">
                  {projects.map((project) => (
                    <div key={project.id} className="rounded-xl border bg-white p-3">
                      <p className="text-sm font-medium">{project.name}</p>
                      <div className="mt-2 flex gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => {
                            setEditingProject(project);
                            setProjectName(project.name);
                            setProjectModalOpen(true);
                          }}
                        >
                          Renomear
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDeleteProject(project)}>
                          Excluir
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </aside>

            <div className="space-y-6">
              <FiltersBar projects={projects} value={filters} onChange={setFilters} />

              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex gap-2">
                  <Button variant={view === "kanban" ? "default" : "outline"} onClick={() => setView("kanban")}>
                    Kanban
                  </Button>
                  <Button variant={view === "list" ? "default" : "outline"} onClick={() => setView("list")}>
                    Lista
                  </Button>
                </div>
                <span className="text-sm text-muted-foreground">
                  {loading ? "Atualizando tarefas..." : `${tasks.length} tarefas`}
                </span>
              </div>

              {loading ? (
                <div className="rounded-2xl border border-dashed bg-white/80 p-6 text-sm text-muted-foreground">
                  Buscando tarefas...
                </div>
              ) : view === "kanban" ? (
                <KanbanBoard tasks={tasks} onEdit={(task) => {
                  setSelectedTask(task);
                  setTaskModalOpen(true);
                }} onDelete={handleDeleteTask} onMove={handleMoveTask} />
              ) : (
                <TasksList tasks={tasks} onEdit={(task) => {
                  setSelectedTask(task);
                  setTaskModalOpen(true);
                }} onDelete={handleDeleteTask} onMove={handleMoveTask} />
              )}
            </div>
          </section>
        </div>
      </div>

      <nav className="fixed bottom-4 left-1/2 z-40 flex w-[calc(100%-2rem)] max-w-md -translate-x-1/2 items-center justify-between rounded-2xl border bg-white/90 px-3 py-2 shadow-lg backdrop-blur lg:hidden">
        {[
          { label: "Home", icon: LayoutGrid, active: true },
          { label: "Projetos", icon: Folder },
          { label: "Tarefas", icon: ClipboardList },
          { label: "Kanban", icon: KanbanSquare },
          { label: "Perfil", icon: User }
        ].map((item) => (
          <button
            key={item.label}
            type="button"
            className={`flex flex-1 flex-col items-center gap-1 rounded-xl px-2 py-2 text-[11px] ${
              item.active ? "text-stone-900" : "text-stone-500"
            }`}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </button>
        ))}
      </nav>

      <TaskModal
        open={taskModalOpen}
        projects={projects}
        task={selectedTask}
        onClose={() => {
          setTaskModalOpen(false);
          setSelectedTask(null);
        }}
        onSubmit={handleSaveTask}
      />

      <Dialog open={projectModalOpen} onOpenChange={(value) => !value && setProjectModalOpen(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingProject ? "Editar projeto" : "Novo projeto"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="project-name">Nome do projeto</Label>
            <Input
              id="project-name"
              value={projectName}
              onChange={(event) => setProjectName(event.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setProjectModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveProject}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
