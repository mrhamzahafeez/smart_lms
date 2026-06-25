# UI Design Context

## Design Direction
SmartLMS uses a clean, professional "academic SaaS" aesthetic — closer to Notion/Linear than a traditional clunky school ERP. The goal is to feel calm and trustworthy for Admins, efficient for Teachers, and approachable (not childish) for Students. One shared design system powers all three dashboards; only data and permissions differ.

## Theme
- Both light and dark themes are supported (platform-wide toggle, per Section 7.11 of the PRD) — implemented via Tailwind CSS variables and a `.dark` class, not separate component trees.
- Light theme is the default for the public landing page and login; dashboards respect the user's saved preference.
- All colors are referenced through CSS custom property tokens defined in `globals.css` — never raw Tailwind palette classes or hardcoded hex values in components.

## Typography
- **Primary font**: Inter (UI text, body, tables, forms) — high legibility at small sizes, standard for data-dense SaaS dashboards.
- **Display font**: Lexend or Sora for landing-page headlines and dashboard page titles — slightly warmer/rounder, signals "education product" without looking childish.
- **Monospace**: JetBrains Mono — used only for codes/IDs (roll numbers, course codes, challan numbers).
- Type scale:
  - `text-xs` (12px) — table meta, timestamps, badges
  - `text-sm` (14px) — body default, form labels, sidebar items
  - `text-base` (16px) — primary content, chat messages
  - `text-lg` / `text-xl` — section headers, card titles
  - `text-2xl` / `text-3xl` — page titles, dashboard headline stat
- Font weights: 400 body, 500 emphasis/labels, 600 headings, 700 reserved for landing-page hero only.

## Color Tokens
| Token                  | Purpose                                              |
| ----------------------- | ----------------------------------------------------- |
| `bg-base`               | Page background                                       |
| `bg-surface`            | Card/panel background                                 |
| `bg-elevated`           | Modals, dropdowns, popovers                           |
| `text-primary`          | Default text                                          |
| `text-muted`            | Secondary text, helper text, placeholders             |
| `border-subtle`         | Default borders/dividers                              |
| `accent-primary`        | Primary brand action (buttons, active nav, links)     |
| `accent-success`        | Paid fees, submitted assignments, present attendance  |
| `accent-warning`        | Pending fees, late submissions, low attendance         |
| `accent-danger`         | Overdue, absent, failed/blocked actions               |
| `accent-ai`             | AI Assistant elements (chat bubbles, AI Reports, AI badges) — visually distinct from primary brand color |
| `role-admin`            | Admin-context accent (sidebar active state, badges)    |
| `role-teacher`          | Teacher-context accent                                 |
| `role-student`          | Student-context accent                                 |

Role accent colors are subtle (used on active nav item, role badge, and dashboard header underline only) — they reinforce "which dashboard am I in" without turning each dashboard into a different product.

## Layout Structure (shared across dashboards)
- **Top Navbar** (fixed): logo, current role badge, global search, notification bell (dropdown), theme toggle, user menu (auth provider user menu).
- **Left Sidebar** (collapsible): role-specific nav items per the PRD's site map (Section 7.12), grouped logically (e.g. Teacher: Courses → Students → Attendance → Notes → Assignments → Grading, then Communities/Project Workspace, then AI Assistant, then Announcements/Messages/Settings at the bottom).
- **Main Workspace**: page header (title + primary action button, right-aligned) + content area. Content area uses cards/tables/charts, never raw unstyled lists.
- **Right-side AI Panel** (Teacher/Student only): slide-in overlay, doesn't push main content — consistent with the AI Assistant being "always one click away" without being the default view.

## Component Patterns
- **Cards**: `rounded-2xl`, `border-subtle`, `bg-surface`, subtle shadow on hover only (no shadow at rest) — used for course cards, stat summaries, community cards.
- **Tables**: used for Teacher Directory, Student lists, Grade sheets, Challan batches — sticky header, zebra-free (border-based row separation), row actions revealed on hover, status shown as colored pill badges (`accent-success`/`warning`/`danger`).
- **Forms/Modals**: `rounded-3xl` dialogs, label above input, inline validation messages in `accent-danger`, primary action button right-aligned, destructive actions (delete teacher, delete course) require a typed-confirmation or explicit "Are you sure" step.
- **Buttons**: `rounded-xl`. Primary = solid `accent-primary`; secondary = outline/ghost; destructive = `accent-danger` outline, solid only on final confirm.
- **Status badges**: small `rounded-full` pills — Submitted/Pending/Late, Paid/Unpaid, Present/Absent — color-coded consistently across every module.
- **Charts**: line/bar charts for performance trends, attendance %, fee collection — muted gridlines, accent-primary/success/warning/danger as the only data colors (no rainbow palettes).

## Module-Specific Patterns
- **AI Assistant (Teacher & Student)**: chat-style thread, user messages right-aligned in `accent-primary`-tinted bubble, AI messages left-aligned in `accent-ai`-tinted bubble with a small bot icon; generated quizzes/summaries render as a distinct "draft card" with explicit Save/Discard actions (never auto-applied).
- **Communities/Discussions**: Slack/Discord-style — channel list left, threaded feed center, member list/pinned items right (collapsible on smaller viewports).
- **Project Workspace**: Kanban board, drag-and-drop columns (To Do / In Progress / Review / Done), task cards show assignee avatars and due-date pill.
- **Time Tracker (Student)**: large circular or bar timer control, daily goal as a horizontal progress bar, history as a simple list with subject tags.
- **Fee Challan (Admin)**: printable-style document card layout (clearly distinct from the rest of the dashboard chrome) — student info block, fee breakdown table, QR placeholder, due date badge.

## Accessibility & Responsiveness
- WCAG 2.1 AA target: minimum 4.5:1 text contrast in both themes, visible focus rings on all interactive elements, no color-only status indicators (always paired with text/icon).
- Mobile-responsive (PWA-ready): sidebar collapses to a bottom nav or hamburger drawer below `md` breakpoint; tables convert to stacked cards on small screens.
- All interactive icons have accessible labels; charts include a text-equivalent summary for screen readers where feasible.

## Motion
- Framer Motion used sparingly: sidebar/panel slide-in (200ms ease-out), modal fade+scale (150ms), AI "thinking" state as a subtle pulsing dot — never decorative animation that delays task completion (this is a study tool, not a marketing site, inside the dashboards).