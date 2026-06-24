# Architecture Context

## Stack
| Layer              | Technology                                | Role                                                                 |
| ------------------ | ------------------------------------------ | --------------------------------------------------------------------- |
| Framework           | Next.js (App Router) + TypeScript          | Full-stack app with server/client boundaries, shared across all 3 dashboards |
| UI                  | Tailwind CSS + Shadcn UI + Framer Motion   | Component composition, styling, dark/light theme                     |
| Auth                | Clerk                                      | Identity, role assignment (Admin/Teacher/Student), session management, route protection |
| Primary Database    | PostgreSQL (via Prisma)                    | Relational core: academic structure, courses, grades, attendance, fees |
| Document Store      | MongoDB                                    | Semi-structured content: notes/resources metadata, community posts, project boards |
| Cache / Pub-Sub     | Redis                                      | Session/rate-limit cache, pub/sub for real-time chat & notifications across instances |
| Vector Store        | Pinecone / ChromaDB (managed)              | Embeddings for course documents, powers RAG retrieval                 |
| AI Orchestration    | LangChain + LLM provider                   | RAG pipeline orchestration, quiz/summary/insight generation           |
| File Storage        | Object storage (e.g. S3-compatible / Vercel Blob) | Uploaded notes, assignment attachments, resource files               |
| Background Jobs     | Job queue/worker (e.g. BullMQ on Redis, or equivalent) | Document ingestion, embedding generation, challan batch generation, report aggregation |

## System Boundaries
- `app/(public)` — Landing page and marketing routes; no auth required.
- `app/dashboard/admin`, `app/dashboard/teacher`, `app/dashboard/student` — Role-scoped authenticated routes, each rendering its own sidebar/workspace.
- `app/api` — Request handlers: auth checks, input validation, ownership/role checks, persistence, job triggering.
- `jobs` / `workers` — Long-running or scheduled work: document ingestion → embedding, challan batch generation, AI report aggregation.
- `lib` — Shared infrastructure: Prisma client, Mongo client, Redis client, Clerk helpers, RAG pipeline client, access-control helpers.
- `components` — UI composition only: dashboard widgets, tables, chat/AI panels, kanban boards, charts.
- `prisma` — PostgreSQL schema (academic structure, fees, grades, attendance) and generated client.
- `models` (Mongo) — Schemas for notes/resources, community posts, project boards, chat messages.

## Storage Model
SmartLMS splits data across three stores by access pattern, not by feature:

- **PostgreSQL (relational, transactional)**: Users-to-role mapping (synced from Clerk), Session/Group/Section/Course structure, Enrollment, Attendance, Grades, Fee Structure, Challan, Payment, AuditLog. Anything requiring joins, constraints, or financial integrity belongs here.
- **MongoDB (flexible/content)**: Notes & Resources metadata (category, file ref, uploader), Community posts/threads, Project Workspace boards/tasks, Announcement content, Message history. Chosen for variable schema and high write/read volume of content-style data.
- **Redis**: Ephemeral state — active session cache, typing/presence indicators, pub/sub channels for chat and notifications across server instances. Never the source of truth.
- **Vector Store (Pinecone/ChromaDB)**: One namespace/index per course. Stores chunked embeddings of ingested course documents (PDF/DOCX/text) for RAG retrieval only — never raw file content.
- **Object Storage**: Original uploaded files (notes, assignment attachments, project files, fee challans). PostgreSQL/Mongo records store only the file URL/reference, never the binary.

## Auth and Collaboration Model
- **Clerk handles all identity and authentication.** Clerk manages sign-in, session tokens, and password reset for all three roles.
- Each Clerk user carries a `role` (Admin / Teacher / Student) and an `academicScope` (group/section/course assignments) set via Clerk's public/private metadata, synced into PostgreSQL on account creation/update.
- **Account provisioning is admin-driven, not self-serve**: Admin creates Teacher accounts (via Clerk Backend API) and Student accounts/bulk-imports as part of academic structure setup. There is no public sign-up route.
- Route protection is enforced via Clerk middleware (`middleware.ts` / `proxy.ts`): every `/dashboard/*` route requires a valid Clerk session; role mismatch (e.g. Student hitting `/dashboard/admin`) redirects to the user's own dashboard.
- Every API route re-verifies Clerk auth() + role + academic-scope (e.g. a Teacher can only mark attendance for sections they are assigned to) before any read/write — middleware checks are not sufficient on their own.
- **Collaboration boundaries**:
  - Communities and Messages are scoped to shared courses/sections — never open, platform-wide DMs (safeguarding requirement, students are minors).
  - Only verified Clerk accounts created by Admin can access Communities/Messages; no public/guest access.
  - Admin retains audit visibility into community posts and messages via AuditLog records in PostgreSQL.
  - Project Workspace membership (Kanban boards) is scoped to the student group assigned by the Teacher/Admin who created the project room.

## AI Generation Model (RAG, Notes, Quizzes)

### Document Ingestion (shared foundation)
- Input: notes/resources uploaded by a Teacher into a course (PDF, DOCX, text).
- Execution (background job): extract text → chunk → embed → upsert into that course's vector-store namespace.
- Output: course-scoped embeddings ready for retrieval. Raw files remain in object storage; PostgreSQL/Mongo records reference both the file and its ingestion status.
- Invariant: every embedding is tagged with `courseId`; retrieval is always filtered to the requesting user's enrolled/assigned courses — no cross-course leakage.

### RAG Q&A (Student AI Study Assistant / Teacher AI Assistant)
- Input: user question + `courseId` context.
- Execution: LangChain pipeline retrieves top-K chunks from that course's vector namespace → constructs grounded prompt → LLM generates response.
- Output: answer returned to the chat UI with copy/share actions; interaction logged for AI Reports analytics.
- Faithfulness/relevance evaluated offline via RAGAS (target ≥ 0.85) — not a runtime gate, but a QA/monitoring process.

### Note Summarization
- Input: a course's ingested notes (selected document or full set).
- Execution: retrieval of relevant chunks from the course namespace → LLM summarization prompt.
- Output: a generated summary returned to the Teacher or Student AI panel; not auto-persisted as a Note unless the Teacher explicitly saves it.

### Quiz / MCQ Generation
- Input: Teacher-selected course/topic scope, optionally a specific document.
- Execution: retrieval of relevant chunks → LLM prompt constrained to generate structured quiz output (question, options, correct answer) — schema-validated before returning.
- Output: draft quiz/MCQ set shown to the Teacher for review/edit; only persisted as an Assignment/Quiz record in PostgreSQL after explicit Teacher save — AI output is never auto-published to students.

### Admin AI Reports
- Input: aggregated attendance, grading, and community-engagement data (PostgreSQL + Mongo), not raw documents.
- Execution: scheduled aggregation job + LLM-assisted insight generation (e.g. weak-course detection, low-attendance alerts).
- Output: report records/dashboard widgets for Admin; does not touch the vector store.

## Invariants
1. Request handlers do not run long AI/ingestion work directly — that belongs in background jobs/workers.
2. Vector-store retrieval is always scoped by `courseId` matching the requester's enrollment/assignment — never global.
3. AI-generated content (quizzes, summaries, assignments) is a draft until a Teacher/Admin explicitly saves it; nothing AI-generated auto-publishes to students.
4. Auth (Clerk) + role + academic-scope checks are enforced at every mutation boundary, not just at the route/middleware level.
5. Messaging and Community access never extends beyond shared course/section membership; no open social graph.
6. Financial mutations (challan generation, payment marking) always write an AuditLog entry.
7. Raw files live in object storage only; databases store references, never binaries or large blobs.