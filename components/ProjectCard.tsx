import Link from "next/link";
import type { Project } from "@/types";

const RISK_STYLES: Record<Project["risk_level"], { label: string; className: string }> = {
  on_track: { label: "On track", className: "text-verified border-verified/40 bg-verified/10" },
  delayed: { label: "Delayed", className: "text-risk border-risk/40 bg-risk/10" },
  insufficient_evidence: {
    label: "Needs evidence",
    className: "text-flagged border-flagged/40 bg-flagged/10",
  },
};

export default function ProjectCard({ project }: { project: Project }) {
  const risk = RISK_STYLES[project.risk_level];

  return (
    <Link href={`/project/${project.slug}`} className="card block p-5 hover:border-line/80 transition-colors">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-medium">{project.name}</h3>
          {project.location && (
            <p className="text-sm text-muted mt-1">{project.location}</p>
          )}
        </div>
        <span className={`shrink-0 text-xs font-mono px-2 py-1 rounded border ${risk.className}`}>
          {risk.label}
        </span>
      </div>
    </Link>
  );
}
