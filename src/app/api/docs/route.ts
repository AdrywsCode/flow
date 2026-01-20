import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { apiError } from "@/lib/api";
import { docFiltersSchema, docSchema } from "@/lib/validations";

export async function GET(request: Request) {
  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(apiError("Nao autenticado"), { status: 401 });
  }

  const url = new URL(request.url);
  const parsedFilters = docFiltersSchema.safeParse({
    language: url.searchParams.get("language") ?? undefined,
    visibility: url.searchParams.get("visibility") ?? undefined,
    q: url.searchParams.get("q") ?? undefined
  });

  if (!parsedFilters.success) {
    return NextResponse.json(apiError("Filtros invalidos"), { status: 400 });
  }

  let query = supabase
    .from("docs")
    .select("id, title, content, language, visibility, created_at, updated_at")
    .order("created_at", { ascending: false });

  const { language, visibility, q } = parsedFilters.data;

  if (language) query = query.eq("language", language);
  if (visibility) query = query.eq("visibility", visibility);
  if (q) {
    query = query.or(`title.ilike.%${q}%,content.ilike.%${q}%`);
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
  const parsed = docSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(apiError("Dados invalidos"), { status: 400 });
  }

  const { data, error } = await supabase
    .from("docs")
    .insert({ ...parsed.data, user_id: user.id })
    .select("id, title, content, language, visibility, created_at, updated_at")
    .single();

  if (error) {
    return NextResponse.json(apiError(error.message), { status: 400 });
  }

  return NextResponse.json({ success: true, data }, { status: 201 });
}
