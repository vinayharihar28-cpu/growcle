<html>
<body>
<!--StartFragment--><html><head></head><body><h2>1. Purpose</h2><p>The Member Dashboard is the primary workspace for a normal <strong>Growcle member</strong>.</p><p>Its purpose is to let a member:</p><ul><li><p>Manage their own profile and business</p></li><li><p>Represent their business within the chapter</p></li><li><p>View chapter information</p></li><li><p>Track their referrals</p></li><li><p>Manage visitors they bring</p></li><li><p>Schedule and manage one-to-ones</p></li><li><p>View meetings and attendance</p></li><li><p>Track their own membership/payment information</p></li><li><p>Communicate with their chapter</p></li><li><p>Monitor their networking activity</p></li><li><p>Discover other members and businesses</p></li><li><p>Access relevant reports/analytics about their own activity</p></li></ul><p>The Member Dashboard is <strong>not an administrative workspace</strong>.</p><p>A member should never be able to:</p><ul><li><p>Manage another member's account</p></li><li><p>Change chapter leadership</p></li><li><p>Manage chapter settings</p></li><li><p>Manage RBAC</p></li><li><p>Access another chapter's private information</p></li><li><p>Modify attendance records arbitrarily</p></li><li><p>Manage chapter-wide financial records</p></li><li><p>Access platform administration</p></li></ul><hr><h1>2. Member Access Model</h1><p>The member's access follows:</p><pre><code class="language-text">Authenticated User
       ↓
Member
       ↓
Member Role
       ↓
Assigned Chapter
       ↓
Member Permissions
       ↓
Member Dashboard</code></pre><p>The member's primary scope is:</p><pre><code class="language-text">My Profile
My Business
My Referrals
My Visitors
My One-to-Ones
My Attendance
My Meetings
My Payments
My Notifications</code></pre><p>They can additionally have <strong>read-only access</strong> to selected chapter information:</p><pre><code class="language-text">Chapter Members
Chapter Meetings
Chapter Events
Chapter Announcements
Chapter Statistics</code></pre><p>depending on permissions.</p><hr><h1>3. Recommended Route</h1><pre><code class="language-text">/dashboard/member</code></pre><p>This should be the primary workspace for:</p><pre><code class="language-text">MEMBER</code></pre><p>A member should be automatically redirected here after authentication when their effective role is <code inline="">MEMBER</code>.</p><hr><h1>4. Member Dashboard Navigation</h1><p>Recommended navigation:</p><pre><code class="language-text">Dashboard

My Profile
My Business

Members
Visitors

Meetings
Attendance

Referrals
One-to-Ones

Payments

Notifications

Reports</code></pre><p>Potential future sections:</p><pre><code class="language-text">Resources
Events
Documents
Settings
Help</code></pre><p>The navigation should be permission-driven rather than hardcoded purely from the role name.</p><hr><h1>5. Dashboard Home</h1><p>The dashboard home should provide a quick overview of the member's networking activity.</p><p>Suggested layout:</p><pre><code class="language-text">Good morning, Vinay

Chapter Alpha
Your networking overview

------------------------------------------------

Membership
Active

Next Meeting
Thursday
8:00 AM

Attendance
92%

------------------------------------------------

Referrals
12

Closed Business
₹1,25,000

One-to-Ones
8

Visitors
3

------------------------------------------------

Upcoming

Next Meeting
Upcoming One-to-One
Visitor Follow-up

------------------------------------------------

Quick Actions

[Give Referral]
[Invite Visitor]
[Schedule One-to-One]
[View Meeting]
[Update Profile]</code></pre><p>The dashboard should answer:</p><blockquote><p>"What do I need to know or do today?"</p></blockquote><hr><h1>6. Dashboard KPI Cards</h1><p>Recommended KPI cards:</p><h3>Membership</h3><pre><code class="language-text">Membership Status
Active</code></pre><p>Possible states:</p><pre><code class="language-text">Active
Pending
Suspended
Expired
Inactive</code></pre><hr><h3>Attendance</h3><p>Show:</p><pre><code class="language-text">Attendance Percentage</code></pre><p>Example:</p><pre><code class="language-text">92%</code></pre><p>Clicking should take the member to:</p><pre><code class="language-text">Attendance</code></pre><hr><h3>Referrals</h3><p>Show:</p><pre><code class="language-text">Referrals Given
Referrals Received</code></pre><p>Optionally:</p><pre><code class="language-text">Closed Referrals
Referral Value</code></pre><hr><h3>One-to-Ones</h3><p>Show:</p><pre><code class="language-text">Completed
Scheduled</code></pre><hr><h3>Visitors</h3><p>Show:</p><pre><code class="language-text">Visitors Invited
Visitors Attended
Visitors Converted</code></pre><hr><h3>Business Generated</h3><p>If the platform tracks referral value:</p><pre><code class="language-text">Business Generated
₹1,25,000</code></pre><p>This should represent the member's permitted referral/business data, not arbitrary chapter-wide financial information.</p><hr><h1>7. Quick Actions</h1><p>The dashboard should provide high-frequency actions.</p><p>Recommended:</p><pre><code class="language-text">Give Referral
Receive Referral
Invite Visitor
Schedule One-to-One
View Meeting
Mark Meeting Attendance
Update Business Profile
View Members</code></pre><p>The most important actions should be accessible without navigating through several pages.</p><hr><h1>8. My Profile</h1><p>Route:</p><pre><code class="language-text">/dashboard/member/profile</code></pre><p>The member should be able to view and edit their own personal information.</p><h3>Personal Information</h3><pre><code class="language-text">First Name
Last Name
Profile Photo
Email
Phone
Designation
Bio</code></pre><p>Some fields may be read-only depending on business rules.</p><hr><h1>9. Business Profile</h1><p>Route:</p><pre><code class="language-text">/dashboard/member/business</code></pre><p>This is particularly important because the Growcle platform is a <strong>business networking platform</strong>.</p><p>The business profile should include:</p><pre><code class="language-text">Business Name
Industry
Category
Website
Business Email
Business Phone
Business Address
Business Description
Services
Products
Years in Business
Target Customers
Ideal Referral</code></pre><p>Potential networking-specific fields:</p><pre><code class="language-text">What I Do
Who I Help
What I Am Looking For
Best Referral For Me
Not A Good Referral</code></pre><p>Example:</p><pre><code class="language-text">I help small businesses improve their accounting
and financial reporting.

Best referral:
Businesses with 10–50 employees looking
for professional accounting support.</code></pre><p>This makes the member profile useful for actual networking rather than simply being an account record.</p><hr><h1>10. Profile Visibility</h1><p>Members should have control over selected profile visibility.</p><p>Potential settings:</p><pre><code class="language-text">Visible to Chapter Members
Visible to Organization Members
Visible to Visitors
Public Profile</code></pre><p>However, visibility rules must be enforced server-side.</p><p>A frontend toggle must never expose information that the backend considers private.</p><hr><h1>11. Member Directory</h1><p>Route:</p><pre><code class="language-text">/dashboard/member/members</code></pre><p>Members should be able to discover other members in their permitted networking scope.</p><p>Recommended information:</p><pre><code class="language-text">Profile Photo
Name
Business
Industry
Designation
Contact Options</code></pre><p>Search:</p><pre><code class="language-text">Name
Business
Industry
Keyword</code></pre><p>Filters:</p><pre><code class="language-text">Industry
Business Category
Location</code></pre><hr><h1>12. Member Directory Privacy</h1><p>The directory should <strong>not expose every database field</strong>.</p><p>For example, depending on privacy rules, members should not automatically see:</p><ul><li><p>Internal admin notes</p></li><li><p>Payment information</p></li><li><p>Private contact information</p></li><li><p>Internal RBAC data</p></li><li><p>Audit information</p></li><li><p>Administrative records</p></li></ul><p>The API should return a dedicated member-directory DTO rather than the complete Member database object.</p><hr><h1>13. Member Details</h1><p>When a member selects another member:</p><pre><code class="language-text">/dashboard/member/members/[memberId]</code></pre><p>show:</p><pre><code class="language-text">Profile
Business
Industry
Bio
Services
Contact Information
Networking Information</code></pre><p>Possible actions:</p><pre><code class="language-text">Request One-to-One
Give Referral
Send Message
Save Contact</code></pre><p>Only actions supported by the backend permission model should appear.</p><hr><h1>14. Referrals</h1><p>Route:</p><pre><code class="language-text">/dashboard/member/referrals</code></pre><p>Referrals are one of the most important member-facing modules.</p><p>The member should be able to see:</p><pre><code class="language-text">Referrals Given
Referrals Received</code></pre><p>Tabs:</p><pre><code class="language-text">Given
Received</code></pre><hr><h1>15. Give a Referral</h1><p>Action:</p><pre><code class="language-text">[Give Referral]</code></pre><p>Form:</p><pre><code class="language-text">Member
Referral Description
Potential Client
Contact Information
Estimated Value
Notes
Follow-up Date</code></pre><p>Example:</p><pre><code class="language-text">Referral To:
Sarah Johnson

Potential Client:
ABC Manufacturing

Description:
ABC Manufacturing needs help with
annual financial planning.

Estimated Value:
₹50,000</code></pre><hr><h1>16. Referral Status</h1><p>Recommended statuses:</p><pre><code class="language-text">PENDING
CONTACTED
IN_PROGRESS
CLOSED_WON
CLOSED_LOST</code></pre><p>The member should be able to track the progress of referrals they are involved in.</p><hr><h1>17. Referral Details</h1><p>Referral details should display:</p><pre><code class="language-text">Given By
Received By
Description
Date
Status
Follow-up
Value
Notes</code></pre><p>Activity timeline:</p><pre><code class="language-text">Referral Created
      ↓
Recipient Contacted
      ↓
Follow-up Added
      ↓
Business Closed</code></pre><hr><h1>18. Referral Privacy</h1><p>A member should only see referrals they are authorized to access.</p><p>For example:</p><pre><code class="language-text">Member A
   ↓
Referral given to Member B</code></pre><p>Member A can see their referral.</p><p>Member B can see the referral they received.</p><p>A normal member should <strong>not</strong> automatically see every referral in the chapter.</p><p>Chapter-wide referral analytics belong to:</p><pre><code class="language-text">Leadership
Director
Admin</code></pre><hr><h1>19. Visitors</h1><p>Route:</p><pre><code class="language-text">/dashboard/member/visitors</code></pre><p>Members should be able to manage visitors they personally invite.</p><p>Actions:</p><pre><code class="language-text">Invite Visitor
View Visitor
Edit Visitor
View Visit Status
Follow Up</code></pre><hr><h1>20. Invite Visitor</h1><p>Form:</p><pre><code class="language-text">First Name
Last Name
Email
Phone
Business
Industry
Purpose of Visit
Meeting
Notes</code></pre><p>The system should automatically associate the visitor with:</p><pre><code class="language-text">Inviting Member
Chapter
Meeting</code></pre><p>The member should not manually select an arbitrary chapter.</p><hr><h1>21. Visitor Lifecycle</h1><pre><code class="language-text">Invited
   ↓
Registered
   ↓
Upcoming
   ↓
Attended
   ↓
Follow-up
   ↓
Converted / Not Converted</code></pre><p>The member should be able to see the status of visitors they invited.</p><hr><h1>22. Visitor Follow-Up</h1><p>After a meeting:</p><pre><code class="language-text">Visitor attended
        ↓
Member receives follow-up reminder
        ↓
Member contacts visitor
        ↓
Visitor interested
        ↓
Potential membership</code></pre><p>Possible actions:</p><pre><code class="language-text">Add Follow-up Note
Schedule Follow-up
Mark Contacted
Recommend Membership</code></pre><hr><h1>23. Meetings</h1><p>Route:</p><pre><code class="language-text">/dashboard/member/meetings</code></pre><p>Members should be able to view:</p><pre><code class="language-text">Upcoming Meetings
Past Meetings
Meeting Details
Agenda
Location
Speaker</code></pre><hr><h1>24. Meeting Details</h1><p>A member should see:</p><pre><code class="language-text">Meeting Title
Date
Time
Location
Agenda
Speaker
Meeting Type
Visitors
Announcements</code></pre><p>Actions:</p><pre><code class="language-text">View Agenda
View Attendees
Mark Attendance
Invite Visitor</code></pre><p>Only permitted actions should be available.</p><hr><h1>25. Meeting-Day Experience</h1><p>The member experience should be optimized for mobile.</p><p>Example:</p><pre><code class="language-text">Today's Meeting

Chapter Alpha

Thursday
8:00 AM

Location:
Grand Hall

--------------------------------

Your Attendance

[ Mark Present ]

--------------------------------

Agenda

8:00 — Networking
8:15 — Chapter Updates
8:30 — Speaker
9:00 — Closing</code></pre><p>This should be extremely fast to use.</p><hr><h1>26. Attendance</h1><p>Route:</p><pre><code class="language-text">/dashboard/member/attendance</code></pre><p>A member should be able to see their own attendance history.</p><p>Example:</p>
Date | Meeting | Status
-- | -- | --
Aug 6 | Weekly Meeting | Present
Aug 13 | Weekly Meeting | Present
Aug 20 | Weekly Meeting | Absent

<p>The exact permission names should ultimately align with the existing RBAC backend rather than creating arbitrary frontend-only permissions.</p><hr><h1>41. What Members Must NOT Access</h1><p>A normal member must not have access to:</p><pre><code class="language-text">Platform Administration
Organization Administration
Chapter Administration
RBAC Management
Role Assignment
Leadership Assignment
Audit Logs
Other Members' Payments
Organization Financial Reports
Chapter Financial Reports
Private Administrative Notes
Other Chapters</code></pre><hr><h1>42. Chapter Scope</h1><p>This is critical.</p><p>Suppose:</p><pre><code class="language-text">Member A
Chapter Alpha</code></pre><p>and:</p><pre><code class="language-text">Chapter Beta
Chapter Gamma</code></pre><p>exist.</p><p>Member A should only have access to:</p><pre><code class="language-text">Chapter Alpha</code></pre><p>unless the product explicitly supports multi-chapter membership.</p><p>Changing:</p><pre><code class="language-text">/dashboard/member?chapterId=beta</code></pre><p>must not expose Chapter Beta.</p><p>The backend must derive and validate chapter access.</p><hr><h1>43. Member API Security</h1><p>The frontend should never call an endpoint like:</p><pre><code class="language-text">GET /api/members/:id</code></pre><p>and assume the user is allowed to access it.</p><p>The backend must perform:</p><pre><code class="language-text">authenticate()
        ↓
getMember()
        ↓
verifyChapterScope()
        ↓
verifyPermission()
        ↓
return permitted fields</code></pre><p>For sensitive operations:</p><pre><code class="language-text">authorize()
        ↓
validate ownership
        ↓
validate resource scope
        ↓
perform mutation</code></pre><hr><h1>44. Recommended API Groups</h1><p>The frontend will likely need APIs approximately organized as:</p><pre><code class="language-text">/api/member/profile
/api/member/business

/api/member/members
/api/member/visitors

/api/member/meetings
/api/member/attendance

/api/member/referrals
/api/member/one-to-ones

/api/member/payments
/api/member/notifications

/api/member/reports</code></pre><p>The exact REST/RPC structure can follow the existing backend architecture.</p><p>The important principle is <strong>not</strong> to create endpoints that expose unrestricted database objects.</p><hr><h1>45. Member Dashboard Responsive Design</h1><p>The dashboard must be fully responsive.</p><h3>Desktop</h3><p>Use:</p><pre><code class="language-text">Sidebar
Top navigation
Dashboard grid
Data tables
Charts</code></pre><h3>Tablet</h3><p>Use:</p><pre><code class="language-text">Collapsible sidebar
Responsive cards
Horizontal tables where necessary</code></pre><h3>Mobile</h3><p>Prioritize:</p><pre><code class="language-text">Today's Meeting
Attendance
Referrals
Visitors
One-to-Ones
Notifications</code></pre><p>Use:</p><pre><code class="language-text">Bottom navigation
Quick actions
Cards
Mobile-friendly forms
Swipe/compact interactions</code></pre><hr><h1>46. Member Dashboard Mobile Navigation</h1><p>Recommended mobile navigation:</p><pre><code class="language-text">Home
Members
Activity
Meetings
Profile</code></pre><p>Then secondary modules can be inside:</p><pre><code class="language-text">More</code></pre><p>This prevents the mobile navigation from becoming overloaded.</p><hr><h1>47. Empty States</h1><p>Every module needs useful empty states.</p><p>Example:</p><pre><code class="language-text">No Referrals Yet

Start building your network by
giving your first referral.

[Give Referral]</code></pre><p>Visitor:</p><pre><code class="language-text">No Visitors Yet

Invite a business professional
to your next chapter meeting.

[Invite Visitor]</code></pre><p>One-to-One:</p><pre><code class="language-text">No One-to-Ones Scheduled

Connect with another member
and schedule your first one-to-one.

[Find a Member]</code></pre><hr><h1>48. Loading States</h1><p>Every data-heavy page needs:</p><pre><code class="language-text">Skeleton
Loading indicator</code></pre><p>Avoid blank screens.</p><p>Example:</p><pre><code class="language-text">Loading Members...</code></pre><hr><h1>49. Error States</h1><p>Errors should be understandable.</p><p>Instead of:</p><pre><code class="language-text">403</code></pre><p>show:</p><pre><code class="language-text">You don't have permission to access this information.</code></pre><p>For failed operations:</p><pre><code class="language-text">Unable to submit referral.

Please try again.</code></pre><p>For session expiration:</p><pre><code class="language-text">Your session has expired.

[Sign In Again]</code></pre><hr><h1>50. Member Dashboard Architecture</h1><p>Recommended component structure:</p><pre><code class="language-text">MemberDashboard
│
├── MemberSidebar
├── MemberHeader
│
├── DashboardHome
│   ├── MembershipCard
│   ├── AttendanceCard
│   ├── ReferralCard
│   ├── OneToOneCard
│   ├── VisitorCard
│   ├── UpcomingMeeting
│   └── QuickActions
│
├── Profile
├── BusinessProfile
│
├── MemberDirectory
├── MemberDetails
│
├── Visitors
├── VisitorDetails
│
├── Meetings
├── MeetingDetails
├── Attendance
│
├── Referrals
├── ReferralDetails
│
├── OneToOnes
│
├── Payments
│
├── Notifications
│
├── Reports
│
└── Settings</code></pre><hr><h1>51. Member Dashboard Data Flow</h1><pre><code class="language-text">Better Auth
      ↓
Current User
      ↓
Member Record
      ↓
Chapter Membership
      ↓
Member Permissions
      ↓
Dashboard API
      ↓
Member Dashboard</code></pre><p>The dashboard should receive only the data the member is allowed to access.</p><hr><h1>52. Recommended Dashboard Development Order</h1><p>For Person B, I would build the Member Dashboard in this order:</p><h3>Phase 1 — Foundation</h3><pre><code class="language-text">Member layout
Sidebar
Header
Responsive navigation
Dashboard home
Permission-aware navigation
Loading states
Error states</code></pre><h3>Phase 2 — Identity</h3><pre><code class="language-text">Profile
Business Profile
Settings</code></pre><h3>Phase 3 — Networking</h3><pre><code class="language-text">Member Directory
Member Details
Referrals
Visitors
One-to-Ones</code></pre><h3>Phase 4 — Meetings</h3><pre><code class="language-text">Meetings
Meeting Details
Attendance
Meeting-day mobile UX</code></pre><h3>Phase 5 — Finance</h3><pre><code class="language-text">Payments
Invoices
Receipts
Payment status</code></pre><h3>Phase 6 — Engagement</h3><pre><code class="language-text">Notifications
Personal Reports
Activity Timeline
Networking metrics</code></pre><hr><h1>53. Backend Work Required From Person A</h1><p>While Person B builds the UI, Person A should expose/verify APIs for:</p><pre><code class="language-text">Current member
Member profile
Business profile
Member directory
Member details

Referrals
Visitors
Meetings
Attendance
One-to-ones

Payments
Notifications

Member reports</code></pre><p>And most importantly:</p><pre><code class="language-text">Authorization
Ownership checks
Chapter scope
Permission checks</code></pre><hr><h1>54. Frontend Work Required From Person B</h1><p>Person B should:</p><pre><code class="language-text">Build Member workspace
Connect authenticated member
Build profile
Build business profile
Build member directory
Build referrals
Build visitors
Build meetings
Build attendance
Build one-to-ones
Build payments
Build notifications
Build reports
Build settings
Implement responsive UX
Implement loading/error/empty states
Connect backend APIs
Respect RBAC permissions</code></pre><hr><h1>55. Definition of Done</h1><p>The Member Dashboard should not be considered complete merely because:</p><pre><code class="language-text">/dashboard/member</code></pre><p>loads.</p><p>It is complete when:</p><ul><li><p>Member can authenticate</p></li><li><p>Member sees only their permitted chapter</p></li><li><p>Member can manage their own profile</p></li><li><p>Member can manage business information</p></li><li><p>Member can discover permitted members</p></li><li><p>Member can give/track referrals</p></li><li><p>Member can invite/manage their visitors</p></li><li><p>Member can view meetings</p></li><li><p>Member can view their attendance</p></li><li><p>Member can schedule one-to-ones</p></li><li><p>Member can view their payments</p></li><li><p>Member receives notifications</p></li><li><p>Member can view personal reports</p></li><li><p>Unauthorized resources are blocked server-side</p></li><li><p>Mobile UX works</p></li><li><p>Loading states exist</p></li><li><p>Empty states exist</p></li><li><p>Error states exist</p></li><li><p>API authorization is enforced</p></li><li><p>No chapter-scope bypass exists</p></li></ul><hr><h1>56. Core Principle</h1><p>The Member Dashboard should answer one simple question:</p><blockquote><p><strong>"How can I get more value from my chapter and my business network?"</strong></p></blockquote><p>Everything in the workspace should support that.</p><p>The hierarchy becomes:</p><pre><code class="language-text">                  GROWCLE
                     │
        ┌────────────┴────────────┐
        │                         │
   Administration              Members
        │                         │
 Admin / Director /        Networking Workspace
 Leadership                     │
                         ┌───────┼────────┐
                         │       │        │
                      Business  Network  Activity
                         │       │        │
                       Profile Members Referrals
                               Visitors One-to-Ones
                               Meetings Attendance
                               Payments Notifications</code></pre><h3>Recommended next wiki after this</h3><p>Once the Member Dashboard is locked, the next one should be the <strong>Visitor Dashboard Wiki</strong>. After that, we can consolidate <strong>Admin + Director + Leadership + Member + Visitor</strong> into the master <strong>RBAC &amp; Permission Matrix</strong>, which can become the single source of truth for both your backend implementation and the frontend agent.</p></body></html><!--EndFragment-->
</body>
</html>