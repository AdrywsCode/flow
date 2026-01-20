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
import { Github, Chrome } from "lucide-react";
import type { Provider } from "@supabase/supabase-js";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

type FormValues = z.infer<typeof schema>;

export default function LoginPage() {
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
    const { error } = await supabase.auth.signInWithPassword(values);
    if (error) {
      toast.error("Falha no login", { description: error.message });
      return;
    }
    toast.success("Login efetuado");
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
        <h1 className="text-2xl font-semibold text-stone-900">Entrar</h1>
        <p className="text-sm text-stone-600">Acesse sua conta para continuar.</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Button
          variant="outline"
          className="border-stone-200 bg-white/80 text-stone-700 hover:bg-white"
          type="button"
          onClick={() => handleOAuth("google")}
        >
          <Chrome className="h-4 w-4" />
          <span className="text-stone-600">Entrar com</span>
          <span className="font-semibold">
            <span className="text-[#4285F4]">G</span>
            <span className="text-[#EA4335]">o</span>
            <span className="text-[#FBBC05]">o</span>
            <span className="text-[#4285F4]">g</span>
            <span className="text-[#34A853]">l</span>
            <span className="text-[#EA4335]">e</span>
          </span>
        </Button>
        <Button
          variant="outline"
          className="border-[#6e40c9] bg-white/80 text-[#6e40c9] hover:bg-white"
          type="button"
          onClick={() => handleOAuth("github")}
        >
          <Github className="h-4 w-4" />
          Entrar com GitHub
        </Button>
      </div>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-2">
          <Label htmlFor="email" className="text-xs text-stone-600">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="voce@email.com"
            className="border-stone-300 bg-white/80 text-stone-900 placeholder:text-stone-400"
            {...form.register("email")}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password" className="text-xs text-stone-600">
            Senha
          </Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            className="border-stone-300 bg-white/80 text-stone-900 placeholder:text-stone-400"
            {...form.register("password")}
          />
        </div>
        <Button
          type="submit"
          className="h-12 w-full bg-[var(--auth-accent)] text-white hover:brightness-95"
          disabled={form.formState.isSubmitting}
        >
          Entrar
        </Button>
      </form>
      <p className="text-center text-sm text-stone-600">
        Ainda nao tem conta?{" "}
        <Link className="font-semibold text-stone-900" href="/auth/register">
          Criar conta
        </Link>
      </p>
    </div>
  );
}
