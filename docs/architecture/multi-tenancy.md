# Multi-Tenancy Architecture

---

## Overview
The platform uses a Shared Database, Shared Schema multi-tenancy model. All tenants (Organizations) share the same database and tables. Tenant isolation is enforced logically at the application level.

## Tenant Identification
Every table containing tenant-specific data MUST include an \`organizationId\` foreign key. Application code and database queries MUST filter by this ID.

## Security
The platform is designed following enterprise security best practices and is architected to support future compliance with frameworks such as GDPR, SOC 2, ISO 27001, and other regional privacy regulations through configuration and operational controls.

## Enforcement
- **Prisma Middlewares/Extensions**: Will automatically append \`where: { organizationId: currentUser.orgId }\` to relevant queries to prevent cross-tenant data spillage.
- **Foreign Keys**: All tenant-bound records cascade or restrict properly based on the Organization lifecycle.
