export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen px-4 py-8 md:px-10">
      <div className="mx-auto grid min-h-[80vh] w-full max-w-5xl overflow-hidden rounded-[32px] border border-white/5 bg-white/10 shadow-[0_30px_120px_rgba(0,0,0,0.25)] backdrop-blur md:grid-cols-2">
        <section className="relative flex flex-col justify-center gap-8 bg-gradient-to-b from-[#f7c38a] via-[#f4d8c9] to-[#1b120e] px-6 py-10 text-stone-900 md:px-12">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-stone-800">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-stone-900 text-white">
              TF
            </span>
            TaskFlow
          </div>
          <div>
            <h1 className="text-3xl font-semibold text-stone-900 md:text-4xl">
              Comece sua jornada com foco total
            </h1>
            <p className="mt-3 text-sm text-stone-700">
              Crie projetos, priorize tarefas e acompanhe sua evolucao com um Kanban elegante.
            </p>
          </div>
          <div className="space-y-3">
            <div className="rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-stone-900 shadow-sm">
              <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-stone-900 text-white">
                1
              </span>
              Crie sua conta em segundos
            </div>
            <div className="rounded-2xl bg-white/60 px-4 py-3 text-sm text-stone-700">
              <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-white text-stone-700">
                2
              </span>
              Organize projetos e prioridades
            </div>
            <div className="rounded-2xl bg-white/60 px-4 py-3 text-sm text-stone-700">
              <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-white text-stone-700">
                3
              </span>
              Arraste tarefas no Kanban
            </div>
          </div>
        </section>
        <section className="flex items-center justify-center bg-stone-900/80 px-6 py-10 md:px-12">
          <div className="w-full max-w-md text-white">{children}</div>
        </section>
      </div>
    </main>
  );
}
