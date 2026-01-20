import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { apiError } from "@/lib/api";
import { projectUpdateSchema } from "@/lib/validations";

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
  const parsed = projectUpdateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(apiError("Dados invalidos"), { status: 400 });
  }

  const { data, error } = await supabase
    .from("projects")
    .update(parsed.data)
    .eq("id", params.id)
    .select("*")
    .single();

  if (error) {
    return NextResponse.json(apiError(error.message), { status: 400 });
  }

  return NextResponse.json({ success: true, data });
}

export async function DELETE(_: Request, { params }: Params) {
  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(apiError("Nao autenticado"), { status: 401 });
  }

  const { error } = await supabase.from("projects").delete().eq("id", params.id);

  if (error) {
    return NextResponse.json(apiError(error.message), { status: 400 });
  }

  return NextResponse.json({ success: true, data: { id: params.id } });
}
