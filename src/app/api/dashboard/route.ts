import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { apiError } from "@/lib/api";
import { filtersSchema } from "@/lib/validations";

export async function GET(request: Request) {
  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(apiError("Nao autenticado"), { status: 401 });
  }

  const url = new URL(request.url);
  const parsedFilters = filtersSchema.safeParse({
    status: url.searchParams.get("status") ?? undefined,
    priority: url.searchParams.get("priority") ?? undefined,
    project: url.searchParams.get("project") ?? undefined,
    overdue: url.searchParams.get("overdue") ?? undefined,
    q: url.searchParams.get("q") ?? undefined
  });

  if (!parsedFilters.success) {
    return NextResponse.json(apiError("Filtros invalidos"), { status: 400 });
  }

  let tasksQuery = supabase
    .from("tasks")
    .select(
      "id, title, description, status, priority, due_date, project_id, created_at, updated_at, project:projects(id, name)"
    )
    .order("created_at", { ascending: false });

  const { status, priority, project, overdue, q } = parsedFilters.data;

  if (status) tasksQuery = tasksQuery.eq("status", status);
  if (priority) tasksQuery = tasksQuery.eq("priority", priority);
  if (project) tasksQuery = tasksQuery.eq("project_id", project);
  if (overdue) {
    const today = new Date().toISOString().slice(0, 10);
    tasksQuery = tasksQuery.lt("due_date", today);
  }
  if (q) {
    tasksQuery = tasksQuery.or(`title.ilike.%${q}%,description.ilike.%${q}%`);
  }

  const projectsQuery = supabase.from("projects").select("*").order("created_at", { ascending: true });

  const [{ data: tasks, error: tasksError }, { data: projects, error: projectsError }] =
    await Promise.all([tasksQuery, projectsQuery]);

  if (tasksError) {
    return NextResponse.json(apiError(tasksError.message), { status: 400 });
  }

  if (projectsError) {
    return NextResponse.json(apiError(projectsError.message), { status: 400 });
  }

  return NextResponse.json({ success: true, data: { projects, tasks } });
}
