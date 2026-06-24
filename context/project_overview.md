# SmartLMS
## Overview
SmartLMS is a unified, AI-assisted digital campus platform for Intermediate colleges (Grade 11-12, FSC/ICS/FA/ICOM streams). It replaces WhatsApp groups, paper fee challans, and disconnected spreadsheets with a single role-based web application for Admins, Teachers, and Students — combining academic administration, a teaching/learning workspace, and an AI + community layer in one product.

## Goals
1. Make SmartLMS the system of record for academic structure, fees, and communication at the pilot college.
2. Differentiate via AI-assisted learning (RAG) grounded in each course's own content.
3. Drive daily engagement across all three roles, not just Admin.
4. Replace manual record-keeping with structured, auditable digital workflows.

## Core User Flow
1. User visits the public landing page and logs in via role selector (Admin / Teacher / Student).
2. User is redirected to their role-specific dashboard (`/dashboard/admin`, `/dashboard/teacher`, `/dashboard/student`).
3. Admin sets up academic structure (Session → Group → Section → Course), onboards teachers, and assigns students.
4. Teacher manages courses: attendance, notes/resources, assignments, grading, communities, and project workspaces.
5. Student consumes courses: views notes/assignments/grades, tracks attendance, asks the AI Study Assistant questions, and collaborates in communities/projects.
6. Admin generates fee challans and tracks payments.
7. All roles use AI features, communities, and messaging scoped to their courses.

## Features
### Public Website & Auth
- Marketing landing page with feature grid and dashboard preview.
- Role-based login (Admin/Teacher/Student) with show/hide password, remember me, forgot password.
- JWT sessions (24h expiry, refresh-token rotation); route-level role-based access control.

### Academic Administration (Admin)
- Teacher lifecycle: add/edit/delete, assign courses & sections, generate/reset credentials, enable/disable access.
- Course creation: auto-provisions Announcements, Assignments, Resources, Discussion, Attendance, and Shared Files per course.
- Academic structure management: Sessions, Groups (FSC, ICS, FA, ICOM), Sections, subject combinations.

### Financial Management (Admin)
- Fee-structure setup per group/section.
- Bulk fee-challan generation (name, roll number, due date, fee breakdown, QR placeholder).
- Mark paid/unpaid, pending-fee tracking, payment/revenue reports.

### Teaching & Learning Workspace (Course Workspace)
- Notes & Resources: categorized upload, search, filter, download.
- Assignments: create with due date/attachments, submit with file upload, status tracking, teacher review/comments.
- Grading: marks by exam type, auto-computed grade/percentage, performance-trend view for students.
- Attendance: daily/subject-wise marking with bulk actions; student-facing attendance percentage and history.

### Communities & Discussion Groups
- Course-linked and topic-based communities (class, subject, clubs, exam-prep).
- Channel-style UI: sidebar, post feed, threaded replies, member list, pinned announcements.
- Real-time updates to threads without manual refresh.

### Project Workspace
- Kanban-style task boards per project with team assignment, deadlines, file sharing, progress tracking, activity feed.

### Communication
- Announcements: course/group-targeted, pinnable, schedulable.
- In-app notifications for every role.
- Course/community-scoped messaging (not open social DMs, for safeguarding).
- Admin broadcast tools with delivery history.

### AI Engine (RAG)
- Document ingestion (PDF/DOCX/text) per course into a RAG pipeline (chunking, embedding, vector store, retrieval, grounded LLM response).
- Teacher AI Assistant: note summaries, quiz/MCQ generation, assignment drafts, performance insights.
- Student AI Study Assistant: topic explanations, question solving, lecture summaries, practice quizzes — grounded in that student's enrolled courses only.
- Admin AI Reports: attendance trends, weak-course detection, engagement analytics, low-attendance alerts.

### Time Tracker (Student)
- Start/stop/reset study timer with subject-wise logging, daily goal progress, weekly/monthly charts.

### Personalization & Settings
- Profile management per role, dark/light theme toggle, notification preferences, password management.

## Scope
### In Scope (MVP v1)
- Public landing page and role-based login
- Admin, Teacher, and Student dashboards (already built on mock data; backend wiring is next phase)
- Fixed academic structure model (Session → Group → Section → Course), admin-driven assignment (not student self-enroll)
- Course-scoped RAG AI assistant
- Communities, project workspace, course/community-scoped messaging
- Fee-challan generation and manual payment tracking

### Out of Scope (Future Phases)
- Native mobile apps (responsive web only for v1)
- Online payment-gateway integration (challans only in v1)
- Public, open-enrollment course marketplace
- Badges/gamification and social feed (posts/likes)
- Parent/guardian portal

## Key Product Decisions
- **Academic model**: Fixed Session → Group → Section → Course structure (admin-assigned), not browse-and-enroll.
- **Frontend framework**: Next.js (App Router) + Tailwind + Shadcn UI — standardized over the Architecture Doc's earlier "React.js" entry.
- **Messages**: Scoped to course/community context (teacher ↔ student), not open social DMs — safeguarding requirement since students are minors.
- **Gamification & social feed**: Deferred to a later phase pending pilot validation.

## Non-Functional Requirements
- Performance: API < 500ms, RAG response < 3s, chat delivery < 200ms.
- Security: bcrypt hashing, JWT + refresh rotation, HTTPS, input validation, role-based access on every route.
- Scalability: stateless API, Redis pub/sub for chat, managed vector store.
- Usability: mobile-responsive, PWA-ready, WCAG 2.1 target, one consistent design system.
- Safeguarding: school-account-only access for Communities/Messages (minors), moderation hooks, Admin audit trail.

## Success Criteria
1. ≥90% of enrolled students have an activated account in month 1.
2. ≥85% of teachers actively use grading + attendance weekly.
3. RAG answer faithfulness/relevance (RAGAS) ≥ 0.85.
4. Fee-challan run generated and distributed in < 1 day.
5. ≥70% reduction in admin queries previously handled over WhatsApp.
6. All grading, attendance, and fee actions are auditable and reflected in real time to the affected role.