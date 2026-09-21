## 1. Purpose

The Leadership Team is responsible for running the day-to-day operations of a specific Growcle chapter.

The Leadership Team consists of:

- President
- Vice President
- Secretary/Treasurer

All three positions belong to the same Leadership Team workspace.

They should use the same chapter dashboard and operate within the same chapter.

The main rule is:

> A Leadership Team member can only access data belonging to the chapter they are assigned to.

They cannot:

- View other chapters
- Manage other chapters
- Access Director-level data
- Manage Directors
- Manage platform settings
- Manage global RBAC
- Access platform-wide reports
- Access another chapter by changing a URL or ID

---

# 2. Leadership Team Structure

```text
Leadership Team
       |
       +-------------------+
       |         |         |
       v         v         v
   President  Vice President  Secretary/Treasurer
       |         |         |
       +---------+---------+
                 |
                 v
          Their Chapter Only
````

The three positions should not have three completely separate dashboards.

They should share one:

`/dashboard/leadership`

The dashboard automatically loads the chapter associated with the logged-in leadership member.

---

# 3. Chapter Scope

Every Leadership Team member has a `chapterId` or equivalent chapter relationship.

Example:

```text
President John
    ↓
Chapter Alpha

Vice President Sarah
    ↓
Chapter Alpha

Secretary/Treasurer Michael
    ↓
Chapter Alpha
```

All three can access:

```text
Chapter Alpha
    |
    +-- Members
    +-- Visitors
    +-- Meetings
    +-- Attendance
    +-- Referrals
    +-- One-to-Ones
    +-- Chapter Notifications
    +-- Chapter Reports
```

They cannot access:

```text
Chapter Beta
Chapter Gamma
Chapter Delta
```

unless they are explicitly assigned to those chapters through the backend.

---

# 4. Leadership Dashboard Route

Recommended route:

`/dashboard/leadership`

The application should determine the logged-in user's:

* User
* Member
* Chapter
* Leadership position

and load the appropriate chapter workspace.

The user should not need to manually select a chapter if they belong to only one chapter.

---

# 5. Leadership Dashboard Layout

The dashboard should contain:

* Sidebar
* Top navigation
* Chapter name
* Leadership position indicator
* Notifications
* User profile
* Main dashboard
* Breadcrumbs

Example:

```text
Chapter Alpha

Leadership Team
President — John Smith
```

or:

```text
Chapter Alpha

Leadership Team
Vice President — Sarah Johnson
```

or:

```text
Chapter Alpha

Leadership Team
Secretary/Treasurer — Michael Brown
```

---

# 6. Leadership Sidebar

Recommended navigation:

```text
Dashboard

Members
Visitors

Meetings
Attendance

Referrals
One-to-Ones

Reports

Notifications
```

Optional:

```text
Chapter Profile
```

The exact menu items should be controlled by the permissions assigned to the specific leadership position.

---

# 7. Leadership Dashboard Overview

The dashboard should provide a quick view of the current chapter.

The main purpose is to answer:

1. How is the chapter performing?
2. Who is attending?
3. Which visitors are coming?
4. What referrals are being generated?
5. What meetings are coming up?
6. Are members participating?
7. Is there anything that requires leadership attention?

---

# 8. Dashboard KPI Cards

Display:

## Active Members

Show:

* Total active members
* New members
* Inactive members

---

## Upcoming Visitors

Show:

* Upcoming visitors
* Visitors for the next meeting
* Visitor count

---

## Attendance

Show:

* Current attendance
* Attendance percentage
* Attendance trend

---

## Referrals

Show:

* Referrals given
* Referrals received
* Pending referrals
* Closed referrals

---

## Closed Business

Show:

* Total closed business
* Current period value

---

## One-to-Ones

Show:

* Completed one-to-ones
* Scheduled one-to-ones
* Participation

---

# 9. Dashboard Upcoming Meeting

The dashboard should prominently display the next chapter meeting.

Show:

```text
Next Chapter Meeting

Date:
August 20, 2026

Time:
7:30 AM

Location:
Chapter Alpha Meeting Hall

Meeting Type:
In Person

Members Expected:
42

Visitors:
5

[View Meeting]
```

Actions should depend on the user's permissions.

---

# 10. Dashboard Quick Actions

Recommended actions:

* Add Member
* Add Visitor
* Create Meeting
* Record Attendance
* Add Referral
* View Members
* Send Chapter Notification

The available actions should depend on the specific leadership position's permissions.

---

# 11. Member Management

Route:

`/dashboard/leadership/members`

The Leadership Team should have access to members of their chapter.

They should not see members from other chapters.

---

# 12. Member List

Display:

* Name
* Business name
* Industry
* Email
* Phone
* Membership status
* Membership number
* Join date
* Attendance
* Role
* Actions

---

# 13. Member Search

Search by:

* Name
* Email
* Business name
* Phone
* Membership number

Search must remain restricted to the current chapter.

---

# 14. Member Filters

Filters:

* Membership status
* Role
* Industry
* Attendance
* Join date
* Renewal date

---

# 15. Member Details

Leadership should be able to view:

* Personal information
* Business information
* Membership information
* Chapter
* Role
* Attendance
* Referrals
* One-to-ones
* Visitors invited
* Relevant activity

Sensitive information should only be exposed when the backend permission allows it.

---

# 16. Adding Members

The Leadership Team may be allowed to add members depending on the RBAC configuration.

If permitted:

Fields:

### Personal Information

* First name
* Last name
* Email
* Phone

### Business Information

* Business name
* Industry
* Website
* Business description

### Membership

* Membership number
* Joined date
* Membership status

The chapter should automatically be set to the leadership user's chapter.

The leadership member should NOT be allowed to select another chapter.

Example:

```text
Chapter:

Chapter Alpha

[Locked]
```

---

# 17. Member Editing

Depending on permission, Leadership can update:

* Contact information
* Business information
* Membership information
* Profile information

They should not be able to modify platform-level account information.

---

# 18. Member Role Visibility

Leadership should be able to see the current role of each member.

Example:

```text
John Smith
Role: Member

Sarah Johnson
Role: President

Michael Brown
Role: Treasurer
```

---

# 19. Member Role Changes

Role changes are more restricted than normal member editing.

By default:

* Leadership should NOT be able to freely promote members to any system role.
* Leadership should not be able to assign Director.
* Leadership should not be able to assign Admin.
* Leadership should not be able to change roles outside their chapter.

If the product requires Leadership to nominate or assign chapter roles, this should be handled through specific backend permissions.

Recommended approach:

```text
Leadership
    ↓
Request/Assign Chapter Leadership Role
    ↓
Backend validates
    ↓
Role updated
```

The Director should remain the primary authority for changing:

* President
* Vice President
* Secretary/Treasurer

unless the Admin explicitly configures otherwise.

---

# 20. Visitor Management

Route:

`/dashboard/leadership/visitors`

Leadership should manage visitors for their chapter.

---

## Visitor List

Display:

* Name
* Business
* Email
* Phone
* Visit date
* Invited by
* Status
* Conversion status

---

# 21. Add Visitor

Fields:

* First name
* Last name
* Email
* Phone
* Business name
* Industry
* Visit date
* Inviting member
* Notes

The chapter should automatically be associated with the leadership user's chapter.

---

# 22. Visitor Workflow

The Leadership Team should be able to manage:

```text
Visitor
   ↓
Registered
   ↓
Upcoming Visit
   ↓
Attended / No Show
   ↓
Follow-up
   ↓
Converted to Member
```

---

# 23. Visitor Details

Display:

* Personal information
* Business
* Visit date
* Inviting member
* Visit status
* Follow-up information
* Conversion status
* Notes

---

# 24. Visitor Conversion

If the backend allows Leadership to convert visitors:

```text
Visitor
   ↓
Convert
   ↓
Member
   ↓
Chapter automatically assigned
```

The visitor should be converted into a member of the same chapter.

The user should not be able to select another chapter.

---

# 25. Meeting Management

Route:

`/dashboard/leadership/meetings`

The Leadership Team is responsible for operating chapter meetings.

---

# 26. Meeting List

Display:

* Meeting title
* Date
* Time
* Location
* Speaker
* Theme
* Meeting type
* Status
* Attendance
* Actions

---

# 27. Create Meeting

Where permitted, Leadership can create a chapter meeting.

Fields:

* Meeting title
* Date
* Start time
* End time
* Location
* Meeting type
* Speaker
* Theme
* Agenda
* Meeting link if applicable

The chapter should automatically be associated.

---

# 28. Edit Meeting

Leadership can update:

* Date
* Time
* Location
* Speaker
* Theme
* Agenda
* Meeting link
* Status

The backend should determine who can edit or cancel meetings.

---

# 29. Meeting Agenda

Leadership should have an agenda view.

Display:

```text
Chapter Alpha

Weekly Meeting

1. Opening
2. Attendance
3. Visitor Introduction
4. Member Presentations
5. Referrals
6. One-to-Ones
7. Announcements
8. Closing
```

The exact agenda structure should remain configurable.

---

# 30. Attendance Management

Route:

`/dashboard/leadership/attendance`

Attendance is one of the primary responsibilities of the Leadership Team.

---

# 31. Attendance Screen

For the current meeting display:

```text
Member                 Status

John Smith             Present
Sarah Johnson          Present
Michael Brown          Absent
David Lee              Substitute
```

Possible statuses:

* Present
* Absent
* Substitute
* Excused

The exact statuses should match the backend enums.

---

# 32. Attendance Actions

Leadership can:

* Mark present
* Mark absent
* Mark substitute
* Mark excused
* Correct attendance where permitted
* Add attendance notes

---

# 33. Attendance Summary

Display:

* Total members
* Present
* Absent
* Substitute
* Excused
* Attendance percentage

Example:

```text
Attendance

Present       35
Absent         4
Substitute     2
Excused        1

Attendance: 87.5%
```

---

# 34. Attendance History

Leadership should be able to view:

* Previous meetings
* Attendance percentage
* Individual member attendance
* Attendance trends

This can help identify members who consistently miss meetings.

---

# 35. Referral Management

Route:

`/dashboard/leadership/referrals`

Leadership should have visibility into referral activity for their chapter.

---

# 36. Referral List

Display:

* Referral
* From member
* To member
* Status
* Value
* Created date
* Follow-up date
* Closed date

---

# 37. Referral Status

Use backend-supported statuses:

```text
PENDING
CONTACTED
CLOSED_WON
CLOSED_LOST
```

---

# 38. Referral Actions

Depending on permissions:

* View referral
* Create referral
* Update referral
* Update status
* Add notes
* Add follow-up date
* View referral history

Leadership should not be able to access referrals belonging to another chapter.

---

# 39. Referral Analytics

Display:

* Total referrals
* Pending referrals
* Contacted referrals
* Closed Won
* Closed Lost
* Total closed business
* Referral value

---

# 40. One-to-One Management

Route:

`/dashboard/leadership/one-to-ones`

Leadership should have visibility into one-to-one activity within their chapter.

---

# 41. One-to-One List

Display:

* Initiator
* Receiver
* Date
* Duration
* Status
* Outcome

---

# 42. One-to-One Analytics

Show:

* Total one-to-ones
* Completed
* Scheduled
* Cancelled
* Member participation

The Leadership Team should use this primarily to understand chapter engagement.

They should not unnecessarily edit private member records.

---

# 43. Chapter Notifications

Route:

`/dashboard/leadership/notifications`

Leadership should be able to communicate with members of their chapter where permitted.

---

# 44. Send Notification

Possible recipients:

* All chapter members
* Leadership Team
* Specific member
* Visitors
* Meeting attendees

Fields:

* Title
* Message
* Priority
* Recipient
* Scheduled time if supported

---

# 45. Notification Examples

```text
Tomorrow's meeting will be held at the usual location.

Please arrive by 7:15 AM.
```

or:

```text
Reminder:
Please submit your referral updates before tomorrow's meeting.
```

Leadership should not be able to send platform-wide notifications.

---

# 46. Chapter Reports

Route:

`/dashboard/leadership/reports`

Leadership should only see reports for their chapter.

---

## Membership Report

Show:

* Total members
* Active members
* Inactive members
* New members
* Members by role

---

## Attendance Report

Show:

* Overall attendance
* Attendance by member
* Attendance trend
* Members with low attendance

---

## Visitor Report

Show:

* Visitors
* Attended visitors
* No-shows
* Converted visitors
* Conversion percentage

---

## Referral Report

Show:

* Total referrals
* Referral status
* Closed business
* Referral value

---

## One-to-One Report

Show:

* Completed one-to-ones
* Participation
* Chapter engagement

---

# 47. Chapter Overview

Leadership should have a dedicated chapter overview.

Display:

```text
Chapter Alpha

Members
42

Attendance
91%

Visitors This Month
8

Visitor Conversion
37%

Referrals
24

Closed Business
₹X

Upcoming Meeting
Thursday, 7:30 AM
```

---

# 48. Leadership Position Indicator

The dashboard should clearly show the user's current position.

Example:

```text
Chapter Alpha

Leadership Team
President
```

or:

```text
Chapter Alpha

Leadership Team
Vice President
```

or:

```text
Chapter Alpha

Leadership Team
Secretary/Treasurer
```

This helps users understand why they have access to certain actions.

---

# 49. President Responsibilities

The President is the primary operational leader of the chapter.

The President should generally have access to:

* Chapter dashboard
* Members
* Visitors
* Meetings
* Attendance
* Referrals
* One-to-Ones
* Chapter reports
* Chapter notifications
* Leadership overview

The President should be able to coordinate chapter activities and monitor overall chapter performance.

---

# 50. Vice President Responsibilities

The Vice President supports the President and helps manage chapter operations.

The Vice President should generally have access to:

* Chapter dashboard
* Members
* Visitors
* Meetings
* Attendance
* Referrals
* One-to-Ones
* Chapter reports
* Chapter notifications
* Leadership overview

The Vice President should be able to step in and perform operational tasks when required.

The exact difference between President and Vice President should be permission-based rather than requiring completely separate frontend applications.

---

# 51. Secretary/Treasurer Responsibilities

The Secretary/Treasurer handles administrative records and chapter financial responsibilities.

The Secretary/Treasurer should generally have access to:

* Chapter dashboard
* Members
* Visitors
* Meetings
* Attendance
* Chapter records
* Referrals
* One-to-Ones
* Payments
* Payment records
* Financial reports
* Chapter notifications

The Secretary/Treasurer should have additional visibility into payment and financial information.

---

# 52. Shared Leadership Permissions

The three leadership positions should share many permissions.

Example:

```text
Chapter
    view

Members
    view

Visitors
    view
    create

Meetings
    view
    create
    update

Attendance
    view
    update

Referrals
    view
    create
    update

One-to-Ones
    view

Notifications
    view
    create
    send

Reports
    view
```

Additional permissions can be assigned to specific positions.

---

# 53. Position-Specific Permissions

Recommended difference:

```text
PRESIDENT

- Full chapter operational oversight
- Leadership overview
- Chapter reports
- Meeting management
- Member oversight
- Visitor oversight
```

```text
VICE PRESIDENT

- Chapter operational support
- Member oversight
- Visitor oversight
- Meeting management
- Attendance
- Referrals
- Reports
```

```text
SECRETARY/TREASURER

- Administrative records
- Attendance records
- Meeting records
- Payment records
- Financial reports
- Member records
```

These are recommended defaults.

The actual permissions should be controlled through the existing RBAC engine.

---

# 54. Leadership Role Boundaries

Leadership should NOT have:

```text
Platform Settings
Global RBAC
Global Audit Logs
Director Management
Organization Management
Other Chapter Management
Global Member Management
Global Financial Management
Platform Branding
```

Their access is strictly chapter-level.

---

# 55. Chapter Scope Security

The backend must enforce:

```text
Logged-in User
      ↓
Member
      ↓
Leadership Role
      ↓
Chapter ID
      ↓
Permission
      ↓
Requested Resource
```

For example:

```text
President of Chapter Alpha
        ↓
Requests Chapter Beta members
        ↓
Backend checks chapter scope
        ↓
DENIED
```

The frontend should display:

```text
You do not have access to this chapter.
```

---

# 56. URL Security

The frontend must not rely on URL structure for security.

For example:

```text
/dashboard/leadership/chapters/chapter-beta
```

must not become accessible simply because the user manually changes:

```text
chapter-alpha
```

to:

```text
chapter-beta
```

The backend must verify chapter membership and permissions on every protected request.

---

# 57. Role Change Restrictions

Leadership should not have unrestricted role-management capabilities.

By default:

```text
Leadership
    |
    +-- Cannot assign Director
    +-- Cannot assign Admin
    +-- Cannot manage global roles
    +-- Cannot modify another chapter
```

For chapter leadership changes, the recommended authority is:

```text
Admin
    ↓
Director
    ↓
Leadership Team
```

Leadership may view current leadership and, if specifically granted permission, request or perform certain chapter-level role changes.

---

# 58. Loading States

Every backend-driven page should have:

* Table skeletons
* KPI skeletons
* Chart skeletons
* Detail skeletons
* Form loading states
* Button loading states

Never show an empty screen while data is loading.

---

# 59. Empty States

Example:

```text
No members found.

There are currently no members in this chapter.

[Add Member]
```

Visitor:

```text
No upcoming visitors.

No visitors are currently scheduled for this chapter.
```

Leadership:

```text
Leadership Team

President
John Smith

Vice President
Unassigned

Secretary/Treasurer
Michael Brown
```

---

# 60. Error States

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

Chapter scope error:

```text
You do not have access to this chapter.
```

---

# 61. Confirmation for Important Actions

Require confirmation for:

* Deactivating a member
* Removing a member
* Cancelling a meeting
* Correcting important attendance records
* Updating payment information
* Changing important member information

Example:

```text
Cancel Meeting?

This will cancel the Chapter Alpha meeting scheduled for
August 20, 2026.

[Cancel] [Confirm]
```

---

# 62. Mobile Requirements

The Leadership dashboard must work properly on mobile.

Mobile should support:

* Navigation drawer
* Stacked KPI cards
* Mobile-friendly forms
* Scrollable tables
* Action menus
* Meeting attendance marking
* Visitor management
* Notifications

Attendance marking should be particularly optimized for mobile because leadership may use a phone during the actual chapter meeting.

---

# 63. Meeting-Day Experience

The Leadership dashboard should provide a simplified meeting-day workflow.

Example:

```text
Today's Meeting

Chapter Alpha
August 20, 2026

42 Members
5 Visitors

[Start Attendance]

[View Visitors]

[View Agenda]
```

After selecting attendance:

```text
John Smith       Present
Sarah Johnson    Present
Michael Brown    Absent
David Lee        Substitute
```

The goal is to allow Leadership to complete attendance quickly during the meeting.

---

# 64. Leadership Dashboard Definition of Done

The Leadership workspace is complete when:

* President can access their chapter.
* Vice President can access their chapter.
* Secretary/Treasurer can access their chapter.
* Users cannot access other chapters.
* Dashboard shows real chapter data.
* Members can be viewed.
* Members can be searched.
* Members can be filtered.
* Visitors can be managed.
* Meetings can be viewed and managed according to permissions.
* Attendance can be recorded.
* Attendance history can be viewed.
* Referrals can be viewed and managed according to permissions.
* One-to-one activity can be viewed.
* Chapter reports work.
* Chapter notifications work.
* Secretary/Treasurer can access permitted payment information.
* Leadership overview is available.
* Position-specific permissions are respected.
* Chapter scope is enforced by the backend.
* Loading states exist.
* Empty states exist.
* Error states exist.
* Permission-denied states exist.
* Sensitive actions require confirmation.
* Mobile workflows work correctly.
* No permanent mock data remains.
* TypeScript checks pass.
* Relevant lint checks pass.
* Main leadership workflows have been manually tested.

---

# 65. Implementation Priority

## Priority 1 — Leadership Foundation

Build:

* Leadership layout
* Chapter identification
* Position indicator
* Sidebar
* Top navigation
* Notifications
* Profile

---

## Priority 2 — Chapter Overview

Build:

* Chapter dashboard
* KPI cards
* Upcoming meeting
* Chapter activity
* Quick actions

---

## Priority 3 — Members

Build:

* Member list
* Search
* Filters
* Member details
* Member profile
* Member management

---

## Priority 4 — Visitors

Build:

* Visitor list
* Add visitor
* Visitor details
* Visitor status
* Visitor conversion

---

## Priority 5 — Meetings & Attendance

Build:

* Meeting list
* Meeting details
* Create/edit meeting
* Meeting agenda
* Attendance
* Attendance history
* Meeting-day workflow

---

## Priority 6 — Networking Activity

Build:

* Referrals
* Referral status
* Referral analytics
* One-to-ones
* Participation analytics

---

## Priority 7 — Finance

Build:

* Payment visibility
* Payment records
* Financial information for Secretary/Treasurer
* Financial reports

---

## Priority 8 — Communication

Build:

* Chapter notifications
* Announcements
* Notification history

---

## Priority 9 — Reports

Build:

* Membership report
* Attendance report
* Visitor report
* Referral report
* One-to-one report
* Financial report

---

# 66. Core Product Rule

The Leadership Team is a chapter-level operational team.

All three positions:

```text
President
Vice President
Secretary/Treasurer
```

use the same chapter workspace.

Their data scope is:

```text
ONE LEADERSHIP MEMBER
        ↓
ONE ASSIGNED CHAPTER
        ↓
CHAPTER DATA ONLY
```

They should never be given platform-wide access.

The final security model should therefore be:

```text
ADMIN
Platform-wide access

        ↓

DIRECTOR
Assigned chapters

        ↓

LEADERSHIP TEAM
One assigned chapter

        ↓

MEMBER
Own profile + networking activity

        ↓

VISITOR
Limited visitor experience
```

The frontend should reflect this hierarchy, but the backend RBAC and chapter-scope validation must remain the final authority.

```
```
