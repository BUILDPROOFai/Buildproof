import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import { createClient } from "@/lib/supabase/server";
import type { Project, Milestone, Evidence, Profile } from "@/types";
import { VERIFICATION_LEVEL_LABELS } from "@/types";
import MilestoneStatusSelect from "@/components/MilestoneStatusSelect";
import EvidenceUploadForm from "@/components/EvidenceUploadForm";
import CoverImageUpload from "@/components/CoverImageUpload";

export const dynamic = "force-dynamic";

export default async function AdminProjectPage({
  params,
}: {
  params: { slug: string };
}) {
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
    isAdmin = (profileData as Profile | null)?.role === "admin";
  }

  if (!isAdmin) {
    return (
      <>
        <Nav />
        <main className="max-w-5xl mx-auto px-6 py-16">
          <div className="card p-6 max-w-md">
            <p className="text-sm text-muted">
              {user ? "This account doesn't have admin access." : "Sign in with an admin account."}
            </p>
          </div>
        </main>
      </>
    );
  }

  const { data: projectData } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", params.slug)
    .single();
  const project = projectData as Project | null;
  if (!project) notFound();

  const { data: milestonesData } = await supabase
    .from("milestones")
    .select("*")
    .eq("project_id", project.id)
    .order("sort_order");
  const milestones = (milestonesData as Milestone[] | null) ?? [];

  const { data: evidenceData } = await supabase
    .from("evidence")
    .select("*")
    .eq("project_id", project.id)
    .order("created_at", { ascending: false });
  const evidence = (evidenceData as Evidence[] | null) ?? [];

  return (
    <>
      <Nav />
      <main className="max-w-5xl mx-auto px-6 py-16">
        <p className="label mb-2">Admin · {project.name}</p>
        <h1 className="font-display text-2xl font-semibold text-ink mb-1">{project.name}</h1>
        <a href={`/project/${project.slug}`} className="text-sm text-seal hover:underline">
          View public page →
        </a>

        <div className="mt-8">
          <CoverImageUpload projectId={project.id} currentUrl={project.cover_image_url} />
        </div>

        <div className="grid md:grid-cols-2 gap-8 mt-10">
          <div>
            <p className="label mb-4">Milestones</p>
            <div className="space-y-2">
              {milestones.map((m) => (
                <div key={m.id} className="card p-3.5 flex items-center justify-between gap-3">
                  <p className="text-sm">{m.name}</p>
                  <MilestoneStatusSelect milestoneId={m.id} status={m.status} />
                </div>
              ))}
              {milestones.length === 0 && (
                <p className="text-sm text-muted">No milestones on this project.</p>
              )}
            </div>
          </div>

          <div>
            <p className="label mb-4">Uploaded evidence</p>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {evidence.map((e) => (
                <div key={e.id} className="card overflow-hidden">
                  {e.file_type === "photo" ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={e.file_url} alt={e.caption ?? ""} className="aspect-[4/3] object-cover w-full" />
                  ) : (
                    <div className="aspect-[4/3] flex items-center justify-center bg-panel text-xs text-muted">
                      {e.file_type}
                    </div>
                  )}
                  <p className="text-xs px-2.5 py-2 text-ink truncate">{e.caption || "Untitled"}</p>
                  <p className="text-[11px] px-2.5 pb-2 text-muted">
                    {VERIFICATION_LEVEL_LABELS[e.verification_level]}
                  </p>
                </div>
              ))}
              {evidence.length === 0 && (
                <p className="text-sm text-muted col-span-2">No evidence uploaded yet.</p>
              )}
            </div>

            {milestones.length > 0 ? (
              <EvidenceUploadForm projectId={project.id} milestones={milestones} />
            ) : (
              <p className="text-sm text-muted">Add milestones before uploading evidence.</p>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
