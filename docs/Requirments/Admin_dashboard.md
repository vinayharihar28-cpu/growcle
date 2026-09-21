## 1. Purpose

The Admin Dashboard is the highest-level management interface in Growcle.

The Admin represents the Growcle platform owner/founder and is responsible for managing the overall platform structure, chapters, directors, leadership assignments, members, visitors, meetings, referrals, payments, notifications, and platform-level analytics.

The Admin has the broadest access in the system.

The Admin Dashboard must not be treated as a normal chapter dashboard. It is a platform-level control center that allows the Admin to manage and monitor multiple chapters and their users.

---

# 2. Admin Role

## Role Name

`ADMIN`

## Responsibility

The Admin is responsible for:

- Creating and managing chapters
- Assigning Directors
- Managing chapter leadership
- Managing members
- Managing visitors
- Managing meetings
- Monitoring attendance
- Monitoring referrals
- Monitoring one-to-one activity
- Monitoring payments
- Managing notifications
- Managing platform-level settings
- Viewing platform-wide analytics
- Managing roles and permissions where permitted
- Viewing important audit activity

The Admin should be able to move between chapters without being restricted to a single chapter.

---

# 3. Admin Dashboard Route

Recommended route:

`/dashboard/admin`

The Admin dashboard should load the platform-level overview.

It should not automatically open a single chapter unless the Admin explicitly selects one.

---

# 4. Admin Dashboard Layout

The Admin workspace should contain:

- Sidebar
- Top navigation
- Global search
- Organization/chapter selector where required
- Notification center
- User profile menu
- Breadcrumbs
- Main content area

The layout must be responsive.

---

# 5. Admin Sidebar

Recommended navigation:

```text
Dashboard

Chapters
Members
Directors
Leadership
Visitors

Meetings
Attendance

Referrals
One-to-Ones

Payments

Notifications

Reports & Analytics

RBAC

Audit Logs

Platform Settings
````

The exact visibility of individual actions must be controlled by the backend authorization system.

---

# 6. Admin Dashboard Overview

## Purpose

The dashboard should allow the Admin to understand the overall state of Growcle without opening individual modules.

---

## 6.1 Platform KPI Cards

Display:

### Total Chapters

Number of chapters currently registered in Growcle.

Show:

* Total chapters
* Active chapters
* Inactive chapters

### Total Members

Display:

* Total members
* Active members
* Pending members
* Inactive members

### Total Visitors

Display:

* Total visitors
* Upcoming visitors
* Attended visitors
* Converted visitors

### Total Referrals

Display:

* Total referrals
* Pending
* Contacted
* Closed Won
* Closed Lost

### Total Closed Business

Display the total value of referrals marked as closed won.

### Total Payments

Display:

* Total collected
* Pending
* Outstanding

---

# 7. Admin Dashboard Analytics

## Chapter Performance

Display a table or chart showing:

* Chapter name
* Active members
* Attendance
* Visitors
* Visitor conversion
* Referrals
* Closed business
* Payment status

Allow:

* Sorting
* Filtering
* Chapter selection
* Date filtering

---

## Member Growth

Display member growth over time.

Filters:

* Last 30 days
* Last 3 months
* Last 6 months
* Last 12 months

---

## Visitor Conversion

Show:

```text
Visitors
    ↓
Attended
    ↓
Converted to Member
```

Display conversion percentage.

---

## Referral Performance

Show:

* Referrals created
* Referrals contacted
* Closed won
* Closed lost
* Total referral value
* Average referral value

---

## Revenue / Payment Overview

Show:

* Payments collected
* Pending payments
* Outstanding payments
* Revenue by chapter
* Revenue trend

---

# 8. Admin Quick Actions

The dashboard should provide direct access to common administrative actions.

Recommended actions:

* Create Chapter
* Add Member
* Add Visitor
* Add Director
* Assign Leadership
* Create Meeting
* View Attendance
* View Referrals
* Record Payment
* Send Notification

These should open the relevant workflow rather than duplicating the complete functionality inside the dashboard.

---

# 9. Chapter Management

Route:

`/dashboard/admin/chapters`

This is one of the Admin's primary responsibilities.

---

## 9.1 Chapter List

Display:

* Chapter name
* Chapter code
* Location
* Region
* Director
* President
* Vice President
* Treasurer
* Active members
* Upcoming meeting
* Status
* Created date
* Actions

---

## 9.2 Chapter Search

Search by:

* Chapter name
* Chapter code
* Location
* Director

---

## 9.3 Chapter Filters

Filters:

* Active
* Inactive
* Region
* Director
* Creation date

---

## 9.4 Create Chapter

Create a guided chapter creation workflow.

### Step 1 — Basic Information

Fields:

* Chapter name
* Chapter code
* Description
* Region
* Country
* Location

### Step 2 — Meeting Information

Fields:

* Meeting day
* Meeting time
* Meeting location
* Meeting type
* Hybrid/online information if applicable

### Step 3 — Director

Select an existing Director or create/invite one if supported.

### Step 4 — Leadership Team

Assign:

* President
* Vice President
* Treasurer

### Step 5 — Review

Display all entered information before creation.

### Step 6 — Create

Create the chapter and establish the required relationships.

---

# 10. Chapter Details

Route:

`/dashboard/admin/chapters/[chapterId]`

The Admin should be able to view a complete chapter overview.

Sections:

* Overview
* Members
* Leadership
* Visitors
* Meetings
* Attendance
* Referrals
* One-to-Ones
* Payments
* Reports
* Settings
* Audit Activity

---

## Chapter Overview

Display:

* Chapter information
* Director
* Leadership Team
* Active members
* Visitors
* Attendance
* Referral activity
* Revenue
* Upcoming meeting

---

# 11. Chapter Administration

Admin actions:

* Edit chapter
* Change chapter status
* Update meeting schedule
* Change location
* Assign Director
* Assign President
* Assign Vice President
* Assign Treasurer
* View chapter history

Deactivating a chapter must not silently delete its data.

The UI should clearly distinguish between:

* Active
* Inactive

---

# 12. Director Management

Route:

`/dashboard/admin/directors`

The Admin manages Directors from this section.

---

## Director List

Display:

* Name
* Email
* Assigned chapters
* Status
* Date assigned
* Last activity
* Actions

---

## Director Actions

Admin can:

* Add Director
* Invite Director
* View Director
* Edit Director
* Assign chapters
* Remove chapter assignment
* Activate/deactivate Director

---

## Assign Director

The Admin selects:

```text
Director
    ↓
One or more chapters
```

The system must prevent unauthorized cross-tenant assignment through backend validation.

---

# 13. Leadership Management

Route:

`/dashboard/admin/leadership`

The Leadership Team consists of:

* President
* Vice President
* Treasurer

These are not separate frontend workspaces.

They belong to the same Leadership Team concept.

---

## Leadership Assignment

Admin can:

* Assign President
* Assign Vice President
* Assign Treasurer
* Replace leadership
* View current leadership
* View leadership history where supported

---

## Leadership View

For each chapter display:

```text
Chapter

President
Vice President
Treasurer
```

Each person should be linked to their member profile.

---

# 14. Member Management

Route:

`/dashboard/admin/members`

The Admin can manage members across the platform.

---

## Member Table

Columns:

* Name
* Business
* Industry
* Email
* Phone
* Chapter
* Membership status
* Membership number
* Joined date
* Renewal date
* Role
* Actions

---

## Member Search

Search:

* Name
* Email
* Business
* Phone
* Membership number

---

## Member Filters

Filter by:

* Chapter
* Status
* Role
* Industry
* Joined date
* Renewal date

---

# 15. Add Member

Admin can add a member directly.

Fields:

### Personal Information

* First name
* Last name
* Email
* Phone
* Profile image

### Business Information

* Business name
* Industry
* Business description
* Website
* Business contact details

### Membership

* Chapter
* Membership number
* Status
* Joined date
* Renewal date

### Role

Assign the appropriate role.

Possible role:

* Member
* Leadership Team

If the person is being assigned to Leadership Team, the specific leadership position should be selected.

---

# 16. Member Details

Admin should be able to view:

* Personal information
* Business information
* Chapter
* Role
* Membership status
* Attendance
* Referrals
* One-to-Ones
* Visitors invited
* Payment history
* Activity history

---

# 17. Member Actions

Depending on backend permissions:

* Edit member
* Change chapter
* Change role
* Activate member
* Deactivate member
* View profile
* View business profile
* View activity
* View payments

Destructive actions must require confirmation.

---

# 18. Visitor Management

Route:

`/dashboard/admin/visitors`

The Admin can view visitors across all chapters.

---

## Visitor Table

Display:

* Name
* Business
* Email
* Phone
* Chapter
* Invited by
* Visit date
* Status
* Conversion status
* Actions

---

## Visitor Status

Support:

* Pending
* Approved
* Attended
* No Show
* Converted

The exact statuses should follow the backend enum/state definitions.

---

# 19. Add Visitor

Fields:

* First name
* Last name
* Email
* Phone
* Business name
* Industry
* Chapter
* Visit date
* Inviting member
* Notes

---

# 20. Visitor Actions

Admin can:

* View visitor
* Edit visitor
* Approve visitor
* Change status
* Mark attended
* Mark no-show
* View visit history
* Convert visitor to member

---

# 21. Visitor Conversion

The Admin should have a clear conversion workflow:

```text
Visitor
   ↓
Convert to Member
   ↓
Select Chapter
   ↓
Create Membership
   ↓
Assign Member Role
   ↓
Member Profile
```

Do not create a second unrelated person record if the backend supports converting the existing visitor record.

---

# 22. Meeting Management

Route:

`/dashboard/admin/meetings`

The Admin should be able to monitor meetings across chapters.

---

## Meeting List

Display:

* Meeting title
* Chapter
* Date
* Time
* Location
* Speaker
* Meeting type
* Status
* Attendance
* Actions

---

## Meeting Actions

Admin can:

* Create meeting
* Edit meeting
* Cancel meeting
* View meeting
* View agenda
* View attendance
* View meeting notes
* View attachments

---

# 23. Meeting Details

Display:

* Chapter
* Meeting number
* Date
* Start time
* End time
* Location
* Meeting mode
* Speaker
* Theme
* Agenda
* Attendance
* Notes
* Attachments

---

# 24. Attendance Tracking

Route:

`/dashboard/admin/attendance`

Admin can view attendance across chapters.

---

## Attendance Overview

Display:

* Chapter
* Meeting
* Total members
* Present
* Absent
* Substitute
* Excused
* Attendance percentage

---

## Member Attendance

Admin can drill into:

```text
Chapter
    ↓
Meeting
    ↓
Member
    ↓
Attendance Record
```

---

## Attendance Actions

Where permitted:

* View attendance
* Correct attendance
* View history
* Export/report attendance

The Admin should not need to manually manage attendance every week if the chapter leadership is responsible for it.

Admin primarily needs oversight and correction capabilities.

---

# 25. Referral Management

Route:

`/dashboard/admin/referrals`

Admin can monitor referral activity across the platform.

---

## Referral Table

Columns:

* Referral
* From member
* To member
* Chapter
* Status
* Value
* Created date
* Follow-up date
* Closed date
* Actions

---

## Referral Status

Display:

* Pending
* Contacted
* Closed Won
* Closed Lost

---

## Referral Analytics

Show:

* Total referrals
* Referral conversion
* Closed business
* Referral value
* Top chapters
* Top members

---

# 26. One-to-One Meetings

Route:

`/dashboard/admin/one-to-ones`

Admin can monitor one-to-one activity.

Display:

* Initiator
* Receiver
* Chapter
* Date
* Duration
* Status
* Outcome

Analytics:

* Total one-to-ones
* Completed
* Cancelled
* Participation by chapter

Admin should primarily have visibility rather than interfering with personal member interactions.

---

# 27. Payment Management

Route:

`/dashboard/admin/payments`

This section manages platform-wide payment visibility.

---

## Payment Dashboard

KPIs:

* Total payments
* Collected
* Pending
* Failed
* Outstanding

---

## Payment Table

Display:

* Member
* Chapter
* Amount
* Payment status
* Payment date
* Payment method
* Reference
* Actions

---

## Payment Actions

Depending on the backend implementation:

* View payment
* Record payment
* Update payment status
* View payment history
* View chapter payment summary

Do not allow the frontend to directly manipulate payment state without backend validation.

---

# 28. Notifications

Route:

`/dashboard/admin/notifications`

Admin should be able to manage platform-level notifications.

---

## Notification Creation

Fields:

* Title
* Message
* Recipient type
* Chapter
* Role
* Priority
* Scheduled date if supported

Possible recipients:

* All members
* Specific chapter
* Leadership Team
* Directors
* Individual users

---

## Notification List

Display:

* Title
* Recipient
* Created date
* Status
* Read count where supported

---

## Notification Actions

* Create
* View
* Send
* Schedule
* Cancel scheduled notification
* Archive

---

# 29. Digital Member Cards

Admin should primarily have viewing/management access.

Admin can:

* View member card
* Preview card
* Open member profile
* View QR code

The member remains responsible for their own card information.

Admin should not unnecessarily duplicate card editing functionality.

---

# 30. Reports & Analytics

Route:

`/dashboard/admin/reports`

This should provide platform-wide reporting.

---

## Membership Report

Show:

* Total members
* Active members
* Inactive members
* New members
* Member growth
* Members by chapter

---

## Chapter Report

Show:

* Chapter count
* Active chapters
* Chapter growth
* Members per chapter
* Chapter performance

---

## Visitor Report

Show:

* Total visitors
* Visitors per chapter
* Attendance rate
* No-show rate
* Conversion rate

---

## Referral Report

Show:

* Referrals
* Referral status
* Closed business
* Referral value
* Top chapters
* Top members

---

## Attendance Report

Show:

* Attendance percentage
* Chapter attendance
* Member attendance
* Attendance trends

---

## Payment Report

Show:

* Total collected
* Pending
* Outstanding
* Payment trends
* Chapter-level payment information

---

# 31. RBAC Management

Route:

`/dashboard/admin/rbac`

The Admin should be able to manage the role and permission system exposed by the backend.

The existing backend RBAC engine is the source of truth.

---

## Roles

Display:

* Role name
* Description
* Assigned members
* Permission count
* Status

---

## Role Management

Where backend support exists:

* Create role
* Edit role
* View role
* Delete role
* Assign permissions
* Remove permissions

---

## Member Role Assignment

Admin can:

* Select member
* View current roles
* Assign role
* Remove role
* Change role

The frontend must call the backend authorization APIs.

Do not create a browser-only role repository.

---

# 32. Audit Logs

Route:

`/dashboard/admin/audit-logs`

Admin should be able to view important administrative activity.

---

## Log Fields

Display:

* Actor
* Action
* Entity
* Entity ID
* Chapter
* Timestamp
* Result
* IP address where appropriate

---

## Filters

* Actor
* Action
* Entity
* Chapter
* Date
* Result

Examples of important events:

* Chapter created
* Member created
* Member role changed
* Leadership assigned
* Visitor converted
* Payment updated
* Chapter deactivated

---

# 33. Platform Settings

Route:

`/dashboard/admin/settings`

Possible sections:

## General

* Platform name
* Default timezone
* Default language
* Default currency

## Branding

* Logo
* Primary color
* Platform branding

## Features

Display feature configuration supported by the backend.

## Authentication

Display authentication-related configuration where appropriate.

Sensitive credentials must never be displayed.

---

# 34. Admin Global Search

Admin should have access to global search.

Search across:

* Chapters
* Members
* Directors
* Leadership
* Visitors
* Meetings
* Referrals

Results should show:

* Entity type
* Name
* Chapter
* Status
* Relevant action

All search results must still respect backend authorization.

---

# 35. Admin Notifications Center

The top navigation should include a notification icon.

Display:

* Unread count
* Recent notifications
* Notification type
* Date
* Read/unread state

Actions:

* Open
* Mark as read
* Mark all as read

---

# 36. Admin Profile

The Admin should have access to their own profile.

Display:

* Name
* Email
* Profile image
* Account information
* Security/account settings

Authentication/security settings should remain integrated with Better Auth.

---

# 37. Responsive Requirements

The Admin dashboard must work on:

## Desktop

Full sidebar and multi-column dashboard.

## Tablet

Collapsible sidebar.

Tables should remain usable.

## Mobile

Use:

* Navigation drawer
* Stacked KPI cards
* Horizontally scrollable tables where necessary
* Mobile-friendly forms
* Bottom/action sheets where appropriate

Do not simply shrink desktop tables until they become unusable.

---

# 38. Loading States

Every Admin page that requests backend data must have a loading state.

Examples:

* KPI skeletons
* Table skeletons
* Chart skeletons
* Detail-page skeletons

Never show a blank page while data is loading.

---

# 39. Empty States

Every major module must have an intentional empty state.

Example:

```text
No chapters have been created yet.

Create your first chapter to start managing the network.

[Create Chapter]
```

Empty states should provide a useful next action.

---

# 40. Error States

Display useful errors without exposing technical backend details.

Example:

```text
Unable to load chapters.

Please try again.

[Retry]
```

For permission failures:

```text
You do not have permission to perform this action.
```

---

# 41. Confirmation for Destructive Actions

Require confirmation before:

* Deactivating a chapter
* Deactivating a member
* Removing leadership
* Deleting a record where deletion is actually supported
* Cancelling a meeting
* Removing a role

The confirmation should explain the consequence.

---

# 42. Frontend Authorization Rules

The frontend is NOT the final security layer.

Correct flow:

```text
Admin User
    ↓
Better Auth
    ↓
Authenticated Session
    ↓
RBAC
    ↓
Backend API
    ↓
Admin UI
```

Frontend permissions can be used to:

* Hide unavailable navigation
* Disable unavailable actions
* Display permission-aware UI

But the backend must enforce every protected operation.

Never rely on:

```ts
if (role === "ADMIN") {
    allowAction();
}
```

as the actual security mechanism.

---

# 43. API Integration

All Admin functionality must use real backend APIs when available.

Do not create permanent mock repositories.

For every request handle:

* Loading
* Success
* Empty
* Error
* Unauthorized
* Forbidden

If a required backend endpoint does not exist yet:

1. Build the UI structure.
2. Document the required API contract.
3. Mark the integration as pending.
4. Coordinate with the backend developer.
5. Connect the real API when available.

Do not create fake production data that can later be mistaken for real functionality.

---

# 44. Definition of Done

The Admin Dashboard feature is considered complete when:

* Admin can access the Admin workspace.
* Dashboard KPIs use real backend data.
* Chapter management is functional.
* Director management is functional.
* Leadership assignment is functional.
* Member management is functional.
* Visitor management is functional.
* Meeting management is functional.
* Attendance visibility is functional.
* Referral visibility is functional.
* One-to-one visibility is functional.
* Payment management is connected to the backend.
* Notifications are connected to the backend.
* RBAC management is connected to the existing RBAC engine.
* Audit logs are connected to the backend.
* Reports use real data.
* Loading states exist.
* Empty states exist.
* Error states exist.
* Permission-denied states exist.
* Forms validate correctly.
* Destructive actions require confirmation.
* Responsive layouts work.
* No permanent mock data remains in production flows.
* TypeScript checks pass.
* Relevant lint checks pass.
* Main Admin workflows have been manually tested.

---

# 45. Admin Dashboard Implementation Priority

Implement in this order:

## Priority 1 — Admin Foundation

* Admin layout
* Sidebar
* Top navigation
* Notifications
* Profile menu
* Dashboard routing
* Permission-aware navigation

## Priority 2 — Platform Structure

* Chapter Management
* Director Management
* Leadership Management

## Priority 3 — People

* Member Management
* Visitor Management

## Priority 4 — Chapter Operations

* Meetings
* Attendance
* Referrals
* One-to-Ones

## Priority 5 — Finance

* Payments
* Payment reporting

## Priority 6 — Administration

* Notifications
* RBAC
* Audit Logs
* Platform Settings

## Priority 7 — Analytics

* Dashboard analytics
* Reports
* Chapter comparisons
* Member/visitor/referral/payment analytics

---

# 46. Important Product Principle

The Admin Dashboard should answer five questions quickly:

1. What chapters exist and how are they performing?
2. Who is managing each chapter?
3. What is happening with members and visitors?
4. What is happening with meetings, referrals, attendance, and payments?
5. Is there anything that requires the Admin's attention?

The dashboard should therefore prioritize actionable information over displaying every available database field.

The Admin should be able to move from:

```text
Dashboard
    ↓
Chapter
    ↓
Member / Visitor / Meeting / Referral / Payment
```

without losing the context of the selected chapter.

The Admin workspace is the platform-level management interface. It should provide broad visibility and control while leaving normal day-to-day chapter operations to the Director and Leadership Team.

```
```



