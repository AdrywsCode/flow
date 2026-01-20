import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import { Toaster } from "sonner";
import "@/app/globals.css";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space" });

export const metadata: Metadata = {
  title: "TaskFlow",
  description: "Gerenciador de tarefas com projetos, kanban e filtros.",
  manifest: "/manifest.webmanifest"
};

export const viewport = {
  themeColor: "#f97316"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={`${spaceGrotesk.variable} min-h-screen font-sans`}>
        <div className="grain min-h-screen">{children}</div>
        <Toaster richColors />
      </body>
    </html>
  );
}
