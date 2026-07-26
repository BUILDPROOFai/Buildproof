"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Nav from "@/components/Nav";
import { createClient } from "@/lib/supabase/client";

// A standard construction sequence — pre-fills every new project so your team
// is updating dates and statuses, not typing out stages from scratch each time.
const DEFAULT_MILESTONES = [
  "Foundation",
  "Substructure",
  "Superstructure / framing",
  "Roofing",
  "Walling & plastering",
  "Electrical & plumbing rough-in",
  "Interior finishing",
  "Final inspection & handover",
];

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");
}

export default function NewProjectPage() {
  const router = useRouter();
  const supabase = createClient();

  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [deliveryTimeline, setDeliveryTimeline] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const slug = slugify(name);

    const { data: project, error: projectError } = await supabase
      .from("projects")
      .insert({
        slug,
        name,
        location,
        description,
        delivery_timeline: deliveryTimeline || null,
      })
      .select()
      .single();

    if (projectError || !project) {
      setError(projectError?.message ?? "Could not create project.");
      setLoading(false);
      return;
    }

    const projectId = project.id as string;

    const { error: milestoneError } = await supabase.from("milestones").insert(
      DEFAULT_MILESTONES.map((milestoneName, i) => ({
        project_id: projectId,
        name: milestoneName,
        status: "pending",
        sort_order: i,
      }))
    );

    if (milestoneError) {
      setError(
        `Project was created, but milestones failed to add: ${milestoneError.message}`
      );
      setLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <>
      <Nav />
      <main className="max-w-lg mx-auto px-6 py-16">
        <p className="label mb-2">Admin</p>
        <h1 className="font-display text-2xl font-semibold text-ink mb-8">
          New project
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label block mb-1.5">Project name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-line rounded-xl px-4 py-2.5 bg-panel text-ink text-sm"
              placeholder="Prestige Manor"
            />
            {name && (
              <p className="text-xs text-muted mt-1">
                Public link: /project/{slugify(name)}
              </p>
            )}
          </div>

          <div>
            <label className="label block mb-1.5">Location</label>
            <input
              type="text"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full border border-line rounded-xl px-4 py-2.5 bg-panel text-ink text-sm"
              placeholder="Jahi, Abuja"
            />
          </div>

          <div>
            <label className="label block mb-1.5">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full border border-line rounded-xl px-4 py-2.5 bg-panel text-ink text-sm"
              placeholder="5 bed, 6 bath, cinema room — flagged as a hot deal."
            />
          </div>

          <div>
            <label className="label block mb-1.5">Expected delivery date</label>
            <input
              type="date"
              value={deliveryTimeline}
              onChange={(e) => setDeliveryTimeline(e.target.value)}
              className="w-full border border-line rounded-xl px-4 py-2.5 bg-panel text-ink text-sm"
            />
          </div>

          <div className="card p-4">
            <p className="label mb-2">Milestones (added automatically)</p>
            <ul className="text-sm text-muted space-y-1">
              {DEFAULT_MILESTONES.map((m) => (
                <li key={m}>{m}</li>
              ))}
            </ul>
          </div>

          {error && <p className="text-sm text-risk">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-seal text-white py-3 rounded-full text-sm font-medium disabled:opacity-50 hover:bg-seal/90 transition-colors"
          >
            {loading ? "Creating…" : "Create project"}
          </button>
        </form>
      </main>
    </>
  );
}
