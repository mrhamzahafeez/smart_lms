<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

## Application Building Context

This is **SmartLMS** — an AI-powered Learning Management System for Intermediate colleges (Grade 11 & 12). Read the following files in order before implementing or making any architectural decision:

1. `context/project_overview.md` — product definition, goals, features, and scope
2. `context/project_architecture.md` — system structure, boundaries, storage model, auth/collaboration model, and AI/RAG invariants
3. `context/project_uidesign.md` — theme, colors, typography, layout, and component conventions
4. `context/coding_standard.md` — implementation rules and conventions
5. `context/ai_agent_workflow_rules.md` — development workflow, scoping rules, and delivery approach
6. `context/progress_tracker.md` — current phase, completed work, open questions, and next steps

Update `context/progress_tracker.md` after each meaningful implementation change.

If implementation changes the architecture, scope, or standards documented in the context files, update the relevant file before continuing.

# Existing Code First Rule

Before implementing any feature:

1. Inspect the current implementation.
2. Determine what already exists.
3. Reuse existing architecture and patterns.
4. Only implement missing requirements.
5. Avoid refactoring working code unless necessary.
6. Do not introduce breaking changes without documenting the reason.
7. Prefer incremental updates over rewrites.

The project is expected to be implemented in phases. Some requirements in feature specifications may already be partially or fully completed. The implementation must adapt to the current state of the project rather than assuming a clean starting point.
