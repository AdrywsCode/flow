import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { env, isSupabaseConfigured } from "@/lib/env";

export function createClient() {
  if (!isSupabaseConfigured) {
    throw new Error("Supabase nao configurado. Defina as variaveis de ambiente.");
  }
  const cookieStore = cookies();

  return createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(
          cookiesToSet: {
            name: string;
            value: string;
            options: {
              path?: string;
              domain?: string;
              maxAge?: number;
              secure?: boolean;
              httpOnly?: boolean;
              sameSite?: "lax" | "strict" | "none";
            };
          }[]
        ) {
          cookiesToSet.forEach(({ name, value, options }) => {
            try {
              cookieStore.set({ name, value, ...options });
            } catch {
              // Ignore cookie writes when not in a Route Handler/Server Action.
            }
          });
        }
      }
    }
  );
}
