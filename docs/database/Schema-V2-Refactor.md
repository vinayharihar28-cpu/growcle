# Prisma Schema V2 Refactor Documentation

This document outlines the architectural changes made during the V2 Schema Refactoring to support multi-tenancy, Role-Based Access Control (RBAC), and enterprise-grade SaaS features.

## 1. Authentication vs. Membership
The identity system has been completely decoupled from the membership profile:
- **`User` Model:** Represents the global identity (used by Better Auth for authentication).
- **`Member` Model:** Represents a user's membership profile within a specific `Organization` and `Chapter`. 
- **Change:** Removed the `@unique` constraint from `Member.userId`. One `User` can now hold multiple `Member` profiles across the platform.

## 2. Role-Based Access Control (RBAC)
Hardcoded string roles have been replaced with a dynamic, scalable permission engine:
- **New Models:** `Role`, `Permission`, `RolePermission`, `MemberRole`.
- **Implementation:** Roles (e.g., Platform Admin, Organization Admin, Member) are assigned dynamically. Permissions are atomic actions (e.g., `members.create`, `meetings.delete`) linked to Roles.

## 3. Strong Typing with Enums
String-based statuses have been upgraded to native PostgreSQL Enums to ensure data integrity:
- `MemberStatus`: ACTIVE, INACTIVE, PENDING, SUSPENDED, EXPIRED
- `VisitorStatus`: PENDING, ATTENDED, NO_SHOW, CONVERTED
- `ReferralStatus`: PENDING, CONTACTED, CLOSED_WON, CLOSED_LOST
- `MeetingStatus`: SCHEDULED, COMPLETED, CANCELLED
- `AttendanceStatus`: PRESENT, ABSENT, SUBSTITUTE, EXCUSED
- `OneToOneStatus`: SCHEDULED, COMPLETED, CANCELLED
- `InvitationStatus`: PENDING, ACCEPTED, EXPIRED, CANCELLED
- `SubscriptionStatus`: TRIALING, ACTIVE, CANCELED, PAST_DUE, etc.
- `PaymentStatus`: PENDING, SUCCEEDED, FAILED, REFUNDED

## 4. Financial Precision
Floating-point errors are mitigated by converting financial fields to `Decimal`:
- `Referral.value`
- `Payment.amount`
- `Invoice.total`
- `Subscription.price`

## 5. Multi-Tenant Organization Enhancements
The `Organization` and `Chapter` models were expanded to support white-labeling and deep configuration:
- **Organization:** Added `timezone`, `country`, `currency`, `language`, `slug`, `customDomain`, and `isActive`. Added a 1-to-1 relationship with `OrganizationSettings` for brand colors, emails, and feature flags.
- **Chapter:** Added `chapterCode`, `region`, `meetingDay`, `meetingTime`, and `meetingLocation`.

## 6. Comprehensive Networking Tracking
The core networking models were significantly upgraded to track business generation accurately:
- **MemberBusiness:** Abstracted business details (company, industry, website, logo) out of `Member` into a 1-to-1 `MemberBusiness` model.
- **Meeting:** Added detailed tracking (Zoom links, hybrid status, speaker, theme, attachments).
- **MeetingAttendance:** Strict database tracking for check-in times. Allows tracking attendance for both Members and Visitors.
- **Referrals & One-to-Ones:** Added conversion tracking, closed dates, durations, meeting modes, and ratings.

## 7. SaaS Foundation
New models were introduced to support a commercial SaaS deployment:
- **Onboarding:** `Invitation` model for secure user invitations.
- **Finance:** `Subscription`, `Invoice`, `Payment`, `Coupon`, and `Transaction` models for billing via Stripe/Razorpay.
- **Notifications:** `Notification`, `NotificationPreference`, and `NotificationTemplate` for omnichannel alerting.
- **Auditing:** `AuditLog` model to track critical system actions (who, when, what, old value, new value).
- **Storage:** `File` model for managing uploads (profile pictures, attachments, logos).

## 8. Database Best Practices
- **UUIDs:** Enforced UUIDs for all primary keys globally.
- **Timestamps:** Every model includes `createdAt` and `updatedAt`.
- **Soft Deletes:** Core entities feature `deletedAt DateTime?` to prevent accidental data loss.
- **Indexes:** Strategic `@@index` and composite `@@unique` constraints were added to heavily queried relations to ensure enterprise scalability.
