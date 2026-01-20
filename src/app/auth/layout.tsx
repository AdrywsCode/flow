import type { CSSProperties } from "react";
import { Fraunces, Space_Grotesk } from "next/font/google";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-fraunces"
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-space"
});

const authVariant = "minimal" as const;

const variants = {
  editorial: {
    accent: "#1d4ed8",
    accentSoft: "#dbeafe",
    canvas: "bg-[radial-gradient(circle_at_top,_#f4efe8_0%,_#efe4d2_45%,_#f7f5f2_100%)]",
    panel: "bg-white/80",
    left: "bg-[radial-gradient(circle_at_top,_#f8d7b0_0%,_#f4e6da_48%,_#24150f_100%)] text-stone-900",
    leftPattern:
      "after:absolute after:inset-0 after:bg-[radial-gradient(circle_at_20%_20%,_rgba(255,255,255,0.6),_transparent_55%)] after:content-['']",
    badge: "bg-white/80 text-stone-800",
    step: "bg-white text-stone-900",
    stepMuted: "bg-white/60 text-stone-700",
    headline: "Comece sua jornada com foco total",
    subtitle: "Crie projetos, priorize tarefas e acompanhe sua evolucao com um quadro elegante."
  },
  retro: {
    accent: "#22d3ee",
    accentSoft: "#164e63",
    canvas: "bg-[radial-gradient(circle_at_top,_#0f172a_0%,_#0b0f1a_55%,_#05070b_100%)]",
    panel: "bg-[#0f172a]/70",
    left:
      "bg-[radial-gradient(circle_at_top,_#111827_0%,_#0b1120_50%,_#030712_100%)] text-slate-100",
    leftPattern:
      "after:absolute after:inset-0 after:bg-[linear-gradient(transparent_85%,_rgba(34,211,238,0.12)_100%)] after:content-[''] before:absolute before:inset-0 before:bg-[linear-gradient(90deg,_rgba(34,211,238,0.08)_1px,_transparent_1px)] before:bg-[length:32px_32px] before:content-['']",
    badge: "bg-white/10 text-slate-100",
    step: "bg-white/10 text-slate-100",
    stepMuted: "bg-white/5 text-slate-300",
    headline: "Controle o caos, domine o fluxo",
    subtitle: "Sua central de foco com visual futurista e atalhos rapidos."
  },
  minimal: {
    accent: "#ea580c",
    accentSoft: "#ffedd5",
    canvas: "bg-[radial-gradient(circle_at_top,_#fff7ed_0%,_#fef3c7_50%,_#f8fafc_100%)]",
    panel: "bg-white",
    left:
      "bg-[radial-gradient(circle_at_top,_#fef3c7_0%,_#fde68a_45%,_#f1f5f9_100%)] text-stone-900",
    leftPattern:
      "after:absolute after:-right-16 after:top-10 after:h-40 after:w-40 after:rounded-full after:bg-[#fb923c]/30 after:content-[''] before:absolute before:-left-10 before:bottom-10 before:h-28 before:w-28 before:rounded-full before:bg-[#0f172a]/10 before:content-['']",
    badge: "bg-white/80 text-stone-900",
    step: "bg-white text-stone-900",
    stepMuted: "bg-white/70 text-stone-700",
    headline: "Clareza total para o seu dia",
    subtitle: "Um painel direto ao ponto para voce ganhar ritmo."
  }
};

const theme = variants[authVariant];

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main
      className={`${fraunces.variable} ${spaceGrotesk.variable} min-h-screen px-4 py-10 md:px-10 ${theme.canvas}`}
      style={
        {
          "--auth-accent": theme.accent,
          "--auth-accent-soft": theme.accentSoft
        } as CSSProperties
      }
    >
      <div className="mx-auto grid min-h-[80vh] w-full max-w-5xl overflow-hidden rounded-[32px] border border-white/40 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.45)] md:grid-cols-2">
        <section
          className={`relative hidden flex-col justify-center gap-8 px-6 py-12 md:flex md:px-12 ${theme.left} ${theme.leftPattern}`}
        >
          <div
            className={`relative z-10 inline-flex items-center gap-3 rounded-full border border-white/60 bg-white/90 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-700 shadow-sm ${theme.badge}`}
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-stone-900 text-white">
              TF
            </span>
            <span className="tracking-[0.24em] text-current">TaskFlow</span>
          </div>
          <div className="relative z-10">
            <h1 className="text-3xl font-semibold md:text-4xl font-[var(--font-fraunces)]">
              {theme.headline}
            </h1>
            <p className="mt-3 text-sm opacity-80">{theme.subtitle}</p>
          </div>
          <div className="relative z-10 space-y-3">
            <div className={`rounded-2xl px-4 py-3 text-sm font-semibold shadow-sm ${theme.step}`}>
              <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-stone-900 text-white">
                1
              </span>
              Crie sua conta em segundos
            </div>
            <div className={`rounded-2xl px-4 py-3 text-sm ${theme.stepMuted}`}>
              <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/70 text-stone-700">
                2
              </span>
              Organize projetos e prioridades
            </div>
            <div className={`rounded-2xl px-4 py-3 text-sm ${theme.stepMuted}`}>
              <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/70 text-stone-700">
                3
              </span>
              Arraste tarefas no quadro
            </div>
          </div>
        </section>
        <section className={`flex items-center justify-center px-6 py-12 md:px-12 ${theme.panel}`}>
          <div className="w-full max-w-md font-[var(--font-space)] text-stone-900">
            {children}
          </div>
        </section>
      </div>
    </main>
  );
}
