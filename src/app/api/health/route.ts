import { getSupabaseEnv } from "@/lib/supabase/env";

/** Quick check that Supabase env vars are present (does not expose secrets). */
export async function GET() {
  const env = getSupabaseEnv();
  if (!env.ok) {
    return Response.json({ ok: false, error: env.message }, { status: 503 });
  }

  const key = env.key;
  const keyType = key.startsWith("eyJ")
    ? "anon"
    : key.startsWith("sb_publishable_")
      ? "publishable"
      : "other";

  return Response.json({
    ok: true,
    url: env.url,
    keyType,
    hint:
      keyType === "publishable"
        ? "If auth fails with API error, switch Vercel/local env to the legacy anon key (eyJ…)."
        : undefined,
  });
}
