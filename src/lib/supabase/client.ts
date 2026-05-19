import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseEnv } from "./env";

export function createClient() {
  const env = getSupabaseEnv();
  if (!env.ok) {
    throw new Error(env.message);
  }
  return createBrowserClient(env.url, env.key);
}

export function getSupabaseConfigError(): string | null {
  const env = getSupabaseEnv();
  return env.ok ? null : env.message;
}
