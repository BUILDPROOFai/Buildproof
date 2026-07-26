// Hand-written to match supabase/migrations/0001_init.sql.
// Once the project is live, you can replace this with an auto-generated version by running:
//   npx supabase gen types typescript --project-id your-project-ref > types/database.ts
// That command reads your real database and keeps this file perfectly in sync — worth doing
// as soon as you start iterating on the schema, so this file stops drifting from reality.

import type { Profile, Project, Milestone, Evidence, Report } from "./index";

export interface Database {
  public: {
    Tables: {
      profiles: { Row: Profile; Insert: Partial<Profile>; Update: Partial<Profile>; Relationships: [] };
      projects: { Row: Project; Insert: Partial<Project>; Update: Partial<Project>; Relationships: [] };
      milestones: { Row: Milestone; Insert: Partial<Milestone>; Update: Partial<Milestone>; Relationships: [] };
      evidence: { Row: Evidence; Insert: Partial<Evidence>; Update: Partial<Evidence>; Relationships: [] };
      reports: { Row: Report; Insert: Partial<Report>; Update: Partial<Report>; Relationships: [] };
    };
    Views: {};
    Functions: {};
    Enums: {};
    CompositeTypes: {};
  };
}
