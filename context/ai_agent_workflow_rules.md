# Development Workflow Rules

## Approach
Build SmartLMS incrementally, against the existing context files — `project_overview.md`, `project_architecture.md`, `project_uidesign.md`, and `coding_standard.md` — and the release phases defined in the PRD (Phase 0–6). These files define what to build, how to build it, and what it should look like. Do not infer or invent academic, financial, or AI behavior that isn't defined in them. The frontend already exists against mock data (Phase 0, complete); the agent's job from here is backend wiring, AI integration, and progressive replacement of mock data with real data — without breaking the existing UI contracts.

## Scoping Rules
- Work on exactly one feature unit at a time (e.g. "Attendance marking API," not "Teacher dashboard backend").
- A feature unit must map to one functional area from the PRD (Section 7) and one layer from the architecture (API route, job, or UI wiring) — not several.
- Prefer small, verifiable increments over large speculative builds. If unsure whether something is one unit or three, default to three.
- Never implement a feature for a role you weren't asked to implement it for, even if it looks like "the same feature, different role" (e.g. building Student-side Grades view automatically while asked for Teacher-side grade entry).
- Always check `progress_tracker.md` before starting — do not re-implement or silently diverge from a feature already marked complete.

## When To Split Work
Split a step into smaller units if it combines any of the following:
- A relational (PostgreSQL) change and a document-store (MongoDB) change
- An API route and the background job it triggers (build and verify the job in isolation first)
- AI/RAG logic and the UI that displays its output
- Changes across more than one role's dashboard
- Academic data (grades, attendance) and financial data (fees, challans) in the same change
- A new capability and a refactor of existing code — never ship both in one step

If a unit can't be verified end-to-end on its own (e.g. "did the API return the right shape," "did the job complete," "does the UI render the real data correctly") in one focused pass, the scope is too broad — split it.

## Handling Missing Requirements
- Do not invent academic policy, grading rules, fee logic, or AI behavior that isn't stated in `project_overview.md` or the architecture context.
- If a requirement is ambiguous (e.g. exact grade-boundary rules, which exam types are weighted how), stop and resolve it in the relevant context file before writing implementation code — do not guess and proceed.
- If a requirement is genuinely missing, add it as an **Open Question** in `progress_tracker.md` with enough detail that a human can answer it, then either pause that unit or implement the narrowest unambiguous version and flag the assumption explicitly in the tracker.
- Never silently resolve a discrepancy between context files (e.g. architecture doc vs. UI spec) — surface it the same way Section 5.3 of the PRD did, as an explicit decision point.

## Protected Foundation Components
Do not modify the following unless a task explicitly instructs it:
- `components/ui/*` (Shadcn UI primitives)
- Generated Prisma client output (`prisma/generated/*` or equivalent)
- Clerk SDK internals and Clerk-provided UI components (extend via configuration/props, not by editing the package)
- Any third-party library internals (LangChain, vector-store SDKs, Mongo/Redis drivers)

Project-specific logic, layout, and styling changes belong in app-level components and `lib/` modules — never in the files above. If a foundation component genuinely must change (e.g. a Shadcn component needs a new variant), that change must be called out as its own unit, not bundled silently into a feature change.

## Keeping Docs In Sync
Update the relevant context file in the same work session as the implementation change, not later:
- `project_architecture.md` — any change to storage model, system boundaries, auth/collaboration rules, or the AI/RAG pipeline.
- `project_uidesign.md` — any new UI pattern, token, or layout convention not already documented.
- `coding_standard.md` — any new convention adopted during implementation (e.g. a new validation pattern, a new file-naming rule).
- `project_overview.md` — any change to feature scope, in/out-of-scope decisions, or success criteria.

If implementation and docs disagree, the docs are wrong until updated — never leave a silent mismatch for the next session to discover.

## Before Moving To The Next Unit
A unit is not done until all of the following hold:
1. It works end-to-end within its declared scope (API → DB/job → UI, as applicable) — not just "compiles."
2. No invariant in `project_architecture.md` was violated (role/scope checks, storage boundaries, AI-draft-until-approved rule, audit logging on financial/academic mutations, course-scoped RAG retrieval).
3. No protected foundation component was modified without explicit instruction.
4. Styling follows `project_uidesign.md` tokens — no raw colors, no ad hoc radius/spacing values.
5. `npm run lint` and `npm run build` (or equivalent) pass clean.
6. `progress_tracker.md` is updated with: what was built, which files changed, and any new open questions — written as the actual current state, not the intended one.

Only after all six are true should the agent move to the next feature unit.