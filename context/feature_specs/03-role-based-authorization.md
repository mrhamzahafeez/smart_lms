# Feature: Role-Based Authorization

## Overview

This feature implements role-based authorization for Smart Campus LMS & ERP.

Authentication has already been implemented using:

* JWT Authentication
* bcrypt Password Hashing
* HttpOnly Cookies
* Prisma User Model

This feature extends authentication by controlling access to pages, APIs, and resources based on user roles.

Authorization determines what an authenticated user is allowed to access.

Authentication verifies identity.

Authorization verifies permissions.

---

## Dependencies

Required:

* 00-project-setup.md completed
* 01-database-prisma.md completed
* 02-authentication.md completed

Verify through:

* context/progress-tracker.md

---

## Architecture Decision

The original project architecture referenced Clerk.

The project has transitioned to:

* JWT Authentication
* Prisma User Storage
* HttpOnly Cookie Sessions

Authorization must use the current JWT-based authentication system.

Do not install or configure Clerk.

Do not introduce third-party authorization providers.

---

## Existing Implementation Verification

Before making any changes:

1. Inspect authentication implementation.
2. Inspect Prisma User model.
3. Inspect existing middleware.
4. Inspect dashboard routes.
5. Inspect API routes.
6. Inspect auth utilities.
7. Compare implementation against this specification.

### Rules

* Do not recreate working authentication logic.
* Do not duplicate middleware.
* Do not duplicate role helpers.
* Reuse JWT validation functions.
* Extend existing implementation.
* Make the smallest possible changes.

### If Requirements Are Already Implemented

Mark as completed.

Continue with remaining tasks.

### If Changes Are Required

Before making architectural changes:

1. Explain why.
2. Identify affected files.
3. Update context documentation.
4. Apply the smallest possible change.

---

## Roles

The system must support:

### Admin

Permissions:

* Manage Students
* Manage Teachers
* Manage Courses
* Manage Attendance
* Manage Results
* Manage Fees
* Manage Announcements
* Access all dashboards

---

### Teacher

Permissions:

* Manage assigned courses
* Mark attendance
* Create assignments
* Upload notes
* Publish results

---

### Student

Permissions:

* View enrolled courses
* Submit assignments
* View attendance
* View notes
* View results
* View fee records

---

## User Role Source

Use:

```text
User.role
```

From Prisma User model.

Do not create a separate role system.

User.role must be the single source of truth.

---

## Authorization Utilities

Verify or create:

```text
src/lib/authorization.ts
```

Responsibilities:

* requireAuth()
* requireRole()
* requireAdmin()
* requireTeacher()
* requireStudent()

Reuse existing authentication utilities.

Do not duplicate JWT logic.

---

## Route Protection

Protect dashboard routes:

```text
/admin/*
```

Admin only.

---

```text
/teacher/*
```

Teacher only.

---

```text
/student/*
```

Student only.

---

Unauthorized access must redirect to:

```text
/unauthorized
```

---

## API Protection

Protect future API routes.

Examples:

Admin APIs:

```text
/api/admin/*
```

Teacher APIs:

```text
/api/teacher/*
```

Student APIs:

```text
/api/student/*
```

Authorization checks must happen before business logic executes.

---

## Middleware

Verify whether middleware already exists.

If missing:

Create:

```text
src/middleware.ts
```

Responsibilities:

* validate authentication
* read JWT session
* enforce role access
* redirect unauthorized users

Do not create duplicate middleware files.

---

## Dashboard Validation

Verify role-based access:

### Admin

Can access:

```text
/admin/dashboard
```

Cannot access:

```text
/teacher/dashboard
/student/dashboard
```

---

### Teacher

Can access:

```text
/teacher/dashboard
```

Cannot access:

```text
/admin/dashboard
/student/dashboard
```

---

### Student

Can access:

```text
/student/dashboard
```

Cannot access:

```text
/admin/dashboard
/teacher/dashboard
```

---

## Validation

Verify:

* JWT session validation works.
* Role validation works.
* Unauthorized users redirected correctly.
* Dashboard protection works.
* API protection works.

Run:

```bash
npm run lint
npx tsc --noEmit
```

Fix all authorization-related errors.

---

## Out Of Scope

Do NOT implement:

* Student Management
* Teacher Management
* Course Management
* Attendance
* Assignments
* Results
* Fees
* Announcements
* AI Features

These belong to future feature specifications.

---

## Acceptance Criteria

* Roles implemented successfully.
* Dashboard access protected.
* API access protected.
* Unauthorized access blocked.
* Middleware functioning correctly.
* No duplicate authorization logic.
* No TypeScript errors.
* No ESLint errors.

---

## Deliverable

Provide:

### Existing Items Detected

### Missing Items Detected

### Validation Results

### Changes Made

### Files Created

### Files Modified

### Architecture Decisions

### Progress Tracker Updates

Update:

```text
context/progress-tracker.md
```

Record:

* authorization status
* role implementation status
* protected routes status
* next recommended feature

---

## Next Recommended Feature

04-admin-management.md
