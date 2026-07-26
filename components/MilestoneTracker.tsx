import type { Milestone } from "@/types";

const STATUS_STYLES: Record<Milestone["status"], string> = {
  completed: "bg-verified border-verified text-ink",
  in_progress: "bg-flagged border-flagged text-ink",
  delayed: "bg-risk border-risk text-ink",
  pending: "bg-transparent border-line text-muted",
};

export default function MilestoneTracker({ milestones }: { milestones: Milestone[] }) {
  const sorted = [...milestones].sort((a, b) => a.sort_order - b.sort_order);

  return (
    <ol className="relative border-l border-line pl-6 space-y-6">
      {sorted.map((m) => (
        <li key={m.id} className="relative">
          <span
            className={`absolute -left-[29px] top-1 w-3 h-3 rounded-full border-2 ${STATUS_STYLES[m.status]}`}
          />
          <p className="font-medium">{m.name}</p>
          <p className="label mt-1">
            {m.status.replace("_", " ")}
            {m.planned_date && ` · planned ${new Date(m.planned_date).toLocaleDateString()}`}
          </p>
        </li>
      ))}
      {sorted.length === 0 && (
        <p className="text-sm text-muted">No milestones added yet.</p>
      )}
    </ol>
  );
}
