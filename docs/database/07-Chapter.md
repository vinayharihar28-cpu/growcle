# Chapter

---

## Overview
Represents the Chapter entity in the system. Ensures multi-tenant isolation and data integrity.

---

## Purpose
This table exists to manage Chapter data within the business networking SaaS platform.

---

## Business Rules
- Must belong to an Organization (Tenant Isolation).
- Enforces UUID Primary Keys.
- Supports Soft Deletes via `deletedAt`.

---

## Fields

| Field | Type | Required | Default | Description |
|---|---|---|---|---|
| id | String (UUID) | Yes | `uuid()` | Primary key. |
| organizationId | String (UUID) | Yes | None | Tenant isolation foreign key. |
| createdAt | DateTime | Yes | `now()` | Timestamp of creation. |
| updatedAt | DateTime | Yes | `now()` | Timestamp of last update. |
| deletedAt | DateTime | No | null | Soft delete timestamp. |

---

## Relationships

Organization
One-to-Many
Chapter

---

## Foreign Keys
- `organizationId`: References `Organization(id)`.

---

## Indexes
- `@@index([organizationId])`: Essential for tenant data filtering and isolation.
- `@@index([deletedAt])`: Optimizes queries omitting soft-deleted records.

---

## Constraints
- Primary Key on `id`.
- Foreign Key constraint on `organizationId`.

---

## Validation Rules
- UUID format required for all IDs.
- Future-proof validation for GDPR compliance data retention.

---

## Security Considerations
The platform is designed following enterprise security best practices and is architected to support future compliance with frameworks such as GDPR, SOC 2, ISO 27001, and other regional privacy regulations through configuration and operational controls.

- **Multi-Tenant Data Isolation**: Restricted by `organizationId`.
- **Soft Deletes**: Active to prevent accidental data loss.
- **Audit Logging**: All changes tracked via the AuditLog table.

---

## Example Record
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "organizationId": "660e8400-e29b-41d4-a716-446655440000",
  "createdAt": "2026-07-27T10:00:00Z",
  "updatedAt": "2026-07-27T10:00:00Z",
  "deletedAt": null
}
```

---

## Future Expansion
Designed to integrate with OAuth, Single Sign-On (SSO), LDAP, and API Passkeys.

---

## Prisma Model
```prisma
model Chapter {
  id             String       @id @default(uuid())
  organizationId String
  createdAt      DateTime     @default(now())
  updatedAt      DateTime     @updatedAt
  deletedAt      DateTime?

  Organization   Organization @relation(fields: [organizationId], references: [id])

  @@index([organizationId])
  @@index([deletedAt])
}
```

---

## Notes
Generated according to Enterprise Database Documentation specifications.\n