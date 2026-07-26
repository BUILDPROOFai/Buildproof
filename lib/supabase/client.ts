import { createBrowserClient } from "@supabase/ssr";

// Use this inside client components ("use client" files) — e.g. login forms,
// interactive upload widgets, anything that runs in the browser.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
