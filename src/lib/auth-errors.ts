export function friendlyAuthError(message: string): string {
  const lower = message.toLowerCase();

  if (
    lower.includes("invalid api key") ||
    lower.includes("invalid jwt") ||
    lower.includes("unauthorized") ||
    lower.includes("api error") ||
    message === "401"
  ) {
    return "Supabase rejected the API key (401). In Supabase → Settings → API Keys, copy the legacy anon public key (starts with eyJ…) into NEXT_PUBLIC_SUPABASE_ANON_KEY. If you use Vercel, add it there too and redeploy.";
  }

  if (lower.includes("invalid login credentials")) {
    return "That email or password doesn’t look right. Please try again.";
  }
  if (lower.includes("email not confirmed")) {
    return "Please confirm your email first, then log in.";
  }
  if (lower.includes("user already registered")) {
    return "An account with this email already exists. Try logging in instead.";
  }
  if (lower.includes("password")) {
    return "Password should be at least 6 characters.";
  }
  return message;
}
