"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function CoverImageUpload({
  projectId,
  currentUrl,
}: {
  projectId: string;
  currentUrl: string | null;
}) {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    setError(null);

    const path = `${projectId}/cover/${Date.now()}-${file.name}`;
    const { error: uploadError } = await supabase.storage.from("evidence").upload(path, file);
    if (uploadError) {
      setError(uploadError.message);
      setLoading(false);
      return;
    }

    const { data: urlData } = supabase.storage.from("evidence").getPublicUrl(path);

    const { error: updateError } = await supabase
      .from("projects")
      .update({ cover_image_url: urlData.publicUrl })
      .eq("id", projectId);

    if (updateError) {
      setError(updateError.message);
      setLoading(false);
      return;
    }

    setLoading(false);
    router.refresh();
  }

  return (
    <div className="card p-4 mb-6">
      <p className="label mb-3">Public render (shown to everyone, no login required)</p>
      {currentUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={currentUrl} alt="Current render" className="w-full aspect-[16/9] object-cover rounded-lg mb-3" />
      )}
      <input type="file" accept="image/*" onChange={handleFile} disabled={loading} className="text-sm" />
      {loading && <p className="text-xs text-muted mt-2">Uploading…</p>}
      {error && <p className="text-xs text-risk mt-2">{error}</p>}
    </div>
  );
}
