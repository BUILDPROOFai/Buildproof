"use client";

import { useMemo, useState } from "react";
import ProjectCard from "@/components/ProjectCard";
import type { Project } from "@/types";

export default function ProjectDirectory({ projects }: { projects: Project[] }) {
  const [city, setCity] = useState("all");
  const [status, setStatus] = useState("all");

  const cities = useMemo(() => {
    const set = new Set(
      projects.map((p) => p.location?.split(",").pop()?.trim()).filter(Boolean) as string[]
    );
    return Array.from(set);
  }, [projects]);

  const filtered = projects.filter((p) => {
    const cityMatch = city === "all" || p.location?.includes(city);
    const statusMatch = status === "all" || p.status === status;
    return cityMatch && statusMatch;
  });

  return (
    <div>
      <div className="flex flex-wrap gap-3 mb-6">
        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="border border-line rounded-full px-4 py-2 bg-white text-sm text-ink"
        >
          <option value="all">All cities</option>
          {cities.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border border-line rounded-full px-4 py-2 bg-white text-sm text-ink"
        >
          <option value="all">All statuses</option>
          <option value="active">Active</option>
          <option value="delayed">Delayed</option>
          <option value="completed">Completed</option>
          <option value="on_hold">On hold</option>
        </select>
      </div>

      {filtered.length > 0 ? (
        <div className="grid sm:grid-cols-2 gap-4">
          {filtered.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted">No projects match these filters.</p>
      )}
    </div>
  );
}
