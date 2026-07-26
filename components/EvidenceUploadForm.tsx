"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Milestone } from "@/types";

export default function EvidenceUploadForm({
  projectId,
  milestones,
}: {
  projectId: string;
  milestones: Milestone[];
}) {
  const router = useRouter();
  const supabase = createClient();

  const [file, setFile] = useState<File | null>(null);
  const [milestoneId, setMilestoneId] = useState(milestones[0]?.id ?? "");
  const [caption, setCaption] = useState("");
  const [verificationLevel, setVerificationLevel] = useState("1");
  const [fileType, setFileType] = useState<"photo" | "video" | "document">("photo");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) {
      setError("Choose a file first.");
      return;
    }
    setError(null);
    setLoading(true);

    // Path includes the project so files stay organized in storage, and a
    // timestamp so two uploads with the same filename never collide.
    const path = `${projectId}/${Date.now()}-${file.name}`;

    const { error: uploadError } = await supabase.storage
      .from("evidence")
      .upload(path, file);

    if (uploadError) {
      setError(uploadError.message);
      setLoading(false);
      return;
    }

    const { data: urlData } = supabase.storage.from("evidence").getPublicUrl(path);

    const { error: insertError } = await supabase.from("evidence").insert({
      project_id: projectId,
      milestone_id: milestoneId || null,
      file_url: urlData.publicUrl,
      file_type: fileType,
      caption,
      verification_level: Number(verificationLevel),
    });

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
      return;
    }

    setFile(null);
    setCaption("");
    setLoading(false);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="card p-5 space-y-4">
      <p className="label">Add evidence</p>

      <div>
        <label className="label block mb-1.5">File</label>
        <input
          type="file"
          accept="image/*,video/*,.pdf"
          required
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="w-full text-sm"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label block mb-1.5">Type</label>
          <select
            value={fileType}
            onChange={(e) => setFileType(e.target.value as typeof fileType)}
            className="w-full border border-line rounded-xl px-3 py-2 bg-panel text-ink text-sm"
          >
            <option value="photo">Photo</option>
            <option value="video">Video</option>
            <option value="document">Document</option>
          </select>
        </div>
        <div>
          <label className="label block mb-1.5">Verification level</label>
          <select
            value={verificationLevel}
            onChange={(e) => setVerificationLevel(e.target.value)}
            className="w-full border border-line rounded-xl px-3 py-2 bg-panel text-ink text-sm"
          >
            <option value="1">L1 — Developer submitted</option>
            <option value="2">L2 — BuildProof reviewed</option>
            <option value="3">L3 — Third-party inspected</option>
            <option value="4">L4 — AI-assisted review</option>
            <option value="5">L5 — Audit-trail secured</option>
          </select>
        </div>
      </div>

      <div>
        <label className="label block mb-1.5">Milestone</label>
        <select
          value={milestoneId}
          onChange={(e) => setMilestoneId(e.target.value)}
          className="w-full border border-line rounded-xl px-3 py-2 bg-panel text-ink text-sm"
        >
          {milestones.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="label block mb-1.5">Caption</label>
        <input
          type="text"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Foundation pour, east wing"
          className="w-full border border-line rounded-xl px-3 py-2 bg-panel text-ink text-sm"
        />
      </div>

      {error && <p className="text-sm text-risk">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="bg-seal text-white px-5 py-2.5 rounded-full text-sm font-medium disabled:opacity-50 hover:bg-seal/90 transition-colors"
      >
        {loading ? "Uploading…" : "Upload"}
      </button>
    </form>
  );
}
