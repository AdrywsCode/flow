import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { apiError } from "@/lib/api";
import { taskStatusSchema } from "@/lib/validations";

type Params = { params: { id: string } };

export async function PATCH(request: Request, { params }: Params) {
  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(apiError("Nao autenticado"), { status: 401 });
  }

  const body = await request.json();
  const parsed = taskStatusSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(apiError("Status invalido"), { status: 400 });
  }

  const { data, error } = await supabase
    .from("tasks")
    .update({ status: parsed.data.status })
    .eq("id", params.id)
    .select(
      "id, title, description, status, priority, due_date, project_id, created_at, updated_at, project:projects(id, name)"
    )
    .single();

  if (error) {
    return NextResponse.json(apiError(error.message), { status: 400 });
  }

  return NextResponse.json({ success: true, data });
}
