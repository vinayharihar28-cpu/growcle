# System Overview

---

## Objective
The platform is a multi-tenant, white-label Business Networking SaaS designed for scale, security, and flexibility. 

## Technology Stack
- **Framework**: Next.js 15 (App Router)
- **UI Library**: React 19
- **Language**: TypeScript
- **ORM**: Prisma ORM
- **Authentication**: Better Auth
- **Database**: Neon PostgreSQL
- **Styling**: Tailwind CSS v4 & shadcn/ui

## Core Domains
1. **Tenant Management**: Organizations and white-labeling.
2. **Identity & Access (RBAC)**: Users, Roles, Permissions.
3. **Chapter Management**: Chapters, Meeting, Executives.
4. **Networking**: Referrals, Visitors, 1-to-1s.
5. **Finance**: Invoices, Payments, Expenses.
6. **System**: Audit Logs, Notifications, Feature Flags.

## Architecture Principles
- **Multi-Tenant Data Isolation**: Secure data segregation per organization.
- **Role-Based Access Control (RBAC)**: Fine-grained permissions using a union-based inheritance model.
- **UUID Primary Keys**: Globally unique identifiers for all records to prevent enumeration attacks.
- **Soft Deletes**: Data retention and recovery support.
- **Enterprise Security**: Built to support future compliance (GDPR, SOC 2, ISO 27001).
