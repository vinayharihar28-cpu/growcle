
# Growcle Director Dashboard — Detailed Feature Specification

## 1. Role Overview

The Director is responsible for managing and overseeing the chapters assigned to them.

The Director has broad administrative access similar to the Growcle Admin, but their access is limited to their assigned chapters.

The Director is responsible for:

- Managing assigned chapters
- Managing members
- Adding and removing members
- Changing member roles
- Assigning leadership
- Managing visitors
- Managing meetings
- Monitoring attendance
- Monitoring referrals
- Monitoring one-to-one activity
- Monitoring payments
- Viewing chapter performance
- Sending chapter-level notifications
- Identifying chapters that need attention

The Director does not control the entire Growcle platform.

---

# 2. Role Hierarchy

The platform role structure is:

```text
Growcle Admin
      |
      v
Director
      |
      v
Assigned Chapters
      |
      +-- Leadership Team
      |     +-- President
      |     +-- Vice President
      |     +-- Treasurer
      |
      +-- Members
      |
      +-- Visitors
````

The Director manages the people and operations inside their assigned chapters.

---

# 3. Director vs Admin

The main difference is scope.

```text
ADMIN
- Platform-wide access
- All chapters
- All members
- All visitors
- Platform settings
- Global RBAC
- Director management
- Global reports

DIRECTOR
- Assigned chapters only
- Members within assigned chapters
- Visitors within assigned chapters
- Leadership within assigned chapters
- Meetings within assigned chapters
- Attendance within assigned chapters
- Referrals within assigned chapters
- Payments within assigned chapters
- Chapter-level reports
```

The backend must enforce this scope.

The Director must never be able to access another chapter simply by changing an ID in a URL.

---

# 4. Director Dashboard

Recommended route:

`/dashboard/director`

The dashboard is the Director's central overview of all assigned chapters.

If the Director manages multiple chapters, the dashboard should allow:

* View all assigned chapters
* Select a specific chapter
* Compare chapters
* View chapter-specific information

---

# 5. Director Dashboard Layout

The dashboard should contain:

* Sidebar
* Top navigation
* Chapter selector
* Global search
* Notifications
* User profile menu
* Breadcrumbs
* Main dashboard area

The layout must be responsive for:

* Desktop
* Tablet
* Mobile

---

# 6. Director Sidebar

Recommended navigation:

```text
Dashboard

Chapters
Members
Leadership
Visitors

Meetings
Attendance

Referrals
One-to-Ones

Payments

Notifications

Reports & Analytics
```

Navigation should be permission-aware.

If a Director does not have permission for a particular action or module, the frontend should not expose unnecessary controls.

The backend remains the final authorization layer.

---

# 7. Director Dashboard KPIs

The main dashboard should display the following metrics.

## Total Chapters

Show:

* Total assigned chapters
* Active chapters
* Inactive chapters

---

## Total Members

Show:

* Total members
* Active members
* Pending members
* Inactive members

---

## Total Visitors

Show:

* Upcoming visitors
* Attended visitors
* No-shows
* Converted visitors

---

## Attendance

Show:

* Overall attendance percentage
* Current attendance
* Attendance trend

---

## Referrals

Show:

* Total referrals
* Pending
* Contacted
* Closed Won
* Closed Lost

---

## Closed Business

Show:

* Total closed business
* Current period value
* Previous period comparison
* Trend

---

## Payments

Show:

* Total collected
* Pending payments
* Outstanding payments

---

# 8. Director Dashboard Analytics

## Chapter Performance

Display:

* Chapter name
* Active members
* Attendance
* Visitors
* Visitor conversion
* Referrals
* Closed business
* Payment status

Allow:

* Search
* Sorting
* Filtering
* Date filtering
* Chapter filtering

---

## Chapter Comparison

If the Director has multiple chapters, allow comparison between them.

Compare:

* Member count
* Attendance
* Visitors
* Visitor conversion
* Referrals
* Closed business
* Payments

Example:

```text
Chapter A
Members: 42
Attendance: 91%
Visitors: 8
Conversion: 37%
Referrals: 24

Chapter B
Members: 35
Attendance: 84%
Visitors: 11
Conversion: 45%
Referrals: 19
```

---

# 9. Director Quick Actions

The dashboard should provide quick access to common operations.

Recommended actions:

* Add Member
* Add Visitor
* Assign Leadership
* Change Member Role
* Create Meeting
* Record Attendance
* View Referrals
* Record Payment
* Send Notification

If chapter creation is allowed for Directors through RBAC, also show:

* Create Chapter

---

# 10. Chapter Management

Route:

`/dashboard/director/chapters`

The Director should be able to manage all chapters assigned to them.

---

## Chapter List

Display:

* Chapter name
* Chapter code
* Location
* Region
* Active members
* President
* Vice President
* Treasurer
* Upcoming meeting
* Attendance
* Visitors
* Referrals
* Status
* Actions

---

## Chapter Search

Search by:

* Chapter name
* Chapter code
* Location
* President
* Vice President
* Treasurer

---

## Chapter Filters

Filter by:

* Active/inactive
* Region
* Leadership status
* Member count
* Performance
* Creation date

---

# 11. Chapter Creation

If the Director has permission to create chapters, provide a chapter creation wizard.

## Step 1 — Basic Information

Fields:

* Chapter name
* Chapter code
* Description
* Region
* Country
* Location

## Step 2 — Meeting Information

Fields:

* Meeting day
* Meeting time
* Meeting location
* Meeting type
* Hybrid/online configuration

## Step 3 — Leadership

Assign:

* President
* Vice President
* Treasurer

## Step 4 — Review

Display all information before submission.

## Step 5 — Create

Submit through the backend API.

If the Director does not have the required permission, the Create Chapter action should not be displayed.

---

# 12. Chapter Details

Route:

`/dashboard/director/chapters/[chapterId]`

The chapter detail page should contain:

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
* Activity

---

## Chapter Overview

Display:

* Chapter name
* Chapter code
* Location
* Director
* Leadership Team
* Active members
* Visitors
* Attendance
* Referrals
* Closed business
* Payment status
* Upcoming meeting

---

# 13. Chapter Administration

The Director can perform chapter-level administration where permitted.

Actions include:

* Edit chapter
* Update chapter information
* Change meeting schedule
* Change meeting location
* Activate chapter
* Deactivate chapter
* Assign leadership
* View chapter activity

Deactivating a chapter should not automatically delete historical records.

---

# 14. Member Management

Route:

`/dashboard/director/members`

Member management is one of the Director's most important responsibilities.

The Director should be able to manage members belonging to their assigned chapters.

---

# 15. Member List

Display:

* Name
* Business name
* Industry
* Email
* Phone
* Chapter
* Current role
* Membership status
* Membership number
* Joined date
* Renewal date
* Attendance
* Actions

---

# 16. Member Search

Search by:

* Name
* Email
* Business name
* Phone
* Membership number
* Chapter

---

# 17. Member Filters

Filter by:

* Chapter
* Role
* Membership status
* Industry
* Attendance
* Joined date
* Renewal date

---

# 18. Add Member

The Director can add a member when they have the required permission.

## Personal Information

Fields:

* First name
* Last name
* Email
* Phone
* Profile image

## Business Information

Fields:

* Business name
* Industry
* Business description
* Website
* Business phone
* Business email
* Business address

## Membership

Fields:

* Chapter
* Membership number
* Status
* Joined date
* Renewal date

## Role

The default role should normally be:

`MEMBER`

Leadership assignment should be handled through the dedicated role/leadership workflow.

---

# 19. Member Details

The Director should be able to view:

* Personal information
* Business information
* Chapter
* Current role
* Membership status
* Membership dates
* Attendance
* Referrals
* One-to-Ones
* Visitors invited
* Payment history
* Activity history

---

# 20. Member Editing

Where permitted, the Director can update:

* Personal information
* Contact information
* Business information
* Membership information
* Chapter assignment
* Status

The backend must validate all updates.

---

# 21. Member Role Management

This is a major Director capability.

The Director should be able to change a member's role within their assigned chapter.

Possible roles include:

```text
MEMBER
PRESIDENT
VICE_PRESIDENT
TREASURER
```

The frontend should only display roles that the backend allows the Director to assign.

---

# 22. Member Promotion

Example:

```text
Member
   |
   v
Change Role
   |
   +-- Member
   +-- President
   +-- Vice President
   +-- Treasurer
```

The Director should be able to promote:

```text
Member → President
Member → Vice President
Member → Treasurer
```

where the backend permits it.

---

# 23. Leadership Role Changes

The Director should also be able to change existing leadership assignments.

Examples:

```text
President → Member
President → Vice President

Vice President → President
Vice President → Member

Treasurer → Member
Treasurer → President
```

The exact allowed transitions must be controlled by backend business rules.

The frontend must not be responsible for enforcing role security.

---

# 24. Leadership Management

Route:

`/dashboard/director/leadership`

The Leadership Team consists of:

```text
President
Vice President
Treasurer
```

These should be treated as one Leadership Team workspace.

---

## Leadership Overview

For each chapter display:

```text
Chapter Alpha

President
John Smith

Vice President
Sarah Johnson

Treasurer
Michael Brown
```

If a position is empty:

```text
Treasurer
Unassigned

[Assign Treasurer]
```

---

# 25. Assign Leadership

Workflow:

```text
Select Chapter
      ↓
Select Position
      ↓
President / Vice President / Treasurer
      ↓
Select Member
      ↓
Review
      ↓
Confirm
```

Before allowing the assignment, the backend should verify:

* Member exists
* Member belongs to the chapter
* Member is active
* Position can be assigned
* Director has permission
* Existing leadership conflicts are handled correctly

---

# 26. Replace Leadership

The Director should be able to replace an existing leadership member.

Example:

```text
Current President:
John Smith

Replace With:
Sarah Johnson
```

The confirmation should clearly explain:

* Current role
* Current person
* New person
* Chapter
* Result of the change

---

# 27. Leadership Vacancy Management

The Director dashboard should clearly show vacant leadership positions.

Example:

```text
Chapter Alpha

President
John Smith

Vice President
Unassigned

Treasurer
Michael Brown

[Assign Vice President]
```

This should be visible in:

* Chapter dashboard
* Leadership page
* Director dashboard
* Reports where relevant

---

# 28. Visitor Management

Route:

`/dashboard/director/visitors`

The Director can manage visitors across assigned chapters.

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

# 29. Visitor Status

Use the status values supported by the backend.

Typical statuses:

```text
PENDING
APPROVED
ATTENDED
NO_SHOW
CONVERTED
```

Do not introduce frontend-only statuses that do not exist in the backend.

---

# 30. Visitor Actions

Director can:

* Add visitor
* View visitor
* Edit visitor
* Approve visitor
* Change status
* Mark attended
* Mark no-show
* View visit history
* Convert visitor to member

---

# 31. Visitor Conversion

Workflow:

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
Create/Complete Member Profile
```

The normal conversion should be:

```text
Visitor → Member
```

Leadership roles should be assigned separately through the role-management workflow.

---

# 32. Meeting Management

Route:

`/dashboard/director/meetings`

The Director can monitor meetings across assigned chapters.

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

# 33. Meeting Actions

Where permitted:

* Create meeting
* Edit meeting
* Cancel meeting
* View meeting
* View agenda
* View attendance
* View notes
* View attachments

The Director should have oversight of meetings without needing to perform every weekly operational task.

---

# 34. Meeting Details

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

# 35. Attendance Management

Route:

`/dashboard/director/attendance`

The Director should be able to monitor attendance across assigned chapters.

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

Allow drill-down:

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
* View attendance history
* View attendance trends
* Generate reports

The Director should primarily monitor and intervene when necessary.

---

# 36. Referral Management

Route:

`/dashboard/director/referrals`

The Director should have oversight of referral activity across assigned chapters.

---

## Referral Table

Display:

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

The purpose is to allow the Director to identify strong and weak chapter performance.

---

# 37. One-to-One Management

Route:

`/dashboard/director/one-to-ones`

The Director should have visibility into chapter networking activity.

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
* Participation
* Participation by chapter

The Director should primarily have visibility rather than modifying private member records.

---

# 38. Payment Management

Route:

`/dashboard/director/payments`

The Director can monitor payments for assigned chapters.

---

## Payment Dashboard

Display:

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

Depending on backend permissions:

* View payment
* Record payment
* Update payment status
* View payment history
* View chapter payment summary

The Treasurer handles normal chapter financial operations.

The Director provides oversight and management.

---

# 39. Notifications

Route:

`/dashboard/director/notifications`

The Director should be able to communicate with their assigned chapters.

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

* All members in a chapter
* Leadership Team
* Specific member
* Specific chapter
* Multiple assigned chapters

---

## Notification Actions

* Create
* Send
* Schedule
* View
* Cancel scheduled notification
* Archive

The Director should not automatically be able to send platform-wide notifications.

---

# 40. Digital Member Cards

The Director should have viewing access to member cards.

Actions:

* View member card
* Preview card
* Open member profile
* View QR code

Members remain responsible for their own profile/card information unless the Director has explicit permission to edit it.

---

# 41. Reports & Analytics

Route:

`/dashboard/director/reports`

Reports should only contain data from chapters assigned to the Director.

---

## Membership Report

Display:

* Total members
* Active members
* Inactive members
* New members
* Member growth
* Members by chapter
* Members by role

---

## Leadership Report

Display:

* Chapter
* President
* Vice President
* Treasurer
* Leadership vacancies
* Leadership changes

---

## Visitor Report

Display:

* Total visitors
* Visitors by chapter
* Attendance rate
* No-show rate
* Conversion rate

---

## Referral Report

Display:

* Total referrals
* Referrals by chapter
* Referral status
* Closed business
* Referral value
* Top members
* Top chapters

---

## Attendance Report

Display:

* Attendance percentage
* Chapter attendance
* Member attendance
* Attendance trends
* Members with low attendance

---

## Payment Report

Display:

* Total collected
* Pending
* Outstanding
* Payment trends
* Chapter-level payment information

---

# 42. Leadership Performance Monitoring

The Director should have a dedicated overview to identify chapters requiring attention.

Display:

* Chapter
* President
* Vice President
* Treasurer
* Leadership status
* Chapter performance
* Attendance
* Member growth
* Visitor conversion
* Referral activity

Example:

```text
Chapter Alpha

President: John Smith
Vice President: Sarah Johnson
Treasurer: Michael Brown

Members: 42
Attendance: 91%
Visitors: 8
Visitor Conversion: 37%
Referrals: 24

Status: Healthy
```

If a position is vacant:

```text
Treasurer: Unassigned

[Assign Treasurer]
```

---

# 43. Director Global Search

The Director should have search access to their permitted data.

Search:

* Chapters
* Members
* Leadership
* Visitors
* Meetings
* Referrals

Search results should show:

* Entity type
* Name
* Chapter
* Status
* Relevant action

The backend must enforce chapter scope.

---

# 44. Director Notification Center

The top navigation should contain:

* Notification icon
* Unread count
* Recent notifications

Notification information:

* Type
* Title
* Message
* Date
* Read/unread status

Actions:

* Open
* Mark as read
* Mark all as read

---

# 45. Director Profile

The Director should have access to:

* Name
* Email
* Profile image
* Assigned chapters
* Account information
* Security settings

Authentication and session management remain handled by Better Auth.

---

# 46. Director Permissions

The Director should have broad permissions, but permissions must remain backend-controlled.

Example permission groups:

```text
Chapters
    chapters.view
    chapters.create
    chapters.update
    chapters.activate
    chapters.deactivate

Members
    members.view
    members.create
    members.update
    members.activate
    members.deactivate
    members.change_role

Leadership
    leadership.view
    leadership.assign
    leadership.replace

Visitors
    visitors.view
    visitors.create
    visitors.update
    visitors.convert

Meetings
    meetings.view
    meetings.create
    meetings.update
    meetings.cancel

Attendance
    attendance.view
    attendance.update

Referrals
    referrals.view
    referrals.update

One-to-Ones
    one_to_ones.view

Payments
    payments.view
    payments.create
    payments.update

Notifications
    notifications.view
    notifications.create
    notifications.send

Reports
    reports.view
```

The exact permission names should match the existing backend RBAC implementation.

Do not invent duplicate permission names if the backend already has defined permissions.

---

# 47. Director Scope Rules

A Director can only operate within their assigned scope.

Example:

```text
Director
   |
   +-- Chapter A
   |     +-- Members
   |     +-- Visitors
   |     +-- Meetings
   |     +-- Referrals
   |     +-- Payments
   |
   +-- Chapter B
         +-- Members
         +-- Visitors
         +-- Meetings
         +-- Referrals
         +-- Payments
```

The Director cannot access:

```text
Chapter C
```

unless Chapter C is assigned to them.

This must be enforced by the backend.

---

# 48. Role Change Security

Role changes are sensitive administrative operations.

The correct flow is:

```text
Director
    ↓
Select Member
    ↓
Select "Change Role"
    ↓
Frontend requests available roles
    ↓
Director selects new role
    ↓
Backend validates:
    - Authentication
    - Director permission
    - Chapter scope
    - Target member
    - Current role
    - Allowed transition
    ↓
Backend updates role
    ↓
Audit event recorded
    ↓
Frontend refreshes member
```

The frontend must never be responsible for security enforcement.

---

# 49. Role Change UI

Member profile:

```text
John Smith

Current Role:
Member

[Change Role]
```

Modal:

```text
Change Member Role

Member:
John Smith

Current Role:
Member

New Role:
[ Member ▼ ]

Available Roles:
- Member
- President
- Vice President
- Treasurer

Chapter:
Chapter Alpha

[Cancel] [Confirm Change]
```

After success:

```text
Role updated successfully.

John Smith is now President of Chapter Alpha.
```

---

# 50. Sensitive Action Confirmation

Require confirmation before:

* Changing a member role
* Removing leadership
* Replacing leadership
* Deactivating a member
* Deactivating a chapter
* Cancelling a meeting
* Updating sensitive payment information

Example:

```text
Change Leadership Role?

You are about to change:

John Smith
President → Member

This will remove John Smith from the President position.

[Cancel] [Confirm Change]
```

---

# 51. Loading States

Every backend-driven page must include loading states.

Examples:

* Dashboard KPI skeletons
* Table skeletons
* Chart skeletons
* Detail-page skeletons
* Form loading states
* Button loading states

Never show an unexplained blank screen.

---

# 52. Empty States

Every major section needs an intentional empty state.

Example:

```text
No chapters assigned.

You currently do not have any chapters under your management.
```

Leadership:

```text
No leadership team assigned.

Assign a President, Vice President, and Treasurer to manage this chapter.

[Assign Leadership]
```

Members:

```text
No members found.

[Add Member]
```

---

# 53. Error States

Example:

```text
Unable to load chapter members.

Please try again.

[Retry]
```

Permission error:

```text
You do not have permission to perform this action.
```

Scope error:

```text
You do not have access to this chapter.
```

Do not expose raw database or server errors to the user.

---

# 54. Responsive Requirements

## Desktop

* Full sidebar
* Multi-column dashboard
* Data tables
* Charts
* Full filtering

## Tablet

* Collapsible sidebar
* Responsive cards
* Scrollable tables

## Mobile

* Navigation drawer
* Stacked KPI cards
* Mobile-friendly filters
* Horizontally scrollable tables where required
* Mobile-friendly forms
* Action menus

The mobile interface should be designed intentionally rather than simply shrinking the desktop interface.

---

# 55. API Integration

All Director functionality must use real backend APIs.

Do not create permanent frontend-only repositories.

For every API operation handle:

* Loading
* Success
* Empty
* Error
* Unauthorized
* Forbidden

If a required backend API does not yet exist:

1. Build the UI.
2. Document the required API contract.
3. Mark the integration as pending.
4. Coordinate with the backend developer.
5. Connect the real API once available.

Do not create permanent fake production functionality.

---

# 56. Frontend Authorization

The frontend is not the final security layer.

Correct architecture:

```text
Director
    ↓
Better Auth
    ↓
Authenticated Session
    ↓
RBAC
    ↓
Chapter Scope Validation
    ↓
Backend API
    ↓
Director UI
```

Frontend permissions may be used to:

* Hide unavailable navigation
* Hide unavailable buttons
* Disable unavailable actions
* Display permission-aware states

The backend must enforce every protected operation.

---

# 57. Definition of Done

The Director Dashboard is complete when:

* Director can access the Director workspace.
* Director only sees assigned chapters.
* Dashboard KPIs use real backend data.
* Chapter management works.
* Member management works.
* Member creation works.
* Member editing works.
* Member role changes work.
* Member promotion works.
* Leadership assignment works.
* President assignment works.
* Vice President assignment works.
* Treasurer assignment works.
* Leadership replacement works.
* Leadership vacancies are visible.
* Visitor management works.
* Visitor conversion works.
* Meeting management works.
* Attendance monitoring works.
* Referral monitoring works.
* One-to-one monitoring works.
* Payment monitoring works.
* Chapter notifications work.
* Reports use real backend data.
* Chapter comparison works where applicable.
* Chapter scope restrictions are enforced.
* RBAC restrictions are respected.
* Loading states exist.
* Empty states exist.
* Error states exist.
* Permission-denied states exist.
* Sensitive actions require confirmation.
* No permanent mock data remains.
* Responsive layouts work.
* TypeScript checks pass.
* Relevant lint checks pass.
* Main Director workflows have been manually tested.

---

# 58. Implementation Priority

## Priority 1 — Director Foundation

Build:

* Director layout
* Sidebar
* Top navigation
* Chapter selector
* Notification center
* Profile menu
* Permission-aware navigation
* Responsive layout

---

## Priority 2 — Chapter Oversight

Build:

* Chapter list
* Chapter details
* Chapter overview
* Chapter performance
* Chapter comparison
* Chapter management

---

## Priority 3 — Member Management

Build:

* Member list
* Member search
* Member filters
* Add member
* Edit member
* Member details
* Member activity

---

## Priority 4 — Role & Leadership Management

This is a critical Director feature.

Build:

* Change member role
* Promote Member → President
* Promote Member → Vice President
* Promote Member → Treasurer
* Assign President
* Assign Vice President
* Assign Treasurer
* Replace leadership
* Remove leadership
* Leadership vacancies
* Leadership history where supported

---

## Priority 5 — Chapter Operations

Build:

* Visitors
* Visitor conversion
* Meetings
* Attendance
* Referrals
* One-to-Ones

---

## Priority 6 — Finance

Build:

* Payment dashboard
* Payment records
* Payment status
* Payment reports

---

## Priority 7 — Communication

Build:

* Notifications
* Chapter announcements

---

## Priority 8 — Reports

Build:

* Membership reports
* Leadership reports
* Visitor reports
* Attendance reports
* Referral reports
* Payment reports
* Chapter comparison

---

# 59. Core Product Principle

The Director Dashboard should answer five important questions:

1. How are my assigned chapters performing?
2. Are the chapters properly staffed with leadership?
3. Are members and visitors active and growing?
4. Are meetings, attendance, referrals, and payments healthy?
5. Does any chapter require intervention?

The Director should be able to move from:

```text
Director Dashboard
       ↓
Chapter
       ↓
Leadership
       ↓
Member
       ↓
Role / Profile / Activity
```

without losing chapter context.

The Director is the operational management layer between the Growcle Admin and the individual chapters.

```text
Growcle Admin
      ↓
Platform-wide control
      ↓
Director
      ↓
Assigned chapters
      ↓
Leadership Team
      ↓
Members
      ↓
Visitors
```

The Admin controls the Growcle platform.

The Director controls their assigned chapters and the people/operations within those chapters.

The Leadership Team runs the day-to-day chapter.

The Member manages their own networking activity.

The Visitor receives a limited visitor experience.

```
```
