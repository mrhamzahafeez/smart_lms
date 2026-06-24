# Code Standards

## General
- Keep modules small and single-purpose; one responsibility per file.
- Fix root causes — do not layer workarounds or silent fallbacks around a failing check.
- Do not mix unrelated concerns in one component or route (e.g. grading logic inside an attendance handler).
- Respect the system boundaries defined in `project_architecture.md` — relational vs. document vs. vector vs. object storage are not interchangeable.
- Every feature that touches student data, grades, fees, or AI output must be traceable to a specific role + permission check — never assume access.

## TypeScript
- Strict mode required throughout the project (`strict: true` in `tsconfig.json`).
- Avoid `any`; use explicit `interface`/`type` definitions for every API payload, Prisma model, and Mongo document shape.
- Validate all unknown external input — request bodies, Clerk webhook payloads, AI/LLM JSON output, file uploads — with Zod before trusting it. AI-generated structured output (quizzes, summaries) is treated as untrusted input and schema-validated before it can be saved.
- Use `interface` for object contracts (e.g. `CourseRecord`, `AttendanceEntry`, `QuizDraft`); use `type` for unions/utility types.
- Share types between frontend and backend via a single `types/` directory — never redefine the same shape twice.

## Next.js
- Default to React Server Components; fetch data on the server wherever possible (dashboards, tables, reports).
- Add `"use client"` only when a component needs interactivity, browser APIs, real-time updates (chat, notifications), or local form state.
- Route groups separate concerns: `app/(public)` for landing/login, `app/dashboard/admin`, `app/dashboard/teacher`, `app/dashboard/student` for authenticated areas — never share a layout file across roles that assumes the wrong role's data shape.
- `middleware.ts` enforces Clerk auth + coarse role gating; route handlers re-check role + academic scope themselves (middleware is not the only checkpoint).
- Long-running or scheduled work (document ingestion, embedding, challan batch generation, AI report aggregation) belongs in background jobs, never inside a request/response cycle.

## Styling
- Use CSS custom property tokens defined in `globals.css` (see `project_uidesign.md`) — no raw Tailwind palette classes (`blue-500`, `zinc-800`) or hardcoded hex values in component code.
- Reference tokens through Tailwind utility names: `bg-surface`, `text-muted`, `border-subtle`, `accent-ai`, `role-teacher`, etc.
- Respect the radius scale: `rounded-xl` for buttons/badges, `rounded-2xl` for cards, `rounded-3xl` for modals/dialogs.
- Do not introduce one-off custom CSS files per component; extend the shared token system instead.
- Dark/light theme must work without component-level conditionals — themes are driven by CSS variables and the `.dark` class only.

## API Routes
- Every route handler, in order:
  1. Verify Clerk session (`auth()`); 401 if missing.
  2. Resolve the user's role + academic scope from the synced PostgreSQL record (not just Clerk metadata) and check it against the requested resource; 403 if mismatched.
  3. Validate and parse the request body/query with Zod; 400 on failure with field-level errors.
  4. Perform the single responsibility of the route (one read, one mutation, or one job trigger) — push any further logic into `lib/`.
  5. Return a consistent response shape: `{ data }` on success, `{ error: string }` on failure, with the correct HTTP status.
- Never let an API route call an LLM directly for ingestion-scale work — trigger a background job and return a job/run ID instead.
- Mutations that affect grades, attendance, or fees must write an `AuditLog` entry as part of the same transaction, not as an afterthought.
- Routes that issue retrieval against the vector store must always filter by the requester's enrolled/assigned `courseId` — never an unscoped query.

## Data and Storage
- **PostgreSQL (Prisma)**: source of truth for academic structure, enrollment, attendance, grades, fee structure, challans, payments, audit logs. All financial and academic-record mutations go through Prisma with proper relations/constraints — never raw SQL unless a migration requires it.
- **MongoDB**: notes/resources metadata, community posts/threads, project workspace boards, message history. Use typed Mongoose/Prisma-Mongo schemas — no untyped `any` documents.
- **Redis**: ephemeral only — session cache, pub/sub channels, presence/typing indicators. Never store anything in Redis that doesn't have a durable source of truth elsewhere.
- **Vector store (Pinecone/ChromaDB)**: one namespace per course; only embeddings + minimal metadata (`courseId`, `documentId`, `chunkIndex`) — never raw file content or PII beyond what's needed for retrieval.
- **Object storage**: all uploaded files (notes, assignment attachments, project files, challan PDFs). Databases store the file URL/key only — never binary content in PostgreSQL or MongoDB.
- AI-generated content (quiz drafts, summaries) is not persisted as a real Assignment/Note/Quiz record until a Teacher/Admin explicitly approves and saves it.

## File Organization
- `app/(public)/` — landing page, login; no auth required.
- `app/dashboard/admin/`, `app/dashboard/teacher/`, `app/dashboard/student/` — role-scoped pages, one folder per nav item (e.g. `attendance/`, `grading/`, `communities/`).
- `app/api/` — route handlers, mirroring the resource they manage (e.g. `app/api/courses/[courseId]/attendance/route.ts`).
- `lib/` — shared infrastructure: `lib/prisma.ts`, `lib/mongo.ts`, `lib/redis.ts`, `lib/clerk.ts`, `lib/rag/` (ingestion + retrieval clients), `lib/access-control.ts`.
- `jobs/` — background workers: document ingestion, embedding generation, challan batch jobs, AI report aggregation.
- `components/` — UI composition only, organized by domain (`components/courses/`, `components/attendance/`, `components/ai/`, `components/communities/`); no business logic or direct DB/Clerk calls inside components.
- `types/` — shared TypeScript types/interfaces and Zod schemas, reused by both server and client code.
- `prisma/` — PostgreSQL schema and generated client.
- Name files after the responsibility they contain (`grade-calculator.ts`, `challan-generator.ts`), not the technology (`utils.ts`, `helpers.ts`) unless genuinely generic.