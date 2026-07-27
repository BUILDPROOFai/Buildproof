"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Project } from "@/types";

interface DirectoryProject extends Project {
  coverPhoto?: string;
  coverVerification?: number;
}

const STATUS_OPTIONS = [
  { value: "active", label: "Active" },
  { value: "delayed", label: "Delayed" },
  { value: "completed", label: "Completed" },
  { value: "on_hold", label: "On hold" },
];

const VERIFICATION_OPTIONS = [1, 2, 3, 4, 5];

const ASPECTS = ["aspect-[4/5]", "aspect-[1/1]", "aspect-[3/4]", "aspect-[4/3]"];

export default function ProjectDirectory({ projects }: { projects: DirectoryProject[] }) {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [cities, setCities] = useState<string[]>([]);
  const [statuses, setStatuses] = useState<string[]>([]);
  const [levels, setLevels] = useState<number[]>([]);

  const allCities = useMemo(() => {
    const set = new Set(
      projects.map((p) => p.location?.split(",").pop()?.trim()).filter(Boolean) as string[]
    );
    return Array.from(set);
  }, [projects]);

  function toggle<T>(list: T[], value: T, setter: (v: T[]) => void) {
    setter(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
  }

  const activeFilterCount = cities.length + statuses.length + levels.length;

  const filtered = projects.filter((p) => {
    const cityMatch = cities.length === 0 || cities.some((c) => p.location?.includes(c));
    const statusMatch = statuses.length === 0 || statuses.includes(p.status);
    const levelMatch = levels.length === 0 || (p.coverVerification && levels.includes(p.coverVerification));
    return cityMatch && statusMatch && levelMatch;
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => setFiltersOpen(!filtersOpen)}
          className="flex items-center gap-2 text-sm font-medium text-ink hover:text-seal transition-colors"
        >
          Filter projects
          <span className="font-mono text-xs text-muted">
            ({filtered.length}){activeFilterCount > 0 && ` · ${activeFilterCount} active`}
          </span>
          <span className={`transition-transform ${filtersOpen ? "rotate-45" : ""}`}>+</span>
        </button>
        {activeFilterCount > 0 && (
          <button
            onClick={() => {
              setCities([]);
              setStatuses([]);
              setLevels([]);
            }}
            className="text-xs text-muted hover:text-ink transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      {filtersOpen && (
        <div className="border-t border-b border-line py-6 mb-8 space-y-5 animate-[fadeIn_0.3s_ease-out]">
          {allCities.length > 0 && (
            <div>
              <p className="label mb-2.5">City</p>
              <div className="flex flex-wrap gap-2">
                {allCities.map((c) => (
                  <button
                    key={c}
                    onClick={() => toggle(cities, c, setCities)}
                    className={`text-xs px-3.5 py-1.5 rounded-full border transition-colors ${
                      cities.includes(c)
                        ? "bg-ink text-white border-ink"
                        : "bg-white border-line text-ink hover:border-ink/30"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <p className="label mb-2.5">Status</p>
            <div className="flex flex-wrap gap-2">
              {STATUS_OPTIONS.map((s) => (
                <button
                  key={s.value}
                  onClick={() => toggle(statuses, s.value, setStatuses)}
                  className={`text-xs px-3.5 py-1.5 rounded-full border transition-colors ${
                    statuses.includes(s.value)
                      ? "bg-ink text-white border-ink"
                      : "bg-white border-line text-ink hover:border-ink/30"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="label mb-2.5">Verification level</p>
            <div className="flex flex-wrap gap-2">
              {VERIFICATION_OPTIONS.map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => toggle(levels, lvl, setLevels)}
                  className={`text-xs px-3.5 py-1.5 rounded-full border transition-colors ${
                    levels.includes(lvl)
                      ? "bg-ink text-white border-ink"
                      : "bg-white border-line text-ink hover:border-ink/30"
                  }`}
                >
                  L{lvl}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {filtered.length > 0 ? (
        <div className="columns-1 sm:columns-2 gap-4">
          {filtered.map((p, i) => (
            <Link
              key={p.id}
              href={`/project/${p.slug}`}
              className="group block mb-4 break-inside-avoid"
            >
              <div className={`relative ${ASPECTS[i % ASPECTS.length]} rounded-2xl overflow-hidden bg-panel`}>
                {p.coverPhoto ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={p.coverPhoto}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted text-sm">
                    No photo yet
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="text-white font-medium">{p.name}</p>
                  <p className="text-white/70 text-xs mt-0.5">{p.location}</p>
                </div>
                {p.coverVerification && (
                  <span className="absolute top-3 right-3 bg-white/90 backdrop-blur text-ink text-[11px] font-mono px-2 py-1 rounded-full">
                    L{p.coverVerification}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted">No projects match these filters.</p>
      )}
    </div>
  );
}
