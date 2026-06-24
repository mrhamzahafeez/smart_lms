# Feature: Authentication & Session Management

## Overview

This feature implements the authentication foundation for Smart Campus LMS & ERP.

The original project architecture considered Clerk Authentication. However, the project has intentionally switched to a custom authentication system using Prisma, JWT, and bcrypt for the initial implementation.

The goal is to provide complete authentication and session management while maintaining the ability to migrate to Clerk or another authentication provider in the future if required.

This feature must implement authentication only. Authorization, role permissions, and user management belong to future features.

---

## Dependencies

Required:

* 00-project-setup.md completed
* 01-database-prisma.md completed

Verify through:

* context/progress-tracker.md

---

## Architecture Decision

### Previous Approach

The original architecture referenced:

* Clerk Authentication

### Current Approach

The project has switched to:

* JWT Authentication
* bcrypt password hashing
* Prisma user storage
* HttpOnly cookie-based sessions

### Reason

The project requires:

* Full control over authentication logic
* Learning-focused implementation
* No dependency on third-party authentication providers
* Better understanding of authentication architecture

Future migration to Clerk should remain possible.

---

## Existing Implementation Verification

Before making any changes:

1. Inspect existing authentication code.
2. Inspect package.json.
3. Inspect Prisma schema.
4. Inspect middleware configuration.
5. Inspect existing login or auth routes.
6. Compare implementation against this specification.

### Rules

* Do not install Clerk.
* Do not create Clerk configuration.
* Do not create Clerk middleware.
* Preserve existing work where possible.
* Extend existing implementation rather than rebuilding it.
* Make the smallest possible changes.

### If Requirements Are Already Implemented

Mark them as completed.

Continue with remaining tasks.

### If Changes Are Required

Before making architectural changes:

1. Explain why the change is required.
2. Identify affected files.
3. Update context documentation.
4. Apply the smallest possible change.

---

## Required Packages

Verify:

```json
{
  "bcryptjs": "...",
  "jsonwebtoken": "..."
}
```

If missing:

```bash
npm install bcryptjs jsonwebtoken
```

Install only missing dependencies.

---

## User Model Verification

Verify User model contains:

* id
* email
* password
* role
* isActive
* createdAt
* updatedAt

Password must store hashed values only.

Never store plain text passwords.

---

## Authentication Features

Implement:

### Login

User enters:

* email
* password

System:

* validates credentials
* verifies password hash
* generates JWT token
* creates session cookie

---

### Logout

System:

* clears authentication cookie
* invalidates current session

---

### Session Validation

System should:

* validate JWT
* identify current user
* provide authenticated user context

---

## JWT Configuration

Environment Variables:

```env
JWT_SECRET=
JWT_EXPIRES_IN=
```

Add only if missing.

Do not overwrite existing values.

---

## Authentication Utilities

Create or verify:

```text
src/lib/auth.ts
```

Responsibilities:

* password hashing
* password comparison
* JWT generation
* JWT verification
* session helpers

---

## API Routes

Create only if missing.

### Login

```text
/api/auth/login
```

Method:

```http
POST
```

---

### Logout

```text
/api/auth/logout
```

Method:

```http
POST
```

---

### Current User

```text
/api/auth/me
```

Method:

```http
GET
```

---

## Authentication Pages

Create only if missing.

### Login Page

```text
/login
```

Requirements:

* email field
* password field
* validation
* error handling

---

## Security Requirements

Passwords:

* bcrypt hashing
* minimum 10 salt rounds

Cookies:

* HttpOnly
* Secure in production
* SameSite protection

JWT:

* signed using JWT_SECRET
* expiration support

Never:

* expose passwords
* expose secrets
* store authentication tokens in localStorage

---

## Validation

Verify:

* login works
* logout works
* session persists
* invalid credentials rejected
* protected routes can detect user

Run:

```bash
npm run lint
npx tsc --noEmit
```

---

## Out Of Scope

Do NOT implement:

* Role permissions
* Route authorization
* Admin dashboard access rules
* Teacher dashboard access rules
* Student dashboard access rules
* User management
* Password reset
* Email verification
* OAuth providers
* Clerk integration

These belong to future feature specifications.

---

## Acceptance Criteria

* Users can login.
* Passwords are hashed.
* JWT tokens generated successfully.
* Secure cookies implemented.
* Sessions validated successfully.
* Logout works correctly.
* No TypeScript errors.
* No ESLint errors.

---

## Deliverable

Provide:

### Existing Items Detected

* Existing authentication files
* Existing dependencies
* Existing routes

### Missing Items Detected

List missing requirements.

### Changes Made

Describe modifications.

### Files Created

List newly created files.

### Files Modified

List modified files.

### Architectural Decisions

Document authentication decisions.

### Progress Tracker

Update:

```text
context/progress-tracker.md
```

Record:

* authentication status
* session management status
* completed tasks
* next recommended feature

---

## Next Recommended Feature

03-role-based-authorization.md
