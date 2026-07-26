export type Role = "admin" | "developer" | "buyer";

export type ProjectStatus = "active" | "delayed" | "completed" | "on_hold";
export type RiskLevel = "on_track" | "delayed" | "insufficient_evidence";
export type MilestoneStatus = "pending" | "in_progress" | "completed" | "delayed";
export type EvidenceType = "photo" | "video" | "document";

// Matches the five-tier framework from the investment proposal (section 10)
export type VerificationLevel = 1 | 2 | 3 | 4 | 5;

export const VERIFICATION_LEVEL_LABELS: Record<VerificationLevel, string> = {
  1: "Developer submitted",
  2: "BuildProof reviewed",
  3: "Third-party inspected",
  4: "AI-assisted review",
  5: "Audit-trail secured",
};

export interface Profile {
  id: string;
  full_name: string | null;
  role: Role;
  created_at: string;
}

export interface Project {
  id: string;
  slug: string;
  name: string;
  location: string | null;
  developer_id: string;
  description: string | null;
  delivery_timeline: string | null;
  status: ProjectStatus;
  risk_level: RiskLevel;
  created_at: string;
}

export interface Milestone {
  id: string;
  project_id: string;
  name: string;
  planned_date: string | null;
  actual_date: string | null;
  status: MilestoneStatus;
  sort_order: number;
  created_at: string;
}

export interface Evidence {
  id: string;
  project_id: string;
  milestone_id: string | null;
  file_url: string;
  file_type: EvidenceType;
  caption: string | null;
  uploaded_by: string | null;
  verification_level: VerificationLevel;
  hash: string | null;
  created_at: string;
}

export interface Report {
  id: string;
  project_id: string;
  period_start: string;
  period_end: string;
  summary: string | null;
  ai_draft: string | null;
  pdf_url: string | null;
  published: boolean;
  created_at: string;
}
