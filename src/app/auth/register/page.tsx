"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/env";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Github, Chrome, Eye } from "lucide-react";
import type { Provider } from "@supabase/supabase-js";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

type FormValues = z.infer<typeof schema>;

export default function RegisterPage() {
  const router = useRouter();
  const form = useForm<FormValues>({
    resolver: zodResolver(schema)
  });

  const onSubmit = async (values: FormValues) => {
    if (!isSupabaseConfigured) {
      toast.error("Supabase nao configurado");
      return;
    }
    const supabase = createClient();
    const { error } = await supabase.auth.signUp(values);
    if (error) {
      toast.error("Falha no cadastro", { description: error.message });
      return;
    }
    toast.success("Conta criada", { description: "Verifique seu email se a confirmacao estiver ativa." });
    router.push("/app");
  };

  const handleOAuth = async (provider: Provider) => {
    if (!isSupabaseConfigured) {
      toast.error("Supabase nao configurado");
      return;
    }
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/app`
      }
    });
    if (error) {
      toast.error("Falha no login social", { description: error.message });
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-white">Criar conta</h1>
        <p className="text-sm text-zinc-400">Comece a organizar seus projetos.</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Button
          variant="outline"
          className="border-zinc-800 bg-transparent text-white hover:bg-zinc-900"
          type="button"
          onClick={() => handleOAuth("google")}
        >
          <Chrome className="h-4 w-4" />
          Criar com Google
        </Button>
        <Button
          variant="outline"
          className="border-zinc-800 bg-transparent text-white hover:bg-zinc-900"
          type="button"
          onClick={() => handleOAuth("github")}
        >
          <Github className="h-4 w-4" />
          Criar com Github
        </Button>
      </div>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-2">
          <Label htmlFor="email" className="text-xs text-zinc-400">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="voce@email.com"
            className="border-zinc-800 bg-zinc-900 text-white placeholder:text-zinc-600"
            {...form.register("email")}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password" className="text-xs text-zinc-400">
            Senha
          </Label>
          <div className="relative">
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              className="border-zinc-800 bg-zinc-900 text-white placeholder:text-zinc-600"
              {...form.register("password")}
            />
            <Eye className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-600" />
          </div>
        </div>
        <Button
          type="submit"
          className="h-12 w-full bg-white text-black hover:bg-zinc-200"
          disabled={form.formState.isSubmitting}
        >
          Criar conta
        </Button>
      </form>
      <p className="text-center text-sm text-zinc-400">
        Ja tem conta?{" "}
        <Link className="font-semibold text-white" href="/auth/login">
          Entrar
        </Link>
      </p>
    </div>
  );
}
