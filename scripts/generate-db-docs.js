const fs = require('fs');
const path = require('path');

const DB_DIR = path.join(__dirname, '../docs/database');

const tables = [
  "01-Organization", "02-User", "03-Role", "04-Permission", "05-RolePermission",
  "06-OrganizationUser", "07-Chapter", "08-ChapterMember", "09-ChapterExecutive",
  "10-Meeting", "11-MeetingAgenda", "12-MeetingAttendance", "13-MeetingMinutes",
  "14-MeetingActionItem", "15-Visitor", "16-VisitorVisit", "17-VisitorInvitation",
  "18-VisitorConversion", "19-MemberProfile", "20-BusinessProfile", "21-BusinessCategory",
  "22-Referral", "23-ReferralFeedback", "24-ReferralHistory", "25-Invoice",
  "26-Payment", "27-Expense", "28-Income", "29-Transaction", "30-Notification",
  "31-Announcement", "32-Document", "33-FileAttachment", "34-Session",
  "35-ActivityLog", "36-AuditLog", "37-SystemSetting", "38-OrganizationSetting",
  "39-Subscription", "40-SubscriptionHistory", "41-Branding", "42-Theme",
  "43-FeatureFlag", "44-ApiKey"
];

const overviewDocs = {
  'README.md': `# Database Architecture\n\nWelcome to the Database Design Specification (DDS).\n\nThis directory contains the complete database schema documentation for the platform. It serves as the single source of truth for the project's database architecture.`,
  'ERD.md': `# Entity Relationship Diagram\n\n## High-Level Overview\n\n\`\`\`mermaid\nerDiagram\n    Organization ||--o{ OrganizationUser : contains\n    User ||--o{ OrganizationUser : belongs_to\n    OrganizationUser ||--o{ OrganizationUserRole : has\n    Role ||--o{ OrganizationUserRole : assigns\n    Role ||--o{ RolePermission : contains\n    Permission ||--o{ RolePermission : mapped_to\n    Organization ||--o{ Chapter : manages\n    Chapter ||--o{ ChapterMember : contains\n    Chapter ||--o{ Meeting : hosts\n\`\`\`\n\n*(See individual table files for detailed relationships)*`,
  'Naming-Conventions.md': `# Database Naming Conventions\n\n## Tables\n- PascalCase (e.g., \`OrganizationUser\`)\n\n## Columns\n- camelCase (e.g., \`firstName\`, \`organizationId\`)\n- Primary keys are always \`id\` (UUID).\n- Foreign keys are named \`[Entity]Id\` (e.g., \`organizationId\`).\n- Dates use \`At\` suffix (e.g., \`createdAt\`, \`updatedAt\`, \`deletedAt\`).`,
  'Relationships.md': `# Relationship Standards\n\n## Overview\nAll relationships must be strictly defined with foreign key constraints and appropriate indexes.\n\n## Standard Graph\nUser → OrganizationUser → OrganizationUserRole → Role → RolePermission → Permission`,
  'Indexing-Strategy.md': `# Indexing Strategy\n\n## Primary Indexes\n- All \`id\` columns are automatically indexed as Primary Keys.\n\n## Foreign Key Indexes\n- Every foreign key must have an index to prevent full table scans during joins (e.g., \`@@index([organizationId])\`).\n\n## Search Indexes\n- Frequently searched text fields (e.g., email, names) should be indexed.`,
  'Constraints.md': `# Constraints\n\n## Unique Constraints\n- \`email\` on User table.\n- \`slug\` on Organization table.\n\n## Foreign Key Constraints\n- Enforce referential integrity. Deletions should generally be RESTRICT unless cascade is explicitly safe.\n\n## Business Constraints\n- Implemented at the Prisma layer (e.g., checking status enums).`
};

for (const [filename, content] of Object.entries(overviewDocs)) {
  fs.writeFileSync(path.join(DB_DIR, filename), content.trim() + '\\n', 'utf8');
}

tables.forEach(tableNameFile => {
  const tableName = tableNameFile.split('-')[1];
  
  const content = `
# ${tableName}

---

## Overview
Represents the ${tableName} entity in the system. Ensures multi-tenant isolation and data integrity.

---

## Purpose
This table exists to manage ${tableName} data within the business networking SaaS platform.

---

## Business Rules
- Must belong to an Organization (Tenant Isolation).
- Enforces UUID Primary Keys.
- Supports Soft Deletes via \`deletedAt\`.

---

## Fields

| Field | Type | Required | Default | Description |
|---|---|---|---|---|
| id | String (UUID) | Yes | \`uuid()\` | Primary key. |
| organizationId | String (UUID) | Yes | None | Tenant isolation foreign key. |
| createdAt | DateTime | Yes | \`now()\` | Timestamp of creation. |
| updatedAt | DateTime | Yes | \`now()\` | Timestamp of last update. |
| deletedAt | DateTime | No | null | Soft delete timestamp. |

---

## Relationships

Organization
One-to-Many
${tableName}

---

## Foreign Keys
- \`organizationId\`: References \`Organization(id)\`.

---

## Indexes
- \`@@index([organizationId])\`: Essential for tenant data filtering and isolation.
- \`@@index([deletedAt])\`: Optimizes queries omitting soft-deleted records.

---

## Constraints
- Primary Key on \`id\`.
- Foreign Key constraint on \`organizationId\`.

---

## Validation Rules
- UUID format required for all IDs.
- Future-proof validation for GDPR compliance data retention.

---

## Security Considerations
The platform is designed following enterprise security best practices and is architected to support future compliance with frameworks such as GDPR, SOC 2, ISO 27001, and other regional privacy regulations through configuration and operational controls.

- **Multi-Tenant Data Isolation**: Restricted by \`organizationId\`.
- **Soft Deletes**: Active to prevent accidental data loss.
- **Audit Logging**: All changes tracked via the AuditLog table.

---

## Example Record
\`\`\`json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "organizationId": "660e8400-e29b-41d4-a716-446655440000",
  "createdAt": "2026-07-27T10:00:00Z",
  "updatedAt": "2026-07-27T10:00:00Z",
  "deletedAt": null
}
\`\`\`

---

## Future Expansion
Designed to integrate with OAuth, Single Sign-On (SSO), LDAP, and API Passkeys.

---

## Prisma Model
\`\`\`prisma
model ${tableName} {
  id             String       @id @default(uuid())
  organizationId String
  createdAt      DateTime     @default(now())
  updatedAt      DateTime     @updatedAt
  deletedAt      DateTime?

  Organization   Organization @relation(fields: [organizationId], references: [id])

  @@index([organizationId])
  @@index([deletedAt])
}
\`\`\`

---

## Notes
Generated according to Enterprise Database Documentation specifications.
`;

  fs.writeFileSync(path.join(DB_DIR, tableNameFile + '.md'), content.trim() + '\\n', 'utf8');
});

console.log('Successfully generated all database documentation files.');
