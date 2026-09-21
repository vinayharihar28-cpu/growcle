also the member imnplementation was stopped in between so iwant you to check and implemenmt what is missing and complete it and do not erase anything which is there 
# Implementation Plan: Growcle Member Dashboard Workspace

Implement the complete specification from `D:\Education\growcle\white-label-saas\docs\Requirments\member.md` for regular Growcle members, providing a dedicated member-scoped networking workspace at `/dashboard/member` with real Server Actions, profile and business management, referrals in ₹ INR, visitor invitations, meetings with 1-click self-attendance check-in, 1-to-1s, notifications, and personal performance reports.

As explicitly instructed by the user, the **Payment section is omitted / removed** from all member navigation and views for now.

## User Review Required

> [!IMPORTANT]
> **Payments Section Omitted**: Per your instruction, the payments and invoices section is completely excluded from the member navigation, dashboard cards, and sub-pages.
> 
> **Strict Member Scope**: A normal member can only view and edit their own profile, their own business, referrals they gave or received, visitors they personally invited, their own attendance records, and their own 1-to-1s. They have read-only discovery access to fellow chapter members and chapter meetings.
> 
> **All Currency in INR (`₹`)**: All referral values and closed business figures are displayed in Indian Rupees with `en-IN` numbering.

## Proposed Changes

---

### 1. Navigation Configuration

#### [MODIFY] [member.ts](file:///d:/Education/growcle/white-label-saas/src/shared/config/navigation/member.ts)
- Update `memberNavigation` to reflect the updated member routes:
  - Workspace Home: `/dashboard/member`
  - My Profile: `/dashboard/member/profile`
  - My Business: `/dashboard/member/business`
  - Chapter Members: `/dashboard/member/members`
  - Referrals: `/dashboard/member/referrals`
  - Visitors: `/dashboard/member/visitors`
  - Meetings: `/dashboard/member/meetings`
  - Attendance: `/dashboard/member/attendance`
  - 1-to-1 Sessions: `/dashboard/member/one-to-ones`
  - Announcements: `/dashboard/member/notifications`
  - Reports: `/dashboard/member/reports`
- **Completely remove all payment / invoice items** from navigation.

---

### 2. Member Server Actions Layer

#### [NEW] [member-actions.ts](file:///d:/Education/growcle/white-label-saas/src/features/member/actions/member-actions.ts)
- `getMemberContext()`: Resolves current authenticated member identity, assigned chapter details, and status.
- `getMemberDashboardData(memberId: string)`:
  - Personal KPIs: Membership status, attendance %, referrals given/received, closed business value in ₹ INR, 1-to-1s completed/scheduled, visitors invited/attended.
  - Next Chapter Meeting summary with 1-click self check-in status.
  - Quick action helpers and upcoming schedule items.
- `getMemberProfile(memberId: string)` & `updateMemberProfile(memberId: string, data)`:
  - Personal profile fields: First/Last name, email, phone, designation, bio, social links.
- `getMemberBusiness(memberId: string)` & `updateMemberBusiness(memberId: string, data)`:
  - Business details: Business name, industry, category, description, website, phone, email, address, services, products, years in business, target customers, and networking synergy prompts ("What I Do", "Who I Help", "Best Referral For Me", "Not A Good Referral").
- `getChapterMemberDirectory(chapterId: string, search?: string, industry?: string)`:
  - Privacy-safe member directory returning member cards with business details, services, contact options, and chapter badge.
- `getChapterMemberDetail(memberId: string)`:
  - Detailed view of a fellow chapter member for 1-to-1 request or giving a referral.
- `getMemberReferrals(memberId: string)`:
  - Given Referrals and Received Referrals lists with INR value and status pipeline (`PENDING`, `CONTACTED`, `IN_PROGRESS`, `CLOSED_WON`, `CLOSED_LOST`).
- `giveMemberReferral(data)`:
  - Gives referral to a chapter colleague with deal value in ₹ INR.
- `updateMemberReferralStatus(referralId: string, memberId: string, status: ReferralStatus)`:
  - Allows recipient member to advance deal status (e.g. mark closed won).
- `getMemberVisitors(memberId: string)`:
  - Visitors personally invited by this member, tracking visit date, status, and notes.
- `inviteMemberVisitor(data)`:
  - Invites guest, automatically linking to member's chapter and member ID.
- `getMemberMeetings(chapterId: string, memberId: string)`:
  - Upcoming and past meetings with agenda, speaker, venue, and member's attendance status.
- `recordSelfAttendance(meetingId: string, memberId: string)`:
  - Fast 1-click self check-in button for the member on meeting day.
- `getMemberAttendanceHistory(memberId: string)`:
  - Attendance rate %, present, absent, substitute, excused counts and meeting history.
- `getMemberOneToOnes(memberId: string)`:
  - 1-to-1 networking sessions involving this member.
- `scheduleMemberOneToOne(data)`:
  - Schedule 1-to-1 session with a fellow chapter member.
- `getMemberNotifications(memberId: string, chapterId: string)`:
  - Chapter announcements, meeting reminders, and referral notifications.
- `getMemberReports(memberId: string)`:
  - Personal networking scorecard: Referrals Given vs Received ratio, closed business generated (₹), attendance reliability %, visitor contribution.

---

### 3. Member Components Layer

#### [NEW] [src/features/member/components/](file:///d:/Education/growcle/white-label-saas/src/features/member/components/)
- `member-header-bar.tsx`: Member identity banner showing member name, chapter name, membership badge, and meeting day alert.
- `member-dashboard-view.tsx`: Dashboard overview with KPI cards, Next Meeting Hero Card with 1-click check-in, Upcoming Activities list, and Quick Actions bar ([Give Referral], [Invite Visitor], [Schedule 1-to-1], [View Meeting], [Edit Profile]).
- `member-profile-view.tsx`: Personal profile view and edit form.
- `member-business-view.tsx`: Networking business profile view and edit form ("What I Do", "Best Referral For Me", etc.).
- `member-directory-view.tsx`: Searchable chapter member discovery cards with filters, direct [Request 1-to-1] and [Give Referral] actions.
- `member-referrals-view.tsx`: Given and Received tabs, Give Referral modal with ₹ INR input, status pipeline updates.
- `member-visitors-view.tsx`: Invited guests pipeline, Invite Visitor modal, follow-up tracking.
- `member-meetings-view.tsx`: Chapter meeting calendar, agenda details, attendees list, mobile-optimized meeting day experience.
- `member-attendance-view.tsx`: Personal attendance scorecard and historical log.
- `member-one-to-ones-view.tsx`: 1-to-1 networking sessions list, Schedule 1-to-1 modal with fellow member picker.
- `member-notifications-view.tsx`: Chapter announcements and inbox.
- `member-reports-view.tsx`: Personal networking performance analytics and scorecard.

---

### 4. App Router Routes Layer

#### [NEW] [src/app/(dashboard)/dashboard/member/](file:///d:/Education/growcle/white-label-saas/src/app/%28dashboard%29/dashboard/member/)
- `page.tsx`: Member overview dashboard
- `profile/page.tsx`: Personal profile page
- `business/page.tsx`: Business networking profile page
- `members/page.tsx`: Chapter member directory page
- `referrals/page.tsx`: Referrals given and received page
- `visitors/page.tsx`: Invited visitors page
- `meetings/page.tsx`: Chapter meetings schedule and agenda page
- `attendance/page.tsx`: Attendance history and scorecard page
- `one-to-ones/page.tsx`: 1-to-1 networking sessions page
- `notifications/page.tsx`: Chapter announcements page
- `reports/page.tsx`: Personal networking analytics page

---

## Verification Plan

### Automated Verification
- Run `npx tsc --noEmit` to verify type safety across all actions, components, and pages with 0 errors.
- Run `npm run build` to verify clean production compilation of all 11 new member routes.

### Manual / Browser Verification
- Verify `http://localhost:3001/dashboard/member` renders the member dashboard with KPIs, meeting hero, and quick actions.
- Verify no payments links or references appear anywhere in the member workspace.

---

## Status: COMPLETE
- All 12 Member routes and 13 components fully implemented and verified.
- Member details route `/dashboard/member/members/[memberId]` created with direct action modals.
- Synergy prompts ("What I Do", "Who I Help", "Best Referral For Me", "Not A Good Referral") persisted and loaded.
- Visitor follow-up lifecycle and 1-to-1 completion/outcome modals functional.
- Meeting attendees dialog and 1-click self-attendance check-in functional.
- Authenticated session resolution with `getCurrentSession()` verified.
- `npx tsc --noEmit` verified with 0 errors.
