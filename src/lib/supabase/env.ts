export function getSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

  if (!url || !key) {
    return {
      ok: false as const,
      message:
        "Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local (local) or Vercel Environment Variables (deployed), then restart or redeploy.",
    };
  }

  if (key.startsWith("sb_secret_") || key.includes("service_role")) {
    return {
      ok: false as const,
      message:
        "Wrong Supabase key: use the publishable or anon public key, not a secret or service_role key.",
    };
  }

  return { ok: true as const, url, key };
}
