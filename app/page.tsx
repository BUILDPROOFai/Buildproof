import Nav from "@/components/Nav";
import VerifiedBadge from "@/components/VerifiedBadge";
import ProjectDirectory from "@/components/ProjectDirectory";
import Reveal from "@/components/Reveal";
import { createClient } from "@/lib/supabase/server";
import type { Project } from "@/types";

export const dynamic = "force-dynamic";

const LEVELS = [
  { n: 1, name: "Developer submitted" },
  { n: 2, name: "BuildProof reviewed" },
  { n: 3, name: "Third-party inspected" },
  { n: 4, name: "AI-assisted review" },
  { n: 5, name: "Audit-trail secured" },
];

export default async function Home() {
  const supabase = createClient();
  const { data } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });
  const projects = (data as Project[] | null) ?? [];

  const { data: photoEvidence } = await supabase
    .from("evidence")
    .select("*")
    .eq("file_type", "photo")
    .order("created_at", { ascending: false });

  // Most recent photo per project becomes its directory cover image.
  const coverByProject = new Map<string, { url: string; level: number }>();
  ((photoEvidence as { project_id: string; file_url: string; verification_level: number }[] | null) ?? []).forEach(
    (e) => {
      if (!coverByProject.has(e.project_id)) {
        coverByProject.set(e.project_id, { url: e.file_url, level: e.verification_level });
      }
    }
  );

  const directoryProjects = projects.map((p) => ({
    ...p,
    coverPhoto: coverByProject.get(p.id)?.url,
    coverVerification: coverByProject.get(p.id)?.level,
  }));

  const { count: evidenceCount } = await supabase
    .from("evidence")
    .select("*", { count: "exact", head: true });

  const cityCount = new Set(
    projects.map((p) => p.location?.split(",").pop()?.trim()).filter(Boolean)
  ).size;

  const stats = [
    { value: String(projects.length), label: "Projects tracked", href: "#projects" },
    { value: String(cityCount || 0), label: "Cities covered", href: "#projects" },
    { value: String(evidenceCount ?? 0), label: "Pieces of evidence logged", href: "#projects" },
    { value: "5", label: "Verification levels", href: "#verification" },
  ];

  return (
    <>
      <Nav />
      <main>
        <section className="relative overflow-hidden">
          <div
            className="absolute -top-32 -right-40 w-[36rem] h-[36rem] rounded-full opacity-[0.15] blur-3xl pointer-events-none animate-[pulse_8s_ease-in-out_infinite]"
            style={{ background: "radial-gradient(circle, #3457E0 0%, transparent 70%)" }}
          />
          <div
            className="absolute -top-10 left-1/3 w-[28rem] h-[28rem] rounded-full opacity-[0.10] blur-3xl pointer-events-none animate-[pulse_10s_ease-in-out_infinite]"
            style={{ background: "radial-gradient(circle, #17A34A 0%, transparent 70%)" }}
          />

          <div className="max-w-5xl mx-auto px-6 pt-20 pb-16 relative">
            <div className="grid md:grid-cols-[1fr_auto] gap-10 items-center">
              <Reveal>
                <p className="label mb-5 text-seal">Construction progress verification</p>
                <h1 className="font-display text-4xl md:text-6xl font-semibold tracking-tight max-w-xl leading-[1.05] text-ink">
                  Every claim of progress, backed by proof.
                </h1>
                <p className="text-muted max-w-lg mt-6 text-lg leading-relaxed">
                  Browse off-plan and under-construction projects with structured,
                  dated evidence — not just a developer&apos;s word for it.
                </p>
                <div className="flex flex-wrap gap-3 mt-9">
                  
                    href="#projects"
                    className="bg-seal text-white px-7 py-3.5 rounded-full font-medium text-sm hover:bg-seal/90 hover:-translate-y-0.5 transition-all"
                  >
                    Browse projects
                  </a>
                  
                    href="mailto:Offplanadvisory@gmail.com?subject=Get%20my%20project%20verified"
                    className="border border-line bg-white px-7 py-3.5 rounded-full font-medium text-sm text-ink hover:border-ink/20 hover:-translate-y-0.5 transition-all"
                  >
                    Developer? Get verified
                  </a>
                </div>
              </Reveal>
              <Reveal delay={200}>
                <VerifiedBadge className="w-28 h-28 shrink-0 text-seal hidden md:block" />
              </Reveal>
            </div>
          </div>
        </section>

        <section id="projects" className="max-w-5xl mx-auto px-6 py-14 border-t border-line">
          <Reveal>
            <p className="label mb-2">(01) Tracked projects</p>
            <h2 className="font-display text-2xl font-semibold text-ink mb-8">
              Every project, filtered your way.
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <ProjectDirectory projects={directoryProjects} />
          </Reveal>
        </section>

        <section id="verification" className="bg-panel border-t border-line">
          <div className="max-w-5xl mx-auto px-6 py-20">
            <Reveal>
              <p className="label mb-2">(02) Verification framework</p>
              <h2 className="font-display text-3xl font-semibold text-ink mb-2">
                Five levels of trust, clearly labeled.
              </h2>
              <p className="text-muted max-w-lg mb-10 leading-relaxed">
                Every piece of evidence shows exactly how it was sourced and reviewed —
                so you always know how much confidence it deserves.
              </p>
            </Reveal>

            <div className="flex flex-wrap gap-3">
              {LEVELS.map((level, i) => (
                <Reveal key={level.n} delay={i * 80}>
                  <div
                    className={`flex items-center gap-2.5 px-5 py-3 rounded-full border text-sm hover:-translate-y-0.5 transition-transform ${
                      i === LEVELS.length - 1
                        ? "bg-seal text-white border-seal font-medium"
                        : "bg-white border-line text-ink"
                    }`}
                  >
                    <span className={`font-mono text-xs ${i === LEVELS.length - 1 ? "text-white/70" : "text-muted"}`}>
                      0{level.n}
                    </span>
                    {level.name}
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-line">
          <div className="max-w-5xl mx-auto px-6 py-16 grid grid-cols-2 sm:grid-cols-4 gap-8">
            {stats.map((s, i) => (
              <Reveal key={s.label} delay={i * 100}>
                <a href={s.href} className="block group">
                  <p className="font-display text-4xl font-semibold text-ink group-hover:text-seal transition-colors">
                    {s.value}
                  </p>
                  <p className="text-sm text-muted mt-1">{s.label}</p>
                </a>
              </Reveal>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
