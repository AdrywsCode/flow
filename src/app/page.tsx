import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";

export default async function HomePage() {
  if (isSupabaseConfigured) {
    const supabase = createClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (user) {
      redirect("/app");
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col items-start justify-center gap-8 px-6 py-16">
      <div className="inline-flex items-center gap-2 rounded-full border bg-white/70 px-4 py-1 text-sm">
        <span className="h-2 w-2 rounded-full bg-emerald-500" />
        Organize sua rotina com clareza
      </div>
      <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">
        TaskFlow. Planeje projetos, priorize tarefas e avance no seu ritmo.
      </h1>
      <p className="max-w-2xl text-lg text-muted-foreground">
        Um gerenciador de tarefas focado em produtividade pessoal, com Kanban, filtros inteligentes e
        feedbacks visuais para manter o foco.
      </p>
      {isSupabaseConfigured ? (
        <div className="flex flex-wrap gap-4">
          <Button asChild size="lg">
            <Link href="/auth/register">Criar conta</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/auth/login">Entrar</Link>
          </Button>
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed bg-white/80 p-4 text-sm text-muted-foreground">
          Configure o Supabase em `.env.local` para habilitar login e dados reais.
        </div>
      )}
    </main>
  );
}
