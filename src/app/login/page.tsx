"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Music2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { friendlyAuthError } from "@/lib/auth-errors";
import { ThemeSelector } from "@/components/ThemeSelector";
import { FormField } from "@/components/FormField";
import { FeedbackAlert } from "@/components/ui/FeedbackAlert";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    if (mode === "signup") {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });
      setLoading(false);
      if (signUpError) {
        setError(friendlyAuthError(signUpError.message));
        return;
      }
      setMessage(
        "Account created! Check your email to confirm, then log in. (If email confirm is off, you can log in right away.)",
      );
      setMode("login");
      return;
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);

    if (signInError) {
      setError(friendlyAuthError(signInError.message));
      return;
    }

    router.push("/dashboard");
    router.refresh();
  };

  return (
    <div className="hero-gradient min-h-screen">
      <div className="absolute right-4 top-4 z-10">
        <ThemeSelector />
      </div>

      <div className="mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center gap-10 px-4 py-12 lg:flex-row lg:gap-16">
        <div className="max-w-lg text-center lg:text-left">
          <div className="mb-4 inline-flex rounded-full bg-primary/10 p-3 shadow-lg">
            <Music2 className="h-10 w-10 text-primary" aria-hidden />
          </div>
          <h1 className="page-title md:text-5xl">Concert Cost Tracker</h1>
          <p className="page-subtitle mt-4 text-lg">
            Remember every show. Track what you spent. See which concerts were
            actually worth the money — and which were the most fun per dollar.
          </p>
        </div>

        <div className="surface-card w-full max-w-md shadow-xl backdrop-blur-sm">
          <div className="card-body">
            <h2 className="card-title text-xl">
              {mode === "login" ? "Welcome back" : "Create your account"}
            </h2>
            <p className="text-sm text-base-content/70">
              {mode === "login"
                ? "Log in to see your concerts and dashboard."
                : "Sign up to start logging concerts."}
            </p>

            <div className="tabs tabs-boxed mt-3">
              <button
                type="button"
                className={`tab min-h-11 flex-1 transition-all ${
                  mode === "login" ? "tab-active" : ""
                }`}
                onClick={() => {
                  setMode("login");
                  setError(null);
                  setMessage(null);
                }}
              >
                Log in
              </button>
              <button
                type="button"
                className={`tab min-h-11 flex-1 transition-all ${
                  mode === "signup" ? "tab-active" : ""
                }`}
                onClick={() => {
                  setMode("signup");
                  setError(null);
                  setMessage(null);
                }}
              >
                Sign up
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              {message && (
                <FeedbackAlert variant="info" message={message} />
              )}
              {error && (
                <FeedbackAlert
                  variant="error"
                  message={error}
                  onDismiss={() => setError(null)}
                />
              )}

              <FormField label="Email" htmlFor="email" required>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  className="input input-bordered input-md w-full"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </FormField>

              <FormField label="Password" htmlFor="password" required>
                <input
                  id="password"
                  type="password"
                  autoComplete={
                    mode === "login" ? "current-password" : "new-password"
                  }
                  className="input input-bordered input-md w-full"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </FormField>

              <button
                type="submit"
                className={`btn btn-primary btn-md w-full min-h-11 ${
                  loading ? "loading" : ""
                }`}
                disabled={loading}
              >
                {loading
                  ? "Please wait…"
                  : mode === "login"
                    ? "Log in"
                    : "Sign up"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
