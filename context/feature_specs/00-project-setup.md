Read AGENTS.md before starting.
# Feature: Project Setup

## Overview

This feature establishes and validates the foundational project setup for the Smart Campus LMS & ERP application.

The purpose of this feature is to ensure that the project structure, development tooling, configuration files, shared utilities, and application foundation are properly configured before implementing database, authentication, or business features.

This specification must adapt to the current state of the repository and should not assume a clean project.

---

## Existing Implementation Verification

Before making any changes:

1. Inspect the current project structure.
2. Review package.json dependencies.
3. Review existing routes, components, configurations, and utilities.
4. Review all files related to project setup.
5. Compare the current implementation against this specification.

### Rules

* Do not recreate files that already exist and satisfy requirements.
* Do not rename folders or files unless required by the specification.
* Do not replace working implementations with alternative approaches without justification.
* Preserve existing code whenever possible.
* Extend existing implementations instead of rebuilding them.

### If Requirements Are Already Implemented

Mark them as completed and continue with remaining tasks.

### If Changes Are Required

Before making architectural or breaking changes:

1. Explain why the change is required.
2. Identify affected files.
3. Update relevant context documentation.
4. Implement the smallest possible change.

---

## Objectives

Validate and complete:

* Next.js configuration
* TypeScript configuration
* Tailwind CSS configuration
* ESLint configuration
* Project aliases
* Environment variable setup
* Base folder structure
* Shared utilities
* Root application layout
* Global styling

---

## Required Foundation

The project should use:

* Next.js App Router
* TypeScript
* Tailwind CSS
* ESLint
* npm package manager

---

## Dependency Verification

Inspect package.json and verify the presence of:

Core:

* next
* react
* react-dom
* typescript

Recommended:

* clsx
* tailwind-merge
* lucide-react

Development:

* eslint
* prettier
* prettier-plugin-tailwindcss

Only install missing dependencies.

Do not reinstall existing packages.

---

## Environment Configuration

Verify existence of:

```text
.env
.env.local
.env.example
```

Expected variables:

```env
DATABASE_URL=
NEXT_PUBLIC_APP_URL=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
GEMINI_API_KEY=
```

Only create missing files or variables.

Do not overwrite existing values.

---

## Folder Structure Verification

Verify and create only missing folders:

```text
src/

app/
components/
lib/
services/
actions/
hooks/
types/
constants/
providers/
config/
styles/
middleware/
```

Components structure:

```text
components/

ui/
forms/
layout/
dashboard/
shared/
```

---

## Shared Utilities

Verify existence of:

```text
src/lib/utils.ts
```

If missing:

Create utility helpers including:

* className utility
* formatting helpers
* reusable shared functions

If already implemented:

Preserve and extend only if required.

---

## Root Layout Verification

Inspect:

```text
src/app/layout.tsx
```

Verify:

* Metadata configuration
* Global styles import
* Provider support
* Root HTML structure

Only add missing functionality.

Do not rewrite working layouts.

---

## Global Styling Verification

Inspect:

```text
src/app/globals.css
```

Verify:

* Tailwind imports
* CSS variables
* Theme support
* Responsive defaults

Only add missing styles.

---

## Route Verification

Verify existence of:

```text
/
```

Home page

```text
/about
```

About page

```text
/contact
```

Contact page

```text
/unauthorized
```

Unauthorized page

Create only missing routes.

---

## Acceptance Criteria

The project should:

* Build successfully
* Run without errors
* Pass TypeScript validation
* Pass ESLint validation
* Have a consistent folder structure
* Support environment variables
* Support future Prisma integration
* Support future authentication integration

---

## Out Of Scope

Do not implement:

* PostgreSQL
* Prisma
* Authentication
* Authorization
* User Management
* Courses
* Attendance
* Notes
* Assignments
* Results
* Fees
* AI Features

These belong to future feature specifications.

---

## Deliverable

Provide a completion report containing:

### Existing Items Detected

List:

* Existing dependencies
* Existing folders
* Existing routes
* Existing configurations

### Missing Items Detected

List all missing requirements.

### Changes Made

Describe all changes.

### Files Created

List newly created files.

### Files Modified

List modified files.

### Architectural Decisions

Document any setup decisions made during implementation.

### Progress Tracker

Update:

```text
context/progress-tracker.md
```

Record:

* Completed tasks
* Remaining tasks
* Current project state
* Next recommended feature
