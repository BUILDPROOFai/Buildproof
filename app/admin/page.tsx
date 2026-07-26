import Nav from "@/components/Nav";
import { createClient } from "@/lib/supabase/server";
import type { Project, Profile } from "@/types";
import SignOutButton from "@/components/SignOutButton";

export default async function AdminPortal() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let isAdmin = false;
  if (user) {
    const { data: profileData } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();
    const profile = profileData as Profile | null;
    isAdmin = profile?.role === "admin";
  }

  if (!isAdmin) {
    return (
      <>
        <Nav />
        <main className="max-w-5xl mx-auto px-6 py-16">
          <p className="label mb-3">Admin</p>
          <div className="card p-6 max-w-md">
            <p className="text-sm text-muted mb-4">
              {user
                ? "This account doesn't have admin access."
                : "Sign in with an admin account to view this page."}
            </p>
            {!user && (
              <a
                href="/login"
                className="inline-block bg-seal text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-seal/90 transition-colors"
              >
                Sign in
              </a>
            )}
          </div>
        </main>
      </>
    );
  }

  const { data } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });
  const projects = data as Project[] | null;

  return (
    <>
      <Nav />
      <main className="max-w-5xl mx-auto px-6 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="label mb-3">Admin</p>
            <h1 className="text-2xl font-medium tracking-tight">All projects</h1>
          </div>
          <div className="flex items-center gap-5">
            <a
              href="/admin/new"
              className="bg-seal text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-seal/90 transition-colors"
            >
              New project
            </a>
            <SignOutButton />
          </div>
        </div>

        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-line label">
                <th className="p-4 font-normal">Project</th>
                <th className="p-4 font-normal">Location</th>
                <th className="p-4 font-normal">Status</th>
                <th className="p-4 font-normal">Risk</th>
              </tr>
            </thead>
            <tbody>
              {(projects ?? []).map((p) => (
                <tr key={p.id} className="border-b border-line last:border-0 hover:bg-panel/60">
                  <td className="p-4">
                    <a href={`/admin/project/${p.slug}`} className="hover:text-seal transition-colors">
                      {p.name}
                    </a>
                  </td>
                  <td className="p-4 text-muted">{p.location}</td>
                  <td className="p-4 text-muted">{p.status}</td>
                  <td className="p-4 text-muted">{p.risk_level}</td>
                </tr>
              ))}
              {(!projects || projects.length === 0) && (
                <tr>
                  <td colSpan={4} className="p-4 text-muted">
                    No projects yet —{" "}
                    <a href="/admin/new" className="text-seal">
                      create your first one
                    </a>
                    .
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </>
  );
}
