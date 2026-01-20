import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { apiError } from "@/lib/api";
import { filtersSchema, taskSchema } from "@/lib/validations";

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

  let query = supabase
    .from("tasks")
    .select(
      "id, title, description, status, priority, due_date, project_id, created_at, updated_at, project:projects(id, name)"
    )
    .order("created_at", { ascending: false });

  const { status, priority, project, overdue, q } = parsedFilters.data;

  if (status) query = query.eq("status", status);
  if (priority) query = query.eq("priority", priority);
  if (project) query = query.eq("project_id", project);
  if (overdue) {
    const today = new Date().toISOString().slice(0, 10);
    query = query.lt("due_date", today);
  }
  if (q) {
    query = query.or(`title.ilike.%${q}%,description.ilike.%${q}%`);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json(apiError(error.message), { status: 400 });
  }

  return NextResponse.json({ success: true, data });
}

export async function POST(request: Request) {
  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(apiError("Nao autenticado"), { status: 401 });
  }

  const body = await request.json();
  const parsed = taskSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(apiError("Dados invalidos"), { status: 400 });
  }

  const { data, error } = await supabase
    .from("tasks")
    .insert({ ...parsed.data, user_id: user.id })
    .select(
      "id, title, description, status, priority, due_date, project_id, created_at, updated_at, project:projects(id, name)"
    )
    .single();

  if (error) {
    return NextResponse.json(apiError(error.message), { status: 400 });
  }

  return NextResponse.json({ success: true, data }, { status: 201 });
}
