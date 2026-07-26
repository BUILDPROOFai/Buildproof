# BuildProof

Construction progress verification for off-plan real estate. See the full
investment proposal for product context — this repo is the software MVP
described in section 9 (Product Architecture).

## What's in here

```
app/                 Next.js pages (App Router)
  page.tsx            marketing landing page
  developer/           developer portal (placeholder — needs auth)
  admin/                admin portal (placeholder — needs auth)
  project/[slug]/        public buyer-facing project page
components/          Nav, ProjectCard, MilestoneTracker
lib/supabase/        client + server Supabase helpers
types/               shared TypeScript types matching the database
supabase/migrations/ the actual database schema, version-controlled
```

## Getting this running (step by step)

### 1. Create a Supabase project
Go to [supabase.com](https://supabase.com), create a free project, and note
the project URL and anon key from **Project Settings → API**.

### 2. Push the database schema
Install the Supabase CLI, then from this folder:
```bash
npx supabase login
npx supabase link --project-ref your-project-ref
npx supabase db push
```
This runs `supabase/migrations/0001_init.sql` against your real database —
creating the `profiles`, `projects`, `milestones`, `evidence`, and `reports`
tables with the access rules already wired in.

### 3. Set your environment variables
```bash
cp .env.example .env.local
```
Fill in the values from step 1.

### 4. Install and run locally
```bash
npm install
npm run dev
```
Visit `http://localhost:3000`.

### 5. Push to GitHub
```bash
git init
git add .
git commit -m "Initial BuildProof scaffold"
git branch -M main
git remote add origin https://github.com/your-username/buildproof.git
git push -u origin main
```

### 6. Deploy on Vercel
- Go to [vercel.com/new](https://vercel.com/new) and import the GitHub repo.
- Add the same environment variables from `.env.local` in the Vercel project
  settings (**Settings → Environment Variables**).
- Deploy. Every future push to `main` redeploys automatically; every pull
  request gets its own preview URL.

## What's deliberately not built yet

Auth (developer/admin login), the evidence upload form, and PDF report
generation are the next real pieces of work — everything is structured so
they slot into the existing pages rather than requiring new architecture.
AI-assisted report drafting and the blockchain audit-trail hash are future
additions to the `reports` and `evidence` tables respectively — no schema
changes needed when that time comes.
