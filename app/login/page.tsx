"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Nav from "@/components/Nav";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  // Buyers arrive here from a gated project page (?next=/project/slug) and
  // should land back on it after signing in, instead of a generic page.
  const next = searchParams.get("next") || "/";

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (mode === "signin") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }
    } else {
      // Signing up here just creates a normal account (defaults to the "buyer"
      // role). It does NOT grant admin access — that's always assigned
      // manually in Supabase (Table Editor -> profiles), never through this form.
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } },
      });
      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }
    }

    router.push(next);
    router.refresh();
  }

  return (
    <>
      <Nav />
      <main className="max-w-sm mx-auto px-6 py-20">
        <p className="label mb-2">BuildProof account</p>
        <h1 className="font-display text-2xl font-semibold text-ink mb-8">
          {mode === "signin" ? "Sign in" : "Create an account"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" && (
            <div>
              <label className="label block mb-1.5">Full name</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full border border-line rounded-xl px-4 py-2.5 bg-panel text-ink text-sm"
              />
            </div>
          )}
          <div>
            <label className="label block mb-1.5">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-line rounded-xl px-4 py-2.5 bg-panel text-ink text-sm"
            />
          </div>
          <div>
            <label className="label block mb-1.5">Password</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-line rounded-xl px-4 py-2.5 bg-panel text-ink text-sm"
            />
          </div>

          {error && <p className="text-sm text-risk">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-seal text-white py-3 rounded-full text-sm font-medium disabled:opacity-50 hover:bg-seal/90 transition-colors"
          >
            {loading ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
          </button>
        </form>

        <button
          onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          className="text-sm text-muted mt-6 hover:text-ink transition-colors"
        >
          {mode === "signin"
            ? "Need an account? Create one"
            : "Already have an account? Sign in"}
        </button>
      </main>
    </>
  );
}
