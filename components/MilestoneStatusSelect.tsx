"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { MilestoneStatus } from "@/types";

export default function MilestoneStatusSelect({
  milestoneId,
  status,
}: {
  milestoneId: string;
  status: MilestoneStatus;
}) {
  const router = useRouter();
  const supabase = createClient();

  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    await supabase
      .from("milestones")
      .update({ status: e.target.value })
      .eq("id", milestoneId);
    router.refresh();
  }

  return (
    <select
      value={status}
      onChange={handleChange}
      className="border border-line rounded-full px-3 py-1 bg-panel text-ink text-xs"
    >
      <option value="pending">Pending</option>
      <option value="in_progress">In progress</option>
      <option value="completed">Completed</option>
      <option value="delayed">Delayed</option>
    </select>
  );
}
