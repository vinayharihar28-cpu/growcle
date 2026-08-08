# Person B: Frontend & Feature Developer Handbook

## Introduction

Welcome to the Growcle White-Label Business Networking SaaS Platform. As the Frontend & Feature Developer (Person B), you are the master of the user experience. You own all user-facing interactions, visual aesthetics, state management, and frontend architecture.

This role requires a deep understanding of React, Next.js, and modern CSS frameworks (Tailwind CSS). You will consume the APIs built by the Backend Architect (Person A) and transform them into intuitive, responsive, and highly polished interfaces. Your work directly impacts how users perceive the value of the platform.

This document serves as your official source of truth for component structure, UI standards, dashboard requirements, and frontend deliverables.

---

## Public Website

The public website serves as the marketing face of the platform and the primary conversion funnel.

### Home
**Purpose:** Introduce the platform, highlight key benefits, and drive registrations.
**Sections:** Hero Section (with dynamic background), Features Grid, Testimonials Carousel, CTA, Footer.
**Components:** Gradient buttons, floating metric cards, animated scroll reveals.
**Responsive Behavior:** Stack columns on mobile; reduce typography scale.
**Future Improvements:** A/B testing on hero messaging and localized content rendering.

### About & Contact
**Purpose:** Build trust and provide communication channels.
**Sections:** Mission Statement, Leadership Team, Contact Form, Location Map.
**Forms:** Contact form with client-side Zod validation.
**Future Improvements:** Live chat integration.

### Login & Register
**Purpose:** Secure entry points into the application.
**Sections:** Split screen (marketing image on left, form on right).
**Forms:** Email/Password fields, Social Login buttons. Real-time validation.
**Animations:** Shake on invalid login, smooth transitions between steps.

---

## Member Workspace

The core experience for individual networking professionals.

### Dashboard
**Purpose:** Provide a high-level overview of the member's networking success.
**Widgets:**
- **KPI Cards:** Total Referrals Given, Total Referrals Received, Value Generated (Revenue).
- **Recent Activity Feed:** Latest meetings, 1-to-1s logged, and referrals updated.
- **Quick Actions:** "Log Referral", "Schedule 1-to-1", "Update Profile".
**Charts:** Revenue generated over the last 6 months (Bar Chart).
**Loading State:** Skeleton loaders for all widgets.

### Business Profile
**Purpose:** Allow members to showcase their services.
**Forms:** Rich text bio, contact details, social links, logo upload.
**Permissions Required:** `profile.edit` (User owns the profile).

### My Referrals
**Purpose:** Track the status of business passed and received.
**Tables:** Data table with sorting, filtering by status (Pending, Contacted, Closed Won, Closed Lost).
**Dialogs:** "Update Referral Status" modal.

### Visitors & Meetings
**Purpose:** Allow members to invite guests and review upcoming meetings.
**Forms:** Visitor Invitation form (triggers email).
**Calendar:** Custom calendar view highlighting chapter meeting dates.

---

## Chapter Administration Workspace

Used by chapter leadership to manage the weekly flow of the networking group.

### Dashboard
**Purpose:** Chapter health overview.
**Widgets:** Total Active Members, Visitor Conversion Rate, Chapter Revenue Generated.
**Charts:** Member retention trends.
**Quick Actions:** "Record Attendance", "Add Announcement".

### Members & Attendance
**Purpose:** Directory management and weekly roll call.
**Tables:** Editable data table for marking Present, Absent, Substitute, Excused.
**Filters:** By date, by member status.

### Reports & Agenda
**Purpose:** Generate materials for the weekly meeting.
**Views:** Printable meeting agenda view.
**Future Enhancements:** PDF export functionality for physical distribution.

---

## Organization Workspace

Used by regional or national directors overseeing multiple chapters.

### Dashboard
**Purpose:** Aggregate data across all chapters.
**Widgets:** Total Chapters, Total Organization Revenue, Top Performing Chapter.
**Maps:** Geographical distribution of chapters.

### Chapters & Executives
**Purpose:** Manage the hierarchy.
**Tables:** List of chapters with deep-links into the Chapter Administration Workspace.
**Forms:** "Create New Chapter" wizard.

---

## Platform Administration Workspace

The super-admin view for the SaaS owners.

### Dashboard & White Label
**Purpose:** System health and tenant management.
**Widgets:** Active Organizations, Total MRR, Server Health.
**Forms:** Theme configuration form (Primary Color, Logo URL, Custom Domain routing).
**Tables:** Audit logs for critical system actions.

---

## Shared Components & UI Standards

### Shared Components
To ensure consistency and development speed, you must utilize and maintain a robust shared component library (`src/shared/components`).
- **Cards:** Standardized padding, border-radius, and hover elevation.
- **Tables:** Abstracted data tables using `@tanstack/react-table` supporting pagination and global search.
- **Dialogs/Modals:** Accessible, focus-trapping modals for forms and confirmations.
- **Forms:** React Hook Form integrated with Shadcn UI inputs and Zod resolvers.

### UI Standards
**Typography:** Inter or similar modern sans-serif. Strict adherence to Tailwind text scales (`text-sm`, `text-base`, `text-xl`).
**Colors:** Semantic naming (Primary, Secondary, Destructive, Muted). Must support Dark Mode via CSS variables.
**Spacing:** Consistent use of Tailwind's 4-point grid (`p-4`, `m-6`, `gap-8`).
**Loading Skeletons:** Never show a blank screen. Use pulsing skeletons matching the final component layout.
**Error Handling:** Elegant error boundaries and toast notifications for user actions.

---
wwetiuytr
## Daily Responsibilities

1. **Receiving Tasks:** Review feature requirements and verify backend API readiness (via Swagger or Postman).
2. **Building Features:** Construct UI components using the established design system. Ensure absolute responsiveness (Mobile First).
3. **Integration:** Connect UI components to APIs using React Query or Zustand for state management.
4. **Testing:** Verify cross-browser compatibility and responsive breakpoints. Ensure all form validations work correctly.
5. **Pull Requests:** Submit PRs with screenshots/videos of UI changes attached.

---

## Deliverables

Before project completion, Person B must deliver:
1. A fully responsive, high-converting public marketing website.
2. The complete Member Workspace including dashboards, referral tracking, and profile management.
3. The Chapter and Organization Administrative Workspaces with complex data tables and reporting views.
4. The Super Admin Platform Workspace featuring white-label configuration forms.
5. A cohesive, documented design system (Storybook or internal showcase page) containing all reusable UI components.
6. Seamless integration with all backend APIs, featuring robust error handling and loading states.
