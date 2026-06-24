# Feature: Database & Prisma Foundation

## Overview

This feature establishes the database architecture for Smart Campus LMS & ERP using PostgreSQL and Prisma ORM.

The PostgreSQL database, Prisma installation, environment configuration, and Prisma initialization may already be completed. This feature must inspect the current implementation and continue from the existing state rather than recreating completed work.

The objective is to create the initial LMS database schema, configure the Prisma client, generate migrations, and prepare the application for future authentication and role management features.

---

## Dependencies

Required:

* 00-project-setup.md completed

Verify through:

* context/progress-tracker.md

---

## Existing Implementation Verification

Before making any changes:

1. Inspect package.json.
2. Inspect prisma/schema.prisma.
3. Inspect prisma.config.ts.
4. Inspect .env configuration.
5. Verify Prisma installation.
6. Verify PostgreSQL connection configuration.
7. Compare implementation against this specification.

### Rules

* Do not reinstall Prisma if already installed.
* Do not recreate prisma initialization files.
* Do not overwrite DATABASE_URL.
* Do not modify working database configuration.
* Preserve existing implementation whenever possible.
* Extend existing implementation only where required.

### If Requirements Are Already Implemented

Mark them as completed and continue.

### If Changes Are Required

Before making architectural changes:

1. Explain why the change is required.
2. Identify affected files.
3. Update context documentation.
4. Apply the smallest possible change.

---

## Expected Existing State

Verify whether the following already exist:

```text id="o6gx6q"
prisma/
├── schema.prisma

prisma.config.ts
```

Verify package.json contains:

```json id="v0m4hb"
{
  "prisma": "...",
  "@prisma/client": "..."
}
```

Verify:

```env id="5rr43e"
DATABASE_URL=
```

If already implemented, do not recreate.

---

## Database Architecture

Create only the foundational LMS entities.

### User

Purpose:

Central account record for all platform users.

Fields:

* id
* email
* password
* role
* isActive
* createdAt
* updatedAt

Requirements:

* email unique
* role enum
* timestamps

---

### Student

Purpose:

Student-specific profile information.

Fields:

* id
* userId
* rollNumber
* department
* semester
* createdAt
* updatedAt

Requirements:

* rollNumber unique
* one-to-one relationship with User

---

### Teacher

Purpose:

Teacher-specific profile information.

Fields:

* id
* userId
* serialNumber
* designation
* createdAt
* updatedAt

Requirements:

* serialNumber unique
* one-to-one relationship with User

---

### Course

Purpose:

Academic courses.

Fields:

* id
* courseCode
* title
* description
* creditHours
* createdAt
* updatedAt

Requirements:

* courseCode unique

---

### Enrollment

Purpose:

Student course registrations.

Fields:

* id
* studentId
* courseId
* enrolledAt

Requirements:

* foreign keys
* prevent duplicate enrollments

---

## Prisma Best Practices

Requirements:

* Use Prisma enums where appropriate.
* Use @unique constraints.
* Use createdAt timestamps.
* Use updatedAt timestamps.
* Add indexes where beneficial.
* Follow Prisma naming conventions.

---

## Prisma Client Configuration

Verify existence of:

```text id="4cb9h7"
src/lib/prisma.ts
```

If missing:

Create Prisma singleton client.

Requirements:

* Prevent multiple Prisma instances during development.
* Support Next.js App Router.

---

## Migration

After schema completion:

Generate migration:

```bash id="48npd3"
npx prisma migrate dev --name init_database
```

Generate client:

```bash id="9p8dzl"
npx prisma generate
```

---

## Validation

Verify:

```bash id="l4w85l"
npx prisma validate
```

```bash id="fzs2pk"
npm run lint
```

```bash id="lnahjz"
npx tsc --noEmit
```

Confirm:

* Migration successful
* Tables created
* Prisma Client generated
* No TypeScript errors
* No lint errors

---

## Out Of Scope

Do NOT implement:

* Authentication
* Authorization
* Admin Dashboard
* Student Dashboard
* Teacher Dashboard
* Attendance
* Notes
* Assignments
* Results
* Fees
* Challans
* File Uploads
* AI Features

These belong to future feature specifications.

---

## Acceptance Criteria

* PostgreSQL connection verified.
* Prisma configured correctly.
* Initial schema created.
* Migration applied successfully.
* Prisma Client generated.
* Development server still runs successfully.
* No TypeScript errors.
* No ESLint errors.

---

## Deliverable

Provide:

### Existing Items Detected

* Prisma installation status
* PostgreSQL configuration status
* Existing schema status
* Existing migration status

### Missing Items Detected

List missing requirements.

### Changes Made

Describe modifications.

### Files Created

List newly created files.

### Files Modified

List modified files.

### Architectural Decisions

Document database design decisions.

### Progress Tracker

Update:

```text id="s8uhwp"
context/progress-tracker.md
```

Record:

* completed database tasks
* migration status
* schema status
* next recommended feature

---

## Next Recommended Feature

02-authentication.md
