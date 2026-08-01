import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import Reveal from "@/components/Reveal";
import { createClient } from "@/lib/supabase/server";
import { VERIFICATION_LEVEL_LABELS } from "@/types";
import type { Project, Milestone, Evidence } from "@/types";

export const dynamic = "force-dynamic";

function timeAgo(dateString: string) {
  const days = Math.floor((Date.now() - new Date(dateString).getTime()) / 86400000);
  if (days < 1) return "today";
  if (days === 1) return "1 day ago";
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  return months === 1 ? "1 month ago" : `${months} months ago`;
}

export default async function ProjectPage({ params }: { params: { slug: string } }) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

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

  // Renders (what the company intends to build) are the public hero.
  // Progress photos live behind login, further down.
  const heroImage = project.cover_image_url ?? evidence.find((e) => e.file_type === "photo")?.file_url;
  const lastUpdated = evidence[0]?.created_at;
  const highestVerification = evidence.length
    ? Math.max(...evidence.map((e) => e.verification_level))
    : null;

  return (
    <>
      <Nav />
      <main className="max-w-5xl mx-auto px-6 py-12">
        <Reveal>
          {heroImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={heroImage}
              alt={project.name}
              className="w-full aspect-[16/8] object-cover rounded-2xl mb-6"
            />
          ) : (
            <div className="w-full aspect-[16/8] rounded-2xl mb-6 bg-panel border border-line" />
          )}

          <h1 className="font-display text-3xl font-semibold text-ink mb-2">{project.name}</h1>
          {project.description && (
            <p className="text-muted max-w-lg mb-6">{project.description}</p>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-4 gap-x-6 py-5 border-t border-b border-line mb-12">
            <div>
              <p className="text-[11px] text-muted mb-1">Location</p>
              <p className="text-sm">{project.location}</p>
            </div>
            <div>
              <p className="text-[11px] text-muted mb-1">Status</p>
              <p className="text-sm capitalize">{project.status.replace("_", " ")}</p>
            </div>
            <div>
              <p className="text-[11px] text-muted mb-1">Last updated</p>
              <p className="text-sm">{lastUpdated ? timeAgo(lastUpdated) : "No updates yet"}</p>
            </div>
            <div>
              <p className="text-[11px] text-muted mb-1">Verification</p>
              <p className="text-sm">
                {highestVerification ? VERIFICATION_LEVEL_LABELS[highestVerification as 1|2|3|4|5] : "Not yet verified"}
              </p>
            </div>
          </div>
        </Reveal>

        {!user ? (
          <Reveal>
            <div className="card p-8 text-center max-w-lg mx-auto">
              <p className="font-display text-xl font-semibold text-ink mb-2">
                See the actual construction progress
              </p>
              <p className="text-sm text-muted mb-6">
                Sign in to view the full milestone-by-milestone evidence log — dated photos,
                verification levels, and everything backing this project&apos;s progress claims.
              </p>
              <a href={`/login?next=/project/${project.slug}`} className="inline-block bg-seal text-white px-7 py-3 rounded-full font-medium text-sm hover:bg-seal/90 transition-colors">
                Sign in to view details
              </a>
            </div>
          </Reveal>
        ) : (
          <div className="space-y-14">
            {milestones.map((m, i) => {
              const milestoneEvidence = evidence.filter((e) => e.milestone_id === m.id);
              return (
                <Reveal key={m.id}>
                  <p className="label mb-2">
                    {String(i + 1).padStart(2, "0")} — {m.status.replace("_", " ")}
                  </p>
                  <h2 className="font-display text-xl font-semibold text-ink mb-4">{m.name}</h2>

                  {milestoneEvidence.length > 0 ? (
                    <div className="space-y-4">
                      {milestoneEvidence.map((e) => (
                        <div key={e.id}>
                          {e.file_type === "photo" ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={e.file_url}
                              alt={e.caption ?? m.name}
                              className="w-full aspect-[16/9] object-cover rounded-xl mb-2 hover:scale-[1.01] transition-transform duration-200"
                            />
                          ) : (
                            <div className="w-full aspect-[16/9] rounded-xl mb-2 bg-panel border border-line flex items-center justify-center text-sm text-muted">
                              {e.file_type}
                            </div>
                          )}
                          <p className="text-sm text-muted">
                            {e.caption && <span className="text-ink">{e.caption} · </span>}
                            {timeAgo(e.created_at)} · {VERIFICATION_LEVEL_LABELS[e.verification_level]}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted">No evidence uploaded for this stage yet.</p>
                  )}
                </Reveal>
              );
            })}
            {milestones.length === 0 && (
              <p className="text-sm text-muted">No milestones added yet.</p>
            )}
          </div>
        )}
      </main>
    </>
  );
}
