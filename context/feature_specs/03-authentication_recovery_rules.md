# Authentication Implementation Recovery Rules

This project may already contain a partial authentication implementation.

The agent must assume that previous implementation attempts may have:

* stopped due to token limits
* stopped due to API limits
* stopped due to context window limits
* stopped due to manual interruption
* partially completed some tasks

The agent must resume safely from the current project state.

---

## Recovery Workflow

Before implementing anything:

### Step 1 - Audit Existing Implementation

Inspect:

* package.json
* prisma/schema.prisma
* src/lib/
* src/types/
* src/app/
* src/components/
* src/actions/
* src/services/
* src/middleware*
* .env
* .env.example

Identify:

* existing authentication files
* existing authentication routes
* existing authentication utilities
* existing JWT implementation
* existing password hashing implementation
* existing login pages
* existing middleware

---

### Step 2 - Validate Existing Work

For every existing authentication artifact:

Determine:

* Is it complete?
* Is it working?
* Is it referenced correctly?
* Does it match this specification?

If valid:

Keep it.

If incomplete:

Extend it.

If broken:

Fix it.

Do not replace working code.

---

### Step 3 - Detect Duplicates

Before creating any file:

Verify whether an equivalent file already exists.

Examples:

Do not create:

```text
src/lib/auth.ts
```

if authentication utilities already exist elsewhere.

Do not create:

```text
src/types/auth.ts
```

if equivalent auth types already exist.

Do not create duplicate:

* JWT helpers
* password helpers
* auth middleware
* login routes
* logout routes
* session helpers

---

### Step 4 - Continue Implementation

Only implement missing requirements.

Never restart the feature from scratch.

Continue from the latest valid implementation state.

---

## Validation Rules

Before creating a new file:

Ask:

1. Does a file already exist?
2. Can the existing file be reused?
3. Can functionality be extended instead?
4. Will this create duplicate logic?

If yes:

Reuse existing implementation.

---

## Error Prevention Rules

Avoid:

* duplicate routes
* duplicate utilities
* duplicate middleware
* duplicate auth services
* duplicate Prisma access
* duplicate environment variables
* duplicate JWT logic

Avoid:

* creating multiple sources of truth
* introducing alternative implementations
* breaking working routes
* changing architecture unnecessarily

---

## Completion Validation

Before marking any task complete:

Verify:

* TypeScript compiles
* imports resolve correctly
* routes are reachable
* JWT helpers work
* password helpers work
* no duplicate files exist
* no duplicate functionality exists

Run:

```bash
npm run lint
npx tsc --noEmit
```

Fix all authentication-related errors before continuing.

---

## Progress Tracking

After every meaningful implementation step:

Update:

context/progress-tracker.md

Record:

* Existing items detected
* Newly completed tasks
* Validation results
* Files created
* Files modified
* Remaining tasks

This allows future agent sessions to resume safely.
