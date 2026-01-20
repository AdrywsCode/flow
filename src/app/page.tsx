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
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col items-start gap-8 px-6 py-16">
      <div className="inline-flex animate-fade-up items-center gap-2 rounded-full border bg-white/70 px-4 py-1 text-sm">
        <span className="h-2 w-2 rounded-full bg-emerald-500" />
        Organize sua rotina com clareza
      </div>
      <div className="grid w-full gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div className="space-y-6">
          <h1 className="text-4xl font-semibold tracking-tight md:text-6xl animate-fade-up [animation-delay:120ms]">
            TaskFlow. Planeje projetos, priorize tarefas e avance no seu ritmo.
          </h1>
          <p className="max-w-2xl text-lg text-muted-foreground animate-fade-up [animation-delay:220ms]">
            Um gerenciador de tarefas focado em produtividade pessoal, com quadro, filtros inteligentes e
            feedbacks visuais para manter o foco.
          </p>
          {isSupabaseConfigured ? (
            <div className="flex flex-wrap gap-4 animate-fade-up [animation-delay:320ms]">
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
        </div>

        <div className="relative mx-auto w-full max-w-md animate-fade-up [animation-delay:320ms]">
          <div className="absolute -left-6 top-6 h-24 w-24 rounded-full bg-amber-200/70 blur-2xl" />
          <div className="rounded-3xl border bg-white/80 p-5 shadow-lg">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Quadro rapido</span>
              <span>Hoje</span>
            </div>
            <div className="mt-4 space-y-3">
              <div className="rounded-2xl border bg-white p-3 shadow-sm">
                <p className="text-sm font-semibold text-stone-900">Refinar portfolio</p>
                <p className="text-xs text-muted-foreground">Prioridade alta</p>
              </div>
              <div className="rounded-2xl border bg-white p-3 shadow-sm">
                <p className="text-sm font-semibold text-stone-900">Revisar tarefas do time</p>
                <p className="text-xs text-muted-foreground">Projeto trabalho</p>
              </div>
              <div className="rounded-2xl border bg-white p-3 shadow-sm">
                <p className="text-sm font-semibold text-stone-900">Estudar para prova</p>
                <p className="text-xs text-muted-foreground">Projeto faculdade</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <section className="mt-8 grid gap-4 md:grid-cols-3">
        {[
          {
            title: "Quadro fluido",
            description: "Visualize o progresso com colunas claras e movimento rapido."
          },
          {
            title: "Prioridades claras",
            description: "Destaque do que precisa de atencao hoje."
          },
          {
            title: "Projetos organizados",
            description: "Separe trabalho, estudo e vida pessoal sem friccao."
          }
        ].map((feature) => (
          <div
            key={feature.title}
            className="rounded-3xl border bg-white/70 p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md animate-fade-up"
          >
            <h3 className="text-base font-semibold text-stone-900">{feature.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
          </div>
        ))}
      </section>

      <section className="mt-14 grid gap-6 rounded-3xl border bg-white/80 p-8 md:grid-cols-3">
        {[
          { step: "01", title: "Crie seus projetos", text: "Separe por areas e mantenha o foco." },
          { step: "02", title: "Distribua tarefas", text: "Defina prioridades e datas-chave." },
          { step: "03", title: "Arraste no quadro", text: "Acompanhe o progresso em tempo real." }
        ].map((item) => (
          <div key={item.step} className="space-y-3">
            <div className="text-sm font-semibold text-stone-500">{item.step}</div>
            <h3 className="text-lg font-semibold text-stone-900">{item.title}</h3>
            <p className="text-sm text-muted-foreground">{item.text}</p>
          </div>
        ))}
      </section>

      <section className="mt-14 w-full rounded-3xl border bg-white/70 p-8">
        <h2 className="text-2xl font-semibold text-stone-900">Perguntas frequentes</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {[
            {
              q: "Preciso pagar para usar?",
              a: "Nao. O app funciona com Supabase gratuito e deploy na Vercel."
            },
            {
              q: "Posso usar no celular?",
              a: "Sim. O layout e responsivo e pode ser instalado como PWA."
            },
            {
              q: "Meus dados ficam seguros?",
              a: "Sim. As politicas RLS garantem que cada usuario veja apenas seus dados."
            },
            {
              q: "Tem modo lista e quadro?",
              a: "Sim. Voce alterna quando quiser, mantendo os mesmos filtros."
            }
          ].map((item) => (
            <div key={item.q} className="rounded-2xl border bg-white p-4 shadow-sm">
              <h3 className="text-sm font-semibold text-stone-900">{item.q}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{item.a}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
